import * as Yup from 'yup';
import { deepEqual } from '@/utils';

export const imagesSchema = Yup.array()
  .of(Yup.string().url())
  // TODO: Add url validation once we have real images to test
  .required('At least one image is required');

// export a helper for the image section of the builder.
const imagesHelper = {
  // the payload of the reducer needs to be compliant with this schema.
  schema: imagesSchema,
  // Use this validation method unless a very specific function is needed from the schema.
  validate: imagesSchema.validateSync.bind(imagesSchema),
  /**
   * transform the raw api response values to an schematized object to be consumed by the UI component.
   * @param original the state.original property from the product slice
   * @returns a schematized object compliant with imagesHelper.schema
   */
  toSchematized: (original) => {
    if (original?.images) {
      return original.images;
    }
    return [];
  },
  /**
   * merge the proper updates to state.update and return a new state.update
   * @param imagesInstance an object compliant with the imagesHelper.schema
   * @param state the state from the product slice
   * @returns new state.update
   **/
  getStateUpdate: (imagesInstance, state) => {
    // compare new and original values
    if (deepEqual(imagesInstance, state.original.images)) {
      // remove any update if the values are equal
      delete state.update.images;
      return state.update;
    }

    return {
      ...state.update,
      images: imagesInstance,
    };
  },
};

export default imagesHelper;
