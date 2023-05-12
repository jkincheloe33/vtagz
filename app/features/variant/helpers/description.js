import * as Yup from 'yup';
import { isOnlyHtmlEmptyTags } from '@/utils';

export const descriptionSchema = Yup.string()
  .required('a reward description is required')
  .test('quill-empty', (value) => !isOnlyHtmlEmptyTags(value));

// export a helper for the description section of the builder.
const descriptionHelper = {
  // the payload of the reducer needs to be compliant with this schema.
  schema: descriptionSchema,
  // Use this validation method unless a very specific function is needed from the schema.
  validate: descriptionSchema.validateSync.bind(descriptionSchema),
  /**
   * transform the raw api response values to an schematized object to be consumed by the UI component.
   * @param original the state.original property from the product slice
   * @returns a schematized object compliant with descriptionHelper.schema
   */
  toSchematized: (original) => {
    if (original?.description) {
      return original.description;
    }
    return '';
  },
  /**
   * merge the proper updates to state.update and return a new state.update
   * @param descriptionInstance an object compliant with the descriptionHelper.schema
   * @param state the state from the product slice
   * @returns new state.update
   **/
  getStateUpdate: (descriptionInstance, state) => {
    if (descriptionInstance === state.original.description) {
      delete state.update.description;
      return state.update;
    }

    return {
      ...state.update,
      description: descriptionInstance,
    };
  },
};

export default descriptionHelper;
