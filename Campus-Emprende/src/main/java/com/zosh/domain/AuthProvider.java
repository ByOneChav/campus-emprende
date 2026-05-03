package com.zosh.domain;

// Enum que define los proveedores de autenticación disponibles en el sistema
public enum AuthProvider {
    
    // Autenticación tradicional con usuario y contraseña
    LOCAL,
    
    // Autenticación mediante cuenta de Google (OAuth2)
    GOOGLE
}