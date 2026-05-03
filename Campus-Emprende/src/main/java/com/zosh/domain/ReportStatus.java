package com.zosh.domain;

// Enum que representa el estado de un reporte dentro del sistema
public enum ReportStatus {
    
    // Reporte creado y aún pendiente de revisión
    PENDING,
    
    // Reporte que ya fue revisado por un administrador
    REVIEWED,
    
    // Reporte que ha sido resuelto
    RESUELTO
}