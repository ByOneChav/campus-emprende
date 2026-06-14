package com.zosh.Tests;

import com.zosh.configurations.JwtProvider;
import com.zosh.domain.UserRole;
import com.zosh.exception.UserException;
import com.zosh.mapper.UserMapper;
import com.zosh.model.PasswordResetToken;
import com.zosh.model.User;
import com.zosh.payload.response.AuthResponse;
import com.zosh.payload.response.UserDTO;
import com.zosh.repository.PasswordResetTokenRepository;
import com.zosh.repository.UserRepository;
import com.zosh.services.EmailService;
import com.zosh.services.EmailVerificationService;
import com.zosh.services.impl.AuthServiceImpl;
import com.zosh.services.impl.CustomUserImplementation;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

// 🧪 Pruebas unitarias para AuthServiceImpl
// Cubre registro (signup), validación de credenciales (authenticate),
// inicio de sesión (login) y el flujo de reseteo de contraseña.
@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    // 🔗 Repositorio de usuarios (mockeado)
    @Mock
    private UserRepository userRepository;

    // 🔐 Encoder de contraseñas (mockeado)
    @Mock
    private PasswordEncoder passwordEncoder;

    // 🎟️ Generador de tokens JWT (mockeado)
    @Mock
    private JwtProvider jwtProvider;

    // 👤 Carga de usuario para Spring Security (mockeado)
    @Mock
    private CustomUserImplementation customUserImplementation;

    // 🔗 Repositorio de tokens de reseteo de contraseña (mockeado)
    @Mock
    private PasswordResetTokenRepository passwordResetTokenRepository;

    // 📧 Servicio de correo (mockeado)
    @Mock
    private EmailService emailService;

    // 📧 Servicio de verificación de email (mockeado)
    @Mock
    private EmailVerificationService emailVerificationService;

    // 🧩 Clase real que se está probando
    @InjectMocks
    private AuthServiceImpl authService;

    // 🔧 URL del frontend usada para construir el link de reseteo (viene de @Value)
    private static final String RESET_URL = "http://localhost:3000/reset?token=";

    // 🧹 Limpia el contexto de seguridad después de cada prueba,
    // ya que signup()/login() llaman a SecurityContextHolder real.
    @AfterEach
    void cleanUpSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    // =====================================================
    // 🆕 signup() — Registro de usuario
    // =====================================================

    // 🧪 Registra correctamente un nuevo usuario con rol STUDENT por defecto
    @Test
    void signup_success() throws UserException {
        UserDTO req = new UserDTO();
        req.setEmail("nuevo@mail.com");
        req.setPassword("plainPass");
        req.setPhone("123456789");
        req.setFullName("Nuevo Usuario");
        req.setRole(UserRole.ROLE_STUDENT);

        UserDTO mappedDto = new UserDTO();
        mappedDto.setEmail("nuevo@mail.com");

        when(userRepository.findByEmail("nuevo@mail.com")).thenReturn(null);
        when(passwordEncoder.encode("plainPass")).thenReturn("encoded-pass");
        // 💾 save() devuelve el mismo usuario que recibió
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(jwtProvider.generateToken(any(Authentication.class))).thenReturn("jwt-token");

        try (MockedStatic<UserMapper> mockedMapper = mockStatic(UserMapper.class)) {
            mockedMapper.when(() -> UserMapper.toDTO(any(User.class))).thenReturn(mappedDto);

            AuthResponse response = authService.signup(req);

            assertNotNull(response);
            assertEquals("jwt-token", response.getJwt());
            assertEquals("Registro exitoso", response.getMessage());
            assertTrue(response.getTitle().contains("nuevo@mail.com"));
        }

        // 🔍 Valida los datos del usuario que se guardó
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());

        User savedUser = userCaptor.getValue();
        assertEquals("nuevo@mail.com", savedUser.getEmail());
        assertEquals("encoded-pass", savedUser.getPassword());
        assertEquals("123456789", savedUser.getPhone());
        assertEquals("Nuevo Usuario", savedUser.getFullName());
        // 🔐 Siempre se asigna ROLE_STUDENT, sin importar lo enviado en el request
        assertEquals(UserRole.ROLE_STUDENT, savedUser.getRole());
        assertNotNull(savedUser.getCreatedAt());
        assertNotNull(savedUser.getLastLogin());

        // 🔍 Se envió el correo de verificación al usuario recién creado
        verify(emailVerificationService).sendVerificationEmail(savedUser);
    }

    // 🧪 Lanza UserException si el email ya está registrado
    @Test
    void signup_emailAlreadyExists() throws UserException {
        UserDTO req = new UserDTO();
        req.setEmail("existente@mail.com");
        req.setPassword("plainPass");
        req.setRole(UserRole.ROLE_STUDENT);

        User existingUser = new User();
        existingUser.setEmail("existente@mail.com");

        when(userRepository.findByEmail("existente@mail.com")).thenReturn(existingUser);

        assertThrows(UserException.class, () -> authService.signup(req));

        verify(userRepository, never()).save(any(User.class));
        verify(emailVerificationService, never()).sendVerificationEmail(any(User.class));
    }

    // 🧪 Lanza UserException si se intenta registrar con rol ADMIN
    @Test
    void signup_adminRoleNotAllowed() throws UserException {
        UserDTO req = new UserDTO();
        req.setEmail("admin@mail.com");
        req.setPassword("plainPass");
        req.setRole(UserRole.ROLE_ADMIN);

        when(userRepository.findByEmail("admin@mail.com")).thenReturn(null);

        assertThrows(UserException.class, () -> authService.signup(req));

        verify(userRepository, never()).save(any(User.class));
    }

    // =====================================================
    // 🔑 authenticate() — Validar credenciales
    // =====================================================

    // 🧪 Devuelve una autenticación válida cuando el email y la contraseña son correctos
    @Test
    void authenticate_success() throws UserException {
        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                "test@mail.com", "encoded-pass", List.of(new SimpleGrantedAuthority("ROLE_STUDENT")));

        when(customUserImplementation.loadUserByUsername("test@mail.com")).thenReturn(userDetails);
        when(passwordEncoder.matches("plainPass", "encoded-pass")).thenReturn(true);

        Authentication result = authService.authenticate("test@mail.com", "plainPass");

        assertEquals("test@mail.com", result.getPrincipal());
        assertTrue(result.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(a -> a.equals("ROLE_STUDENT")));
    }

    // 🧪 Lanza UserException si no existe un usuario con ese email
    @Test
    void authenticate_userNotFound() {
        when(customUserImplementation.loadUserByUsername("noexiste@mail.com")).thenReturn(null);

        assertThrows(UserException.class, () -> authService.authenticate("noexiste@mail.com", "cualquierPass"));
    }

    // 🧪 Lanza UserException si la contraseña no coincide
    @Test
    void authenticate_wrongPassword() {
        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                "test@mail.com", "encoded-pass", List.of(new SimpleGrantedAuthority("ROLE_STUDENT")));

        when(customUserImplementation.loadUserByUsername("test@mail.com")).thenReturn(userDetails);
        when(passwordEncoder.matches("wrongPass", "encoded-pass")).thenReturn(false);

        assertThrows(UserException.class, () -> authService.authenticate("test@mail.com", "wrongPass"));
    }

    // =====================================================
    // 🔓 login() — Iniciar sesión
    // =====================================================

    // 🧪 Inicia sesión correctamente y actualiza la fecha de último login
    @Test
    void login_success() throws UserException {
        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                "test@mail.com", "encoded-pass", List.of(new SimpleGrantedAuthority("ROLE_STUDENT")));

        User user = new User();
        user.setId(1L);
        user.setEmail("test@mail.com");
        user.setPassword("encoded-pass");

        UserDTO mappedDto = new UserDTO();
        mappedDto.setEmail("test@mail.com");

        when(customUserImplementation.loadUserByUsername("test@mail.com")).thenReturn(userDetails);
        when(passwordEncoder.matches("plainPass", "encoded-pass")).thenReturn(true);
        when(jwtProvider.generateToken(any(Authentication.class))).thenReturn("jwt-token");
        when(userRepository.findByEmail("test@mail.com")).thenReturn(user);
        when(userRepository.save(any(User.class))).thenReturn(user);

        try (MockedStatic<UserMapper> mockedMapper = mockStatic(UserMapper.class)) {
            mockedMapper.when(() -> UserMapper.toDTO(user)).thenReturn(mappedDto);

            AuthResponse response = authService.login("test@mail.com", "plainPass");

            assertNotNull(response);
            assertEquals("jwt-token", response.getJwt());
            assertEquals("Inicio de sesión exitoso", response.getTitle());
            assertTrue(response.getMessage().contains("test@mail.com"));
        }

        // 🔍 Se actualizó la fecha de último login y se guardó el usuario
        assertNotNull(user.getLastLogin());
        verify(userRepository).save(user);
    }

    // 🧪 Lanza UserException si las credenciales son inválidas (delegado de authenticate)
    @Test
    void login_invalidCredentials() {
        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                "test@mail.com", "encoded-pass", List.of(new SimpleGrantedAuthority("ROLE_STUDENT")));

        when(customUserImplementation.loadUserByUsername("test@mail.com")).thenReturn(userDetails);
        when(passwordEncoder.matches("wrongPass", "encoded-pass")).thenReturn(false);

        assertThrows(UserException.class, () -> authService.login("test@mail.com", "wrongPass"));

        verify(userRepository, never()).save(any(User.class));
    }

    // =====================================================
    // 🔁 createPasswordResetToken() — Solicitar reseteo de contraseña
    // =====================================================

    // 🧪 Crea correctamente el token de reseteo y envía el correo con el link
    @Test
    void createPasswordResetToken_success() throws UserException {
        User user = new User();
        user.setId(1L);
        user.setEmail("test@mail.com");

        ReflectionTestUtils.setField(authService, "frontendResetUrl", RESET_URL);

        when(userRepository.findByEmail("test@mail.com")).thenReturn(user);

        authService.createPasswordResetToken("test@mail.com");

        // 🔍 Se guardó un token asociado al usuario, con expiración futura (~5 min)
        ArgumentCaptor<PasswordResetToken> tokenCaptor = ArgumentCaptor.forClass(PasswordResetToken.class);
        verify(passwordResetTokenRepository).save(tokenCaptor.capture());

        PasswordResetToken savedToken = tokenCaptor.getValue();
        assertEquals(user, savedToken.getUser());
        assertNotNull(savedToken.getToken());
        assertTrue(savedToken.getExpiryDate().isAfter(LocalDateTime.now()));
        assertTrue(savedToken.getExpiryDate().isBefore(LocalDateTime.now().plusMinutes(6)));

        // 🔍 Se envió el correo con el link de reseteo que incluye el token generado
        ArgumentCaptor<String> bodyCaptor = ArgumentCaptor.forClass(String.class);
        verify(emailService).sendEmail(eq("test@mail.com"), anyString(), bodyCaptor.capture());
        assertTrue(bodyCaptor.getValue().contains(RESET_URL + savedToken.getToken()));
    }

    // 🧪 Lanza UserException si no existe un usuario con ese email
    @Test
    void createPasswordResetToken_userNotFound() {
        when(userRepository.findByEmail("noexiste@mail.com")).thenReturn(null);

        assertThrows(UserException.class, () -> authService.createPasswordResetToken("noexiste@mail.com"));

        verify(passwordResetTokenRepository, never()).save(any(PasswordResetToken.class));
        verify(emailService, never()).sendEmail(any(), any(), any());
    }

    // =====================================================
    // 🔒 resetPassword() — Restablecer contraseña
    // =====================================================

    // 🧪 Cambia correctamente la contraseña cuando el token es válido y no ha expirado
    @Test
    void resetPassword_success() {
        User user = new User();
        user.setId(1L);
        user.setPassword("old-encoded");

        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token("valid-token")
                .user(user)
                .expiryDate(LocalDateTime.now().plusMinutes(5)) // 🟢 aún válido
                .build();

        when(passwordResetTokenRepository.findByToken("valid-token")).thenReturn(Optional.of(resetToken));
        when(passwordEncoder.encode("newPass")).thenReturn("new-encoded");

        authService.resetPassword("valid-token", "newPass");

        // 🔍 La contraseña del usuario se actualizó y se guardó
        assertEquals("new-encoded", user.getPassword());
        verify(userRepository).save(user);

        // 🔍 El token usado se elimina
        verify(passwordResetTokenRepository).delete(resetToken);
    }

    // 🧪 Lanza BadCredentialsException si el token no existe
    @Test
    void resetPassword_tokenNotFound() {
        when(passwordResetTokenRepository.findByToken("invalid-token")).thenReturn(Optional.empty());

        assertThrows(BadCredentialsException.class, () -> authService.resetPassword("invalid-token", "newPass"));

        verify(userRepository, never()).save(any(User.class));
    }

    // 🧪 Lanza BadCredentialsException y elimina el token si ya expiró
    @Test
    void resetPassword_expiredToken() {
        User user = new User();
        user.setId(1L);
        user.setPassword("old-encoded");

        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token("expired-token")
                .user(user)
                .expiryDate(LocalDateTime.now().minusMinutes(1)) // 🔴 ya expiró
                .build();

        when(passwordResetTokenRepository.findByToken("expired-token")).thenReturn(Optional.of(resetToken));

        assertThrows(BadCredentialsException.class, () -> authService.resetPassword("expired-token", "newPass"));

        // 🔍 El token expirado se elimina
        verify(passwordResetTokenRepository).delete(resetToken);

        // 🔍 La contraseña NUNCA se actualiza
        assertEquals("old-encoded", user.getPassword());
        verify(userRepository, never()).save(any(User.class));
    }
}