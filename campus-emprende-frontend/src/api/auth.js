import client from './client';

const noAuth = { skipAuth: true };

export const login = (email, password) =>
  client.post('/auth/login', { email, password }, noAuth);

export const signup = (data) =>
  client.post('/auth/signup', data, noAuth);

export const forgotPassword = (email) =>
  client.post('/auth/forgot-password', { email }, noAuth);

export const resetPassword = (token, password) =>
  client.post('/auth/reset-password', { token, password }, noAuth);

export const verifyEmail = (token) =>
  client.get('/auth/verify-email', { params: { token }, ...noAuth });

export const resendVerification = (email) =>
  client.post('/auth/resend-verification', null, { params: { email }, ...noAuth });
