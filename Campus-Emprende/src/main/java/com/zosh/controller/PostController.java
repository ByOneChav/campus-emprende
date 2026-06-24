package com.zosh.controller;

import com.zosh.domain.ReactionType;
import com.zosh.model.Post;
import com.zosh.model.PostComment;
import com.zosh.model.User;
import com.zosh.services.PostService;
import com.zosh.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final UserService userService;

    // TODO: Create a PostRequest DTO instead of using parameters when scaling
    @PostMapping
    public ResponseEntity<Post> createPost(
            @RequestHeader("Authorization") String jwt,
            @RequestParam String content,
            @RequestParam(required = false) List<String> imageUrls) throws Exception {
        User user = userService.getUserFromJwtToken(jwt);
        Post post = postService.createPost(user.getId(), content, imageUrls);
        return ResponseEntity.ok(post);
    }

    @GetMapping("/feed")
    public ResponseEntity<Page<Post>> getFeed(
            @RequestHeader("Authorization") String jwt,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) throws Exception {
        User user = userService.getUserFromJwtToken(jwt);
        Page<Post> feed = postService.getFeedForUser(user.getId(), PageRequest.of(page, size));
        return ResponseEntity.ok(feed);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<Post>> getUserPosts(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Post> posts = postService.getPostsByUserId(userId, PageRequest.of(page, size));
        return ResponseEntity.ok(posts);
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<String> deletePost(@RequestHeader("Authorization") String jwt, @PathVariable Long postId) throws Exception {
        User user = userService.getUserFromJwtToken(jwt);
        postService.deletePost(user.getId(), postId);
        return ResponseEntity.ok("Post deleted");
    }

    @PostMapping("/{postId}/react")
    public ResponseEntity<String> reactToPost(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long postId,
            @RequestParam ReactionType type) throws Exception {
        User user = userService.getUserFromJwtToken(jwt);
        postService.reactToPost(user.getId(), postId, type);
        return ResponseEntity.ok("Reaction updated");
    }

    @PostMapping("/{postId}/comments")
    public ResponseEntity<PostComment> addComment(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long postId,
            @RequestParam String content) throws Exception {
        User user = userService.getUserFromJwtToken(jwt);
        PostComment comment = postService.addComment(user.getId(), postId, content);
        return ResponseEntity.ok(comment);
    }
}
