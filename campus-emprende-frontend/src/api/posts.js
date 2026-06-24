import client from './client';

export const postApi = {
  createPost: (content, imageUrls) => 
    client.post('/api/posts', null, { params: { content, imageUrls: imageUrls?.join(',') } }),
    
  getFeed: (page = 0, size = 10) => 
    client.get('/api/posts/feed', { params: { page, size } }),
    
  getUserPosts: (userId, page = 0, size = 10) => 
    client.get(`/api/posts/user/${userId}`, { params: { page, size } }),
    
  deletePost: (postId) => 
    client.delete(`/api/posts/${postId}`),
    
  reactToPost: (postId, type) => 
    client.post(`/api/posts/${postId}/react`, null, { params: { type } }),
    
  addComment: (postId, content) => 
    client.post(`/api/posts/${postId}/comments`, null, { params: { content } }),
};
