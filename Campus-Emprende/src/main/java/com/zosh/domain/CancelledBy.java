package com.zosh.domain;

// Enum que indica quién realizó la cancelación de un servicio o solicitud
public enum CancelledBy {
    
    // Cancelación realizada por el cliente
    CLIENT,
    
    // Cancelación realizada por el proveedor del servicio
    PROVIDER
}