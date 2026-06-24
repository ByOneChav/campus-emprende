import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { followApi } from '../../api/follow';

export const followUser = createAsyncThunk(
  'follow/followUser',
  async (userId, { rejectWithValue }) => {
    try {
      await followApi.followUser(userId);
      return userId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const unfollowUser = createAsyncThunk(
  'follow/unfollowUser',
  async (userId, { rejectWithValue }) => {
    try {
      await followApi.unfollowUser(userId);
      return userId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const followSlice = createSlice({
  name: 'follow',
  initialState: {
    followingIds: [], // Keep track of who the current user is following
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(followUser.fulfilled, (state, action) => {
        if (!state.followingIds.includes(action.payload)) {
            state.followingIds.push(action.payload);
        }
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.followingIds = state.followingIds.filter(id => id !== action.payload);
      });
  },
});

export default followSlice.reducer;
