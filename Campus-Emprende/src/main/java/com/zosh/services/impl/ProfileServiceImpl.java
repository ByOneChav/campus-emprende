package com.zosh.services.impl;

import com.zosh.exception.UserException;
import com.zosh.mapper.ProfileMapper;
import com.zosh.modal.Profile;
import com.zosh.modal.User;
import com.zosh.payload.request.ProfileRequest;
import com.zosh.payload.response.ProfileResponse;
import com.zosh.repository.ProfileRepository;
import com.zosh.repository.UserRepository;
import com.zosh.services.ProfileService;
import com.zosh.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    @Override
    public ProfileResponse getMyProfile() throws UserException {
        User currentUser = userService.getCurrentUser();
        Profile profile = profileRepository.findByUser(currentUser)
                .orElseThrow(() -> new UserException("Perfil no encontrado. Por favor, créelo."));
        return ProfileMapper.toResponse(profile);
    }

    @Override
    public ProfileResponse upsertProfile(ProfileRequest request) throws UserException {
        User currentUser = userService.getCurrentUser();

        Optional<Profile> existing = profileRepository.findByUser(currentUser);
        Profile profile = existing.orElseGet(() -> Profile.builder().user(currentUser).build());

        if (request.getBio() != null) profile.setBio(request.getBio());
        if (request.getCareer() != null) profile.setCareer(request.getCareer());
        if (request.getAvatarUrl() != null) profile.setAvatarUrl(request.getAvatarUrl());
        if (request.getLinkedinUrl() != null) profile.setLinkedinUrl(request.getLinkedinUrl());

        return ProfileMapper.toResponse(profileRepository.save(profile));
    }

    @Override
    public ProfileResponse getPublicProfile(Long userId) throws UserException {
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new UserException("Perfil no encontrado para el usuario " + userId));
        return ProfileMapper.toResponse(profile);
    }
}
