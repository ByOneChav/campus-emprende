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
      return rejectWithValue(err.response?.data ?? { message: 'No se pudo obtener el panel de control' });
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
      return rejectWithValue(err.response?.data ?? { message: 'No se pudieron obtener los servicios.' });
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
      return rejectWithValue(err.response?.data ?? { message: 'No se pudieron obtener los servicios pendientes.' });
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
      return rejectWithValue(err.response?.data ?? { message: 'No se pudieron obtener los servicios activos.' });
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
      return rejectWithValue(err.response?.data ?? { message: 'No se pudieron obtener los servicios rechazados.' });
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
      return rejectWithValue(err.response?.data ?? { message: 'No se aprobó el servicio' });
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
      return rejectWithValue(err.response?.data ?? { message: 'No se rechazó el servicio.' });
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
      return rejectWithValue(err.response?.data ?? { message: 'No se pudieron obtener los usuarios.' });
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
      return rejectWithValue(err.response?.data ?? { message: 'No se pudo recoger a los estudiantes.' });
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
      return rejectWithValue(err.response?.data ?? { message: 'No se pudieron obtener las reseñas' });
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
      return rejectWithValue(err.response?.data ?? { message: 'No obtuvo buenas críticas.' });
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
      return rejectWithValue(err.response?.data ?? { message: 'No se pudo buscar los/as mejores estudiantes.' });
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
      return rejectWithValue(err.response?.data ?? { message: 'No se pudieron obtener malas críticas' });
    }
  }
);
