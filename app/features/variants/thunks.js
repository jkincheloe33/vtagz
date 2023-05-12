import { createAsyncThunk } from '@reduxjs/toolkit';
import { selectProductById } from '@/features/products/slice';

export const getVariantsByProductId = createAsyncThunk(
  'variants/getByProductId',
  async (params, thunkAPI) => {
    const product = selectProductById(thunkAPI.getState(), params.id);
    return product.metadata?.variants || [];
  }
);
