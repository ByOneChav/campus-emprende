package com.zosh.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// DTO que representa la información de los mejores estudiantes para respuestas de la API
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TopStudentResponse {
    
    // ID del estudiante
    private Long studentId;
    
    // Nombre del estudiante
    private String studentName;
    
    // Email del estudiante
    private String studentEmail;
    
    // Total de servicios ofrecidos por el estudiante
    private Long totalServices;
    
    // Total de solicitudes recibidas
    private Long totalRequests;
    
    // Total de solicitudes completadas
    private Long completedRequests;
    
    // Promedio de calificación del estudiante
    private Double averageRating;
}