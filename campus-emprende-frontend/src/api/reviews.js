import client from './client';

export const submitReview = (requestId, rating, comment) =>
  client.post(`/api/requests/${requestId}/review`, { rating, comment });

export const getServiceReviews = (serviceId) =>
  client.get(`/services/${serviceId}/reviews`);

export const getProviderReviews = (userId) =>
  client.get(`/profiles/${userId}/reviews`);
