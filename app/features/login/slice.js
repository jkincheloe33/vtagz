import { createSlice } from '@reduxjs/toolkit';
import { login as loginUser } from '@/features/login/thunks';

const initialState = {
  error: '',
  provider: '',
  interactionDisabled: false,
};

const login = createSlice({
  name: 'login',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.interactionDisabled = true;
    });
    builder.addCase(loginUser.fulfilled, (state) => {
      return { ...initialState };
    });
    builder.addCase(loginUser.rejected, (state, { payload }) => {
      state.interactionDisabled = false;
      // payload.error comes from rejectedWithValue
      if (payload?.error) {
        state.error = payload.error;
      }
    });
  },
});

export default login.reducer;
