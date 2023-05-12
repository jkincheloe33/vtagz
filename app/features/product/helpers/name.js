import * as Yup from 'yup';

export const nameSchema = Yup.string()
  .min(3, 'campaign name needs at least 3 characters')
  .required('a campaign name is required');

// export a helper for the name section of the builder.
const nameHelper = {
  // the payload of the reducer needs to be compliant with this schema.
  schema: nameSchema,
  // Use this validation method unless a very specific function is needed from the schema.
  validate: nameSchema.validateSync.bind(nameSchema),
  /**
   * transform the raw api response values to an schematized object to be consumed by the UI component.
   * @param original the state.original property from the product slice
   * @returns a schematized object compliant with nameHelper.schema
   */
  toSchematized: (original) => {
    if (original?.name) {
      return original.name;
    }
    return '';
  },
  /**
   * merge the proper updates to state.update and return a new state.update
   * @param nameInstance an object compliant with the nameHelper.schema
   * @param state the state from the product slice
   * @returns new state.update
   **/
  getStateUpdate: (nameInstance, state) => {
    if (nameInstance === state.original.name) {
      delete state.update.name;
      return state.update;
    }

    return {
      ...state.update,
      name: nameInstance,
    };
  },
};

export default nameHelper;
