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
    @Operation(summary = "Enviar solicitud de servicio")
    @PostMapping
    public ResponseEntity<ServiceRequestResponse> sendRequest(
            @RequestBody @Valid ServiceRequestCreate request) throws UserException {
        return ResponseEntity.ok(serviceRequestService.sendRequest(request));
    }

    // Aceptar una solicitud
    @Operation(summary = "Aceptar solicitud")
    @PatchMapping("/{id}/accept")
    public ResponseEntity<ServiceRequestResponse> accept(@PathVariable Long id) throws UserException {
        return ResponseEntity.ok(serviceRequestService.accept(id));
    }

    // Rechazar una solicitud
    @Operation(summary = "Rechazar solicitud")
    @PatchMapping("/{id}/decline")
    public ResponseEntity<ServiceRequestResponse> decline(@PathVariable Long id) throws UserException {
        return ResponseEntity.ok(serviceRequestService.decline(id));
    }

    // Marcar solicitud como en progreso
    @Operation(summary = "Iniciar servicio (en progreso)")
    @PatchMapping("/{id}/start")
    public ResponseEntity<ServiceRequestResponse> start(@PathVariable Long id) throws UserException {
        return ResponseEntity.ok(serviceRequestService.markInProgress(id));
    }

    // Marcar solicitud como completada
    @Operation(summary = "Completar servicio")
    @PatchMapping("/{id}/complete")
    public ResponseEntity<ServiceRequestResponse> complete(@PathVariable Long id) throws UserException {
        return ResponseEntity.ok(serviceRequestService.markCompleted(id));
    }

    // Confirmar finalización del servicio
    @Operation(summary = "Confirmar finalización del servicio")
    @PatchMapping("/{id}/confirm")
    public ResponseEntity<ServiceRequestResponse> confirm(@PathVariable Long id) throws UserException {
        return ResponseEntity.ok(serviceRequestService.confirmCompletion(id));
    }

    // Cancelar solicitud
    @Operation(summary = "Cancelar solicitud")
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<ServiceRequestResponse> cancel(@PathVariable Long id) throws UserException {
        return ResponseEntity.ok(serviceRequestService.cancel(id));
    }

    // Obtener solicitudes enviadas por el usuario
    @Operation(summary = "Obtener solicitudes enviadas")
    @GetMapping("/sent")
    public ResponseEntity<List<ServiceRequestResponse>> getSent() throws UserException {
        return ResponseEntity.ok(serviceRequestService.getSentRequests());
    }

    // Obtener solicitudes recibidas por el usuario
    @Operation(summary = "Obtener solicitudes recibidas")
    @GetMapping("/received")
    public ResponseEntity<List<ServiceRequestResponse>> getReceived() throws UserException {
        return ResponseEntity.ok(serviceRequestService.getReceivedRequests());
    }
}