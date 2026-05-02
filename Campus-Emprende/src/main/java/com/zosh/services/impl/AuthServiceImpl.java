package com.zosh.services.impl;

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

import com.zosh.services.AuthService;
import com.zosh.services.EmailService;
import com.zosh.services.EmailVerificationService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Optional;
import java.util.UUID;

@Service // Marca esta clase como servicio de Spring
@RequiredArgsConstructor // Inyección automática de dependencias (constructor)
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository; // Acceso a BD usuarios
    private final PasswordEncoder passwordEncoder; // Encriptar contraseñas
    private final JwtProvider jwtProvider; // Generar tokens JWT
    private final CustomUserImplementation customUserImplementation; // Cargar usuario para auth
    private final PasswordResetTokenRepository passwordResetTokenRepository; // Manejo tokens reset
    private final EmailService emailService; // Envío de correos
    private final EmailVerificationService emailVerificationService; // Verificación de email


    @Value("${app.frontend.reset-url}")
    private String frontendResetUrl; // URL del frontend para reset password


    @Override
    public AuthResponse signup(UserDTO req) throws UserException {

        // 🔍 Verifica si el email ya existe
        User user = userRepository.findByEmail(req.getEmail());
        if(user != null) {
            throw new UserException("La dirección de correo electrónico ya está registrada. ");
        }

        // 🚫 Evita que alguien se registre como ADMIN
        if(req.getRole().equals(UserRole.ROLE_ADMIN)){
            throw new UserException("No se permite el rol de administrador.");
        }

        // 🧱 Crear nuevo usuario
        User createdUser = new User();
        createdUser.setEmail(req.getEmail());
        createdUser.setPassword(passwordEncoder.encode(req.getPassword())); // encripta password
        createdUser.setPhone(req.getPhone());
        createdUser.setFullName(req.getFullName());
        createdUser.setLastLogin(LocalDateTime.now());
        createdUser.setCreatedAt(LocalDateTime.now());
        createdUser.setRole(UserRole.ROLE_STUDENT); // asigna rol por defecto

        // 💾 Guardar en BD
        User savedUser = userRepository.save(createdUser);

        // 📧 Enviar correo de verificación
        emailVerificationService.sendVerificationEmail(savedUser);

        // 🔐 Crear autenticación manual
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                savedUser.getEmail(), savedUser.getPassword());

        // 📌 Guardar en contexto de seguridad
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 🎟️ Generar JWT
        String jwt = jwtProvider.generateToken(authentication);

        // 📤 Construir respuesta
        AuthResponse response = new AuthResponse();
        response.setTitle("Bienvenido " + createdUser.getEmail());
        response.setMessage("Registro exitoso");
        response.setUser(UserMapper.toDTO(savedUser)); // entity → DTO
        response.setJwt(jwt);

        return response;
    }

    @Override
    public AuthResponse login(String username, String password) throws UserException {

        // 🔐 Autentica usuario (valida credenciales)
        Authentication authentication = authenticate(username, password);

        // 📌 Guarda autenticación en contexto
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 🎭 Obtiene roles del usuario
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        String role =  authorities.iterator().next().getAuthority();

        // 🎟️ Genera token JWT
        String token = jwtProvider.generateToken(authentication);

        // 🔍 Busca usuario en BD
        User user = userRepository.findByEmail(username);

        // 🕒 Actualiza último login
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        // 📤 Construye respuesta
        AuthResponse response = new AuthResponse();
        response.setTitle("Inicio de sesión exitoso");
        response.setMessage("Bienvenido de nuevo" + username);
        response.setJwt(token);
        response.setUser(UserMapper.toDTO(user));

        return response;
    }

    // 🔑 Método interno para validar credenciales
    public Authentication authenticate(String email, String password) throws UserException {

        // 📥 Carga usuario desde Spring Security
        UserDetails userDetails = customUserImplementation.loadUserByUsername(email);

        // ❌ Si no existe
        if(userDetails == null) {
            throw new UserException("La dirección de correo electrónico no existe: "+ email);
        }

        // ❌ Si contraseña no coincide
        if(!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new UserException("Contraseña incorrecta. XD");
        }

        // ✅ Retorna autenticación válida
        return new UsernamePasswordAuthenticationToken(
                email, null, userDetails.getAuthorities());
    }

    @Transactional // Manejo transaccional (BD)
    public void createPasswordResetToken(String email) throws UserException {

        // 🔍 Buscar usuario
        User user = userRepository.findByEmail(email);

        // ❌ Si no existe
        if (user==null) {
            throw new UserException("Usuario no encontrado con el correo electrónico proporcionado");
        }

        // 🔑 Generar token único
        String token = UUID.randomUUID().toString();

        // 🧱 Crear objeto token
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiryDate(LocalDateTime.now().plusMinutes(5)) // expira en 5 min
                .build();

        // 💾 Guardar token
        passwordResetTokenRepository.save(resetToken);

        // 🔗 Construir link para frontend
        String resetLink =  frontendResetUrl + token;

        // 📧 Contenido del correo
        String subject = "Solicitud de restablecimiento de contraseña";
        String body = "Solicitaste restablecer tu contraseña. Usa este enlace (válido por 5 minutos): " + resetLink;

        // 📤 Enviar correo
        emailService.sendEmail(user.getEmail(), subject, body);
    }


    @Transactional
    public void resetPassword(String token, String newPassword) {

        // 🔍 Buscar token
        Optional<PasswordResetToken> optionalToken = passwordResetTokenRepository.findByToken(token);

        // ❌ Si no existe
        if (optionalToken.isEmpty()) {
            throw new BadCredentialsException("Token no válido o caducado");
        }

        PasswordResetToken resetToken = optionalToken.get();

        // ❌ Si expiró
        if (resetToken.isExpired()) {
            passwordResetTokenRepository.delete(resetToken);
            throw new BadCredentialsException("Invalid or expired token");
        }

        // 🔄 Actualizar contraseña
        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // 🗑️ Eliminar token usado
        passwordResetTokenRepository.delete(resetToken);
    }
}