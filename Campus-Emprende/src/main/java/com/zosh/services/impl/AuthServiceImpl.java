package com.zosh.services.impl;

import com.zosh.configurations.JwtProvider;
import com.zosh.domain.UserRole;
import com.zosh.exception.UserException;
import com.zosh.mapper.UserMapper;
import com.zosh.model.PasswordResetToken;
import com.zosh.model.User;
import com.zosh.payload.request.SignupRequest;
import com.zosh.payload.response.AuthResponse;
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
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final CustomUserImplementation customUserImplementation;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;
    private final EmailVerificationService emailVerificationService;

    @Value("${app.frontend.reset-url}")
    private String frontendResetUrl;

    @Override
    public AuthResponse signup(SignupRequest req) throws UserException {
        User user = userRepository.findByEmail(req.getEmail());
        if (user != null) {
            throw new UserException("La direccion de correo electronico ya esta registrada.");
        }

        User createdUser = UserMapper.toEntity(req);
        createdUser.setPassword(passwordEncoder.encode(req.getPassword()));
        createdUser.setLastLogin(LocalDateTime.now());
        createdUser.setCreatedAt(LocalDateTime.now());
        createdUser.setRole(UserRole.ROLE_STUDENT);

        User savedUser = userRepository.save(createdUser);
        emailVerificationService.sendVerificationEmail(savedUser);

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                savedUser.getEmail(),
                null,
                List.of(new SimpleGrantedAuthority(savedUser.getRole().name()))
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        AuthResponse response = new AuthResponse();
        response.setTitle("Bienvenido " + createdUser.getEmail());
        response.setMessage("Registro exitoso");
        response.setUser(UserMapper.toDTO(savedUser));
        response.setJwt(jwtProvider.generateToken(authentication));
        return response;
    }

    @Override
    public AuthResponse login(String username, String password) throws UserException {
        Authentication authentication = authenticate(username, password);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtProvider.generateToken(authentication);
        User user = userRepository.findByEmail(username);

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        AuthResponse response = new AuthResponse();
        response.setTitle("Inicio de sesion exitoso");
        response.setMessage("Bienvenido de nuevo " + username);
        response.setJwt(token);
        response.setUser(UserMapper.toDTO(user));
        return response;
    }

    public Authentication authenticate(String email, String password) throws UserException {
        UserDetails userDetails = customUserImplementation.loadUserByUsername(email);

        if (userDetails == null) {
            throw new UserException("La direccion de correo electronico no existe: " + email);
        }

        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new UserException("Contrasena incorrecta.");
        }

        User user = userRepository.findByEmail(email);
        if (user != null && Boolean.FALSE.equals(user.getVerified())) {
            throw new UserException("La cuenta aun no ha sido verificada.");
        }

        return new UsernamePasswordAuthenticationToken(email, null, userDetails.getAuthorities());
    }

    @Override
    @Transactional
    public void createPasswordResetToken(String email) throws UserException {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UserException("Usuario no encontrado con el correo electronico proporcionado");
        }

        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiryDate(LocalDateTime.now().plusMinutes(5))
                .build();

        passwordResetTokenRepository.save(resetToken);

        String resetLink = frontendResetUrl + token;
        String subject = "Solicitud de restablecimiento de contrasena";
        String body = "Solicitaste restablecer tu contrasena. Usa este enlace valido por 5 minutos: " + resetLink;

        emailService.sendEmail(user.getEmail(), subject, body);
    }

    @Override
    @Transactional
    public void resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> optionalToken = passwordResetTokenRepository.findByToken(token);
        if (optionalToken.isEmpty()) {
            throw new BadCredentialsException("Token no valido o caducado");
        }

        PasswordResetToken resetToken = optionalToken.get();
        if (resetToken.isExpired()) {
            passwordResetTokenRepository.delete(resetToken);
            throw new BadCredentialsException("Token no valido o caducado");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        passwordResetTokenRepository.delete(resetToken);
    }
}
