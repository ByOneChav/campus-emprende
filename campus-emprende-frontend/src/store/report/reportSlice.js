import { createSlice } from '@reduxjs/toolkit';
import { submitReportThunk, getReportsThunk, resolveReportThunk } from './reportThunk';

const reportSlice = createSlice({
  name: 'report',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearReportError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // submit
      .addCase(submitReportThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitReportThunk.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.items.unshift(payload);
      })
      .addCase(submitReportThunk.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // get all (admin)
      .addCase(getReportsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReportsThunk.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.items = payload;
      })
      .addCase(getReportsThunk.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // resolve (admin)
      .addCase(resolveReportThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resolveReportThunk.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.items = state.items.map((r) => (r.id === payload.id ? payload : r));
      })
      .addCase(resolveReportThunk.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export const { clearReportError } = reportSlice.actions;
export default reportSlice.reducer;
