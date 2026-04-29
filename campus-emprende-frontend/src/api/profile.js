import client from './client';

export const getMyProfile = () => client.get('/api/profiles/me');

export const upsertProfile = (data) => client.put('/api/profiles/me', data);

export const getPublicProfile = (userId) => client.get(`/profiles/${userId}`);

export const exportPdf = () =>
  client.get('/api/profiles/me/export-pdf', { responseType: 'blob' });
