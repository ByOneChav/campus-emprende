package com.zosh.controller;

import com.zosh.domain.ServiceCategory;
import com.zosh.exception.UserException;
import com.zosh.payload.request.ServiceListingRequest;
import com.zosh.payload.response.ServiceListingResponse;
import com.zosh.services.ServiceListingService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
// import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor

// Agrupa todos los endpoints relacionados a servicios en Swagger
@Tag(
    name = "Servicios",
    description = "Endpoints para gestión de servicios publicados por usuarios"
)
// @SecurityRequirement(name = "bearerAuth") // // 👈 ESTO ES LO QUE TE FALTABA
public class ServiceController {

    private final ServiceListingService serviceListingService;

    // Crear servicio
    @Operation(
        summary = "Crear nuevo servicio",
        description = "Permite a un usuario crear un nuevo servicio dentro de la plataforma"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Servicio creado correctamente"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos"),
        @ApiResponse(responseCode = "401", description = "No autorizado"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PostMapping("/api/services")
    public ResponseEntity<ServiceListingResponse> createService(
            @RequestBody @Valid ServiceListingRequest request) throws UserException {

        // Llama al servicio para crear un nuevo servicio
        return ResponseEntity.ok(serviceListingService.createService(request));
    }

    // Actualizar servicio
    @Operation(
        summary = "Actualizar servicio existente",
        description = "Permite modificar la información de un servicio existente"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Servicio actualizado correctamente"),
        @ApiResponse(responseCode = "404", description = "Servicio no encontrado"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PutMapping("/api/services/{id}")
    public ResponseEntity<ServiceListingResponse> updateService(
            @PathVariable Long id,
            @RequestBody @Valid ServiceListingRequest request) throws UserException {

        // Llama al servicio para actualizar
        return ResponseEntity.ok(serviceListingService.updateService(id, request));
    }

    // Desactivar servicio
    @Operation(
        summary = "Desactivar servicio",
        description = "Permite desactivar un servicio para que no sea visible públicamente"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Servicio desactivado correctamente"),
        @ApiResponse(responseCode = "404", description = "Servicio no encontrado"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PatchMapping("/api/services/{id}/deactivate")
    public ResponseEntity<ServiceListingResponse> deactivateService(@PathVariable Long id) throws UserException {

        // Llama al servicio para desactivar
        return ResponseEntity.ok(serviceListingService.deactivateService(id));
    }

    
    // Listar servicios públicos
    @Operation(
        summary = "Listar servicios disponibles",
        description = "Permite obtener una lista de servicios aprobados con filtros opcionales"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de servicios obtenida correctamente"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/services")
    public ResponseEntity<List<ServiceListingResponse>> browseServices(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) ServiceCategory category) {

        // Busca servicios filtrando por palabra clave o categoría
        return ResponseEntity.ok(serviceListingService.browseApproved(keyword, category));
    }

    // Obtener detalle de servicio
    @Operation(
        summary = "Obtener detalle de un servicio",
        description = "Permite obtener la información detallada de un servicio específico"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Detalle del servicio obtenido correctamente"),
        @ApiResponse(responseCode = "404", description = "Servicio no encontrado"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/services/{id}")
    public ResponseEntity<ServiceListingResponse> getServiceDetail(@PathVariable Long id) throws UserException {

        // Obtiene el detalle de un servicio
        return ResponseEntity.ok(serviceListingService.getServiceDetail(id));
    }

    // Servicios del usuario logueado
    @Operation(
        summary = "Obtener servicios del usuario autenticado",
        description = "Permite obtener todos los servicios creados por el usuario autenticado"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Servicios del usuario obtenidos correctamente"),
        @ApiResponse(responseCode = "401", description = "No autorizado"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/api/services/my")
    public ResponseEntity<List<ServiceListingResponse>> getMyServices() throws UserException {

        // Obtiene servicios del usuario logueado
        return ResponseEntity.ok(serviceListingService.getMyServices());
    }
}