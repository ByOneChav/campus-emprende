package com.zosh.Tests;

import com.zosh.exception.UserException;
import com.zosh.mapper.ProfileMapper;
import com.zosh.model.Profile;
import com.zosh.model.User;
import com.zosh.payload.request.ProfileRequest;
import com.zosh.payload.response.ProfileResponse;
import com.zosh.repository.ProfileRepository;
import com.zosh.repository.UserRepository;
import com.zosh.services.UserService;
import com.zosh.services.impl.ProfileServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

// 🧪 Pruebas unitarias para ProfileServiceImpl
// Cubre obtención del perfio propio, creación/actualización (upsert) y perfil público.
@ExtendWith(MockitoExtension.class)
class ProfileServiceImplTest {

    // 🔗 Repositorio de perfiles (mockeado)
    @Mock
    private ProfileRepository profileRepository;

    // 🔗 Repositorio de usuarios (mockeado, casi no se usa en esta clase)
    @Mock
    private UserRepository userRepository;

    // 🔐 Servicio de usuario (mockeado, simula al usuario autenticado por JWT)
    @Mock
    private UserService userService;

    // 🧩 Clase real que se está probando
    @InjectMocks
    private ProfileServiceImpl profileService;

    // =====================================================
    // 🧱 Helper: mapper "real" que refleja los datos del Profile
    // =====================================================

    // 🗺️ Convierte un Profile a un ProfileResponse copiando sus campos,
    // así podemos validar el resultado sin depender de un Profile específico
    // construido dentro del método (útil para upsertProfile).
    private ProfileResponse mapToResponse(Profile profile) {
        ProfileResponse response = new ProfileResponse();
        response.setBio(profile.getBio());
        response.setCareer(profile.getCareer());
        response.setAvatarUrl(profile.getAvatarUrl());
        response.setLinkedinUrl(profile.getLinkedinUrl());
        return response;
    }

    // =====================================================
    // 👤 getMyProfile() — Perfil del usuario autenticado
    // =====================================================

    // 🧪 Devuelve correctamente el perfil del usuario autenticado
    @Test
    void getMyProfile_success() throws UserException {
        User user = new User();
        user.setId(1L);

        Profile profile = Profile.builder()
                .user(user)
                .bio("Estudiante de ingeniería")
                .build();

        ProfileResponse expectedResponse = new ProfileResponse();
        expectedResponse.setBio("Estudiante de ingeniería");

        when(userService.getCurrentUser()).thenReturn(user);
        when(profileRepository.findByUser(user)).thenReturn(Optional.of(profile));

        try (MockedStatic<ProfileMapper> mockedMapper = mockStatic(ProfileMapper.class)) {
            mockedMapper.when(() -> ProfileMapper.toResponse(profile)).thenReturn(expectedResponse);

            ProfileResponse result = profileService.getMyProfile();

            assertNotNull(result);
            assertEquals("Estudiante de ingeniería", result.getBio());
        }
    }

    // 🧪 Lanza UserException si el usuario aún no tiene perfil creado
    @Test
    void getMyProfile_notFound() throws UserException {
        User user = new User();
        user.setId(1L);

        when(userService.getCurrentUser()).thenReturn(user);
        when(profileRepository.findByUser(user)).thenReturn(Optional.empty());

        assertThrows(UserException.class, () -> profileService.getMyProfile());
    }

    // =====================================================
    // ✏️ upsertProfile() — Crear o actualizar perfil
    // =====================================================

    // 🧪 Crea un perfil nuevo cuando el usuario todavía no tiene uno
    @Test
    void upsertProfile_createsNewProfile() throws UserException {
        User user = new User();
        user.setId(1L);

        ProfileRequest request = new ProfileRequest();
        request.setBio("Nueva bio");
        request.setCareer("Ingeniería de Software");
        request.setAvatarUrl("http://avatar.com/foto.png");
        request.setLinkedinUrl("http://linkedin.com/in/usuario");

        when(userService.getCurrentUser()).thenReturn(user);
        // 🚫 Aún no existe perfil para este usuario
        when(profileRepository.findByUser(user)).thenReturn(Optional.empty());
        // 💾 save() devuelve el mismo objeto que recibió (insert)
        when(profileRepository.save(any(Profile.class))).thenAnswer(invocation -> invocation.getArgument(0));

        try (MockedStatic<ProfileMapper> mockedMapper = mockStatic(ProfileMapper.class)) {
            // 🗺️ El mapper devuelve un DTO reflejando los datos del Profile guardado
            mockedMapper.when(() -> ProfileMapper.toResponse(any(Profile.class)))
                    .thenAnswer(invocation -> mapToResponse(invocation.getArgument(0)));

            ProfileResponse result = profileService.upsertProfile(request);

            assertNotNull(result);
            assertEquals("Nueva bio", result.getBio());
            assertEquals("Ingeniería de Software", result.getCareer());
            assertEquals("http://avatar.com/foto.png", result.getAvatarUrl());
            assertEquals("http://linkedin.com/in/usuario", result.getLinkedinUrl());
        }

        verify(profileRepository).save(any(Profile.class));
    }

    // 🧪 Actualiza solo los campos enviados (update parcial), dejando el resto intacto
    @Test
    void upsertProfile_partialUpdateKeepsExistingFields() throws UserException {
        User user = new User();
        user.setId(1L);

        // 📌 Perfil ya existente con todos sus datos
        Profile existingProfile = Profile.builder()
                .user(user)
                .bio("Bio anterior")
                .career("Carrera anterior")
                .avatarUrl("http://avatar.com/anterior.png")
                .linkedinUrl("http://linkedin.com/in/anterior")
                .build();

        // 📝 El request SOLO trae un nuevo "bio", el resto viene null (sin cambios)
        ProfileRequest request = new ProfileRequest();
        request.setBio("Bio actualizada");

        when(userService.getCurrentUser()).thenReturn(user);
        when(profileRepository.findByUser(user)).thenReturn(Optional.of(existingProfile));
        when(profileRepository.save(any(Profile.class))).thenAnswer(invocation -> invocation.getArgument(0));

        try (MockedStatic<ProfileMapper> mockedMapper = mockStatic(ProfileMapper.class)) {
            mockedMapper.when(() -> ProfileMapper.toResponse(any(Profile.class)))
                    .thenAnswer(invocation -> mapToResponse(invocation.getArgument(0)));

            ProfileResponse result = profileService.upsertProfile(request);

            // ✅ El bio se actualizó
            assertEquals("Bio actualizada", result.getBio());

            // ✅ Los demás campos NO cambiaron (no venían en el request)
            assertEquals("Carrera anterior", result.getCareer());
            assertEquals("http://avatar.com/anterior.png", result.getAvatarUrl());
            assertEquals("http://linkedin.com/in/anterior", result.getLinkedinUrl());
        }

        verify(profileRepository).save(existingProfile);
    }

    // =====================================================
    // 🌍 getPublicProfile() — Perfil público por ID de usuario
    // =====================================================

    // 🧪 Devuelve correctamente el perfil público de un usuario
    @Test
    void getPublicProfile_success() throws UserException {
        User user = new User();
        user.setId(5L);

        Profile profile = Profile.builder()
                .user(user)
                .bio("Profesor de cálculo")
                .build();

        ProfileResponse expectedResponse = new ProfileResponse();
        expectedResponse.setBio("Profesor de cálculo");

        when(profileRepository.findByUserId(5L)).thenReturn(Optional.of(profile));

        try (MockedStatic<ProfileMapper> mockedMapper = mockStatic(ProfileMapper.class)) {
            mockedMapper.when(() -> ProfileMapper.toResponse(profile)).thenReturn(expectedResponse);

            ProfileResponse result = profileService.getPublicProfile(5L);

            assertNotNull(result);
            assertEquals("Profesor de cálculo", result.getBio());
        }
    }

    // 🧪 Lanza UserException si no existe perfil para el usuario indicado
    @Test
    void getPublicProfile_notFound() {
        when(profileRepository.findByUserId(99L)).thenReturn(Optional.empty());

        assertThrows(UserException.class, () -> profileService.getPublicProfile(99L));
    }
}