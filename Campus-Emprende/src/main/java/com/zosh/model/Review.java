package com.zosh.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

// 🧱 Entity Review → representa la tabla "reviews"
// Modela la reseña que deja un cliente después del servicio
@Entity
@Table(name = "reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    // 🆔 ID autogenerado
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔗 Relación 1:1 con ServiceRequest
    // Cada solicitud solo puede tener UNA reseña
    @OneToOne
    @JoinColumn(name = "service_request_id", nullable = false, unique = true)
    private ServiceRequest serviceRequest;

    // 👤 Usuario que deja la reseña (cliente)
    @ManyToOne
    @JoinColumn(name = "reviewer_id", nullable = false)
    private User reviewer;

    // ⭐ Calificación (rating)
    @Column(nullable = false)
    private Short rating;

    // 💬 Comentario del cliente
    @Column(columnDefinition = "TEXT")
    private String comment;

    // 📅 Fecha de creación automática
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}