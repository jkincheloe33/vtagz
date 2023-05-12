import { createAsyncThunk } from '@reduxjs/toolkit';
import query from '@/queries';

export const getSmsCampaign = createAsyncThunk(
  'sms/campaign',
  async ({ productId }) => {
    const { getSmsCampaign } = await query.getSmsCampaign({ productId });
    return getSmsCampaign ?? {};
  }
);

export const createSms = createAsyncThunk(
  'sms/create',
  async ({ active, brandId, productId }, { getState, rejectWithValue }) => {
    const sms = getState().sms;
    const data = { ...sms.update, active, brandId, productId };
    const { createSmsCampaign } = await query.createSmsCampaign(data);
    return createSmsCampaign;
  }
);

export const deactivateSms = createAsyncThunk(
  'sms/deactivate',
  async ({ id }) => {
    const { deleteSmsCampaign } = await query.deleteSmsCampaign({ id });
    return deleteSmsCampaign;
  }
);

export const modifySms = createAsyncThunk(
  'sms/modify',
  async ({ id, active, brandId, productId }, { getState, rejectWithValue }) => {
    const sms = getState().sms;
    const data = { ...sms.update, id, active, brandId, productId };
    const { updateSmsCampaign } = await query.updateSmsCampaign(data);
    return updateSmsCampaign;
  }
);
