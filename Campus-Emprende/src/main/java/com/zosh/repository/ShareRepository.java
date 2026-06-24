package com.zosh.repository;

import com.zosh.model.Share;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShareRepository extends JpaRepository<Share, Long> {
    List<Share> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Share> findByOriginalPostId(Long postId);
}
