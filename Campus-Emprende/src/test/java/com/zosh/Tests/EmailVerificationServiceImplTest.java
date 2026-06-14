package com.zosh.Tests;

import com.zosh.exception.UserException;
import com.zosh.model.EmailVerificationToken;
import com.zosh.model.User;
import com.zosh.repository.EmailVerificationTokenRepository;
import com.zosh.repository.UserRepository;
import com.zosh.services.EmailService;
import com.zosh.services.impl.EmailVerificationServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

// 🧪 Pruebas unitarias para EmailVerificationServiceImpl
// Cubre el envío del correo de verificación, la validación del token
// y el reenvío de verificación.
//
// ⚠️ Nota sobre EmailVerificationToken.isUsed() / isExpired():
// Se asume que se calculan a partir de los campos "usedAt" y "expiresAt"
// (usedAt != null -> usado; expiresAt en el pasado -> expirado), ya que
// el servicio nunca setea un campo "used" booleano explícito, solo
// "setUsedAt(...)". Si tu entidad lo maneja distinto, ajusta los helpers.
@ExtendWith(MockitoExtension.class)
class EmailVerificationServiceImplTest {

    // 🔗 Repositorio de tokens de verificación (mockeado)
    @Mock
    private EmailVerificationTokenRepository tokenRepository;

    // 🔗 Repositorio de usuarios (mockeado)
    @Mock
    private UserRepository userRepository;

    // 📧 Servicio de envío de correos (mockeado, no envía correos de verdad)
    @Mock
    private EmailService emailService;

    // 🧩 Clase real que se está probando
    @InjectMocks
    private EmailVerificationServiceImpl emailVerificationService;

    // 🔧 URL del frontend usada para construir el link de verificación.
    // Este campo viene de @Value(...) y NO se inyecta vía constructor,
    // así que con @InjectMocks queda en null -> lo seteamos manualmente.
    private static final String VERIFY_URL = "http://localhost:3000/verify?token=";

    // =====================================================
    // 🧱 Helpers para construir objetos de prueba
    // =====================================================

    private User buildUser(Long id, String email, boolean verified) {
        User user = new User();
        user.setId(id);
        user.setEmail(email);
        user.setVerified(verified);
        return user;
    }

    // 🟢 Token válido: no usado y no expirado
    private EmailVerificationToken buildValidToken(User user, String token) {
        return EmailVerificationToken.builder()
                .user(user)
                .token(token)
                .expiresAt(LocalDateTime.now().plusHours(24))
                .build();
    }

    // ⚪ Token ya usado (usedAt en el pasado)
    private EmailVerificationToken buildUsedToken(User user, String token) {
        return EmailVerificationToken.builder()
                .user(user)
                .token(token)
                .expiresAt(LocalDateTime.now().plusHours(24))
                .usedAt(LocalDateTime.now().minusHours(1))
                .build();
    }

    // 🔴 Token expirado (expiresAt en el pasado, nunca usado)
    private EmailVerificationToken buildExpiredToken(User user, String token) {
        return EmailVerificationToken.builder()
                .user(user)
                .token(token)
                .expiresAt(LocalDateTime.now().minusHours(1))
                .build();
    }

    // =====================================================
    // 📨 sendVerificationEmail() — Enviar correo de verificación
    // =====================================================

    // 🧪 Borra tokens anteriores, crea uno nuevo y envía el correo con el link
    @Test
    void sendVerificationEmail_success() {
        User user = buildUser(1L, "test@mail.com", false);

        // 🔧 Asigna manualmente la URL del frontend (@Value)
        ReflectionTestUtils.setField(emailVerificationService, "frontendVerifyUrl", VERIFY_URL);

        emailVerificationService.sendVerificationEmail(user);

        // 🔍 Se eliminaron los tokens anteriores del usuario
        verify(tokenRepository).deleteByUser(user);

        // 🔍 Se guardó un nuevo token asociado al usuario, con expiración futura
        ArgumentCaptor<EmailVerificationToken> tokenCaptor = ArgumentCaptor.forClass(EmailVerificationToken.class);
        verify(tokenRepository).save(tokenCaptor.capture());

        EmailVerificationToken savedToken = tokenCaptor.getValue();
        assertEquals(user, savedToken.getUser());
        assertNotNull(savedToken.getToken());
        assertNotNull(savedToken.getExpiresAt());
        assertTrue(savedToken.getExpiresAt().isAfter(LocalDateTime.now().plusHours(23)));

        // 🔍 Se envió el correo al usuario, con el link que incluye el token generado
        ArgumentCaptor<String> bodyCaptor = ArgumentCaptor.forClass(String.class);
        verify(emailService).sendEmail(eq("test@mail.com"), anyString(), bodyCaptor.capture());
        assertTrue(bodyCaptor.getValue().contains(VERIFY_URL + savedToken.getToken()));
    }

    // =====================================================
    // ✅ verifyEmail() — Verificar token
    // =====================================================

    // 🧪 Verifica correctamente la cuenta cuando el token es válido y no ha sido usado
    @Test
    void verifyEmail_success() throws UserException {
        User user = buildUser(1L, "test@mail.com", false);
        EmailVerificationToken verificationToken = buildValidToken(user, "valid-token");

        when(tokenRepository.findByToken("valid-token")).thenReturn(Optional.of(verificationToken));

        emailVerificationService.verifyEmail("valid-token");

        // 🔍 El usuario quedó marcado como verificado y se guardó
        assertEquals(Boolean.TRUE, user.getVerified());
        verify(userRepository).save(user);

        // 🔍 El token se marcó como usado (usedAt) y se guardó
        assertNotNull(verificationToken.getUsedAt());
        verify(tokenRepository).save(verificationToken);

        // 🔍 Nunca se elimina un token válido
        verify(tokenRepository, never()).delete(any(EmailVerificationToken.class));
    }

    // 🧪 Lanza UserException si el token no existe
    @Test
    void verifyEmail_tokenNotFound() {
        when(tokenRepository.findByToken("invalid-token")).thenReturn(Optional.empty());

        assertThrows(UserException.class, () -> emailVerificationService.verifyEmail("invalid-token"));

        verify(userRepository, never()).save(any(User.class));
    }

    // 🧪 Si el token ya fue usado anteriormente, no lanza error y no hace nada más
    @Test
    void verifyEmail_alreadyUsed() throws UserException {
        User user = buildUser(1L, "test@mail.com", true);
        EmailVerificationToken verificationToken = buildUsedToken(user, "used-token");

        when(tokenRepository.findByToken("used-token")).thenReturn(Optional.of(verificationToken));

        // ✅ No debe lanzar excepción, simplemente retorna
        assertDoesNotThrow(() -> emailVerificationService.verifyEmail("used-token"));

        // 🔍 No vuelve a guardar el usuario ni el token, ni lo elimina
        verify(userRepository, never()).save(any(User.class));
        verify(tokenRepository, never()).save(any(EmailVerificationToken.class));
        verify(tokenRepository, never()).delete(any(EmailVerificationToken.class));
    }

    // 🧪 Si el token está expirado, lo elimina y lanza UserException
    @Test
    void verifyEmail_expiredToken() {
        User user = buildUser(1L, "test@mail.com", false);
        EmailVerificationToken verificationToken = buildExpiredToken(user, "expired-token");

        when(tokenRepository.findByToken("expired-token")).thenReturn(Optional.of(verificationToken));

        assertThrows(UserException.class, () -> emailVerificationService.verifyEmail("expired-token"));

        // 🔍 El token expirado se elimina
        verify(tokenRepository).delete(verificationToken);

        // 🔍 El usuario nunca se marca como verificado
        verify(userRepository, never()).save(any(User.class));
        assertNotEquals(Boolean.TRUE, user.getVerified());
    }

    // =====================================================
    // 🔁 resendVerification() — Reenviar verificación
    // =====================================================

    // 🧪 Reenvía correctamente el correo de verificación a un usuario no verificado
    @Test
    void resendVerification_success() throws UserException {
        User user = buildUser(1L, "test@mail.com", false);

        ReflectionTestUtils.setField(emailVerificationService, "frontendVerifyUrl", VERIFY_URL);

        when(userRepository.findByEmail("test@mail.com")).thenReturn(user);

        emailVerificationService.resendVerification("test@mail.com");

        // 🔍 Internamente reutiliza sendVerificationEmail(): borra el token anterior,
        // guarda uno nuevo y envía el correo.
        verify(tokenRepository).deleteByUser(user);
        verify(tokenRepository).save(any(EmailVerificationToken.class));
        verify(emailService).sendEmail(eq("test@mail.com"), anyString(), anyString());
    }

    // 🧪 Lanza UserException si no existe ninguna cuenta con ese correo
    @Test
    void resendVerification_userNotFound() {
        when(userRepository.findByEmail("noexiste@mail.com")).thenReturn(null);

        assertThrows(UserException.class, () -> emailVerificationService.resendVerification("noexiste@mail.com"));

        verify(tokenRepository, never()).deleteByUser(any(User.class));
        verify(emailService, never()).sendEmail(any(), any(), any());
    }

    // 🧪 Lanza UserException si el correo ya está verificado
    @Test
    void resendVerification_alreadyVerified() {
        User user = buildUser(1L, "test@mail.com", true);

        when(userRepository.findByEmail("test@mail.com")).thenReturn(user);

        assertThrows(UserException.class, () -> emailVerificationService.resendVerification("test@mail.com"));

        verify(tokenRepository, never()).deleteByUser(any(User.class));
        verify(emailService, never()).sendEmail(any(), any(), any());
    }
}
