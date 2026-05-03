package com.zosh.controller;

import com.zosh.domain.ReportStatus;
import com.zosh.exception.UserException;
import com.zosh.payload.request.ModerationRequest;
import com.zosh.payload.request.ReportRequest;
import com.zosh.payload.response.ReportResponse;
import com.zosh.services.ReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Swagger imports
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequiredArgsConstructor

// 📌 Agrupa endpoints relacionados a reportes y moderación
@Tag(
    name = "Reportes",
    description = "Endpoints para gestión de reportes y moderación de contenido"
)
public class ReportController {

    // 🔗 Inyección del servicio de reportes
    private final ReportService reportService;

    // ============================
    // 🚨 CREAR REPORTE
    // ============================

    // 📝 Endpoint para enviar un reporte
    @Operation(
        summary = "Enviar reporte",
        description = "Permite a un usuario reportar contenido o servicios inapropiados dentro del sistema"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Reporte enviado correctamente"),
        @ApiResponse(responseCode = "400", description = "Solicitud inválida"),
        @ApiResponse(responseCode = "401", description = "No autorizado"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PostMapping("/api/reports")
    public ResponseEntity<ReportResponse> submitReport(@RequestBody @Valid ReportRequest request) throws UserException {

        // 📌 Delega al service la creación del reporte
        return ResponseEntity.ok(reportService.submitReport(request));
    }

    // ============================
    // 📊 OBTENER REPORTES (ADMIN)
    // ============================

    // 🔎 Endpoint para listar reportes (solo ADMIN)
    @Operation(
        summary = "Obtener lista de reportes (ADMIN)",
        description = "Permite a un administrador visualizar todos los reportes, opcionalmente filtrados por estado"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de reportes obtenida correctamente"),
        @ApiResponse(responseCode = "403", description = "Acceso denegado"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/api/admin/reports")
    @PreAuthorize("hasRole('ADMIN')") // 🔐 Solo administradores
    public ResponseEntity<List<ReportResponse>> getReports(
            @RequestParam(required = false) ReportStatus status) {

        // 📌 Obtiene reportes filtrados por estado (opcional)
        return ResponseEntity.ok(reportService.getReports(status));
    }

    // ============================
    // ✅ RESOLVER REPORTE (ADMIN)
    // ============================

    // ⚖️ Endpoint para resolver un reporte
    @Operation(
        summary = "Resolver reporte (ADMIN)",
        description = "Permite a un administrador resolver un reporte indicando el motivo de la decisión"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Reporte resuelto correctamente"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos"),
        @ApiResponse(responseCode = "403", description = "Acceso denegado"),
        @ApiResponse(responseCode = "404", description = "Reporte no encontrado"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PatchMapping("/api/admin/reports/{id}/resolve")
    @PreAuthorize("hasRole('ADMIN')") // 🔐 Solo administradores
    public ResponseEntity<ReportResponse> resolveReport(
            @PathVariable Long id,
            @RequestBody ModerationRequest request) throws UserException {

        // 📌 Resuelve el reporte con la razón proporcionada
        return ResponseEntity.ok(reportService.resolveReport(id, request.getReason()));
    }
}