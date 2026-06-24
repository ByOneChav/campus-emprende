package com.zosh.services;

import com.zosh.model.User;
import java.util.List;

public interface FollowService {
    void followUser(Long followerId, Long followingId);
    void unfollowUser(Long followerId, Long followingId);
    boolean isFollowing(Long followerId, Long followingId);
    
    long getFollowersCount(Long userId);
    long getFollowingCount(Long userId);
}
