import { createAsyncThunk } from '@reduxjs/toolkit';
import * as servicesApi from '@/api/services';

export const getCommentsThunk = createAsyncThunk(
  'comment/getByService',
  async (serviceId, { rejectWithValue }) => {
    try {
      const { data } = await servicesApi.getComments(serviceId);
      console.log('getComments success:', serviceId, data);
      return { serviceId, comments: data };
    } catch (err) {
      console.error('getComments error:', err.response?.data ?? err.message);
      return rejectWithValue(err.response?.data ?? { message: 'Failed to load comments' });
    }
  }
);

export const addCommentThunk = createAsyncThunk(
  'comment/add',
  async ({ serviceId, content }, { rejectWithValue }) => {
    try {
      const { data } = await servicesApi.addComment(serviceId, content);
      console.log('addComment success:', data);
      return { serviceId, comment: data };
    } catch (err) {
      console.error('addComment error:', err.response?.data ?? err.message);
      return rejectWithValue(err.response?.data ?? { message: 'Failed to post comment' });
    }
  }
);

export const deleteCommentThunk = createAsyncThunk(
  'comment/delete',
  async ({ commentId, serviceId }, { rejectWithValue }) => {
    try {
      await servicesApi.deleteComment(commentId);
      console.log('deleteComment success:', commentId);
      return { commentId, serviceId };
    } catch (err) {
      console.error('deleteComment error:', err.response?.data ?? err.message);
      return rejectWithValue(err.response?.data ?? { message: 'Failed to delete comment' });
    }
  }
);
