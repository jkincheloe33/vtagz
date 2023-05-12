import * as Yup from 'yup';

export const imageUrlSchema = Yup.string()
  .url()
  .required('a cover image is required');

// export a helper for the cover image section of the builder.
const imageUrlHelper = {
  // the payload of the reducer needs to be compliant with this schema.
  schema: imageUrlSchema,
  // Use this validation method unless a very specific function is needed from the schema.
  validate: imageUrlSchema.validateSync.bind(imageUrlSchema),
  /**
   * transform the raw api response values to an schematized object to be consumed by the UI component.
   * @param original the state.original property from the product slice
   * @returns a schematized object compliant with imageUrlHelper.schema
   */
  toSchematized: (original) => {
    if (original?.imageUrl) {
      return original.imageUrl;
    }
    return '';
  },
  /**
   * merge the proper updates to state.update and return a new state.update
   * @param imageUrlInstance an object compliant with the imageUrlHelper.schema
   * @param state the state from the product slice
   * @returns new state.update
   **/
  getStateUpdate: (imageUrlInstance, state) => {
    if (imageUrlInstance === state.original.imageUrl) {
      delete state.update.imageUrl;
      return state.update;
    }

    return {
      ...state.update,
      imageUrl: imageUrlInstance,
    };
  },
};

export default imageUrlHelper;
