import { createSlice } from '@reduxjs/toolkit';
import { getCommentsThunk, addCommentThunk, deleteCommentThunk } from './commentThunk';

const commentSlice = createSlice({
  name: 'comment',
  initialState: {
    byServiceId: {},   // { [serviceId]: { items: [], loading: false } }
    submitting: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch comments
      .addCase(getCommentsThunk.pending, (state, { meta }) => {
        const id = meta.arg;
        state.byServiceId[id] = { items: state.byServiceId[id]?.items ?? [], loading: true };
      })
      .addCase(getCommentsThunk.fulfilled, (state, { payload }) => {
        state.byServiceId[payload.serviceId] = { items: payload.comments, loading: false };
      })
      .addCase(getCommentsThunk.rejected, (state, { meta }) => {
        const id = meta.arg;
        if (state.byServiceId[id]) state.byServiceId[id].loading = false;
      })

      // add comment
      .addCase(addCommentThunk.pending, (state) => { state.submitting = true; state.error = null; })
      .addCase(addCommentThunk.fulfilled, (state, { payload }) => {
        state.submitting = false;
        const bucket = state.byServiceId[payload.serviceId];
        if (bucket) {
          bucket.items = [payload.comment, ...bucket.items];
        } else {
          state.byServiceId[payload.serviceId] = { items: [payload.comment], loading: false };
        }
      })
      .addCase(addCommentThunk.rejected, (state, { payload }) => {
        state.submitting = false;
        state.error = payload;
      })

      // delete comment
      .addCase(deleteCommentThunk.fulfilled, (state, { payload }) => {
        const bucket = state.byServiceId[payload.serviceId];
        if (bucket) {
          bucket.items = bucket.items.filter((c) => c.id !== payload.commentId);
        }
      });
  },
});

export default commentSlice.reducer;
