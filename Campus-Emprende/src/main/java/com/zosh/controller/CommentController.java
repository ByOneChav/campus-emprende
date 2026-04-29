package com.zosh.controller;

import com.zosh.exception.UserException;
import com.zosh.payload.request.CommentRequest;
import com.zosh.payload.response.CommentResponse;
import com.zosh.services.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/services/{serviceId}/comments")
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable Long serviceId) {
        return ResponseEntity.ok(commentService.getCommentsByService(serviceId));
    }

    @PostMapping("/api/services/{serviceId}/comments")
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable Long serviceId,
            @RequestBody @Valid CommentRequest request) throws UserException {
        return ResponseEntity.ok(commentService.addComment(serviceId, request));
    }

    @DeleteMapping("/api/comments/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) throws UserException {
        commentService.deleteComment(id);
        return ResponseEntity.noContent().build();
    }
}
