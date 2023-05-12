import * as Yup from 'yup';

export const RARITIES = {
  LEGENDARY: 'legendary',
  EPIC: 'epic',
  RARE: 'rare',
  UNCOMMON: 'uncommon',
  COMMON: 'common',
};

export const raritySchema = Yup.string().oneOf(Object.values(RARITIES));

// export a helper for the reward section of the builder.
const rarityHelper = {
  // the payload of the reducer needs to be compliant with this schema.
  schema: raritySchema,
  // Use this validation method unless a very specific function is needed from the schema.
  validate: raritySchema.validateSync.bind(raritySchema),
  /**
   * transform the raw api response values to an schematized object to be consumed by the UI component.
   * @param original the state.original property from the variant slice
   * @returns a schematized object compliant with rarityHelper.schema
   */
  toSchematized: (original) => {
    if (original.rarity) {
      return original.rarity;
    }
    return null;
  },
  /**
   * merge the proper updates to state.update and return a new state.update
   * @param rarityInstance an object compliant with the rarityHelper.schema
   * @param state the state from the variant slice
   * @returns new state.update
   **/
  getStateUpdate: (rarityInstance, state) => {
    delete state.update.rarity;

    if (
      (!state.isEdit && rarityInstance) || // create
      (state.isEdit && rarityInstance !== state.original.rarity) // update
    ) {
      return { ...state.update, rarity: rarityInstance };
    }
    return state.update;
  },
};

export default rarityHelper;
