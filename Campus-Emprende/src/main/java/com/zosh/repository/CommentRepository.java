package com.zosh.repository;

import com.zosh.modal.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByServiceIdOrderByCreatedAtDesc(Long serviceId);
    long countByServiceId(Long serviceId);
    Optional<Comment> findByIdAndAuthorId(Long id, Long authorId);
}
