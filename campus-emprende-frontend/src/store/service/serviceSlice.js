import { createSlice } from '@reduxjs/toolkit';
import {
  browseServicesThunk,
  getServiceDetailThunk,
  getMyServicesThunk,
  createServiceThunk,
  updateServiceThunk,
  deactivateServiceThunk,
} from './serviceThunk';

const replaceById = (list, updated) =>
  list.map((item) => (item.id === updated.id ? updated : item));

const serviceSlice = createSlice({
  name: 'service',
  initialState: {
    services: [],
    myServices: [],
    selectedService: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedService(state) {
      state.selectedService = null;
    },
    clearServiceError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // browse
      .addCase(browseServicesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(browseServicesThunk.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.services = payload;
      })
      .addCase(browseServicesThunk.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // get detail
      .addCase(getServiceDetailThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getServiceDetailThunk.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.selectedService = payload;
      })
      .addCase(getServiceDetailThunk.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // get my services
      .addCase(getMyServicesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyServicesThunk.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.myServices = payload;
      })
      .addCase(getMyServicesThunk.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // create
      .addCase(createServiceThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createServiceThunk.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.myServices.unshift(payload);
      })
      .addCase(createServiceThunk.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // update
      .addCase(updateServiceThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateServiceThunk.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.myServices = replaceById(state.myServices, payload);
        if (state.selectedService?.id === payload.id) {
          state.selectedService = payload;
        }
      })
      .addCase(updateServiceThunk.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // deactivate
      .addCase(deactivateServiceThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deactivateServiceThunk.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.myServices = replaceById(state.myServices, payload);
        state.items = replaceById(state.items, payload);
        if (state.selectedService?.id === payload.id) {
          state.selectedService = payload;
        }
      })
      .addCase(deactivateServiceThunk.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export const { clearSelectedService, clearServiceError } = serviceSlice.actions;
export default serviceSlice.reducer;
