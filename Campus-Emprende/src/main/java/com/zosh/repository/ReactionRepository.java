package com.zosh.repository;

import com.zosh.model.Reaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReactionRepository extends JpaRepository<Reaction, Long> {
    Optional<Reaction> findByUserIdAndPostId(Long userId, Long postId);
    Optional<Reaction> findByUserIdAndTargetCommentId(Long userId, Long commentId);
}
