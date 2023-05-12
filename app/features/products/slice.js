import {
  createEntityAdapter,
  createSelector,
  createSlice,
  isAnyOf,
} from '@reduxjs/toolkit';
import { getAllProducts } from './thunks';
import {
  createProduct,
  deactivateProduct,
  modifyProduct,
  publishProduct,
} from '@/features/product/thunks';
import { deactivateVariant, publishVariant } from '@/features/variant/thunks';

export const STATUS = {
  ALL: 'all',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DRAFT: 'draft',
};

const initialState = {
  products: [],
  search: '',
  filter: STATUS.ALL,
  loading: false,
  loaded: false,
};

const productsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.id - a.id,
});

const products = createSlice({
  name: 'products',
  initialState: productsAdapter.getInitialState(initialState),
  reducers: {
    setSearch: (state, { payload }) => {
      state.search = payload;
    },
    setFilter: (state, { payload }) => {
      state.filter = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllProducts.fulfilled, (state, { payload }) => {
      productsAdapter.setAll(state, payload);
      state.loading = false;
      state.loaded = true;
    });
    builder.addCase(getAllProducts.pending, (state, { payload }) => {
      state.loading = true;
    });
    builder.addCase(createProduct.fulfilled, (state, { payload }) => {
      productsAdapter.addOne(state, payload);
      state.loading = false;
    });
    builder.addCase(modifyProduct.fulfilled, (state, { payload }) => {
      productsAdapter.upsertOne(state, payload);
      state.loading = false;
    });
    builder.addMatcher(
      isAnyOf(deactivateProduct.fulfilled, publishProduct.fulfilled),
      (state, { payload }) => {
        productsAdapter.updateOne(state, payload);
        state.loading = false;
      }
    );
    builder.addMatcher(
      isAnyOf(
        createProduct.pending,
        deactivateProduct.pending,
        modifyProduct.pending,
        publishProduct.pending,
        deactivateVariant.pending,
        publishVariant.pending
      ),
      (state) => {
        state.loading = true;
      }
    );
    builder.addMatcher(
      isAnyOf(
        deactivateProduct.rejected,
        modifyProduct.rejected,
        publishProduct.rejected
      ),
      (state) => {
        state.loading = false;
      }
    );
    builder.addMatcher(
      isAnyOf(deactivateVariant.fulfilled, publishVariant.fulfilled),
      (state, { payload }) => {
        productsAdapter.updateOne(state, {
          id: payload.id,
          changes: {
            metadata: {
              variants: payload.variants,
            },
          },
        });
        state.loading = false;
      }
    );
  },
});

export const { setSearch, setFilter } = products.actions;

export const { selectAll: selectAllProducts, selectById: selectProductById } =
  productsAdapter.getSelectors((store) => store.products);

export const selectSearchedProducts = createSelector(
  (state) => ({ products: selectAllProducts(state), state }),
  ({ products, state }) => {
    if (state.products.search === '') {
      return products;
    }
    return products.filter((product) => {
      const title = product.title.toLowerCase();
      const name = product.name.toLowerCase();
      const s = state.products.search.toLowerCase();

      return title.indexOf(s) >= 0 || name.indexOf(s) >= 0;
    });
  }
);

export const selectFilteredProducts = createSelector(
  (state) => ({ products: selectSearchedProducts(state), state }),
  ({ products, state }) => {
    if (state.products.filter === STATUS.ALL) {
      return products;
    }

    return products.filter(({ status }) => status === state.products.filter);
  }
);

export default products.reducer;
