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

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class ServiceRequestController {

    private final ServiceRequestService serviceRequestService;

    @PostMapping
    public ResponseEntity<ServiceRequestResponse> sendRequest(
            @RequestBody @Valid ServiceRequestCreate request) throws UserException {
        return ResponseEntity.ok(serviceRequestService.sendRequest(request));
    }

    @PatchMapping("/{id}/accept")
    public ResponseEntity<ServiceRequestResponse> accept(@PathVariable Long id) throws UserException {
        return ResponseEntity.ok(serviceRequestService.accept(id));
    }

    @PatchMapping("/{id}/decline")
    public ResponseEntity<ServiceRequestResponse> decline(@PathVariable Long id) throws UserException {
        return ResponseEntity.ok(serviceRequestService.decline(id));
    }

    @PatchMapping("/{id}/start")
    public ResponseEntity<ServiceRequestResponse> start(@PathVariable Long id) throws UserException {
        return ResponseEntity.ok(serviceRequestService.markInProgress(id));
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<ServiceRequestResponse> complete(@PathVariable Long id) throws UserException {
        return ResponseEntity.ok(serviceRequestService.markCompleted(id));
    }

    @PatchMapping("/{id}/confirm")
    public ResponseEntity<ServiceRequestResponse> confirm(@PathVariable Long id) throws UserException {
        return ResponseEntity.ok(serviceRequestService.confirmCompletion(id));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<ServiceRequestResponse> cancel(@PathVariable Long id) throws UserException {
        return ResponseEntity.ok(serviceRequestService.cancel(id));
    }

    @GetMapping("/sent")
    public ResponseEntity<List<ServiceRequestResponse>> getSent() throws UserException {
        return ResponseEntity.ok(serviceRequestService.getSentRequests());
    }

    @GetMapping("/received")
    public ResponseEntity<List<ServiceRequestResponse>> getReceived() throws UserException {
        return ResponseEntity.ok(serviceRequestService.getReceivedRequests());
    }
}
