import { createAsyncThunk } from '@reduxjs/toolkit';
import query from '@/queries';

// returns array of all time performance for each product that has any impressions/claims
export const getAllTimePerformance = createAsyncThunk(
  'products-analytics/alltime',
  async (params) => {
    const { allTimePerformance } = await query.getAllTimePerformance(params);
    return allTimePerformance;
  }
);

export const getPerformanceSummary = createAsyncThunk(
  'products-analytics/summary',
  async (params) => {
    const { performanceSummary } = await query.getPerformanceSummary(params);
    return performanceSummary;
  }
);
