import { createAsyncThunk } from '@reduxjs/toolkit';
import query from '@/queries';
import {
  STATUS,
  selectAllProducts,
  selectProductById,
} from '@/features/products/slice';

export const getProductById = createAsyncThunk(
  'product/getById',
  async (params, thunkAPI) => {
    const product = selectProductById(thunkAPI.getState(), params.id);
    return product;
  }
);

export const deactivateProduct = createAsyncThunk(
  'product/deactivate',
  async ({ id }) => {
    if (!id) {
      throw new Error('an id is needed to deactivate a product');
    }
    await query.deactivateProduct({ id });
    return { id, changes: { status: STATUS.INACTIVE } };
  }
);

export const createProduct = createAsyncThunk(
  'product/create',
  async (params, { getState, rejectWithValue }) => {
    // TODO: Remove price placeholder once it's no longer required
    const data = { ...getState().product.update, price: 0 };
    const { createProduct } = await query.createProduct({ data });

    if (createProduct?.duplicateError) {
      return rejectWithValue({
        error: createProduct?.duplicateError,
      });
    }

    createProduct.id = Number(createProduct.id);
    return createProduct;
  }
);

export const modifyProduct = createAsyncThunk(
  'product/modify',
  async ({ id }, { getState, rejectWithValue }) => {
    const data = getState().product.update;
    const { modifyProduct } = await query.modifyProduct({ id, data });

    if (modifyProduct?.duplicateError) {
      return rejectWithValue({
        error: modifyProduct?.duplicateError,
      });
    }

    modifyProduct.id = Number(modifyProduct.id);
    return modifyProduct;
  }
);

export const publishProduct = createAsyncThunk(
  'product/publish',
  async ({ id }, thunkAPI) => {
    const { modifyProduct } = await query.modifyProduct({
      id,
      publish: true,
    });
    const claimToken = modifyProduct.claimToken;
    return { id, changes: { claimToken, status: STATUS.ACTIVE } };
  }
);

export const getUnlockableProducts = createAsyncThunk(
  'product/getUnlockableProducts',
  async (params, { getState }) => {
    const products = selectAllProducts(getState());
    return products.filter((product) => product.isUnlockable);
  }
);

export const getUnlockableRequirements = createAsyncThunk(
  'product/admin/getUnlockableRequirements',
  async (params, { getState }) => {
    const products = selectAllProducts(getState());
    const product = products.find(({ id }) => id === params.id);
    return product?.unlockedByProducts || [];
  }
);
