package com.zosh.controller;

import com.zosh.exception.UserException;
import com.zosh.payload.request.ServiceRequestCreate;
import com.zosh.payload.response.ServiceRequestResponse;
import com.zosh.services.ServiceRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Swagger imports
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor

// Agrupa endpoints relacionados a solicitudes de servicios
@Tag(
    name = "Solicitudes de Servicio",
    description = "Endpoints para gestión de solicitudes entre usuarios"
)
public class ServiceRequestController {

    private final ServiceRequestService serviceRequestService;

    // Enviar una nueva solicitud de servicio
    @Operation(
        summary = "Enviar solicitud de servicio",
        description = "Permite a un usuario enviar una solicitud para contratar un servicio"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Solicitud enviada correctamente"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos"),
        @ApiResponse(responseCode = "401", description = "No autorizado"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PostMapping
    public ResponseEntity<ServiceRequestResponse> sendRequest(
            @RequestBody @Valid ServiceRequestCreate request) throws UserException {

        // Se envía la solicitud al servicio correspondiente
        return ResponseEntity.ok(serviceRequestService.sendRequest(request));
    }

    // Aceptar una solicitud
    @Operation(
        summary = "Aceptar solicitud",
        description = "Permite al proveedor aceptar una solicitud de servicio"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Solicitud aceptada correctamente"),
        @ApiResponse(responseCode = "404", description = "Solicitud no encontrada"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PatchMapping("/{id}/accept")
    public ResponseEntity<ServiceRequestResponse> accept(@PathVariable Long id) throws UserException {

        // Se acepta la solicitud
        return ResponseEntity.ok(serviceRequestService.accept(id));
    }

    // Rechazar una solicitud
    @Operation(
        summary = "Rechazar solicitud",
        description = "Permite al proveedor rechazar una solicitud de servicio"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Solicitud rechazada correctamente"),
        @ApiResponse(responseCode = "404", description = "Solicitud no encontrada"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PatchMapping("/{id}/decline")
    public ResponseEntity<ServiceRequestResponse> decline(@PathVariable Long id) throws UserException {

        // Se rechaza la solicitud
        return ResponseEntity.ok(serviceRequestService.decline(id));
    }

    // Marcar solicitud como en progreso
    @Operation(
        summary = "Iniciar servicio",
        description = "Marca una solicitud como en progreso cuando el servicio comienza"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Servicio iniciado correctamente"),
        @ApiResponse(responseCode = "404", description = "Solicitud no encontrada"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PatchMapping("/{id}/start")
    public ResponseEntity<ServiceRequestResponse> start(@PathVariable Long id) throws UserException {

        // Se marca la solicitud como en progreso
        return ResponseEntity.ok(serviceRequestService.markInProgress(id));
    }

    // Marcar solicitud como completada
    @Operation(
        summary = "Completar servicio",
        description = "Marca una solicitud como completada una vez finalizado el servicio"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Servicio completado correctamente"),
        @ApiResponse(responseCode = "404", description = "Solicitud no encontrada"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PatchMapping("/{id}/complete")
    public ResponseEntity<ServiceRequestResponse> complete(@PathVariable Long id) throws UserException {

        // Se marca la solicitud como completada
        return ResponseEntity.ok(serviceRequestService.markCompleted(id));
    }

    // Confirmar finalización del servicio
    @Operation(
        summary = "Confirmar finalización",
        description = "Permite al cliente confirmar que el servicio fue completado correctamente"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Confirmación exitosa"),
        @ApiResponse(responseCode = "404", description = "Solicitud no encontrada"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PatchMapping("/{id}/confirm")
    public ResponseEntity<ServiceRequestResponse> confirm(@PathVariable Long id) throws UserException {

        // Se confirma la finalización del servicio
        return ResponseEntity.ok(serviceRequestService.confirmCompletion(id));
    }

    // Cancelar solicitud
    @Operation(
        summary = "Cancelar solicitud",
        description = "Permite cancelar una solicitud de servicio antes de completarse"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Solicitud cancelada correctamente"),
        @ApiResponse(responseCode = "404", description = "Solicitud no encontrada"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<ServiceRequestResponse> cancel(@PathVariable Long id) throws UserException {

        // Se cancela la solicitud
        return ResponseEntity.ok(serviceRequestService.cancel(id));
    }

    
    // Obtener solicitudes enviadas por el usuario
    @Operation(
        summary = "Obtener solicitudes enviadas",
        description = "Devuelve todas las solicitudes enviadas por el usuario autenticado"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Solicitudes obtenidas correctamente"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/sent")
    public ResponseEntity<List<ServiceRequestResponse>> getSent() throws UserException {

        // Se obtienen las solicitudes enviadas
        return ResponseEntity.ok(serviceRequestService.getSentRequests());
    }

    // Obtener solicitudes recibidas por el usuario
    @Operation(
        summary = "Obtener solicitudes recibidas",
        description = "Devuelve todas las solicitudes recibidas por el usuario autenticado"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Solicitudes obtenidas correctamente"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/received")
    public ResponseEntity<List<ServiceRequestResponse>> getReceived() throws UserException {

        // Se obtienen las solicitudes recibidas
        return ResponseEntity.ok(serviceRequestService.getReceivedRequests());
    }
}