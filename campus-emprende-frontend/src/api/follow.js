import client from './client';

export const followApi = {
  followUser: (followingId) => client.post(`/api/follow/${followingId}`),
  unfollowUser: (followingId) => client.delete(`/api/follow/${followingId}`),
  checkFollowStatus: (userId) => client.get(`/api/follow/${userId}/status`),
};
