import {
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import { getVariantsByProductId } from './thunks';

const initialState = {
  loading: false,
};

const rarityOrder = ['legendary', 'epic', 'rare', 'uncommon', 'common'];
const variantsAdapter = createEntityAdapter({
  sortComparer: (a, b) =>
    rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity),
});

const variants = createSlice({
  name: 'variants',
  initialState: variantsAdapter.getInitialState(initialState),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getVariantsByProductId.fulfilled, (state, { payload }) => {
      variantsAdapter.setAll(state, payload);
      state.loading = false;
    });
    builder.addCase(getVariantsByProductId.pending, (state, { payload }) => {
      state.loading = true;
    });
  },
});

export const {
  selectById: selectVariantById,
  selectEntities: selectVariantEntities,
  selectAll: selectAllVariants,
} = variantsAdapter.getSelectors((store) => store.variants);

export const selectVariantsByIds = createSelector(
  [selectVariantEntities, (variants, ids) => ids],
  (variants, ids = []) => {
    return ids.map((id) => variants[id]);
  }
);

export default variants.reducer;
