package com.zosh.payload.response;

import lombok.Builder;
import lombok.Data;

// DTO que representa la información resumida para el dashboard del sistema
@Data
@Builder
public class DashboardResponse {
    
    // Total de usuarios registrados en la plataforma
    private long totalUsers;
    
    // Cantidad de servicios pendientes de aprobación
    private long pendingServices;
    
    // Cantidad de servicios aprobados
    private long approvedServices;
    
    // Cantidad de servicios rechazados
    private long rejectedServices;
    
    // Cantidad de servicios inactivos
    private long inactiveServices;
    
    // Total de solicitudes realizadas
    private long totalRequests;
    
    // Cantidad de reportes pendientes
    private long pendingReports;
}