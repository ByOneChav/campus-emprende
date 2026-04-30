import { createAsyncThunk } from '@reduxjs/toolkit';
import * as servicesApi from '@/api/services';

export const browseServicesThunk = createAsyncThunk(
  'service/browse',
  async ({ keyword, category } = {}, { rejectWithValue }) => {
    try {
      const { data } = await servicesApi.browseServices(keyword, category);
      console.log('browseServicesThunk success:', data);
      return data;
    } catch (err) {
      console.error('browseServicesThunk error:', err);
      return rejectWithValue(err.response?.data ?? { message: 'No se pudieron obtener los servicios.' });
    }
  }
);

export const getServiceDetailThunk = createAsyncThunk(
  'service/getDetail',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await servicesApi.getServiceDetail(id);
      console.log('getServiceDetailThunk success:', data);
      return data;
    } catch (err) {
      console.error('getServiceDetailThunk error:', err);
      return rejectWithValue(err.response?.data ?? { message: 'No se pudo obtener el servicio.' });
    }
  }
);

export const getMyServicesThunk = createAsyncThunk(
  'service/getMy',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await servicesApi.getMyServices();
      console.log('getMyServicesThunk success:', data);
      return data;
    } catch (err) {
      console.error('getMyServicesThunk error:', err);
      return rejectWithValue(err.response?.data ?? { message: 'No se pudieron obtener mis servicios.' });
    }
  }
);

export const createServiceThunk = createAsyncThunk(
  'service/create',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await servicesApi.createService(formData);
      console.log('createServiceThunk success:', data);
      return data;
    } catch (err) {
      console.error('createServiceThunk error:', err);
      return rejectWithValue(err.response?.data ?? { message: 'No se pudo crear el servicio.' });
    }
  }
);

export const updateServiceThunk = createAsyncThunk(
  'service/update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const { data } = await servicesApi.updateService(id, formData);
      console.log('updateServiceThunk success:', data);
      return data;
    } catch (err) {
      console.error('updateServiceThunk error:', err);
      return rejectWithValue(err.response?.data ?? { message: 'No se pudo actualizar el servicio.' });
    }
  }
);

export const deactivateServiceThunk = createAsyncThunk(
  'service/deactivate',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await servicesApi.deactivateService(id);
      console.log('deactivateServiceThunk success:', data);
      return data;
    } catch (err) {
      console.error('deactivateServiceThunk error:', err);
      return rejectWithValue(err.response?.data ?? { message: 'No se pudo desactivar el servicio.' });
    }
  }
);
