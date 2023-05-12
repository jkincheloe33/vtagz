import * as Yup from 'yup';

export const claimLimitSchema = Yup.object().shape({
  visible: Yup.boolean().default(false),
  claimLimit: Yup.number()
    .nullable()
    .when('visible', (visible, field) => {
      return visible[0] === true
        ? field
            .required()
            .positive()
            .min(1, 'Claim limit cannot be 0')
            .nonNullable()
        : field;
    }),
});

// export a helper for the claim limit section of the builder.
const claimLimitHelper = {
  // the payload of the reducer needs to be compliant with this schema.
  schema: claimLimitSchema,
  // Use this validation method unless a very specific function is needed from the schema.
  validate: claimLimitSchema.validateSync.bind(claimLimitSchema),
  /**
   * transform the raw api response values to an schematized object to be consumed by the UI component.
   * @param original the state.original property from the product slice
   * @returns a schematized object compliant with claimLimitHelper.schema
   */
  toSchematized: (original) => {
    if (original?.purchaseLimit) {
      return {
        visible: true,
        claimLimit: original.purchaseLimit,
      };
    }
    return {
      visible: false,
      claimLimit: null,
    };
  },
  /**
   * merge the proper updates to state.update and return a new state.update
   * @param claimLimitInstance an object compliant with the claimLimitHelper.schema
   * @param state the state from the product slice
   * @returns new state.update
   **/
  getStateUpdate: ({ claimLimit }, state) => {
    if (
      claimLimit === state.original.purchaseLimit ||
      (!state.isEdit && !claimLimit)
    ) {
      delete state.update.purchaseLimit;
      return state.update;
    }

    return {
      ...state.update,
      purchaseLimit: claimLimit,
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
      state.form.claimLimit?.claimLimit !== null ||
      state.update.purchaseLimit
    ) {
      errors.claimLimit = errorsMap['claimLimit'];
    }
    return errors;
  },
};

export default claimLimitHelper;
