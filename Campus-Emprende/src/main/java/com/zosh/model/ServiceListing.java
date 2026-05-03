package com.zosh.model;

import com.zosh.domain.ServiceCategory;
import com.zosh.domain.ServiceStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

// 🧱 Entity ServiceListing → representa la tabla "services"
@Entity
@Table(name = "services")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceListing {

    // 🆔 ID autogenerado
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 👤 Relación N:1 con User (provider)
    // Un usuario puede tener muchos servicios
    @ManyToOne
    @JoinColumn(name = "provider_id", nullable = false)
    private User provider;

    // 📝 Título del servicio
    @Column(nullable = false, length = 150)
    private String title;

    // 📄 Descripción detallada
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    // 🏷️ Categoría del servicio (enum)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ServiceCategory category;

    // 🔄 Estado del servicio (flujo de negocio)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ServiceStatus status = ServiceStatus.PENDIENTE;

    // ❌ Motivo de rechazo (si aplica)
    @Column(columnDefinition = "TEXT")
    private String rejectionReason;

    // 🖼️ Imagen del servicio
    private String imageUrl;

    // 📅 Fecha de creación automática
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // 🔄 Fecha de actualización automática
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}