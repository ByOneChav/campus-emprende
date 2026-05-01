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
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

// Swagger imports
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")

// Agrupa endpoints administrativos
@Tag(
    name = "Administración",
    description = "Endpoints para gestión administrativa del sistema"
)
public class AdminController {

    private final ServiceListingService serviceListingService;
    private final ServiceRequestService serviceRequestService;
    private final ReportService reportService;
    private final UserService userService;
    private final ReviewService reviewService;

    // Dashboard general del sistema
    @Operation(
        summary = "Obtener métricas del dashboard",
        description = "Retorna estadísticas generales del sistema como usuarios, servicios, solicitudes y reportes. Solo accesible para ADMIN"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Dashboard obtenido correctamente"),
        @ApiResponse(responseCode = "403", description = "Acceso denegado"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponse> getDashboard() {

        // Se construye el dashboard con estadísticas generales
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

    // Obtener todos los servicios
    @Operation(
        summary = "Obtener todos los servicios",
        description = "Devuelve todos los servicios registrados en el sistema sin filtro"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Servicios obtenidos correctamente"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/services")
    public ResponseEntity<List<ServiceListingResponse>> getAllServices() {

        // Se obtienen todos los servicios
        return ResponseEntity.ok(serviceListingService.getAllServices());
    }

    // Obtener servicios pendientes
    @Operation(
        summary = "Obtener servicios pendientes",
        description = "Devuelve los servicios que están en estado pendiente de aprobación"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Servicios pendientes obtenidos"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/services/pending")
    public ResponseEntity<List<ServiceListingResponse>> getPendingServices() {

        // Se filtran servicios pendientes
        return ResponseEntity.ok(serviceListingService.getByStatus(ServiceStatus.PENDIENTE));
    }

    // Obtener servicios activos
    @Operation(
        summary = "Obtener servicios activos",
        description = "Devuelve los servicios aprobados y activos en el sistema"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Servicios activos obtenidos"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/services/active")
    public ResponseEntity<List<ServiceListingResponse>> getActiveServices() {

        // Se obtienen servicios aprobados
        return ResponseEntity.ok(serviceListingService.getByStatus(ServiceStatus.APROBADO));
    }

    // Obtener servicios rechazados
    @Operation(
        summary = "Obtener servicios rechazados",
        description = "Devuelve los servicios que han sido rechazados por un administrador"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Servicios rechazados obtenidos"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/services/rejected")
    public ResponseEntity<List<ServiceListingResponse>> getRejectedServices() {

        // Se obtienen servicios rechazados
        return ResponseEntity.ok(serviceListingService.getByStatus(ServiceStatus.RECHAZADO));
    }

    // Aprobar servicio
    @Operation(
        summary = "Aprobar servicio",
        description = "Permite a un administrador aprobar un servicio pendiente"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Servicio aprobado correctamente"),
        @ApiResponse(responseCode = "404", description = "Servicio no encontrado"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PatchMapping("/services/{id}/approve")
    public ResponseEntity<ServiceListingResponse> approveService(@PathVariable Long id) throws UserException {

        // Se aprueba el servicio por ID
        return ResponseEntity.ok(serviceListingService.approveService(id));
    }

    // Rechazar servicio
    @Operation(
        summary = "Rechazar servicio",
        description = "Permite rechazar un servicio indicando el motivo"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Servicio rechazado correctamente"),
        @ApiResponse(responseCode = "404", description = "Servicio no encontrado"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PatchMapping("/services/{id}/reject")
    public ResponseEntity<ServiceListingResponse> rejectService(
            @PathVariable Long id,
            @RequestBody ModerationRequest request) throws UserException {

        // Se rechaza el servicio con una razón
        return ResponseEntity.ok(serviceListingService.rejectService(id, request.getReason()));
    }

    // Obtener todos los usuarios
    @Operation(
        summary = "Obtener todos los usuarios",
        description = "Devuelve todos los usuarios del sistema en formato DTO"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuarios obtenidos correctamente"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() throws UserException {

        // Se convierten entidades a DTO
        return ResponseEntity.ok(UserMapper.toDTOList(userService.getUsers()));
    }

    // Obtener estudiantes destacados
    @Operation(
        summary = "Obtener top estudiantes",
        description = "Devuelve los usuarios con mejor desempeño o actividad"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Top estudiantes obtenidos"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/top-students")
    public ResponseEntity<List<TopStudentResponse>> getTopStudents() {

        // Se obtienen estudiantes destacados
        return ResponseEntity.ok(userService.getTopStudents());
    }

    // Obtener usuarios con rol estudiante
    @Operation(
        summary = "Obtener usuarios estudiantes",
        description = "Devuelve todos los usuarios con rol STUDENT"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuarios estudiantes obtenidos"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/users/students")
    public ResponseEntity<Set<UserDTO>> getStudents() throws UserException {

        // Se filtran usuarios por rol STUDENT
        return ResponseEntity.ok(UserMapper.toDTOSet(userService.getUserByRole(UserRole.ROLE_STUDENT)));
    }

    // Obtener todas las reseñas
    @Operation(
        summary = "Obtener todas las reseñas",
        description = "Devuelve todas las reseñas del sistema"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Reseñas obtenidas correctamente"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/reviews")
    public ResponseEntity<List<ReviewResponse>> getAllReviews() {

        // Se obtienen todas las reseñas
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    // Obtener reseñas positivas
    @Operation(
        summary = "Obtener reseñas positivas",
        description = "Devuelve únicamente las reseñas con calificación positiva"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Reseñas positivas obtenidas"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/reviews/good")
    public ResponseEntity<List<ReviewResponse>> getGoodReviews() {

        // Se filtran reseñas positivas
        return ResponseEntity.ok(reviewService.getGoodReviews());
    }

    // Obtener reseñas negativas
    @Operation(
        summary = "Obtener reseñas negativas",
        description = "Devuelve únicamente las reseñas con calificación negativa"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Reseñas negativas obtenidas"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/reviews/bad")
    public ResponseEntity<List<ReviewResponse>> getBadReviews() {

        // Se filtran reseñas negativas
        return ResponseEntity.ok(reviewService.getBadReviews());
    }
}