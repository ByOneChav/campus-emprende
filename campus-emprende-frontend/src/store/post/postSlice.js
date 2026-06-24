import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { postApi } from '../../api/posts';

export const getFeed = createAsyncThunk(
  'posts/getFeed',
  async ({ page, size }, { rejectWithValue }) => {
    try {
      const response = await postApi.getFeed(page, size);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async ({ content, imageUrls }, { rejectWithValue }) => {
    try {
      const response = await postApi.createPost(content, imageUrls);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const reactToPost = createAsyncThunk(
  'posts/reactToPost',
  async ({ postId, type }, { rejectWithValue }) => {
    try {
      await postApi.reactToPost(postId, type);
      return { postId, type }; // This needs to be optimistically updated in UI
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const postSlice = createSlice({
  name: 'posts',
  initialState: {
    feed: [],
    loading: false,
    error: null,
    page: 0,
    hasMore: true,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeed.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFeed.fulfilled, (state, action) => {
        state.loading = false;
        if (action.meta.arg.page === 0) {
            state.feed = action.payload.content;
        } else {
            state.feed = [...state.feed, ...action.payload.content];
        }
        state.page = action.payload.number;
        state.hasMore = !action.payload.last;
      })
      .addCase(getFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.feed.unshift(action.payload); // Add to top of feed
      });
  },
});

export default postSlice.reducer;
