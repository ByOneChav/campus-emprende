package com.zosh.mapper;

import com.zosh.model.Profile;
import com.zosh.payload.response.ProfileResponse;

public class ProfileMapper {

    public static ProfileResponse toResponse(Profile profile) {
        ProfileResponse res = new ProfileResponse();
        res.setId(profile.getId());
        res.setUserId(profile.getUser().getId());
        res.setFullName(profile.getUser().getFullName());
        res.setEmail(profile.getUser().getEmail());
        res.setBio(profile.getBio());
        res.setCareer(profile.getCareer());
        res.setAvatarUrl(profile.getAvatarUrl());
        res.setLinkedinUrl(profile.getLinkedinUrl());
        res.setCreatedAt(profile.getCreatedAt());
        res.setUpdatedAt(profile.getUpdatedAt());
        return res;
    }
}
