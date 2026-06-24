package com.zosh.services.impl;

import com.zosh.domain.NotificationType;
import com.zosh.domain.ReactionType;
import com.zosh.model.*;
import com.zosh.repository.*;
import com.zosh.services.NotificationService;
import com.zosh.services.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final PostCommentRepository postCommentRepository;
    private final ReactionRepository reactionRepository;
    private final ShareRepository shareRepository;
    private final FollowRepository followRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public Post createPost(Long userId, String content, List<String> imageUrls) {
        User author = userRepository.findById(userId).orElseThrow();
        Post post = Post.builder().author(author).content(content).build();
        
        if (imageUrls != null) {
            List<PostImage> images = imageUrls.stream()
                .map(url -> PostImage.builder().post(post).imageUrl(url).build())
                .collect(Collectors.toList());
            post.setImages(images);
        }
        
        return postRepository.save(post);
    }

    @Override
    @Transactional
    public Post updatePost(Long userId, Long postId, String newContent) {
        Post post = postRepository.findById(postId).orElseThrow();
        if (!post.getAuthor().getId().equals(userId)) throw new RuntimeException("Unauthorized");
        post.setContent(newContent);
        return postRepository.save(post);
    }

    @Override
    @Transactional
    public void deletePost(Long userId, Long postId) {
        Post post = postRepository.findById(postId).orElseThrow();
        if (!post.getAuthor().getId().equals(userId)) throw new RuntimeException("Unauthorized");
        postRepository.delete(post);
    }

    @Override
    public Post getPostById(Long postId) {
        return postRepository.findById(postId).orElseThrow();
    }

    @Override
    public Page<Post> getFeedForUser(Long userId, Pageable pageable) {
        List<Long> followingIds = followRepository.findFollowingIdsByFollowerId(userId);
        followingIds.add(userId); // Ver mis propios posts también
        return postRepository.findFeedByAuthorIds(followingIds, pageable);
    }

    @Override
    public Page<Post> getPostsByUserId(Long userId, Pageable pageable) {
        return postRepository.findByAuthorIdOrderByCreatedAtDesc(userId, pageable);
    }

    @Override
    @Transactional
    public void reactToPost(Long userId, Long postId, ReactionType reactionType) {
        Post post = postRepository.findById(postId).orElseThrow();
        User user = userRepository.findById(userId).orElseThrow();
        
        Optional<Reaction> existing = reactionRepository.findByUserIdAndPostId(userId, postId);
        if (existing.isPresent()) {
            if (existing.get().getReactionType() == reactionType) {
                reactionRepository.delete(existing.get()); // Toggle off
                return;
            } else {
                existing.get().setReactionType(reactionType); // Change reaction
                reactionRepository.save(existing.get());
                return;
            }
        }
        
        Reaction reaction = Reaction.builder().user(user).post(post).reactionType(reactionType).build();
        reactionRepository.save(reaction);
        
        notificationService.createNotification(post.getAuthor().getId(), userId, NotificationType.REACTION,
                user.getFullName() + " ha reaccionado a tu publicación.", "/post/" + postId);
    }

    @Override
    @Transactional
    public void reactToComment(Long userId, Long commentId, ReactionType reactionType) {
        PostComment comment = postCommentRepository.findById(commentId).orElseThrow();
        User user = userRepository.findById(userId).orElseThrow();
        
        Optional<Reaction> existing = reactionRepository.findByUserIdAndTargetCommentId(userId, commentId);
        if (existing.isPresent()) {
            if (existing.get().getReactionType() == reactionType) {
                reactionRepository.delete(existing.get());
                return;
            } else {
                existing.get().setReactionType(reactionType);
                reactionRepository.save(existing.get());
                return;
            }
        }
        
        Reaction reaction = Reaction.builder().user(user).targetComment(comment).reactionType(reactionType).build();
        reactionRepository.save(reaction);
    }

    @Override
    @Transactional
    public PostComment addComment(Long userId, Long postId, String content) {
        Post post = postRepository.findById(postId).orElseThrow();
        User author = userRepository.findById(userId).orElseThrow();
        
        PostComment comment = PostComment.builder()
            .post(post)
            .author(author)
            .content(content)
            .build();
            
        PostComment saved = postCommentRepository.save(comment);
        
        notificationService.createNotification(post.getAuthor().getId(), userId, NotificationType.COMMENT,
                author.getFullName() + " ha comentado en tu publicación.", "/post/" + postId);
                
        return saved;
    }

    @Override
    @Transactional
    public void deleteComment(Long userId, Long commentId) {
        PostComment comment = postCommentRepository.findById(commentId).orElseThrow();
        if (!comment.getAuthor().getId().equals(userId)) throw new RuntimeException("Unauthorized");
        postCommentRepository.delete(comment);
    }

    @Override
    @Transactional
    public void sharePost(Long userId, Long originalPostId, String additionalContent) {
        User user = userRepository.findById(userId).orElseThrow();
        Post post = postRepository.findById(originalPostId).orElseThrow();
        
        Share share = Share.builder()
            .user(user)
            .originalPost(post)
            .additionalContent(additionalContent)
            .build();
            
        shareRepository.save(share);
        
        notificationService.createNotification(post.getAuthor().getId(), userId, NotificationType.SHARE,
                user.getFullName() + " ha compartido tu publicación.", "/post/" + originalPostId);
    }
}
