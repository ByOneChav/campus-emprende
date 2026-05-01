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

@RestController
@RequiredArgsConstructor

// Agrupa endpoints relacionados a reportes y moderación
@Tag(
    name = "Reportes",
    description = "Endpoints para gestión de reportes y moderación de contenido"
)
public class ReportController {

    private final ReportService reportService;

    // Crear un nuevo reporte
    @Operation(summary = "Enviar reporte")
    @PostMapping("/api/reports")
    public ResponseEntity<ReportResponse> submitReport(@RequestBody @Valid ReportRequest request) throws UserException {
        return ResponseEntity.ok(reportService.submitReport(request));
    }

    // Obtener reportes (solo administrador)
    @Operation(summary = "Obtener lista de reportes (ADMIN)")
    @GetMapping("/api/admin/reports")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReportResponse>> getReports(
            @RequestParam(required = false) ReportStatus status) {
        return ResponseEntity.ok(reportService.getReports(status));
    }

    // Resolver un reporte (solo administrador)
    @Operation(summary = "Resolver reporte (ADMIN)")
    @PatchMapping("/api/admin/reports/{id}/resolve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReportResponse> resolveReport(
            @PathVariable Long id,
            @RequestBody ModerationRequest request) throws UserException {
        return ResponseEntity.ok(reportService.resolveReport(id, request.getReason()));
    }
}