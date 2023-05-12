import * as Yup from 'yup';

export const faqSchema = Yup.string().required('an faq message is required');

// export a helper for the faq section.
const faqHelper = {
  // the payload of the reducer needs to be compliant with this schema.
  schema: faqSchema,
  // Use this validation method unless a very specific function is needed from the schema.
  validate: faqSchema.validateSync.bind(faqSchema),
  /**
   * transform the raw api response values to an schematized object to be consumed by the UI component.
   * @param original the state.original property from the sms slice
   * @returns a schematized object compliant with faqHelper.schema
   */
  toSchematized: (original) => {
    return original?.faqMessage ?? '';
  },
  /**
   * merge the proper updates to state.update and return a new state.update
   * @param faqInstance an object compliant with the faqHelper.schema
   * @param state the state from the sms slice
   * @returns new state.update
   **/
  getStateUpdate: (faqInstance, state) => {
    if (faqInstance === state.original.faqMessage) {
      delete state.update.faqMessage;
      return state.update;
    }

    return {
      ...state.update,
      faqMessage: faqInstance,
    };
  },
};

export default faqHelper;
