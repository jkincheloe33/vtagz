import { createAsyncThunk } from '@reduxjs/toolkit';
import { setAuthorizationHeader, removeAuthorizationHeader } from '@/config';
import query from '@/queries';

export const getSession = createAsyncThunk(
  'login/session',
  async (params, thunkAPI) => {
    const { session } = await query.getSession(params);
    return session;
  }
);

export const logout = createAsyncThunk(
  'login/clear',
  async (params, thunkAPI) => {
    const { logout } = await query.logout();
    removeAuthorizationHeader();
    return logout?.success;
  }
);

export const login = createAsyncThunk(
  'login/authenticate',
  async (params, { rejectWithValue }) => {
    const {
      data: { login: session },
      headers,
    } = await query.login({
      ...params,
      loginProvider: 'generic',
    });

    if (session?.invalidMessage) {
      return rejectWithValue({
        error: `${session.invalidMessage} Please try again.`,
      });
    }
    if (session?.bannedMessage) {
      return rejectWithValue({
        banned: true,
        error:
          'The account linked to that email is currently suspended. If you believe this is an error, please contact support@vtagz.com',
      });
    }

    // store session in localStorage !this is not safe
    setAuthorizationHeader(headers.authorization);
    return session;
  }
);

export const createBrand = createAsyncThunk(
  'login/createBrand',
  async (params, { rejectWithValue }) => {
    const {
      data: { createBrand: session },
      headers,
    } = await query.createBrand({
      ...params,
      loginProvider: 'generic',
    });

    if (session?.invalidMessage) {
      return rejectWithValue({
        error: `${session.invalidMessage} Please try again.`,
      });
    }
    if (session?.bannedMessage) {
      return rejectWithValue({
        banned: true,
        error:
          'The account linked to that email is currently suspended. If you believe this is an error, please contact support@vtagz.com',
      });
    }

    // store session in localStorage !this is not safe
    setAuthorizationHeader(headers.authorization);
    return session;
  }
);

export const modifyBrand = createAsyncThunk(
  'login/modifyBrand',
  async (params, { getState, rejectWithValue }) => {
    const name = getState().user.brand.name;
    const { modifyBrand: brand } = await query.modifyBrand({
      data: { ...params, name },
    });

    if (brand?.takenMessage) {
      return rejectWithValue({
        error: `${brand.takenMessage}.`,
      });
    }
    return brand;
  }
);
