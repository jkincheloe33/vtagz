import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  getSession,
  logout,
  login,
  modifyBrand,
} from '@/features/login/thunks';

const initialState = {
  loading: true,
  error: '',
  authorized: false,
  initialized: false,
  sessionStartTime: Date.now(),
};

const app = createSlice({
  name: 'app',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // reset user auth state if session is being fetched
    builder.addCase(getSession.pending, (state) => {
      state.authorized = false;
      state.loading = true;
      state.initialized = true;
    });

    // reset user auth state if session is being fetched
    builder.addCase(logout.fulfilled, (state) => {
      return initialState;
    });

    builder.addCase(getSession.fulfilled, (state) => {
      state.loading = false;
    });

    builder.addMatcher(
      isAnyOf(getSession.fulfilled, login.fulfilled, modifyBrand.fulfilled),
      (state, action) => {
        const { payload, type } = action;
        if (type === 'login/session/fulfilled' && !payload?.account?.id) {
          state.authorized = false;
        } else {
          state.authorized = true;
        }
        state.loading = false;
      }
    );
  },
});

export default app.reducer;
