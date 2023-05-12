import * as Yup from 'yup';

export const quantitySchema = Yup.object().shape({
  quantity: Yup.number().positive().min(1).required(),
  fallbackVisible: Yup.boolean().default(false),
  fallbackQuantity: Yup.number()
    .nullable()
    .when('fallbackVisible', (visible, field) => {
      return visible[0] === true
        ? field
            .required()
            .positive()
            .min(1, 'Fallback quantity cannot be 0')
            .test(
              'max-quantity',
              'Fallback quantity cannot be greater than quantity',
              (value, ctx) => {
                return value <= ctx.parent.quantity;
              }
            )
            .nonNullable()
        : field;
    }),
  fallbackTier: Yup.number()
    .nullable()
    .when('fallbackVisible', (visible, field) => {
      return visible[0] === true
        ? field
            .required()
            .positive()
            .min(1, 'Fallback tier cannot be 0')
            .nonNullable()
        : field;
    }),
});

// export a helper for the quantity/fallbacks section of the builder.
const quantityHelper = {
  // the payload of the reducer needs to be compliant with this schema.
  schema: quantitySchema,
  // Use this validation method unless a very specific function is needed from the schema.
  validate: quantitySchema.validateSync.bind(quantitySchema),
  /**
   * transform the raw api response values to an schematized object to be consumed by the UI component.
   * @param original the state.original property from the campaign slice
   * @returns a schematized object compliant with quantityHelper.schema
   */
  toSchematized: (original) => {
    const result = { quantity: original.quantity };

    if (original?.fallbackQuantity) {
      return {
        ...result,
        fallbackVisible: true,
        fallbackQuantity: original.fallbackQuantity,
        fallbackTier: original.fallbackTier,
      };
    }
    return {
      ...result,
      fallbackVisible: false,
      fallbackQuantity: null,
      fallbackTier: null,
    };
  },
  /**
   * merge the proper updates to state.update and return a new state.update
   * @param quantityInstance an object compliant with the quantityHelper.schema
   * @param state the state from the campaign slice
   * @returns new state.update
   **/
  getStateUpdate: ({ fallbackQuantity, fallbackTier, quantity }, state) => {
    const update = {};
    delete state.update.quantity;
    delete state.update.fallbackQuantity;
    delete state.update.fallbackTier;

    // if create
    if (!state.isEdit) {
      update.quantity = quantity;
      if (fallbackQuantity) {
        update.fallbackQuantity = fallbackQuantity;
      }
      if (fallbackTier) {
        update.fallbackTier = fallbackTier;
      }
      // if update
    } else {
      if (quantity !== state.original.quantity) {
        update.quantity = quantity;
      }
      if (fallbackQuantity !== state.original.fallbackQuantity) {
        update.fallbackQuantity = fallbackQuantity;
      }
      if (fallbackTier !== state.original.fallbackTier) {
        update.fallbackTier = fallbackTier;
      }
    }

    return {
      ...state.update,
      ...update,
    };
  },
  // handles rendering input specific errors
  toUIErrors: (error, state) => {
    const errors = {};
    const errorsMap = error.inner.reduce((acc, data) => {
      acc[data.path] = data.message;
      return acc;
    }, {});
    // check if the user has passed a value or check if user removes a value that was previously in update
    if (
      state.form.quantity?.fallbackQuantity !== null ||
      state.update.fallbackQuantity
    ) {
      errors.fallbackQuantity = errorsMap['fallbackQuantity'];
    }
    if (
      state.form.quantity?.fallbackTier !== null ||
      state.update.fallbackTier
    ) {
      errors.fallbackTier = errorsMap['fallbackTier'];
    }
    return errors;
  },
};

export default quantityHelper;
