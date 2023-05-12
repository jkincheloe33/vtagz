import { createSelector, createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  createProduct,
  modifyProduct,
  deactivateProduct,
  getProductById,
  getUnlockableProducts,
  getUnlockableRequirements,
} from './thunks';
import unlockablesHelper from './helpers/unlockables';
import productLinksHelper from './helpers/product-links';
import blockchainHelper from './helpers/blockchain';
import imageUrlHelper from './helpers/image-url';
import descriptionHelper from './helpers/description';
import hiddenHelper from './helpers/hidden';
import legalHelper from './helpers/legal';
import wrapperImageHelper from './helpers/branding/wrapper-image';
import claimScreenStylingHelper from './helpers/branding/claim-screen';
import nftScreenStylingHelper from './helpers/branding/nft-screen';
import claimLimitHelper from './helpers/claim-limit';
import coreHelper from './helpers/core';
import titleHelper from './helpers/title';
import nameHelper from './helpers/name';

const initialState = {
  loading: true,
  form: {},
  errors: {},
  original: {},
  update: {},
};

const cleanErrors = (state, key) => {
  const errors = { ...state.errors };
  delete errors[key];
  return errors;
};

const product = createSlice({
  name: 'product',
  initialState,
  reducers: {
    reset: () => initialState,
    setClaimLimit: (state, { payload }) => {
      state.form.claimLimit = payload;
      try {
        claimLimitHelper.validate(payload, { abortEarly: false });
        state.errors = cleanErrors(state, 'claimLimit');
        state.update = claimLimitHelper.getStateUpdate(payload, state);
      } catch (e) {
        state.errors.claimLimit = claimLimitHelper.toUIErrors(e, state);
        state.errors.claimLimit = e.message;
      }
    },
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
    setGated: (state, { payload }) => {
      state.form.gated = payload;
      try {
        blockchainHelper.validate(payload);
        state.errors = cleanErrors(state, 'blockchain');
        state.update = blockchainHelper.getStateUpdate(payload, state);
      } catch (e) {
        state.errors.blockchain = e.message;
      }
    },
    setHidden: (state, { payload }) => {
      state.form.hidden = payload;
      try {
        hiddenHelper.validate(payload);
        state.errors = cleanErrors(state, 'hidden');
        state.update = hiddenHelper.getStateUpdate(payload, state);
      } catch (e) {
        state.errors.hidden = e.message;
      }
    },
    setImageUrl: (state, { payload }) => {
      state.form.imageUrl = payload;
      try {
        imageUrlHelper.validate(payload);
        state.errors = cleanErrors(state, 'imageUrl');
        state.update = imageUrlHelper.getStateUpdate(payload, state);
      } catch (e) {
        state.errors.imageUrl = e.message;
      }
    },
    setName: (state, { payload }) => {
      state.form.name = payload;
      try {
        nameHelper.validate(payload);
        state.errors = cleanErrors(state, 'name');
        state.update = nameHelper.getStateUpdate(payload, state);
      } catch (e) {
        state.errors.name = e.message;
      }
    },
    // a single reducer is needed by each UI component
    setProductLinks: (state, { payload }) => {
      state.form.productLinks = payload;
      try {
        productLinksHelper.validate(payload); // is the payload valid?
        state.errors = cleanErrors(state, 'productLinks'); // clean any previous errors
        state.update = productLinksHelper.getStateUpdate(payload, state); // get a new state.update
      } catch (e) {
        // general submit state can be obtained from state.errors and state.update keys length
        state.errors.productLinks = e.message; // can be consumed by the UI component
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
    setLegal: (state, { payload }) => {
      state.form.legal = payload;
      try {
        legalHelper.validate(payload);
        state.errors = cleanErrors(state, 'legal');
        state.update = legalHelper.getStateUpdate(payload, state);
      } catch (e) {
        state.errors.legal = e.message;
      }
    },
    setWrapperImage: (state, { payload }) => {
      state.form.wrapperImage = payload;
      try {
        wrapperImageHelper.validate(payload);
        state.errors = cleanErrors(state, 'wrapperImage');
        state.update = wrapperImageHelper.getStateUpdate(payload, state);
      } catch (e) {
        state.errors.wrapperImage = e.message;
      }
    },
    setClaimScreenStyling: (state, { payload }) => {
      state.form.claimScreenStyling = payload;
      try {
        claimScreenStylingHelper.validate(payload);
        state.errors = cleanErrors(state, 'claimScreenStyling');
        state.update = claimScreenStylingHelper.getStateUpdate(payload, state);
      } catch (e) {
        state.errors.claimScreenStyling = e.message;
      }
    },
    setNftScreenStyling: (state, { payload }) => {
      state.form.nftScreenStyling = payload;
      try {
        nftScreenStylingHelper.validate(payload);
        state.errors = cleanErrors(state, 'nftScreenStyling');
        state.update = nftScreenStylingHelper.getStateUpdate(payload, state);
      } catch (e) {
        state.errors.nftScreenStyling = e.message;
      }
    },
    setUnlockables: (state, { payload }) => {
      state.form.unlockables = payload;
      try {
        unlockablesHelper.validate(payload);
        state.errors = cleanErrors(state, 'belongsToUnlockable');
        state.update = unlockablesHelper.getStateUpdate(payload, state);
      } catch (e) {
        state.errors.belongsToUnlockable = e.message;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getProductById.fulfilled, (state, { payload }) => {
      // save a copy for improved UX when disabling items
      state.original = payload;
      state.loading = false;

      // fill data needed by each builder component
      state.form.name = nameHelper.toSchematized(state.original);
      state.form.title = titleHelper.toSchematized(state.original);
      state.form.description = descriptionHelper.toSchematized(state.original);
      state.form.imageUrl = imageUrlHelper.toSchematized(state.original);
      state.form.claimLimit = claimLimitHelper.toSchematized(state.original);
      state.form.legal = legalHelper.toSchematized(state.original);
      state.form.productLinks = productLinksHelper.toSchematized(
        state.original
      );
      state.form.gated = blockchainHelper.toSchematized(state.original);
      state.form.wrapperImage = wrapperImageHelper.toSchematized(
        state.original
      );
      state.form.claimScreenStyling = claimScreenStylingHelper.toSchematized(
        state.original
      );
      state.form.nftScreenStyling = nftScreenStylingHelper.toSchematized(
        state.original
      );
      state.form.unlockables = unlockablesHelper.toSchematized(state.original);
      state.form.hidden = hiddenHelper.toSchematized(state.original);
    });
    builder.addCase(getProductById.pending, (state, { payload }) => {
      state.isEdit = true;
      state.loading = true;
    });
    builder.addCase(getUnlockableProducts.fulfilled, (state, { payload }) => {
      state.unlockableProducts = payload;
      state.unlockableProductsFetched = true;
    });
    builder.addCase(
      getUnlockableRequirements.fulfilled,
      (state, { payload }) => {
        state.unlockableRequirementsFetched = true;
        state.unlockableRequirements = payload;
      }
    );
    builder.addMatcher(
      isAnyOf(createProduct.rejected, modifyProduct.rejected),
      (state, { payload }) => {
        // payload.error comes from rejectedWithValue
        if (payload?.error) {
          state.error = payload.error;
        }
      }
    );
    builder.addMatcher(
      isAnyOf(
        createProduct.fulfilled,
        modifyProduct.fulfilled,
        deactivateProduct.fulfilled
      ),
      (state) => {
        state.update = {};
      }
    );
  },
});

// As each section has its own helper/reducer combo and core required fields can be spread across all sections,
// a single reducer cannot catch validation for a field in other section (and it shouldn't).
// We need to make sure that the submit state is disabled whenever those fields are missing,
// so we trigger a validation of the core requirements for the update object whenever product is created/updated
export const selectCreateDisabled = createSelector(
  // first return errors and update objects to memoize the result of the following selector function
  (store) => ({
    errors: store.product.errors,
    update: store.product.update,
    original: store.product.original,
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
    errors: store.product.errors,
    update: store.product.update,
    original: store.product.original,
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
  setClaimLimit,
  setDescription,
  setGated,
  setHidden,
  setImageUrl,
  setName,
  setTitle,
  setLegal,
  setProductLinks,
  setWrapperImage,
  setClaimScreenStyling,
  setNftScreenStyling,
  setUnlockables,
} = product.actions;

export default product.reducer;
