package com.zosh.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.zosh.domain.AuthProvider;
import com.zosh.domain.UserRole;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

// 🧱 Entidad User → representa la tabla "users" en la base de datos
@Entity
@Table(name = "users")
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class User {

    // 🆔 ID autogenerado
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 👤 Nombre completo (obligatorio)
    @NotBlank(message = "fullName is mandatory")
    private String fullName;

    // 🔐 Contraseña (no se expone en JSON)
    @JsonIgnore
    private String password;

    // 📧 Email único y obligatorio
    @Column(nullable = false, unique = true)
    @NotBlank(message = "Email is mandatory")
    @Email(message = "Email should be valid")
    private String email;

    // 📱 Teléfono (opcional)
    private String phone;

    // 🌐 Tipo de autenticación (LOCAL, GOOGLE, etc.)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuthProvider authProvider = AuthProvider.LOCAL;

    // 🟢 ID de Google (si usa OAuth2)
    private String googleId;

    // 🖼️ Imagen de perfil
    private String profileImage;

    // 🎭 Rol del usuario (ADMIN, STUDENT, etc.)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @NotNull(message = "Role is mandatory")
    private UserRole role;

    // ✅ Indica si el usuario está verificado
    @Column(nullable = false)
    private Boolean verified = false;

    // 📅 Fecha de creación (automática)
    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    // 🔄 Fecha de última actualización (automática)
    @Column(nullable = false)
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // 🕒 Último login del usuario
    private LocalDateTime lastLogin;

}