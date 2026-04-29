import client from './client';

export const getDashboard = () => client.get('/api/admin/dashboard');

export const getAllServices = () => client.get('/api/admin/services');
export const getPendingServices = () => client.get('/api/admin/services/pending');
export const getActiveServices = () => client.get('/api/admin/services/active');
export const getRejectedServices = () => client.get('/api/admin/services/rejected');

export const approveService = (id) =>
  client.patch(`/api/admin/services/${id}/approve`);

export const rejectService = (id, reason) =>
  client.patch(`/api/admin/services/${id}/reject`, { reason });

export const getAllUsers = () => client.get('/api/admin/users');
export const getStudents = () => client.get('/api/admin/users/students');

export const getAllReviews = () => client.get('/api/admin/reviews');
export const getGoodReviews = () => client.get('/api/admin/reviews/good');
export const getBadReviews = () => client.get('/api/admin/reviews/bad');

export const getTopStudents = () => client.get('/api/admin/top-students');
