package com.zosh.services.impl;

import com.zosh.domain.NotificationType;
import com.zosh.model.Follow;
import com.zosh.model.User;
import com.zosh.repository.FollowRepository;
import com.zosh.repository.UserRepository;
import com.zosh.services.FollowService;
import com.zosh.services.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FollowServiceImpl implements FollowService {

    private final FollowRepository followRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public void followUser(Long followerId, Long followingId) {
        if (followerId.equals(followingId)) return;
        
        followRepository.findByFollowerIdAndFollowingId(followerId, followingId)
            .ifPresentOrElse(
                f -> {},
                () -> {
                    User follower = userRepository.findById(followerId).orElseThrow();
                    User following = userRepository.findById(followingId).orElseThrow();
                    Follow follow = Follow.builder()
                        .follower(follower)
                        .following(following)
                        .build();
                    followRepository.save(follow);
                    
                    notificationService.createNotification(
                        followingId, followerId, NotificationType.FOLLOW,
                        follower.getFullName() + " ha comenzado a seguirte.",
                        "/profile/" + followerId
                    );
                }
            );
    }

    @Override
    @Transactional
    public void unfollowUser(Long followerId, Long followingId) {
        followRepository.findByFollowerIdAndFollowingId(followerId, followingId)
            .ifPresent(followRepository::delete);
    }

    @Override
    public boolean isFollowing(Long followerId, Long followingId) {
        return followRepository.findByFollowerIdAndFollowingId(followerId, followingId).isPresent();
    }

    @Override
    public long getFollowersCount(Long userId) {
        return followRepository.countByFollowingId(userId);
    }

    @Override
    public long getFollowingCount(Long userId) {
        return followRepository.countByFollowerId(userId);
    }
}
