import * as Yup from 'yup';

export const wrapperImageSchema = Yup.object().shape({
  visible: Yup.boolean().default(false),
  url: Yup.string()
    .nullable()
    .when('visible', (visible, field) => {
      return visible[0] === true ? field.nonNullable().required() : field; // TODO: add url() check when image upload is enabled
    }),
});

// export a helper for the legal section of the builder.
const wrapperImageHelper = {
  // the payload of the reducer needs to be compliant with this schema.
  schema: wrapperImageSchema,
  // Use this validation method unless a very specific function is needed from the schema.
  validate: wrapperImageSchema.validateSync.bind(wrapperImageSchema),
  /**
   * transform the raw api response values to an schematized object to be consumed by the UI component.
   * @param original the state.original property from the product slice
   * @returns a schematized object compliant with wrapperImageHelper.schema
   */
  toSchematized: (original) => {
    if (original?.wrapperImageUrl) {
      return {
        visible: true,
        url: original.wrapperImageUrl,
      };
    }
    return {
      visible: false,
      url: null,
    };
  },
  /**
   * merge the proper updates to state.update and return a new state.update
   * @param wrapperImageInstance an object compliant with the wrapperImageHelper.schema
   * @param state the state from the product slice
   * @returns new state.update
   **/
  getStateUpdate: (wrapperImageInstance, state) => {
    const update = {};
    delete state.update.wrapperImageUrl;

    if (
      (!state.isEdit && wrapperImageInstance.url) ||
      (state.isEdit &&
        wrapperImageInstance.url !== state.original.wrapperImageUrl)
    ) {
      update.wrapperImageUrl = wrapperImageInstance.url;
    }

    return {
      ...state.update,
      ...update,
    };
  },
};

export default wrapperImageHelper;
