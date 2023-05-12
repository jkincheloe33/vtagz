import { createSelector, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { createSms, deactivateSms, getSmsCampaign, modifySms } from './thunks';
import coreHelper from './helpers/core';
import faqHelper from './helpers/faq';
import onboardingHelper from './helpers/onboarding';

export const STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

const initialState = {
  loaded: false,
  loading: true,
  form: {},
  errors: {},
  isEdit: false,
  original: {},
  update: {},
};

const cleanErrors = (state, key) => {
  const errors = { ...state.errors };
  delete errors[key];
  return errors;
};

const sms = createSlice({
  name: 'sms',
  initialState,
  reducers: {
    reset: () => initialState,
    setFaqMessage: (state, { payload }) => {
      state.form.faqMessage = payload;
      try {
        faqHelper.validate(payload);
        state.errors = cleanErrors(state, 'faqMessage');
        state.update = faqHelper.getStateUpdate(payload, state);
      } catch (e) {
        state.errors.faqMessage = e.message;
      }
    },
    setOnboardingMessage: (state, { payload }) => {
      state.form.onboardingMessage = payload;
      try {
        onboardingHelper.validate(payload);
        state.errors = cleanErrors(state, 'onboardingMessage');
        state.update = onboardingHelper.getStateUpdate(payload, state);
      } catch (e) {
        state.errors.onboardingMessage = e.message;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getSmsCampaign.fulfilled, (state, { payload }) => {
      // save a copy for improved UX when disabling items
      state.original = payload;
      state.loading = false;
      state.loaded = true;

      // fill data needed by builder component
      state.form.faqMessage = faqHelper.toSchematized(state.original);
      state.form.onboardingMessage = onboardingHelper.toSchematized(
        state.original
      );

      if (payload.id) {
        state.id = payload.id;
        state.status = payload.status;
        state.isEdit = true;
      }
    });
    builder.addMatcher(
      isAnyOf(createSms.rejected, deactivateSms.rejected, modifySms.rejected),
      (state, { payload }) => {
        // payload.error comes from rejectedWithValue
        if (payload?.error) {
          state.error = payload.error;
        }
      }
    );
    builder.addMatcher(
      isAnyOf(
        createSms.fulfilled,
        deactivateSms.fulfilled,
        modifySms.fulfilled
      ),
      (state, { payload }) => {
        state.status = payload.status;
        state.update = {};
      }
    );
  },
});

// As each section has its own helper/reducer combo and core required fields can be spread across all sections,
// a single reducer cannot catch validation for a field in other section (and it shouldn't).
// We need to make sure that the submit state is disabled whenever those fields are missing,
// so we trigger a validation of the core requirements for the update object whenever smsCampaign is created/updated
export const selectCreateDisabled = createSelector(
  // first return errors and update objects to memoize the result of the following selector function
  (store) => ({
    errors: store.sms.errors,
    update: store.sms.update,
    original: store.sms.original,
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

// for already published/saved smsCampaigns we need to check if there is any updates
export const selectUpdateDisabled = createSelector(
  (store) => ({
    errors: store.sms.errors,
    update: store.sms.update,
    original: store.sms.original,
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

export const { reset, setFaqMessage, setOnboardingMessage } = sms.actions;

export default sms.reducer;
