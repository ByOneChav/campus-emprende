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
      return rejectWithValue(err.response?.data ?? { message: 'Failed to accept request' });
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
      return rejectWithValue(err.response?.data ?? { message: 'Failed to decline request' });
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
      return rejectWithValue(err.response?.data ?? { message: 'Failed to start request' });
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
      return rejectWithValue(err.response?.data ?? { message: 'Failed to complete request' });
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
      return rejectWithValue(err.response?.data ?? { message: 'Failed to confirm request' });
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
      return rejectWithValue(err.response?.data ?? { message: 'Failed to cancel request' });
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
      return rejectWithValue(err.response?.data ?? { message: 'Failed to fetch sent requests' });
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
      return rejectWithValue(err.response?.data ?? { message: 'Failed to fetch received requests' });
    }
  }
);
