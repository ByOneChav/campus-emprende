package com.zosh.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "email_verification_tokens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailVerificationToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // id del token

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // usuario asociado al token

    @Column(nullable = false, unique = true)
    private String token; // valor único del token (UUID)

    @Column(nullable = false)
    private LocalDateTime expiresAt; // fecha de expiración

    private LocalDateTime usedAt; // fecha en que se usó el token

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt; // fecha de creación

    public boolean isExpired() {
        return expiresAt.isBefore(LocalDateTime.now()); // verifica si ya expiró
    }

    public boolean isUsed() {
        return usedAt != null; // verifica si ya fue utilizado
    }
}