package com.zosh.payload.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ProfileResponse {
    private Long id;
    private Long userId;
    private String fullName;
    private String email;
    private String bio;
    private String career;
    private String avatarUrl;
    private String linkedinUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
