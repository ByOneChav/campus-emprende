package com.zosh.services.impl;

import com.zosh.exception.UserException;
import com.zosh.mapper.ProfileMapper;
import com.zosh.model.Profile;
import com.zosh.model.User;
import com.zosh.payload.request.ProfileRequest;
import com.zosh.payload.response.ProfileResponse;
import com.zosh.repository.ProfileRepository;
import com.zosh.repository.UserRepository;
import com.zosh.services.ProfileService;
import com.zosh.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service // 🧠 Lógica de negocio del módulo Profile
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final ProfileRepository profileRepository; // 🗄️ Acceso a perfiles
    private final UserRepository userRepository; // 🗄️ Acceso a usuarios (aunque aquí casi no se usa)
    private final UserService userService; // 🔐 Obtener usuario autenticado

    // 👤 PERFIL DEL USUARIO AUTENTICADO
    @Override
    public ProfileResponse getMyProfile() throws UserException {

        // Obtiene usuario actual (desde JWT / contexto de seguridad)
        User currentUser = userService.getCurrentUser();

        // Busca el perfil asociado al usuario
        Profile profile = profileRepository.findByUser(currentUser)
                .orElseThrow(() -> new UserException("Perfil no encontrado. Por favor, créelo."));

        // Convierte Entity → Response DTO
        return ProfileMapper.toResponse(profile);
    }

    // ✏️ UPSERT (crear o actualizar perfil)
    @Override
    public ProfileResponse upsertProfile(ProfileRequest request) throws UserException {

        // Usuario autenticado
        User currentUser = userService.getCurrentUser();

        // Busca si ya existe perfil
        Optional<Profile> existing = profileRepository.findByUser(currentUser);

        // Si existe → lo usa
        // Si no → crea uno nuevo asociado al usuario
        Profile profile = existing.orElseGet(() -> Profile.builder().user(currentUser).build());

        // 🔄 Actualiza solo campos que vienen en el request (parcial update)
        if (request.getBio() != null) profile.setBio(request.getBio());
        if (request.getCareer() != null) profile.setCareer(request.getCareer());
        if (request.getAvatarUrl() != null) profile.setAvatarUrl(request.getAvatarUrl());
        if (request.getLinkedinUrl() != null) profile.setLinkedinUrl(request.getLinkedinUrl());

        // 💾 Guarda (insert o update automáticamente)
        return ProfileMapper.toResponse(profileRepository.save(profile));
    }

    // 🌍 PERFIL PÚBLICO POR ID
    @Override
    public ProfileResponse getPublicProfile(Long userId) throws UserException {

        // Busca perfil por ID de usuario
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new UserException("Perfil no encontrado para el usuario " + userId));

        // Convierte a DTO
        return ProfileMapper.toResponse(profile);
    }
}