package com.zosh.model;

import com.zosh.domain.CancelledBy;
import com.zosh.domain.RequestStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

// 🧱 Entity ServiceRequest → representa la tabla "service_requests"
// Modela la solicitud entre cliente y proveedor
@Entity
@Table(name = "service_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceRequest {

    // 🆔 ID autogenerado
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔗 Relación con el servicio solicitado
    // Muchas solicitudes pueden pertenecer a un mismo servicio
    @ManyToOne
    @JoinColumn(name = "service_id", nullable = false)
    private ServiceListing service;

    // 👤 Cliente que solicita el servicio
    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private User client;

    // 💬 Mensaje del cliente (detalle de la solicitud)
    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    // 🔄 Estado de la solicitud (workflow)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status = RequestStatus.PENDIENTE;

    // 👤 Quién canceló la solicitud (cliente o proveedor)
    @Enumerated(EnumType.STRING)
    private CancelledBy cancelledBy;

    // ⏱ Se establece cuando el cliente confirma finalización
    // Permite habilitar acciones posteriores (ej: review)
    private LocalDateTime completedAt;

    // 📅 Fecha de creación automática
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // 🔄 Fecha de actualización automática
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}