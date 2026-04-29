package com.zosh.services.impl;

import com.zosh.exception.UserException;
import com.zosh.mapper.CommentMapper;
import com.zosh.modal.Comment;
import com.zosh.modal.ServiceListing;
import com.zosh.modal.User;
import com.zosh.payload.request.CommentRequest;
import com.zosh.payload.response.CommentResponse;
import com.zosh.repository.CommentRepository;
import com.zosh.repository.ServiceListingRepository;
import com.zosh.services.CommentService;
import com.zosh.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final ServiceListingRepository serviceListingRepository;
    private final UserService userService;

    @Override
    public CommentResponse addComment(Long serviceId, CommentRequest request) throws UserException {
        User author = userService.getCurrentUser();
        ServiceListing service = serviceListingRepository.findById(serviceId)
                .orElseThrow(() -> new UserException("Service not found with id " + serviceId));

        Comment comment = Comment.builder()
                .service(service)
                .author(author)
                .content(request.getContent())
                .build();

        return CommentMapper.toResponse(commentRepository.save(comment));
    }

    @Override
    public List<CommentResponse> getCommentsByService(Long serviceId) {
        return CommentMapper.toResponseList(
                commentRepository.findByServiceIdOrderByCreatedAtDesc(serviceId));
    }

    @Override
    public void deleteComment(Long commentId) throws UserException {
        User current = userService.getCurrentUser();
        Comment comment = commentRepository.findByIdAndAuthorId(commentId, current.getId())
                .orElseThrow(() -> new UserException("Comment not found or you are not the author"));
        commentRepository.delete(comment);
    }
}
