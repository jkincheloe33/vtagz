import * as Yup from 'yup';
import { isJsonStringValid } from '@/utils';

export const claimScreenStylingSchema = Yup.object().shape({
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
const claimScreenStylingHelper = {
  // the payload of the reducer needs to be compliant with this schema.
  schema: claimScreenStylingSchema,
  // Use this validation method unless a very specific function is needed from the schema.
  validate: claimScreenStylingSchema.validateSync.bind(
    claimScreenStylingSchema
  ),
  /**
   * transform the raw api response values to an schematized object to be consumed by the UI component.
   * @param original the state.original property from the product slice
   * @returns a schematized object compliant with claimScreenStyling.schema
   */
  toSchematized: (original) => {
    if (original?.metadata?.brandedStyling) {
      return {
        visible: true,
        payload: original.metadata.brandedStyling, // jsoneditor-react needs json when initializing
      };
    }
    return {
      visible: false,
      payload: null,
    };
  },
  /**
   * merge the proper updates to state.update and return a new state.update
   * @param claimScreenStylingInstance an object compliant with the claimScreenStyling.schema
   * @param state the state from the product slice
   * @returns new state.update
   **/
  getStateUpdate: (claimScreenStylingInstance, state) => {
    const metadata = {};
    delete state.update.metadata?.brandedStyling;

    // create
    if (!state.isEdit) {
      if (claimScreenStylingInstance.payload) {
        //TODO: send proper string when connecting backend
        metadata.brandedStyling = JSON.parse(
          claimScreenStylingInstance.payload
        );
      }
      // update
    } else {
      // compare stringified payloads
      const originalPayload =
        state.original.metadata?.brandedStyling &&
        JSON.stringify(state.original.metadata?.brandedStyling);

      // remove new lines for proper comparison
      const payload =
        claimScreenStylingInstance.payload &&
        JSON.stringify(JSON.parse(claimScreenStylingInstance.payload));

      if (payload !== originalPayload) {
        metadata.brandedStyling = JSON.parse(
          claimScreenStylingInstance.payload
        );
      }
    }

    // if metadata is empty after this process
    if (
      !metadata.brandedStyling &&
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

export default claimScreenStylingHelper;
