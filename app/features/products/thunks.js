import { createAsyncThunk } from '@reduxjs/toolkit';
import query from '@/queries';

export const getAllProducts = createAsyncThunk(
  'products/fetchList',
  async (params) => {
    const { products } = await query.getProducts(params);
    products?.forEach((p) => {
      p.id = Number(p.id);
    });
    return products;
  }
);
