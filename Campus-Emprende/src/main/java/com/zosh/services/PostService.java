package com.zosh.services;

import com.zosh.model.Post;
import com.zosh.model.PostComment;
import com.zosh.domain.ReactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PostService {
    Post createPost(Long userId, String content, List<String> imageUrls);
    Post updatePost(Long userId, Long postId, String newContent);
    void deletePost(Long userId, Long postId);
    Post getPostById(Long postId);

    Page<Post> getFeedForUser(Long userId, Pageable pageable);
    Page<Post> getPostsByUserId(Long userId, Pageable pageable);

    void reactToPost(Long userId, Long postId, ReactionType reactionType);
    void reactToComment(Long userId, Long commentId, ReactionType reactionType);

    PostComment addComment(Long userId, Long postId, String content);
    void deleteComment(Long userId, Long commentId);

    void sharePost(Long userId, Long originalPostId, String additionalContent);
}
