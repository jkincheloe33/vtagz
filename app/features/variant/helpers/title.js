import * as Yup from 'yup';

export const titleSchema = Yup.string()
  .min(3, 'reward name needs at least 3 characters')
  .required('a reward name is required');

// export a helper for the name section of the builder.
const titleHelper = {
  // the payload of the reducer needs to be compliant with this schema.
  schema: titleSchema,
  // Use this validation method unless a very specific function is needed from the schema.
  validate: titleSchema.validateSync.bind(titleSchema),
  /**
   * transform the raw api response values to an schematized object to be consumed by the UI component.
   * @param original the state.original property from the product slice
   * @returns a schematized object compliant with titleHelper.schema
   */
  toSchematized: (original) => {
    if (original?.title) {
      return original.title;
    }
    return '';
  },
  /**
   * merge the proper updates to state.update and return a new state.update
   * @param titleInstance an object compliant with the titleHelper.schema
   * @param state the state from the product slice
   * @returns new state.update
   **/
  getStateUpdate: (titleInstance, state) => {
    if (titleInstance === state.original.title) {
      delete state.update.title;
      return state.update;
    }

    if (titleInstance) {
      return {
        ...state.update,
        title: titleInstance,
      };
    }
    return state.update;
  },
};

export default titleHelper;
