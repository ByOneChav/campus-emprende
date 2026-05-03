package com.zosh.payload.response;

import lombok.Data;

import java.time.LocalDateTime;

// 📤 DTO de salida para Profile
// Representa los datos que se envían al frontend
@Data
public class ProfileResponse {

    // 🆔 ID del perfil
    private Long id;

    // 👤 ID del usuario asociado
    private Long userId;

    // 👤 Datos del usuario
    private String fullName;
    private String email;

    // 📝 Datos del perfil
    private String bio;
    private String career;
    private String avatarUrl;
    private String linkedinUrl;

    // 📅 Fechas del perfil
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}