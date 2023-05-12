import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { getAllTimePerformance, getPerformanceSummary } from './thunks';

const today = new Date();

export const TIMESTAMPS = [
  {
    label: 'Last 24 hours',
    value: new Date(new Date().setDate(today.getDate() - 1)).getTime(),
  },
  {
    label: 'Last 7 days',
    value: new Date(new Date().setDate(today.getDate() - 7)).getTime(),
  },
  {
    label: 'Last 14 days',
    value: new Date(new Date().setDate(today.getDate() - 14)).getTime(),
  },
  {
    label: 'Last 30 days',
    value: new Date(new Date().setDate(today.getDate() - 30)).getTime(),
  },
  {
    label: 'All time',
    status: 'Beta',
    value: 0,
  },
];

const productsAnalyticsAdapter = createEntityAdapter({
  selectId: (allTime) => allTime.productId,
});

const initialState = {
  // last 30 days
  startDate: new Date(new Date().setDate(today.getDate() - 30)).getTime(),
  loading: false,
  loaded: false,
};

const productsAnalytics = createSlice({
  name: 'productsAnalytics',
  initialState: productsAnalyticsAdapter.getInitialState(initialState),
  reducers: {
    setStartDate: (state, { payload }) => {
      state.startDate = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPerformanceSummary.fulfilled, (state, { payload }) => {
      state.summary = payload;
    });
    builder.addCase(getAllTimePerformance.fulfilled, (state, { payload }) => {
      productsAnalyticsAdapter.setAll(state, payload);
      state.loading = false;
      state.loaded = true;
    });
    builder.addCase(getAllTimePerformance.pending, (state, { payload }) => {
      state.loading = true;
    });
  },
});

export const {
  selectEntities: selectProductsAnalyticsEntities,
  selectById: selectProductsAnalyticsById,
} = productsAnalyticsAdapter.getSelectors((store) => store.productsAnalytics);

export const { setStartDate } = productsAnalytics.actions;

export default productsAnalytics.reducer;
