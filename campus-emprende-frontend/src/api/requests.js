import client from './client';

export const sendRequest = (serviceId, message) =>
  client.post('/api/requests', { serviceId, message });

export const acceptRequest = (id) => client.patch(`/api/requests/${id}/accept`);
export const declineRequest = (id) => client.patch(`/api/requests/${id}/decline`);
export const startRequest = (id) => client.patch(`/api/requests/${id}/start`);
export const completeRequest = (id) => client.patch(`/api/requests/${id}/complete`);
export const confirmRequest = (id) => client.patch(`/api/requests/${id}/confirm`);
export const cancelRequest = (id) => client.patch(`/api/requests/${id}/cancel`);

export const getSentRequests = () => client.get('/api/requests/sent');
export const getReceivedRequests = () => client.get('/api/requests/received');
