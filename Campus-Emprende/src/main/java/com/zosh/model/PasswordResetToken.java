package com.zosh.model;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

// Entidad que representa los tokens de recuperación de contraseña
@Entity
@Table(name = "password_reset_tokens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PasswordResetToken {
    
    // ID único del token
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Token único utilizado para resetear contraseña
    @Column(nullable = false, unique = true)
    private String token;

    // Usuario al que pertenece el token
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Fecha de expiración del token
    @Column(nullable = false)
    private LocalDateTime expiryDate;

    // Verifica si el token ya expiró
    public boolean isExpired() {
        return expiryDate.isBefore(LocalDateTime.now());
    }
}