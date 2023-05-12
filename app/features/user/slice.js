import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  createBrand,
  getSession,
  login,
  logout,
  modifyBrand,
} from '@/features/login/thunks';

/**
 * Helper for checking permissions to access features
 * within the platform
 * @param {integer} userRole - the role of the user being checked
 * @param {integer} accessFlag - the access to check against
 * @returns {boolean} true|false if user has access to flag
 */
export const hasPermission = (userRole, accessFlag) => {
  return (userRole & accessFlag) !== 0;
};

export const AccountPermissions = Object.freeze({
  /** default user permission for vtagz */
  USER: 1,
  /** brand permissions for accounts */
  VIEWER: 2,
  EDITOR: 4,
  BRANDADMIN: 8,
  /** super permission - access everything */
  SUPERADMIN: 256,
});

const initialState = {
  email: '',
  fullName: '',
  id: null,
  error: {},
};

const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setClearError: (state) => {
      state.error = {};
    },
    setEmail(state, { payload }) {
      state.email = payload;
    },
    setFullName(state, { payload }) {
      state.fullName = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(modifyBrand.fulfilled, (state, { payload }) => {
      state.brand = { ...payload, id: Number(payload.id) };
    });
    builder.addCase(logout.fulfilled, (state, { payload }) => {
      return initialState;
    });
    builder.addMatcher(
      isAnyOf(createBrand.rejected, login.rejected, modifyBrand.rejected),
      (state, { error, payload }) => {
        state.error = payload?.error ? { message: payload.error } : error;
      }
    );
    builder.addMatcher(
      isAnyOf(createBrand.fulfilled, getSession.fulfilled, login.fulfilled),
      (state, { payload }) => {
        if (payload) {
          return {
            ...payload.account,
            id: payload?.account?.id ? Number(payload?.account?.id) : null,
            authorized: payload.authorized,
            brand: { ...payload.brand, id: Number(payload.brand?.id) },
            isNewUser: payload.isNewUser,
            error: {},
          };
        }
      }
    );
  },
});

export const { setClearError, setEmail, setFullName } = user.actions;

export default user.reducer;
