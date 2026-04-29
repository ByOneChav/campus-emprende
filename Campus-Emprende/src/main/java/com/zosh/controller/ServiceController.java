package com.zosh.controller;

import com.zosh.domain.ServiceCategory;
import com.zosh.exception.UserException;
import com.zosh.payload.request.ServiceListingRequest;
import com.zosh.payload.response.ServiceListingResponse;
import com.zosh.services.ServiceListingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ServiceController {

    private final ServiceListingService serviceListingService;

    @PostMapping("/api/services")
    public ResponseEntity<ServiceListingResponse> createService(
            @RequestBody @Valid ServiceListingRequest request) throws UserException {
        return ResponseEntity.ok(serviceListingService.createService(request));
    }

    @PutMapping("/api/services/{id}")
    public ResponseEntity<ServiceListingResponse> updateService(
            @PathVariable Long id,
            @RequestBody @Valid ServiceListingRequest request) throws UserException {
        return ResponseEntity.ok(serviceListingService.updateService(id, request));
    }

    @PatchMapping("/api/services/{id}/deactivate")
    public ResponseEntity<ServiceListingResponse> deactivateService(@PathVariable Long id) throws UserException {
        return ResponseEntity.ok(serviceListingService.deactivateService(id));
    }

    @GetMapping("/services")
    public ResponseEntity<List<ServiceListingResponse>> browseServices(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) ServiceCategory category) {
        return ResponseEntity.ok(serviceListingService.browseApproved(keyword, category));
    }

    @GetMapping("/services/{id}")
    public ResponseEntity<ServiceListingResponse> getServiceDetail(@PathVariable Long id) throws UserException {
        return ResponseEntity.ok(serviceListingService.getServiceDetail(id));
    }

    @GetMapping("/api/services/my")
    public ResponseEntity<List<ServiceListingResponse>> getMyServices() throws UserException {
        return ResponseEntity.ok(serviceListingService.getMyServices());
    }
}
