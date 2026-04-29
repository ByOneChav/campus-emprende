package com.zosh.payload.request;

import lombok.Data;

@Data
public class ProfileRequest {
    private String bio;
    private String career;
    private String avatarUrl;
    private String linkedinUrl;
}
