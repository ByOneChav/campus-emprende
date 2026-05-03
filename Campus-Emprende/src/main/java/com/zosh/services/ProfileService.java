package com.zosh.services;

import com.zosh.exception.UserException;
import com.zosh.payload.request.ProfileRequest;
import com.zosh.payload.response.ProfileResponse;

// 🧠 Interfaz del servicio de Profile
// Define las operaciones del módulo Profile (sin implementación)
public interface ProfileService {

    // 👤 Obtener perfil del usuario autenticado
    // Usa el contexto de seguridad (JWT)
    ProfileResponse getMyProfile() throws UserException;

    // ✏️ Crear o actualizar perfil (UPSERT)
    // Si no existe → crea
    // Si existe → actualiza
    ProfileResponse upsertProfile(ProfileRequest request) throws UserException;

    // 🌍 Obtener perfil público por ID de usuario
    ProfileResponse getPublicProfile(Long userId) throws UserException;
}