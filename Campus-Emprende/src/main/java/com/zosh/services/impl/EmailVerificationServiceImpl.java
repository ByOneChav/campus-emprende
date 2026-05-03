package com.zosh.services.impl;

import com.zosh.exception.UserException;
import com.zosh.model.EmailVerificationToken;
import com.zosh.model.User;
import com.zosh.repository.EmailVerificationTokenRepository;
import com.zosh.repository.UserRepository;
import com.zosh.services.EmailService;
import com.zosh.services.EmailVerificationService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EmailVerificationServiceImpl implements EmailVerificationService {

    private final EmailVerificationTokenRepository tokenRepository; // acceso a tokens
    private final UserRepository userRepository; // acceso a usuarios
    private final EmailService emailService; // servicio de envío de correos

    @Value("${app.frontend.verify-url}")
    private String frontendVerifyUrl; // URL del frontend para verificación

    @Override
    @Transactional
    public void sendVerificationEmail(User user) {
        tokenRepository.deleteByUser(user); // elimina tokens anteriores del usuario

        String token = UUID.randomUUID().toString(); // genera token único
        EmailVerificationToken verificationToken = EmailVerificationToken.builder()
                .user(user) // usuario asociado
                .token(token) // valor del token
                .expiresAt(LocalDateTime.now().plusHours(24)) // expiración (24h)
                .build();
        tokenRepository.save(verificationToken); // guarda token en BD

        String verifyLink = frontendVerifyUrl + token; // link completo para el usuario
        String subject = "Verifica tu cuenta de CAMPUS EMPRENDE";
        String body = "¡Bienvenidos al CAMPUS EMPRENDE!\n\n"
                + "Por favor, verifique su dirección de correo electrónico haciendo clic en el siguiente enlace (válido durante 24 horas):\n\n"
                + verifyLink + "\n\n"
                + "Si no has creado una cuenta, puedes ignorar este correo electrónico sin problema.";
        emailService.sendEmail(user.getEmail(), subject, body); // envía correo
    }

    @Override
    @Transactional
    public void verifyEmail(String token) throws UserException {
        Optional<EmailVerificationToken> optional = tokenRepository.findByToken(token); // busca token
        if (optional.isEmpty()) {
            throw new UserException("Token de verificación no válido"); // token inexistente
        }

        EmailVerificationToken verificationToken = optional.get();

        // 🔥 CAMBIO AQUÍ: si ya fue usado, no lanzar error
        if (verificationToken.isUsed()) {
            // El usuario ya fue verificado anteriormente, no hacemos nada
            return;
        }

        if (verificationToken.isExpired()) {
            tokenRepository.delete(verificationToken); // elimina token expirado
            throw new UserException("El token de verificación ha caducado. Solicite uno nuevo.");
        }

        User user = verificationToken.getUser(); // obtiene usuario asociado
        user.setVerified(true); // activa cuenta
        userRepository.save(user); // guarda cambios

        verificationToken.setUsedAt(LocalDateTime.now()); // marca token como usado
        tokenRepository.save(verificationToken); // actualiza token
    }

    @Override
    @Transactional
    public void resendVerification(String email) throws UserException {
        User user = userRepository.findByEmail(email); // busca usuario por email
        if (user == null) {
            throw new UserException("No se encontró ninguna cuenta con este correo electrónico.");
        }
        if (Boolean.TRUE.equals(user.getVerified())) {
            throw new UserException("El correo electrónico ya está verificado.");
        }
        sendVerificationEmail(user); // reenvía correo
    }
}