package com.zosh.payload.response;

import com.zosh.domain.ReportStatus;
import com.zosh.domain.ReportTargetType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReportResponse {

    private Long id; // id del reporte

    private Long reporterId; // id del usuario que reporta
    private String reporterName; // nombre del usuario

    private ReportTargetType targetType; // tipo de objetivo reportado
    private Long targetId; // id del objetivo

    private String reason; // motivo del reporte

    private ReportStatus status; // estado del reporte

    private String adminNotes; // respuesta del admin

    private LocalDateTime createdAt; // fecha creación
    private LocalDateTime updatedAt; // fecha actualización
}