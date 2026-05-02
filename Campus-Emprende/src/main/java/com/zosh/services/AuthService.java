package com.zosh.services;

import com.zosh.exception.UserException;

import com.zosh.payload.response.AuthResponse;
import com.zosh.payload.response.UserDTO;


// Interfaz del servicio de autenticación
// Define qué operaciones de auth existen (sin implementación)
public interface AuthService {

    // 🔐 Login de usuario
    // Recibe email (username) y contraseña
    // Retorna token JWT + datos del usuario
    AuthResponse login(String username, String password) throws UserException;

    // 📝 Registro de usuario
    // Recibe datos del usuario (DTO)
    // Crea usuario + genera token + retorna respuesta
    AuthResponse signup(UserDTO req) throws UserException;

    // 📩 Generar token de recuperación de contraseña
    // Busca usuario por email y envía correo con token
    void createPasswordResetToken(String email) throws UserException;

    // 🔑 Restablecer contraseña
    // Recibe token + nueva contraseña
    // Valida token y actualiza password
    void resetPassword(String token, String newPassword);
}