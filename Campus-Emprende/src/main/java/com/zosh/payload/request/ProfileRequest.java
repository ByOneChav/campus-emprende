package com.zosh.payload.request;

import lombok.Data;

// 📥 DTO de entrada para Profile
// Representa los datos que el cliente envía para crear o actualizar el perfil
@Data
public class ProfileRequest {

    // 📝 Biografía del usuario
    private String bio;

    // 🎓 Carrera del usuario
    private String career;

    // 🖼️ URL de imagen de perfil
    private String avatarUrl;

    // 🔗 URL de LinkedIn
    private String linkedinUrl;
}