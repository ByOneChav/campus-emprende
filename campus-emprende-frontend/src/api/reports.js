import client from './client';

export const submitReport = (data) => client.post('/api/reports', data);

export const getReports = (status) =>
  client.get('/api/admin/reports', { params: { status } });

export const resolveReport = (id, reason) =>
  client.patch(`/api/admin/reports/${id}/resolve`, { reason });
