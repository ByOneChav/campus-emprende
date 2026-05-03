package com.zosh.domain;

// Enum que representa el estado de un servicio dentro de la plataforma
public enum ServiceStatus {
    
    // Servicio creado pero aún pendiente de aprobación
    PENDIENTE,
    
    // Servicio aprobado y disponible para los usuarios
    APROBADO,
    
    // Servicio rechazado por el sistema o administrador
    RECHAZADO,
    
    // Servicio deshabilitado o no visible actualmente
    INACTIVO
}
