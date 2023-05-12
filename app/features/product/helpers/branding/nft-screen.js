import * as Yup from 'yup';
import { isJsonStringValid } from '@/utils';

export const nftScreenStylingSchema = Yup.object().shape({
  visible: Yup.boolean().default(false),
  payload: Yup.string()
    .nullable()
    .when('visible', (visible, field) => {
      return visible[0] === true
        ? field.required().nonNullable().test('json', isJsonStringValid)
        : field;
    }),
});

// export a helper for the branding section of the builder.
const nftScreenStylingHelper = {
  // the payload of the reducer needs to be compliant with this schema.
  schema: nftScreenStylingSchema,
  // Use this validation method unless a very specific function is needed from the schema.
  validate: nftScreenStylingSchema.validateSync.bind(nftScreenStylingSchema),
  /**
   * transform the raw api response values to an schematized object to be consumed by the UI component.
   * @param original the state.original property from the product slice
   * @returns a schematized object compliant with nftScreenStylingHelper.schema
   */
  toSchematized: (original) => {
    if (original?.metadata?.nftScreenStyling) {
      return {
        visible: true,
        payload: original.metadata.nftScreenStyling, // jsoneditor-react needs json when initializing
      };
    }
    return {
      visible: false,
      payload: null,
    };
  },
  /**
   * merge the proper updates to state.update and return a new state.update
   * @param nftScreenStylingInstance an object compliant with the nftScreenStylingHelper.schema
   * @param state the state from the product slice
   * @returns new state.update
   **/
  getStateUpdate: (nftScreenStylingInstance, state) => {
    const metadata = {};
    delete state.update.metadata?.nftScreenStyling;

    // create
    if (!state.isEdit) {
      if (nftScreenStylingInstance.payload) {
        //TODO: send proper string when connecting backend
        metadata.nftScreenStyling = JSON.parse(
          nftScreenStylingInstance.payload
        );
      }
      // update
    } else {
      // compare stringified payloads
      const originalPayload =
        state.original.metadata?.nftScreenStyling &&
        JSON.stringify(state.original.metadata?.nftScreenStyling);

      // remove new lines for proper comparison
      const payload =
        nftScreenStylingInstance.payload &&
        JSON.stringify(JSON.parse(nftScreenStylingInstance.payload));

      if (payload !== originalPayload) {
        metadata.nftScreenStyling = JSON.parse(
          nftScreenStylingInstance.payload
        );
      }
    }

    // if metadata is empty after this process
    if (
      !metadata.nftScreenStyling &&
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

export default nftScreenStylingHelper;
