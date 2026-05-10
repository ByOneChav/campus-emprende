package com.zosh.controller;

import com.zosh.domain.ServiceStatus;
import com.zosh.domain.UserRole;
import com.zosh.exception.UserException;
import com.zosh.mapper.UserMapper;
import com.zosh.payload.request.ModerationRequest;
import com.zosh.payload.response.DashboardResponse;
import com.zosh.payload.response.ReviewResponse;
import com.zosh.payload.response.ServiceListingResponse;
import com.zosh.payload.response.TopStudentResponse;
import com.zosh.payload.response.UserDTO;
import com.zosh.services.ReportService;
import com.zosh.services.ReviewService;
import com.zosh.services.ServiceListingService;
import com.zosh.services.ServiceRequestService;
import com.zosh.services.UserService;
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
import java.util.Set;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Administracion", description = "Endpoints para gestion administrativa del sistema")
public class AdminController {

    private final ServiceListingService serviceListingService;
    private final ServiceRequestService serviceRequestService;
    private final ReportService reportService;
    private final UserService userService;
    private final ReviewService reviewService;

    @Operation(
            summary = "Obtener metricas del dashboard",
            description = "Retorna estadisticas generales del sistema como usuarios, servicios, solicitudes y reportes. Solo accesible para ADMIN"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Dashboard obtenido correctamente"),
            @ApiResponse(responseCode = "403", description = "Acceso denegado"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponse> getDashboard() {
        DashboardResponse dashboard = DashboardResponse.builder()
                .totalUsers(userService.getTotalUserCount())
                .pendingServices(serviceListingService.countByStatus(ServiceStatus.PENDIENTE))
                .approvedServices(serviceListingService.countByStatus(ServiceStatus.APROBADO))
                .rejectedServices(serviceListingService.countByStatus(ServiceStatus.RECHAZADO))
                .inactiveServices(serviceListingService.countByStatus(ServiceStatus.INACTIVO))
                .totalRequests(serviceRequestService.countAll())
                .pendingReports(reportService.countPending())
                .build();

        return ResponseEntity.ok(dashboard);
    }

    @Operation(summary = "Obtener todos los servicios", description = "Devuelve todos los servicios registrados en el sistema sin filtro")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Servicios obtenidos correctamente"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/services")
    public ResponseEntity<List<ServiceListingResponse>> getAllServices() {
        return ResponseEntity.ok(serviceListingService.getAllServices());
    }

    @Operation(summary = "Obtener servicios pendientes", description = "Devuelve los servicios que estan en estado pendiente de aprobacion")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Servicios pendientes obtenidos"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/services/pending")
    public ResponseEntity<List<ServiceListingResponse>> getPendingServices() {
        return ResponseEntity.ok(serviceListingService.getByStatus(ServiceStatus.PENDIENTE));
    }

    @Operation(summary = "Obtener servicios activos", description = "Devuelve los servicios aprobados y activos en el sistema")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Servicios activos obtenidos"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/services/active")
    public ResponseEntity<List<ServiceListingResponse>> getActiveServices() {
        return ResponseEntity.ok(serviceListingService.getByStatus(ServiceStatus.APROBADO));
    }

    @Operation(summary = "Obtener servicios rechazados", description = "Devuelve los servicios que han sido rechazados por un administrador")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Servicios rechazados obtenidos"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/services/rejected")
    public ResponseEntity<List<ServiceListingResponse>> getRejectedServices() {
        return ResponseEntity.ok(serviceListingService.getByStatus(ServiceStatus.RECHAZADO));
    }

    @Operation(summary = "Aprobar servicio", description = "Permite a un administrador aprobar un servicio pendiente")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Servicio aprobado correctamente"),
            @ApiResponse(responseCode = "404", description = "Servicio no encontrado"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PatchMapping("/services/{id}/approve")
    public ResponseEntity<ServiceListingResponse> approveService(@PathVariable Long id) throws UserException {
        return ResponseEntity.ok(serviceListingService.approveService(id));
    }

    @Operation(summary = "Rechazar servicio", description = "Permite rechazar un servicio indicando el motivo")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Servicio rechazado correctamente"),
            @ApiResponse(responseCode = "404", description = "Servicio no encontrado"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PatchMapping("/services/{id}/reject")
    public ResponseEntity<ServiceListingResponse> rejectService(
            @PathVariable Long id,
            @Valid @RequestBody ModerationRequest request
    ) throws UserException {
        return ResponseEntity.ok(serviceListingService.rejectService(id, request.getReason()));
    }

    @Operation(summary = "Obtener todos los usuarios", description = "Devuelve todos los usuarios del sistema en formato DTO")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuarios obtenidos correctamente"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() throws UserException {
        return ResponseEntity.ok(UserMapper.toDTOList(userService.getUsers()));
    }

    @Operation(summary = "Obtener top estudiantes", description = "Devuelve los usuarios con mejor desempeno o actividad")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Top estudiantes obtenidos"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/top-students")
    public ResponseEntity<List<TopStudentResponse>> getTopStudents() {
        return ResponseEntity.ok(userService.getTopStudents());
    }

    @Operation(summary = "Obtener usuarios estudiantes", description = "Devuelve todos los usuarios con rol STUDENT")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuarios estudiantes obtenidos"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/users/students")
    public ResponseEntity<Set<UserDTO>> getStudents() throws UserException {
        return ResponseEntity.ok(UserMapper.toDTOSet(userService.getUserByRole(UserRole.ROLE_STUDENT)));
    }

    @Operation(summary = "Obtener todas las resenas", description = "Devuelve todas las resenas del sistema")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Resenas obtenidas correctamente"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/reviews")
    public ResponseEntity<List<ReviewResponse>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    @Operation(summary = "Obtener resenas positivas", description = "Devuelve unicamente las resenas con calificacion positiva")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Resenas positivas obtenidas"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/reviews/good")
    public ResponseEntity<List<ReviewResponse>> getGoodReviews() {
        return ResponseEntity.ok(reviewService.getGoodReviews());
    }

    @Operation(summary = "Obtener resenas negativas", description = "Devuelve unicamente las resenas con calificacion negativa")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Resenas negativas obtenidas"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/reviews/bad")
    public ResponseEntity<List<ReviewResponse>> getBadReviews() {
        return ResponseEntity.ok(reviewService.getBadReviews());
    }
}
