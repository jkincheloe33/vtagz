import * as Yup from 'yup';
import { deepEqual } from '@/utils';

// single product link schema
export const productLinkSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'needs at least 3 characters')
    .required('a title is required'),
  url: Yup.string().url().required('a url is required'),
});

const productLinksSchema = Yup.array(productLinkSchema);

// export a productLinks helper for the product links section of the builder.
export default {
  // productLinks schema. The payload of the reducer needs to be compliant with this schema.
  schema: productLinksSchema,
  // Use this validation method unless a very specific function is needed from the schema.
  validate: productLinksSchema.validateSync.bind(productLinksSchema),
  /**
   * transform the raw api response values to an schematized object to be consumed by the UI component.
   * @param original the state.original property from the product slice
   * @returns a schematized object compliant with legalHelper.schema
   */
  toSchematized: (original) => {
    // the original data happens to be compliant with the schema for the ui component
    return original.metadata?.links;
  },
  /**
   * merge the proper updates to state.update and return the new state.update
   * @param productLinksInstance an object compliant with the productLinksHelper.schema
   * @param state the state from the product slice
   **/
  getStateUpdate: (productLinksInstance, state) => {
    const metadata = {};
    // remove any update if the values are equal
    delete state.update.metadata?.links;

    if (
      (!state.isEdit && productLinksInstance.length > 0) || // create
      (state.isEdit &&
        !deepEqual(productLinksInstance, state.original.metadata?.links)) // update
    ) {
      metadata.links = productLinksInstance;
    }

    // if metadata is empty after this process
    if (
      !metadata.links &&
      state.update.metadata &&
      Object.keys(state.update.metadata).length === 0
    ) {
      delete state.update.metadata;
      return state.update;
    }

    return {
      ...state.update,
      metadata: { ...state.update.metadata, ...metadata },
    };
  },
};
