import { createSlice } from '@reduxjs/toolkit';
import {
  submitReviewThunk,
  getServiceReviewsThunk,
  getProviderReviewsThunk,
} from './reviewThunk';

const reviewSlice = createSlice({
  name: 'review',
  initialState: {
    serviceReviews: [],
    providerReviews: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearReviewError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // submit
      .addCase(submitReviewThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitReviewThunk.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.serviceReviews.unshift(payload);
      })
      .addCase(submitReviewThunk.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // get by service
      .addCase(getServiceReviewsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getServiceReviewsThunk.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.serviceReviews = payload;
      })
      .addCase(getServiceReviewsThunk.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // get by provider
      .addCase(getProviderReviewsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProviderReviewsThunk.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.providerReviews = payload;
      })
      .addCase(getProviderReviewsThunk.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export const { clearReviewError } = reviewSlice.actions;
export default reviewSlice.reducer;
