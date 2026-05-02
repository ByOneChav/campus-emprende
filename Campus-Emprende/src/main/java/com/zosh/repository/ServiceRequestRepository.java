package com.zosh.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zosh.model.ServiceRequest;

import java.util.List;

public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {
    List<ServiceRequest> findByClientId(Long clientId);
    List<ServiceRequest> findByServiceProviderId(Long providerId);
}
