import * as Yup from 'yup';

export const hiddenSchema = Yup.boolean().default(false);

// export a helper for the hidden section of the builder.
const hiddenHelper = {
  // the payload of the reducer needs to be compliant with this schema.
  schema: hiddenSchema,
  // Use this validation method unless a very specific function is needed from the schema.
  validate: hiddenSchema.validateSync.bind(hiddenSchema),
  /**
   * transform the raw api response values to an schematized object to be consumed by the UI component.
   * @param original the state.original property from the product slice
   * @returns a schematized object compliant with hiddenHelper.schema
   */
  toSchematized: (original) => {
    return !!original?.hidden;
  },
  /**
   * merge the proper updates to state.update and return a new state.update
   * @param hiddenInstance an object compliant with the nameHelper.schema
   * @param state the state from the product slice
   * @returns new state.update
   **/
  getStateUpdate: (hiddenInstance, state) => {
    if (
      hiddenInstance === state.original.hidden ||
      (!state.isEdit && !hiddenInstance)
    ) {
      delete state.update.hidden;
      return state.update;
    }

    if (hiddenInstance) {
      return {
        ...state.update,
        hidden: hiddenInstance,
      };
    }
    return state.update;
  },
};

export default hiddenHelper;
