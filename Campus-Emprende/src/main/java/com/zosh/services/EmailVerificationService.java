package com.zosh.services;

import com.zosh.exception.UserException;
import com.zosh.model.User;

// Interfaz para la lógica de verificación de email
public interface EmailVerificationService {

    // Envía correo de verificación al usuario
    void sendVerificationEmail(User user);

    // Verifica el email usando un token
    void verifyEmail(String token) throws UserException;

    // Reenvía correo de verificación
    void resendVerification(String email) throws UserException;
}