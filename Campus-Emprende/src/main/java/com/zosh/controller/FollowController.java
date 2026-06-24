package com.zosh.controller;

import com.zosh.model.User;
import com.zosh.services.FollowService;
import com.zosh.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/follow")
@RequiredArgsConstructor
public class FollowController {

    private final FollowService followService;
    private final UserService userService;

    @PostMapping("/{followingId}")
    public ResponseEntity<String> followUser(@RequestHeader("Authorization") String jwt, @PathVariable Long followingId) throws Exception {
        User user = userService.getUserFromJwtToken(jwt);
        followService.followUser(user.getId(), followingId);
        return ResponseEntity.ok("Successfully followed user");
    }

    @DeleteMapping("/{followingId}")
    public ResponseEntity<String> unfollowUser(@RequestHeader("Authorization") String jwt, @PathVariable Long followingId) throws Exception {
        User user = userService.getUserFromJwtToken(jwt);
        followService.unfollowUser(user.getId(), followingId);
        return ResponseEntity.ok("Successfully unfollowed user");
    }

    @GetMapping("/{userId}/status")
    public ResponseEntity<Boolean> isFollowing(@RequestHeader("Authorization") String jwt, @PathVariable Long userId) throws Exception {
        User user = userService.getUserFromJwtToken(jwt);
        boolean status = followService.isFollowing(user.getId(), userId);
        return ResponseEntity.ok(status);
    }
}
