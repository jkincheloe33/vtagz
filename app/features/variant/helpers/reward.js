import * as Yup from 'yup';

export const REWARD_TYPES = {
  NONE: 'none',
  SHOPIFY: 'shopify',
  BARCODE: 'barcode',
  URL: 'url',
  IMAGE: 'image',
};

const codeRewardSchema = {
  type: Yup.string().oneOf(['generic', 'unique']).required(),
  code: Yup.string()
    .nullable()
    .when('type', (type, field) => {
      return type[0] === 'generic' ? field.nonNullable().required() : field;
    }),
  codes: Yup.array()
    .nullable()
    .when('type', (type, field) => {
      return type[0] === 'unique'
        ? field.nonNullable().min(1).required()
        : field;
    }),
};

const shopifyRewardSchema = {
  ...codeRewardSchema,
  url: Yup.string().url().required(),
};

const urlRewardSchema = {
  type: Yup.string().oneOf(['generic', 'unique']).required(),
  code: Yup.string()
    .nullable()
    .when('type', (type, field) => {
      return type[0] === 'generic'
        ? field.nonNullable().url().required()
        : field;
    }),
  codes: Yup.array()
    .nullable()
    .when('type', (type, field) => {
      return type[0] === 'unique'
        ? field.of(Yup.string().url()).nonNullable().min(1).required()
        : field;
    }),
};

const imageRewardSchema = { code: Yup.string().required() }; // TODO: add url() when image upload is ready

export const rewardSchema = Yup.object({
  type: Yup.string().oneOf(Object.values(REWARD_TYPES)).required(),
  options: Yup.mixed().when('type', (type, field) => {
    return type[0] === REWARD_TYPES.SHOPIFY
      ? Yup.object(shopifyRewardSchema).required()
      : type[0] === REWARD_TYPES.BARCODE
      ? Yup.object(codeRewardSchema).required()
      : type[0] === REWARD_TYPES.URL
      ? Yup.object(urlRewardSchema).required()
      : type[0] === REWARD_TYPES.IMAGE
      ? Yup.object(imageRewardSchema).required()
      : field.notRequired();
  }),
});

// export a helper for the reward section of the builder.
const rewardHelper = {
  // the payload of the reducer needs to be compliant with this schema.
  schema: rewardSchema,
  // Use this validation method unless a very specific function is needed from the schema.
  validate: rewardSchema.validateSync.bind(rewardSchema),
  /**
   * transform the raw api response values to an schematized object to be consumed by the UI component.
   * @param original the state.original property from the variant slice
   * @returns a schematized object compliant with rewardHelper.schema
   */
  toSchematized: (original) => {
    if (!original.utility?.type) {
      return {
        type: null,
      };
    }

    const result = {
      type: original.utility.type,
    };

    if (original.utility?.type === REWARD_TYPES.NONE) {
      return result;
    }

    const unique = original.utility?.discountCodes?.length > 0;
    result.options = {
      type: unique ? 'unique' : 'generic',
      code: original.utility?.discountCode,
      codes: original.utility?.discountCode,
    };

    if (original.utility?.type === REWARD_TYPES.SHOPIFY) {
      result.options.url = original.utility.productUrl;
    } else if (original.utility?.type === REWARD_TYPES.IMAGE) {
      delete result.options.codes;
      delete result.options.type;
    }

    return result;
  },
  /**
   * merge the proper updates to state.update and return a new state.update
   * @param rewardInstance an object compliant with the rewardHelper.schema
   * @param state the state from the variant slice
   * @returns new state.update
   **/
  getStateUpdate: (rewardInstance, state) => {
    const utility = {};

    delete state.update.utility?.type;
    delete state.update.utility?.discountCode;
    delete state.update.utility?.discountCodes;
    delete state.update.utility?.productUrl;

    // if create
    if (!state.isEdit) {
      utility.type = rewardInstance.type;

      if (
        rewardInstance.type === REWARD_TYPES.SHOPIFY ||
        rewardInstance.type === REWARD_TYPES.BARCODE ||
        rewardInstance.type === REWARD_TYPES.URL
      ) {
        utility.discountCode = rewardInstance.options.code;
        utility.discountCodes = rewardInstance.options.codes;
      } else if (rewardInstance.type === REWARD_TYPES.IMAGE) {
        utility.discountCode = rewardInstance.options.code;
      }

      if (rewardInstance.options?.url) {
        utility.productUrl = rewardInstance.options.url;
      }
      // if update
    } else {
      utility.type = rewardInstance.type;

      // see if single discount code has been updated
      let singleDiscountCode;
      if (
        rewardInstance.options?.code !== state.original.utility?.discountCode
      ) {
        singleDiscountCode = rewardInstance.options?.code;
      }

      // check if we have updates in any of the code fields
      const updatedCodes =
        singleDiscountCode || rewardInstance.options?.codes?.length;

      // codes array is not retrieved in admin, so we overwrite if there is any updated value.
      if (updatedCodes) {
        if (rewardInstance.options?.codes?.length) {
          utility.discountCode = null;
          utility.discountCodes = rewardInstance.options.codes;
        } else {
          utility.discountCode = rewardInstance.options.code;
          utility.discountCodes = null;
        }
      }

      if (rewardInstance.options?.url !== state.original.utility?.productUrl) {
        utility.productUrl = rewardInstance.options.url;
      }
    }

    // if utility is empty after this process we don't need to update utility field
    if (
      Object.keys(utility).length === 0 &&
      state.update.utility &&
      Object.keys(state.update.utility).length === 0
    ) {
      delete state.update.utility;
      return state.update;
    }

    return {
      ...state.update,
      utility: { ...state.update.utility, ...utility },
    };
  },
  parseCodesFile: (type, file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function (event) {
        const text = event.target.result;
        let items = text.trim().split('\n');
        // if type is barcode or url we have to remove extra characters at end of strings
        if (type === REWARD_TYPES.BARCODE || type === REWARD_TYPES.URL) {
          items = items.map((item) => item.split('\r')[0]);
        }
        const header = items.shift().split(',');
        // find index of 'Code', defaulting to first column
        const discountCodeIndex = header.indexOf('Code');
        if (discountCodeIndex === -1) {
          reject(`'Code' column not found in discount file upload!`);
        }

        const discountCodes = items
          .map((item) => {
            const data = item.split(',');
            return data[discountCodeIndex]?.trim();
          })
          .filter(Boolean);

        resolve(discountCodes);
      };
      reader.readAsText(file);
    });
  },
};

export default rewardHelper;
