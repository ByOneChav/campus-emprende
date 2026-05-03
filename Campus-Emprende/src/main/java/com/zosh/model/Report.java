package com.zosh.model;

import com.zosh.domain.ReportStatus;
import com.zosh.domain.ReportTargetType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // id del reporte

    @ManyToOne
    @JoinColumn(name = "reporter_id", nullable = false)
    private User reporter; // usuario que reporta

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportTargetType targetType; // tipo de objetivo (USER, SERVICE, etc.)

    @Column(nullable = false)
    private Long targetId; // id del objeto reportado

    @Column(nullable = false, columnDefinition = "TEXT")
    private String reason; // motivo del reporte

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportStatus status = ReportStatus.PENDING; // estado del reporte

    @Column(columnDefinition = "TEXT")
    private String adminNotes; // notas del admin al resolver

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt; // fecha de creación

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt; // fecha de actualización
}