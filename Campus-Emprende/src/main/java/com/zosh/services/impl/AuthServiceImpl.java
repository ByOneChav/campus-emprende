package com.zosh.services.impl;

import com.zosh.configurations.JwtProvider;
import com.zosh.domain.UserRole;
import com.zosh.exception.UserException;
import com.zosh.mapper.UserMapper;
import com.zosh.modal.PasswordResetToken;
import com.zosh.modal.User;

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
    public AuthResponse signup(UserDTO req) throws UserException {

        User user = userRepository.findByEmail(req.getEmail());
        if(user != null) {
            throw new UserException("La dirección de correo electrónico ya está registrada. ");
        }

        if(req.getRole().equals(UserRole.ROLE_ADMIN)){
            throw new UserException("No se permite el rol de administrador.");
        }


        User createdUser = new User();
        createdUser.setEmail(req.getEmail());
        createdUser.setPassword(passwordEncoder.encode(req.getPassword()));
        createdUser.setPhone(req.getPhone());
        createdUser.setFullName(req.getFullName());
        createdUser.setLastLogin(LocalDateTime.now());
        createdUser.setCreatedAt(LocalDateTime.now());
        createdUser.setRole(UserRole.ROLE_STUDENT);


        User savedUser = userRepository.save(createdUser);

        emailVerificationService.sendVerificationEmail(savedUser);

        Authentication authentication = new UsernamePasswordAuthenticationToken(savedUser.getEmail(), savedUser.getPassword());
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtProvider.generateToken(authentication);

        AuthResponse response = new AuthResponse();
        response.setTitle("Bienvenido " + createdUser.getEmail());
        response.setMessage("Registro exitoso");
        response.setUser(UserMapper.toDTO(savedUser));
        response.setJwt(jwt);
        return response;
    }

    @Override
    public AuthResponse login(String username, String password) throws UserException {
        Authentication authentication = authenticate(username, password);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        String role =  authorities.iterator().next().getAuthority();
        String token = jwtProvider.generateToken(authentication);

        User user = userRepository.findByEmail(username);

//        update last Login
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        AuthResponse response = new AuthResponse();
        response.setTitle("Inicio de sesión exitoso");
        response.setMessage("Bienvenido de nuevo" + username);
        response.setJwt(token);
        response.setUser(UserMapper.toDTO(user));

        return response;
    }

    public Authentication authenticate(String email, String password) throws UserException {

        UserDetails userDetails = customUserImplementation.loadUserByUsername(email);
        if(userDetails == null) {
            throw new UserException("La dirección de correo electrónico no existe: "+ email);
        }
        if(!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new UserException("Contraseña incorrecta. XD");
        }
        return new UsernamePasswordAuthenticationToken(email, null, userDetails.getAuthorities());
    }

    @Transactional
    public void createPasswordResetToken(String email) throws UserException {
        User user = userRepository.findByEmail(email);

        // Always return/give same response to caller to avoid enumeration attacks.
        if (user==null) {

            throw new UserException("Usuario no encontrado con el correo electrónico proporcionado");
        }



        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiryDate(LocalDateTime.now().plusMinutes(5)) // 5 minutes expiry
                .build();

        passwordResetTokenRepository.save(resetToken);

        String resetLink =  frontendResetUrl + token;
        String subject = "Solicitud de restablecimiento de contraseña";
        String body = "Solicitaste restablecer tu contraseña. Usa este enlace (válido por 5 minutos): " + resetLink;

        emailService.sendEmail(user.getEmail(), subject, body);
    }


    @Transactional
    public void resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> optionalToken = passwordResetTokenRepository.findByToken(token);
        if (optionalToken.isEmpty()) {
            throw new BadCredentialsException("Token no válido o caducado");
        }

        PasswordResetToken resetToken = optionalToken.get();

        if (resetToken.isExpired()) {
            // token expired — delete it
            passwordResetTokenRepository.delete(resetToken);
            throw new BadCredentialsException("Invalid or expired token");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // delete token after successful reset
        passwordResetTokenRepository.delete(resetToken);

    }
}
