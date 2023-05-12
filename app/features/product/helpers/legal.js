import * as Yup from 'yup';
import { isOnlyHtmlEmptyTags } from '@/utils';

export const legalSchema = Yup.object().shape({
  visible: Yup.boolean().default(false),
  disclaimer: Yup.string()
    .nullable()
    .when('visible', (visible, field) => {
      return visible[0] === true
        ? field
            .required()
            .nonNullable()
            .test('quill-empty', (value) => !isOnlyHtmlEmptyTags(value))
        : field;
    }),
});

// export a helper for the legal section of the builder.
const legalHelper = {
  // the payload of the reducer needs to be compliant with this schema.
  schema: legalSchema,
  // Use this validation method unless a very specific function is needed from the schema.
  validate: legalSchema.validateSync.bind(legalSchema),
  /**
   * transform the raw api response values to an schematized object to be consumed by the UI component.
   * @param original the state.original property from the product slice
   * @returns a schematized object compliant with legalHelper.schema
   */
  toSchematized: (original) => {
    if (original?.metadata?.disclaimer) {
      return {
        visible: true,
        disclaimer: original.metadata.disclaimer,
      };
    }
    return {
      visible: false,
      disclaimer: '',
    };
  },
  /**
   * merge the proper updates to state.update and return a new state.update
   * @param legalInstance an object compliant with the legalHelper.schema
   * @param state the state from the product slice
   * @returns new state.update
   **/
  getStateUpdate: (legalInstance, state) => {
    const metadata = {};

    delete state.update.metadata?.disclaimer;

    if (
      (!state.isEdit && legalInstance.disclaimer) || // create
      (state.isEdit &&
        legalInstance.disclaimer !== state.original.metadata?.disclaimer) // update
    ) {
      metadata.disclaimer = legalInstance.disclaimer;
    }

    // if metadata is empty after this process
    if (
      !metadata.disclaimer &&
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

export default legalHelper;
