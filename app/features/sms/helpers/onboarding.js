import * as Yup from 'yup';

export const onboardingSchema = Yup.string().required(
  'an onboarding message is required'
);

// export a helper for the onboarding section.
const onboardingHelper = {
  // the payload of the reducer needs to be compliant with this schema.
  schema: onboardingSchema,
  // Use this validation method unless a very specific function is needed from the schema.
  validate: onboardingSchema.validateSync.bind(onboardingSchema),
  /**
   * transform the raw api response values to an schematized object to be consumed by the UI component.
   * @param original the state.original property from the sms slice
   * @returns a schematized object compliant with onboardingHelper.schema
   */
  toSchematized: (original) => {
    return original?.onboardingMessage ?? '';
  },
  /**
   * merge the proper updates to state.update and return a new state.update
   * @param onboardingInstance an object compliant with the onboardingHelper.schema
   * @param state the state from the sms slice
   * @returns new state.update
   **/
  getStateUpdate: (onboardingInstance, state) => {
    if (onboardingInstance === state.original.onboardingMessage) {
      delete state.update.onboardingMessage;
      return state.update;
    }

    return {
      ...state.update,
      onboardingMessage: onboardingInstance,
    };
  },
};

export default onboardingHelper;
