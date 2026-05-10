package com.zosh.controller;

import com.zosh.domain.ReportStatus;
import com.zosh.exception.UserException;
import com.zosh.payload.request.ModerationRequest;
import com.zosh.payload.request.ReportRequest;
import com.zosh.payload.response.ReportResponse;
import com.zosh.services.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Reportes", description = "Endpoints para gestion de reportes y moderacion de contenido")
public class ReportController {

    private final ReportService reportService;

    @Operation(
            summary = "Enviar reporte",
            description = "Permite a un usuario reportar contenido o servicios inapropiados dentro del sistema"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Reporte enviado correctamente"),
            @ApiResponse(responseCode = "400", description = "Solicitud invalida"),
            @ApiResponse(responseCode = "401", description = "No autorizado"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PostMapping("/api/reports")
    public ResponseEntity<ReportResponse> submitReport(@RequestBody @Valid ReportRequest request) throws UserException {
        return ResponseEntity.ok(reportService.submitReport(request));
    }

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
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReportResponse>> getReports(@RequestParam(required = false) ReportStatus status) {
        return ResponseEntity.ok(reportService.getReports(status));
    }

    @Operation(
            summary = "Resolver reporte (ADMIN)",
            description = "Permite a un administrador resolver un reporte indicando el motivo de la decision"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Reporte resuelto correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos invalidos"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado"),
            @ApiResponse(responseCode = "404", description = "Reporte no encontrado"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PatchMapping("/api/admin/reports/{id}/resolve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReportResponse> resolveReport(
            @PathVariable Long id,
            @Valid @RequestBody ModerationRequest request
    ) throws UserException {
        return ResponseEntity.ok(reportService.resolveReport(id, request.getReason()));
    }
}
