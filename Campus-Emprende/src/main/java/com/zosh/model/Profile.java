package com.zosh.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

// 🧱 Entity Profile → representa la tabla "profiles"
@Entity
@Table(name = "profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Profile {

    // 🆔 ID autogenerado
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔗 Relación 1 a 1 con User
    // Cada usuario tiene un único perfil
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    // 📝 Biografía (texto largo)
    @Column(columnDefinition = "TEXT")
    private String bio;

    // 🎓 Carrera del usuario
    @Column(length = 100)
    private String career;

    // 🖼️ URL de imagen de perfil
    private String avatarUrl;

    // 🔗 Perfil de LinkedIn
    private String linkedinUrl;

    // 📅 Fecha de creación automática
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // 🔄 Fecha de actualización automática
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}