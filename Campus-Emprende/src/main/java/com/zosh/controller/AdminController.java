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

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final ServiceListingService serviceListingService;
    private final ServiceRequestService serviceRequestService;
    private final ReportService reportService;
    private final UserService userService;
    private final ReviewService reviewService;

    // ── Dashboard ────────────────────────────────────────────────────────────

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponse> getDashboard() {
        DashboardResponse dashboard = DashboardResponse.builder()
                .totalUsers(userService.getTotalUserCount())
                .pendingServices(serviceListingService.countByStatus(ServiceStatus.PENDING))
                .approvedServices(serviceListingService.countByStatus(ServiceStatus.APPROVED))
                .rejectedServices(serviceListingService.countByStatus(ServiceStatus.REJECTED))
                .inactiveServices(serviceListingService.countByStatus(ServiceStatus.INACTIVE))
                .totalRequests(serviceRequestService.countAll())
                .pendingReports(reportService.countPending())
                .build();
        return ResponseEntity.ok(dashboard);
    }

    // ── Services ─────────────────────────────────────────────────────────────

    @GetMapping("/services")
    public ResponseEntity<List<ServiceListingResponse>> getAllServices() {
        return ResponseEntity.ok(serviceListingService.getAllServices());
    }

    @GetMapping("/services/pending")
    public ResponseEntity<List<ServiceListingResponse>> getPendingServices() {
        return ResponseEntity.ok(serviceListingService.getByStatus(ServiceStatus.PENDING));
    }

    @GetMapping("/services/active")
    public ResponseEntity<List<ServiceListingResponse>> getActiveServices() {
        return ResponseEntity.ok(serviceListingService.getByStatus(ServiceStatus.APPROVED));
    }

    @GetMapping("/services/rejected")
    public ResponseEntity<List<ServiceListingResponse>> getRejectedServices() {
        return ResponseEntity.ok(serviceListingService.getByStatus(ServiceStatus.REJECTED));
    }

    @PatchMapping("/services/{id}/approve")
    public ResponseEntity<ServiceListingResponse> approveService(@PathVariable Long id) throws UserException {
        return ResponseEntity.ok(serviceListingService.approveService(id));
    }

    @PatchMapping("/services/{id}/reject")
    public ResponseEntity<ServiceListingResponse> rejectService(
            @PathVariable Long id,
            @RequestBody ModerationRequest request) throws UserException {
        return ResponseEntity.ok(serviceListingService.rejectService(id, request.getReason()));
    }

    // ── Users ─────────────────────────────────────────────────────────────────

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() throws UserException {
        return ResponseEntity.ok(UserMapper.toDTOList(userService.getUsers()));
    }

    @GetMapping("/top-students")
    public ResponseEntity<List<TopStudentResponse>> getTopStudents() {
        return ResponseEntity.ok(userService.getTopStudents());
    }

    @GetMapping("/users/students")
    public ResponseEntity<Set<UserDTO>> getStudents() throws UserException {
        return ResponseEntity.ok(UserMapper.toDTOSet(userService.getUserByRole(UserRole.ROLE_STUDENT)));
    }

    // ── Reviews ───────────────────────────────────────────────────────────────

    @GetMapping("/reviews")
    public ResponseEntity<List<ReviewResponse>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    @GetMapping("/reviews/good")
    public ResponseEntity<List<ReviewResponse>> getGoodReviews() {
        return ResponseEntity.ok(reviewService.getGoodReviews());
    }

    @GetMapping("/reviews/bad")
    public ResponseEntity<List<ReviewResponse>> getBadReviews() {
        return ResponseEntity.ok(reviewService.getBadReviews());
    }
}
