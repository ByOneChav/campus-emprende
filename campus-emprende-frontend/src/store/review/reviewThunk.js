import { createAsyncThunk } from '@reduxjs/toolkit';
import * as reviewsApi from '@/api/reviews';

export const submitReviewThunk = createAsyncThunk(
  'review/submit',
  async ({ requestId, rating, comment }, { rejectWithValue }) => {
    try {
      const { data } = await reviewsApi.submitReview(requestId, rating, comment);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { message: 'Failed to submit review' });
    }
  }
);

export const getServiceReviewsThunk = createAsyncThunk(
  'review/getByService',
  async (serviceId, { rejectWithValue }) => {
    try {
      const { data } = await reviewsApi.getServiceReviews(serviceId);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { message: 'Failed to fetch service reviews' });
    }
  }
);

export const getProviderReviewsThunk = createAsyncThunk(
  'review/getByProvider',
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await reviewsApi.getProviderReviews(userId);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { message: 'Failed to fetch provider reviews' });
    }
  }
);
