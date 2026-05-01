package com.zosh.controller;

import com.zosh.domain.ServiceCategory;
import com.zosh.exception.UserException;
import com.zosh.payload.request.ServiceListingRequest;
import com.zosh.payload.response.ServiceListingResponse;
import com.zosh.services.ServiceListingService;
import io.swagger.v3.oas.annotations.Operation; // Swagger: describe cada endpoint
import io.swagger.v3.oas.annotations.tags.Tag;   // Swagger: agrupa endpoints
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor

// Swagger: nombre del grupo en Swagger UI
@Tag(name = "Servicios", description = "Endpoints para gestión de servicios publicados por usuarios")
public class ServiceController {

    private final ServiceListingService serviceListingService;

    // Crear servicio
    @Operation(summary = "Crear nuevo servicio")
    @PostMapping("/api/services")
    public ResponseEntity<ServiceListingResponse> createService(
            @RequestBody @Valid ServiceListingRequest request) throws UserException {
        return ResponseEntity.ok(serviceListingService.createService(request));
    }

    // Actualizar servicio
    @Operation(summary = "Actualizar servicio existente")
    @PutMapping("/api/services/{id}")
    public ResponseEntity<ServiceListingResponse> updateService(
            @PathVariable Long id,
            @RequestBody @Valid ServiceListingRequest request) throws UserException {
        return ResponseEntity.ok(serviceListingService.updateService(id, request));
    }

    // Desactivar servicio
    @Operation(summary = "Desactivar servicio")
    @PatchMapping("/api/services/{id}/deactivate")
    public ResponseEntity<ServiceListingResponse> deactivateService(@PathVariable Long id) throws UserException {
        return ResponseEntity.ok(serviceListingService.deactivateService(id));
    }

    // Listar servicios públicos
    @Operation(summary = "Listar servicios disponibles")
    @GetMapping("/services")
    public ResponseEntity<List<ServiceListingResponse>> browseServices(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) ServiceCategory category) {
        return ResponseEntity.ok(serviceListingService.browseApproved(keyword, category));
    }

    // Obtener detalle de servicio
    @Operation(summary = "Obtener detalle de un servicio")
    @GetMapping("/services/{id}")
    public ResponseEntity<ServiceListingResponse> getServiceDetail(@PathVariable Long id) throws UserException {
        return ResponseEntity.ok(serviceListingService.getServiceDetail(id));
    }

    // Servicios del usuario logueado
    @Operation(summary = "Obtener servicios del usuario autenticado")
    @GetMapping("/api/services/my")
    public ResponseEntity<List<ServiceListingResponse>> getMyServices() throws UserException {
        return ResponseEntity.ok(serviceListingService.getMyServices());
    }
}