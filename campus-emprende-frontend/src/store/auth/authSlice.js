import { createSlice } from "@reduxjs/toolkit";
import { loginThunk, signupThunk } from "./authThunk";


const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    loading: true,
  },
  reducers: {
    initialize(state) {
      const token = localStorage.getItem('jwt');
      const user = localStorage.getItem('user');
      if (token && user) {
        state.token = token;
        state.user = JSON.parse(user);
      }
      state.loading = false;
    },
    logout(state) {
      localStorage.removeItem('jwt');
      localStorage.removeItem('user');
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.fulfilled, (state, { payload }) => {
        state.user = payload.user;
        state.token = payload.jwt;
      })
      .addCase(signupThunk.fulfilled, (state, { payload }) => {
        state.user = payload.user;
        state.token = payload.jwt;
      });
  },
});

export const { initialize, logout } = authSlice.actions;
export default authSlice.reducer;
