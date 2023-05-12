import { createSelector, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { getVariant, publishVariant, deactivateVariant } from './thunks';
import coreHelper from './helpers/core';
import descriptionHelper from './helpers/description';
import quantityHelper from './helpers/quantity';
import imagesHelper from './helpers/images';
import titleHelper from './helpers/title';
import rewardHelper from './helpers/reward';
import rarityHelper from './helpers/rarity';
import availabilityHelper from './helpers/availability';

const initialState = {
  loading: true,
  form: {},
  errors: {},
  original: {},
  uiErrors: {},
  update: {},
};

const cleanErrors = (state, key) => {
  const errors = { ...state.errors };
  delete errors[key];
  return errors;
};

const variant = createSlice({
  name: 'variant',
  initialState,
  reducers: {
    reset: () => initialState,
    setDescription: (state, { payload }) => {
      state.form.description = payload;
      try {
        descriptionHelper.validate(payload);
        state.errors = cleanErrors(state, 'description');
        state.update = descriptionHelper.getStateUpdate(payload, state);
      } catch (e) {
        state.errors.description = e.message;
      }
    },
    setQuantity: (state, { payload }) => {
      state.form.quantity = { ...state.form.quantity, ...payload };
      try {
        // use abortEarly to collect errors for all fields
        // (error object will have an .inner array filled with errors)
        quantityHelper.validate(state.form.quantity, { abortEarly: false });
        state.errors = cleanErrors(state, 'quantity');
        state.update = quantityHelper.getStateUpdate(
          state.form.quantity,
          state
        );
      } catch (e) {
        state.errors.quantity = quantityHelper.toUIErrors(e, state);
        state.errors.quantity.message = e.message;
      }
    },
    setImages: (state, { payload }) => {
      state.form.images = payload;
      try {
        imagesHelper.validate(payload);
        state.errors = cleanErrors(state, 'images');
        state.update = imagesHelper.getStateUpdate(payload, state);
      } catch (e) {
        state.errors.images = e.message;
      }
    },
    setTitle: (state, { payload }) => {
      state.form.title = payload;
      try {
        titleHelper.validate(payload);
        state.errors = cleanErrors(state, 'title');
        state.update = titleHelper.getStateUpdate(payload, state);
      } catch (e) {
        state.errors.title = e.message;
      }
    },
    setRarity: (state, { payload }) => {
      state.form.rarity = payload;
      try {
        rarityHelper.validate(payload);
        state.errors = cleanErrors(state, 'rarity');
        state.update = rarityHelper.getStateUpdate(payload, state);
      } catch (e) {
        state.errors.rarity = e.message;
      }
    },
    setReward: (state, { payload }) => {
      state.form.reward = { ...state.form.reward, ...payload };
      try {
        rewardHelper.validate(state.form.reward);
        state.errors = cleanErrors(state, 'reward');
        state.update = rewardHelper.getStateUpdate(state.form.reward, state);
      } catch (e) {
        state.errors.reward = e.message;
      }
    },
    setAvailability: (state, { payload }) => {
      state.form.availability = payload;
      try {
        availabilityHelper.validate(payload);
        state.errors = cleanErrors(state, 'availability');
        state.update = availabilityHelper.getStateUpdate(payload, state);
      } catch (e) {
        state.errors.availability = e.message;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getVariant.fulfilled, (state, { payload }) => {
      // save a copy for improved UX when disabling items
      state.original = payload;
      state.loading = false;

      // fill data needed by each builder component
      state.form.title = titleHelper.toSchematized(state.original);
      state.form.description = descriptionHelper.toSchematized(state.original);
      state.form.reward = rewardHelper.toSchematized(state.original);
      state.form.quantity = quantityHelper.toSchematized(state.original);
      state.form.rarity = rarityHelper.toSchematized(state.original);
      state.form.availability = availabilityHelper.toSchematized(
        state.original
      );
      state.form.images = imagesHelper.toSchematized(state.original);
    });
    builder.addCase(getVariant.pending, (state, { payload }) => {
      state.isEdit = true;
      state.loading = true;
    });
    builder.addMatcher(
      isAnyOf(publishVariant.fulfilled, deactivateVariant.fulfilled),
      (state) => {
        state.update = {};
      }
    );
  },
});

// As each section has its own helper/reducer combo and core required fields can be spread across all sections,
// a single reducer cannot catch validation for a field in other section (and it shouldn't).
// We need to make sure that the submit state is disabled whenever those fields are missing,
// so we trigger a validation of the core requirements for the update object whenever variant is created/updated
export const selectCreateDisabled = createSelector(
  // first return errors and update objects to memoize the result of the following selector function
  (store) => ({
    errors: store.variant.errors,
    update: store.variant.update,
    original: store.variant.original,
  }),
  ({ errors, update, original }) => {
    try {
      const merged = { ...original, ...update };
      coreHelper.validate(merged);
      return Object.keys(errors).length > 0;
    } catch (e) {
      return true;
    }
  }
);

// for already published/saved products we need to check if there is any updates
export const selectUpdateDisabled = createSelector(
  (store) => ({
    errors: store.variant.errors,
    update: store.variant.update,
    original: store.variant.original,
  }),
  ({ errors, update, original }) => {
    try {
      const merged = { ...original, ...update };
      coreHelper.validate(merged);
      return Object.keys(errors).length > 0 || Object.keys(update).length === 0;
    } catch (e) {
      return true;
    }
  }
);

export const {
  reset,
  setDescription,
  setQuantity,
  setImages,
  setTitle,
  setReward,
  setRarity,
  setAvailability,
} = variant.actions;

export default variant.reducer;
