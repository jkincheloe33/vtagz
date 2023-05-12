import * as Yup from 'yup';

export const unlockableSchema = Yup.object().shape({
  isUnlockable: Yup.boolean().default(false),
  btuVisible: Yup.boolean().default(false),
  belongsToUnlockable: Yup.number()
    .nullable()
    .when('btuVisible', (visible, field) => {
      return visible[0] === true ? field.required().nonNullable() : field;
    }),
});

// export a helper for the unlockable section of the builder.
const unlockableHelper = {
  // the payload of the reducer needs to be compliant with this schema.
  schema: unlockableSchema,
  // Use this validation method unless a very specific function is needed from the schema.
  validate: unlockableSchema.validateSync.bind(unlockableSchema),
  /**
   * transform the raw api response values to an schematized object to be consumed by the UI component.
   * @param original the state.original property from the product slice
   * @returns a schematized object compliant with unlockableHelper.schema
   */
  toSchematized: (original) => {
    if (original?.isUnlockable) {
      return {
        btuVisible: false,
        belongsToUnlockable: null,
        isUnlockable: true,
      };
    } else if (original?.belongsToUnlockable) {
      return {
        btuVisible: true,
        belongsToUnlockable: original.belongsToUnlockable,
        isUnlockable: false,
      };
    }
    return {
      btuVisible: false,
      belongsToUnlockable: null,
      isUnlockable: false,
    };
  },
  /**
   * merge the proper updates to state.update and return a new state.update
   * @param unlockableInstance an object compliant with the unlockableHelper.schema
   * @param state the state from the product slice
   * @returns new state.update
   **/
  getStateUpdate: ({ belongsToUnlockable, isUnlockable }, state) => {
    const unlockables = {};
    if (
      isUnlockable === state.original.isUnlockable ||
      (!state.isEdit && !isUnlockable)
    ) {
      delete state.update.isUnlockable;
    } else {
      unlockables.isUnlockable = isUnlockable;
    }

    if (
      belongsToUnlockable === state.original.belongsToUnlockable ||
      (!state.isEdit && !belongsToUnlockable)
    ) {
      delete state.update.belongsToUnlockable;
    } else {
      unlockables.belongsToUnlockable = belongsToUnlockable;
    }

    return {
      ...state.update,
      ...unlockables,
    };
  },
};

export default unlockableHelper;
