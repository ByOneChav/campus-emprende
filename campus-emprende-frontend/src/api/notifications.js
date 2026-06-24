import client from './client';

export const notificationApi = {
  getNotifications: (page = 0, size = 20) => client.get('/api/notifications', { params: { page, size } }),
  getUnreadCount: () => client.get('/api/notifications/unread/count'),
  markAsRead: (notificationId) => client.patch(`/api/notifications/${notificationId}/read`),
};
