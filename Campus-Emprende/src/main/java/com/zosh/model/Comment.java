package com.zosh.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

// 🧱 Entity Comment → representa la tabla "comments"
// Modela los comentarios que los usuarios hacen sobre servicios
@Entity
@Table(name = "comments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment {

    // 🆔 ID autogenerado
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔗 Relación N:1 con ServiceListing
    // Muchos comentarios pertenecen a un servicio
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private ServiceListing service;

    // 👤 Usuario que escribe el comentario
    // Un usuario puede hacer muchos comentarios
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    // 💬 Contenido del comentario
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    // 📅 Fecha de creación automática
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}