package com.zosh.services;

import com.zosh.domain.ReportStatus;
import com.zosh.exception.UserException;
import com.zosh.payload.request.ReportRequest;
import com.zosh.payload.response.ReportResponse;

import java.util.List;

// 🧠 Interfaz del servicio de reportes
// Define el CONTRATO del sistema de moderación
public interface ReportService {

    // 🚨 Crear un nuevo reporte
    // El usuario reporta contenido (servicio, usuario, etc.)
    ReportResponse submitReport(ReportRequest request) throws UserException;

    // 📊 Obtener lista de reportes (opcionalmente filtrados por estado)
    // Usado principalmente por ADMIN
    List<ReportResponse> getReports(ReportStatus status);

    // ✅ Resolver un reporte (acción de moderación)
    // Admin decide qué hacer con el reporte
    ReportResponse resolveReport(Long id, String adminNotes) throws UserException;

    // 📈 Contar reportes pendientes
    // Útil para dashboard de administración
    long countPending();
}