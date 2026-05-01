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
    @Operation(summary = "Obtener métricas del dashboard")
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

    // Obtener todos los servicios
    @Operation(summary = "Obtener todos los servicios")
    @GetMapping("/services")
    public ResponseEntity<List<ServiceListingResponse>> getAllServices() {
        return ResponseEntity.ok(serviceListingService.getAllServices());
    }

    // Obtener servicios pendientes
    @Operation(summary = "Obtener servicios pendientes")
    @GetMapping("/services/pending")
    public ResponseEntity<List<ServiceListingResponse>> getPendingServices() {
        return ResponseEntity.ok(serviceListingService.getByStatus(ServiceStatus.PENDIENTE));
    }

    // Obtener servicios activos
    @Operation(summary = "Obtener servicios activos")
    @GetMapping("/services/active")
    public ResponseEntity<List<ServiceListingResponse>> getActiveServices() {
        return ResponseEntity.ok(serviceListingService.getByStatus(ServiceStatus.APROBADO));
    }

    // Obtener servicios rechazados
    @Operation(summary = "Obtener servicios rechazados")
    @GetMapping("/services/rejected")
    public ResponseEntity<List<ServiceListingResponse>> getRejectedServices() {
        return ResponseEntity.ok(serviceListingService.getByStatus(ServiceStatus.RECHAZADO));
    }

    // Aprobar servicio
    @Operation(summary = "Aprobar servicio")
    @PatchMapping("/services/{id}/approve")
    public ResponseEntity<ServiceListingResponse> approveService(@PathVariable Long id) throws UserException {
        return ResponseEntity.ok(serviceListingService.approveService(id));
    }

    // Rechazar servicio
    @Operation(summary = "Rechazar servicio")
    @PatchMapping("/services/{id}/reject")
    public ResponseEntity<ServiceListingResponse> rejectService(
            @PathVariable Long id,
            @RequestBody ModerationRequest request) throws UserException {
        return ResponseEntity.ok(serviceListingService.rejectService(id, request.getReason()));
    }

    // Obtener todos los usuarios
    @Operation(summary = "Obtener todos los usuarios")
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() throws UserException {
        return ResponseEntity.ok(UserMapper.toDTOList(userService.getUsers()));
    }

    // Obtener estudiantes destacados
    @Operation(summary = "Obtener top estudiantes")
    @GetMapping("/top-students")
    public ResponseEntity<List<TopStudentResponse>> getTopStudents() {
        return ResponseEntity.ok(userService.getTopStudents());
    }

    // Obtener usuarios con rol estudiante
    @Operation(summary = "Obtener usuarios estudiantes")
    @GetMapping("/users/students")
    public ResponseEntity<Set<UserDTO>> getStudents() throws UserException {
        return ResponseEntity.ok(UserMapper.toDTOSet(userService.getUserByRole(UserRole.ROLE_STUDENT)));
    }

    // Obtener todas las reseñas
    @Operation(summary = "Obtener todas las reseñas")
    @GetMapping("/reviews")
    public ResponseEntity<List<ReviewResponse>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    // Obtener reseñas positivas
    @Operation(summary = "Obtener reseñas positivas")
    @GetMapping("/reviews/good")
    public ResponseEntity<List<ReviewResponse>> getGoodReviews() {
        return ResponseEntity.ok(reviewService.getGoodReviews());
    }

    // Obtener reseñas negativas
    @Operation(summary = "Obtener reseñas negativas")
    @GetMapping("/reviews/bad")
    public ResponseEntity<List<ReviewResponse>> getBadReviews() {
        return ResponseEntity.ok(reviewService.getBadReviews());
    }
}