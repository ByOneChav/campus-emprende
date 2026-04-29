import { createSlice } from '@reduxjs/toolkit';
import {
  sendRequestThunk,
  acceptRequestThunk,
  declineRequestThunk,
  startRequestThunk,
  completeRequestThunk,
  confirmRequestThunk,
  cancelRequestThunk,
  getSentRequestsThunk,
  getReceivedRequestsThunk,
} from './serviceRequestThunk';

const replaceById = (list, updated) =>
  list.map((item) => (item.id === updated.id ? updated : item));

const updateBoth = (state, payload) => {
  state.sent = replaceById(state.sent, payload);
  state.received = replaceById(state.received, payload);
};

const serviceRequestSlice = createSlice({
  name: 'serviceRequest',
  initialState: {
    sent: [],
    received: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearRequestError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // send
      .addCase(sendRequestThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendRequestThunk.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.sent.unshift(payload);
      })
      .addCase(sendRequestThunk.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // get sent
      .addCase(getSentRequestsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSentRequestsThunk.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.sent = payload;
      })
      .addCase(getSentRequestsThunk.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // get received
      .addCase(getReceivedRequestsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReceivedRequestsThunk.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.received = payload;
      })
      .addCase(getReceivedRequestsThunk.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // accept
      .addCase(acceptRequestThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptRequestThunk.fulfilled, (state, { payload }) => {
        state.loading = false;
        updateBoth(state, payload);
      })
      .addCase(acceptRequestThunk.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // decline
      .addCase(declineRequestThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(declineRequestThunk.fulfilled, (state, { payload }) => {
        state.loading = false;
        updateBoth(state, payload);
      })
      .addCase(declineRequestThunk.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // start (mark in progress)
      .addCase(startRequestThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startRequestThunk.fulfilled, (state, { payload }) => {
        state.loading = false;
        updateBoth(state, payload);
      })
      .addCase(startRequestThunk.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // complete (provider marks done)
      .addCase(completeRequestThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeRequestThunk.fulfilled, (state, { payload }) => {
        state.loading = false;
        updateBoth(state, payload);
      })
      .addCase(completeRequestThunk.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // confirm (client confirms completion)
      .addCase(confirmRequestThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmRequestThunk.fulfilled, (state, { payload }) => {
        state.loading = false;
        updateBoth(state, payload);
      })
      .addCase(confirmRequestThunk.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // cancel
      .addCase(cancelRequestThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelRequestThunk.fulfilled, (state, { payload }) => {
        state.loading = false;
        updateBoth(state, payload);
      })
      .addCase(cancelRequestThunk.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export const { clearRequestError } = serviceRequestSlice.actions;
export default serviceRequestSlice.reducer;
