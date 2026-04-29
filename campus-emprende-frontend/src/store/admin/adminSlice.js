import { createSlice } from '@reduxjs/toolkit';
import {
  getDashboardThunk,
  getAllServicesThunk,
  getPendingServicesThunk,
  getActiveServicesThunk,
  getRejectedServicesThunk,
  approveServiceThunk,
  rejectServiceThunk,
  getAllUsersThunk,
  getStudentsThunk,
  getAllReviewsThunk,
  getGoodReviewsThunk,
  getBadReviewsThunk,
  getTopStudentsThunk,
} from './adminThunk';

const pending = (state) => { state.loading = true; state.error = null; };
const rejected = (state, { payload }) => { state.loading = false; state.error = payload; };

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    dashboard: null,
    allServices: [],
    pendingServices: [],
    activeServices: [],
    rejectedServices: [],
    allUsers: [],
    students: [],
    allReviews: [],
    goodReviews: [],
    badReviews: [],
    topStudents: [],
    loading: false,
    actionLoading: false,
    error: null,
  },
  reducers: {
    clearAdminError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardThunk.pending, pending)
      .addCase(getDashboardThunk.fulfilled, (state, { payload }) => { state.loading = false; state.dashboard = payload; })
      .addCase(getDashboardThunk.rejected, rejected)

      .addCase(getAllServicesThunk.pending, pending)
      .addCase(getAllServicesThunk.fulfilled, (state, { payload }) => { state.loading = false; state.allServices = payload; })
      .addCase(getAllServicesThunk.rejected, rejected)

      .addCase(getPendingServicesThunk.pending, pending)
      .addCase(getPendingServicesThunk.fulfilled, (state, { payload }) => { state.loading = false; state.pendingServices = payload; })
      .addCase(getPendingServicesThunk.rejected, rejected)

      .addCase(getActiveServicesThunk.pending, pending)
      .addCase(getActiveServicesThunk.fulfilled, (state, { payload }) => { state.loading = false; state.activeServices = payload; })
      .addCase(getActiveServicesThunk.rejected, rejected)

      .addCase(getRejectedServicesThunk.pending, pending)
      .addCase(getRejectedServicesThunk.fulfilled, (state, { payload }) => { state.loading = false; state.rejectedServices = payload; })
      .addCase(getRejectedServicesThunk.rejected, rejected)

      .addCase(approveServiceThunk.pending, (state) => { state.actionLoading = true; state.error = null; })
      .addCase(approveServiceThunk.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.pendingServices = state.pendingServices.filter((s) => s.id !== action.meta.arg);
      })
      .addCase(approveServiceThunk.rejected, (state, { payload }) => { state.actionLoading = false; state.error = payload; })

      .addCase(rejectServiceThunk.pending, (state) => { state.actionLoading = true; state.error = null; })
      .addCase(rejectServiceThunk.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.pendingServices = state.pendingServices.filter((s) => s.id !== action.meta.arg.id);
      })
      .addCase(rejectServiceThunk.rejected, (state, { payload }) => { state.actionLoading = false; state.error = payload; })

      .addCase(getAllUsersThunk.pending, pending)
      .addCase(getAllUsersThunk.fulfilled, (state, { payload }) => { state.loading = false; state.allUsers = payload; })
      .addCase(getAllUsersThunk.rejected, rejected)

      .addCase(getStudentsThunk.pending, pending)
      .addCase(getStudentsThunk.fulfilled, (state, { payload }) => { state.loading = false; state.students = payload; })
      .addCase(getStudentsThunk.rejected, rejected)

      .addCase(getAllReviewsThunk.pending, pending)
      .addCase(getAllReviewsThunk.fulfilled, (state, { payload }) => { state.loading = false; state.allReviews = payload; })
      .addCase(getAllReviewsThunk.rejected, rejected)

      .addCase(getGoodReviewsThunk.pending, pending)
      .addCase(getGoodReviewsThunk.fulfilled, (state, { payload }) => { state.loading = false; state.goodReviews = payload; })
      .addCase(getGoodReviewsThunk.rejected, rejected)

      .addCase(getBadReviewsThunk.pending, pending)
      .addCase(getBadReviewsThunk.fulfilled, (state, { payload }) => { state.loading = false; state.badReviews = payload; })
      .addCase(getBadReviewsThunk.rejected, rejected)

      .addCase(getTopStudentsThunk.pending, pending)
      .addCase(getTopStudentsThunk.fulfilled, (state, { payload }) => { state.loading = false; state.topStudents = payload; })
      .addCase(getTopStudentsThunk.rejected, rejected);
  },
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
