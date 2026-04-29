package com.zosh.services;

import com.zosh.exception.UserException;
import com.zosh.payload.request.CommentRequest;
import com.zosh.payload.response.CommentResponse;

import java.util.List;

public interface CommentService {
    CommentResponse addComment(Long serviceId, CommentRequest request) throws UserException;
    List<CommentResponse> getCommentsByService(Long serviceId);
    void deleteComment(Long commentId) throws UserException;
}
