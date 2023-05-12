import * as Yup from 'yup';

export const availabilitySchema = Yup.object({
  visible: Yup.boolean().required(),
  expiresAt: Yup.date()
    .nullable()
    .when('visible', (value, field) =>
      value[0] === true ? field.nonNullable().required() : field
    ),
});

// export a helper for the reward section of the builder.
const availabilityHelper = {
  // the payload of the reducer needs to be compliant with this schema.
  schema: availabilitySchema,
  // Use this validation method unless a very specific function is needed from the schema.
  validate: availabilitySchema.validateSync.bind(availabilitySchema),
  /**
   * transform the raw api response values to an schematized object to be consumed by the UI component.
   * @param original the state.original property from the variant slice
   * @returns a schematized object compliant with availabilityHelper.schema
   */
  toSchematized: (original) => {
    if (original.utility?.expiresAt) {
      return {
        visible: true,
        expiresAt: new Date(original.utility.expiresAt),
      };
    }
    return {
      visible: false,
      expiresAt: null,
    };
  },
  /**
   * merge the proper updates to state.update and return a new state.update
   * @param availabilityInstance an object compliant with the availabilityHelper.schema
   * @param state the state from the variant slice
   * @returns new state.update
   **/
  getStateUpdate: (availabilityInstance, state) => {
    const utility = {};

    delete state.update.utility?.expiresAt;

    // if create
    if (!state.isEdit) {
      if (availabilityInstance.expiresAt) {
        utility.expiresAt = availabilityInstance.expiresAt;
      }
      // if update
    } else {
      if (
        availabilityInstance.expiresAt !== state.original.utility?.expiresAt
      ) {
        utility.expiresAt = availabilityInstance.expiresAt;
      }
      // if there is not a type already in update add the original because we cannot send expiresAt only
      if (!state.update.utility?.type) {
        utility.type = state.original.utility?.type;
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
      // merge with utility in update, since this is used in other helpers
      utility: { ...state.update.utility, ...utility },
    };
  },
};

export default availabilityHelper;
