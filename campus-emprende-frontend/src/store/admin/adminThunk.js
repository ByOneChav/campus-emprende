import { createAsyncThunk } from '@reduxjs/toolkit';
import * as adminApi from '@/api/admin';

export const getDashboardThunk = createAsyncThunk(
  'admin/getDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await adminApi.getDashboard();
      console.log('getDashboard success:', data);
      return data;
    } catch (err) {
      console.error('getDashboard error:', err.response?.data ?? err.message);
      return rejectWithValue(err.response?.data ?? { message: 'Failed to fetch dashboard' });
    }
  }
);

export const getAllServicesThunk = createAsyncThunk(
  'admin/getAllServices',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await adminApi.getAllServices();
      console.log('getAllServices success:', data);
      return data;
    } catch (err) {
      console.error('getAllServices error:', err.response?.data ?? err.message);
      return rejectWithValue(err.response?.data ?? { message: 'Failed to fetch services' });
    }
  }
);

export const getPendingServicesThunk = createAsyncThunk(
  'admin/getPendingServices',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await adminApi.getPendingServices();
      console.log('getPendingServices success:', data);
      return data;
    } catch (err) {
      console.error('getPendingServices error:', err.response?.data ?? err.message);
      return rejectWithValue(err.response?.data ?? { message: 'Failed to fetch pending services' });
    }
  }
);

export const getActiveServicesThunk = createAsyncThunk(
  'admin/getActiveServices',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await adminApi.getActiveServices();
      console.log('getActiveServices success:', data);
      return data;
    } catch (err) {
      console.error('getActiveServices error:', err.response?.data ?? err.message);
      return rejectWithValue(err.response?.data ?? { message: 'Failed to fetch active services' });
    }
  }
);

export const getRejectedServicesThunk = createAsyncThunk(
  'admin/getRejectedServices',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await adminApi.getRejectedServices();
      console.log('getRejectedServices success:', data);
      return data;
    } catch (err) {
      console.error('getRejectedServices error:', err.response?.data ?? err.message);
      return rejectWithValue(err.response?.data ?? { message: 'Failed to fetch rejected services' });
    }
  }
);

export const approveServiceThunk = createAsyncThunk(
  'admin/approveService',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await adminApi.approveService(id);
      console.log('approveService success:', data);
      return data;
    } catch (err) {
      console.error('approveService error:', err.response?.data ?? err.message);
      return rejectWithValue(err.response?.data ?? { message: 'Failed to approve service' });
    }
  }
);

export const rejectServiceThunk = createAsyncThunk(
  'admin/rejectService',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const { data } = await adminApi.rejectService(id, reason);
      console.log('rejectService success:', data);
      return data;
    } catch (err) {
      console.error('rejectService error:', err.response?.data ?? err.message);
      return rejectWithValue(err.response?.data ?? { message: 'Failed to reject service' });
    }
  }
);

export const getAllUsersThunk = createAsyncThunk(
  'admin/getAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await adminApi.getAllUsers();
      console.log('getAllUsers success:', data);
      return data;
    } catch (err) {
      console.error('getAllUsers error:', err.response?.data ?? err.message);
      return rejectWithValue(err.response?.data ?? { message: 'Failed to fetch users' });
    }
  }
);

export const getStudentsThunk = createAsyncThunk(
  'admin/getStudents',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await adminApi.getStudents();
      console.log('getStudents success:', data);
      return data;
    } catch (err) {
      console.error('getStudents error:', err.response?.data ?? err.message);
      return rejectWithValue(err.response?.data ?? { message: 'Failed to fetch students' });
    }
  }
);

export const getAllReviewsThunk = createAsyncThunk(
  'admin/getAllReviews',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await adminApi.getAllReviews();
      console.log('getAllReviews success:', data);
      return data;
    } catch (err) {
      console.error('getAllReviews error:', err.response?.data ?? err.message);
      return rejectWithValue(err.response?.data ?? { message: 'Failed to fetch reviews' });
    }
  }
);

export const getGoodReviewsThunk = createAsyncThunk(
  'admin/getGoodReviews',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await adminApi.getGoodReviews();
      console.log('getGoodReviews success:', data);
      return data;
    } catch (err) {
      console.error('getGoodReviews error:', err.response?.data ?? err.message);
      return rejectWithValue(err.response?.data ?? { message: 'Failed to fetch good reviews' });
    }
  }
);

export const getTopStudentsThunk = createAsyncThunk(
  'admin/getTopStudents',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await adminApi.getTopStudents();
      console.log('getTopStudents success:', data);
      return data;
    } catch (err) {
      console.error('getTopStudents error:', err.response?.data ?? err.message);
      return rejectWithValue(err.response?.data ?? { message: 'Failed to fetch top students' });
    }
  }
);

export const getBadReviewsThunk = createAsyncThunk(
  'admin/getBadReviews',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await adminApi.getBadReviews();
      console.log('getBadReviews success:', data);
      return data;
    } catch (err) {
      console.error('getBadReviews error:', err.response?.data ?? err.message);
      return rejectWithValue(err.response?.data ?? { message: 'Failed to fetch bad reviews' });
    }
  }
);
