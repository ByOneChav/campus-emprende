import { createAsyncThunk } from '@reduxjs/toolkit';
import * as requestsApi from '@/api/requests';

export const sendRequestThunk = createAsyncThunk(
  'serviceRequest/send',
  async ({ serviceId, message }, { rejectWithValue }) => {
    try {
      const { data } = await requestsApi.sendRequest(serviceId, message);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { message: 'Failed to send request' });
    }
  }
);

export const acceptRequestThunk = createAsyncThunk(
  'serviceRequest/accept',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await requestsApi.acceptRequest(id);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { message: 'No se pudo aceptar la solicitud' });
    }
  }
);

export const declineRequestThunk = createAsyncThunk(
  'serviceRequest/decline',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await requestsApi.declineRequest(id);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { message: 'No se pudo rechazar la solicitud' });
    }
  }
);

export const startRequestThunk = createAsyncThunk(
  'serviceRequest/start',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await requestsApi.startRequest(id);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { message: 'No se pudo iniciar la solicitud' });
    }
  }
);

export const completeRequestThunk = createAsyncThunk(
  'serviceRequest/complete',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await requestsApi.completeRequest(id);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { message: 'No se pudo completar la solicitud' });
    }
  }
);

export const confirmRequestThunk = createAsyncThunk(
  'serviceRequest/confirm',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await requestsApi.confirmRequest(id);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { message: 'No se pudo confirmar la solicitud.' });
    }
  }
);

export const cancelRequestThunk = createAsyncThunk(
  'serviceRequest/cancel',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await requestsApi.cancelRequest(id);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { message: 'No se pudo cancelar la solicitud.' });
    }
  }
);

export const getSentRequestsThunk = createAsyncThunk(
  'serviceRequest/getSent',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await requestsApi.getSentRequests();
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { message: 'No se pudieron recuperar las solicitudes enviadas.' });
    }
  }
);

export const getReceivedRequestsThunk = createAsyncThunk(
  'serviceRequest/getReceived',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await requestsApi.getReceivedRequests();
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { message: 'No se pudieron recuperar las solicitudes recibidas.' });
    }
  }
);
