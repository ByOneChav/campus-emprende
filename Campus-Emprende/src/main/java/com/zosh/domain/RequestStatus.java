package com.zosh.domain;

// Enum que representa los estados posibles de una solicitud dentro del sistema
public enum RequestStatus {
    
    // Solicitud creada pero aún no gestionada
    PENDIENTE,
    
    // Solicitud aceptada por el proveedor
    ACEPTADO,
    
    // Servicio actualmente en ejecución
    EN_CURSO,
    
    // Servicio finalizado correctamente
    COMPLETADO,
    
    // Solicitud cancelada
    CANCELADO
}