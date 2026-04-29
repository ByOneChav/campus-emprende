package com.zosh.services;

import com.zosh.domain.ServiceCategory;
import com.zosh.domain.ServiceStatus;
import com.zosh.exception.UserException;
import com.zosh.payload.request.ServiceListingRequest;
import com.zosh.payload.response.ServiceListingResponse;

import java.util.List;

public interface ServiceListingService {
    ServiceListingResponse createService(ServiceListingRequest request) throws UserException;
    ServiceListingResponse updateService(Long id, ServiceListingRequest request) throws UserException;
    ServiceListingResponse deactivateService(Long id) throws UserException;
    List<ServiceListingResponse> browseApproved(String keyword, ServiceCategory category);
    ServiceListingResponse getServiceDetail(Long id) throws UserException;
    List<ServiceListingResponse> getMyServices() throws UserException;

    // used by admin group
    List<ServiceListingResponse> getAllServices();
    List<ServiceListingResponse> getByStatus(ServiceStatus status);
    ServiceListingResponse approveService(Long id) throws UserException;
    ServiceListingResponse rejectService(Long id, String reason) throws UserException;
    long countByStatus(ServiceStatus status);
}
