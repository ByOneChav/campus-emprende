package com.zosh.services;

import com.zosh.exception.UserException;
import com.zosh.payload.request.ProfileRequest;
import com.zosh.payload.response.ProfileResponse;

public interface ProfileService {
    ProfileResponse getMyProfile() throws UserException;
    ProfileResponse upsertProfile(ProfileRequest request) throws UserException;
    ProfileResponse getPublicProfile(Long userId) throws UserException;
}
