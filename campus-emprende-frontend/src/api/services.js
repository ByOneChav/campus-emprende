import client from './client';

export const browseServices = (keyword, category) =>
  client.get('/services', { params: { keyword, category } });

export const getServiceDetail = (id) => client.get(`/services/${id}`);

export const getMyServices = () => client.get('/api/services/my');

export const createService = (data) => client.post('/api/services', data);

export const updateService = (id, data) => client.put(`/api/services/${id}`, data);

export const deactivateService = (id) =>
  client.patch(`/api/services/${id}/deactivate`);

export const getComments = (serviceId) =>
  client.get(`/services/${serviceId}/comments`);

export const addComment = (serviceId, content) =>
  client.post(`/api/services/${serviceId}/comments`, { content });

export const deleteComment = (commentId) =>
  client.delete(`/api/comments/${commentId}`);
