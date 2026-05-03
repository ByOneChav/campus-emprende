package com.zosh.mapper;

import com.zosh.model.Profile;
import com.zosh.payload.response.ProfileResponse;

// 🔄 Mapper de Profile
// Convierte la entidad Profile → ProfileResponse (DTO)
public class ProfileMapper {

    public static ProfileResponse toResponse(Profile profile) {

        // 📦 Crea objeto de respuesta
        ProfileResponse res = new ProfileResponse();

        // 🆔 Datos del perfil
        res.setId(profile.getId());

        // 👤 Datos del usuario (relación Profile → User)
        res.setUserId(profile.getUser().getId());
        res.setFullName(profile.getUser().getFullName());
        res.setEmail(profile.getUser().getEmail());

        // 📝 Datos propios del perfil
        res.setBio(profile.getBio());
        res.setCareer(profile.getCareer());
        res.setAvatarUrl(profile.getAvatarUrl());
        res.setLinkedinUrl(profile.getLinkedinUrl());

        // 📅 Fechas
        res.setCreatedAt(profile.getCreatedAt());
        res.setUpdatedAt(profile.getUpdatedAt());

        return res;
    }
}