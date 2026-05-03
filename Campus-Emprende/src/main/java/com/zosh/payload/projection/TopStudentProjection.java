package com.zosh.payload.projection;

// Proyección para obtener información resumida de los mejores estudiantes
public interface TopStudentProjection {
    
    // ID del estudiante
    Long getStudentId();
    
    // Nombre del estudiante
    String getStudentName();
    
    // Email del estudiante
    String getStudentEmail();
    
    // Total de servicios ofrecidos
    Long getTotalServices();
    
    // Total de solicitudes recibidas
    Long getTotalRequests();
    
    // Total de solicitudes completadas
    Long getCompletedRequests();
    
    // Promedio de calificación del estudiante
    Double getAverageRating();
}