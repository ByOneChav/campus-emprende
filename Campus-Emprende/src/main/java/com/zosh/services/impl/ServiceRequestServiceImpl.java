package com.zosh.services.impl;

import com.zosh.domain.CancelledBy;
import com.zosh.domain.RequestStatus;
import com.zosh.domain.ServiceStatus;
import com.zosh.exception.UserException;
import com.zosh.mapper.ServiceRequestMapper;
import com.zosh.modal.ServiceListing;
import com.zosh.modal.ServiceRequest;
import com.zosh.modal.User;
import com.zosh.payload.request.ServiceRequestCreate;
import com.zosh.payload.response.ServiceRequestResponse;
import com.zosh.repository.ServiceListingRepository;
import com.zosh.repository.ServiceRequestRepository;
import com.zosh.services.ServiceRequestService;
import com.zosh.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ServiceRequestServiceImpl implements ServiceRequestService {

    private final ServiceRequestRepository serviceRequestRepository;
    private final ServiceListingRepository serviceListingRepository;
    private final UserService userService;

    @Override
    public ServiceRequestResponse sendRequest(ServiceRequestCreate request) throws UserException {
        User client = userService.getCurrentUser();
        ServiceListing service = serviceListingRepository.findById(request.getServiceId())
                .orElseThrow(() -> new UserException("Service not found"));

        if (service.getStatus() != ServiceStatus.APPROVED) {
            throw new UserException("Cannot request a service that is not approved");
        }
        if (service.getProvider().getId().equals(client.getId())) {
            throw new UserException("You cannot request your own service");
        }

        ServiceRequest sr = ServiceRequest.builder()
                .service(service)
                .client(client)
                .message(request.getMessage())
                .status(RequestStatus.PENDING)
                .build();
        return ServiceRequestMapper.toResponse(serviceRequestRepository.save(sr));
    }

    @Override
    public ServiceRequestResponse accept(Long id) throws UserException {
        ServiceRequest sr = getAsProvider(id);
        requireStatus(sr, RequestStatus.PENDING);
        sr.setStatus(RequestStatus.ACCEPTED);
        return ServiceRequestMapper.toResponse(serviceRequestRepository.save(sr));
    }

    @Override
    public ServiceRequestResponse decline(Long id) throws UserException {
        ServiceRequest sr = getAsProvider(id);
        requireStatus(sr, RequestStatus.PENDING);
        sr.setStatus(RequestStatus.CANCELLED);
        sr.setCancelledBy(CancelledBy.PROVIDER);
        return ServiceRequestMapper.toResponse(serviceRequestRepository.save(sr));
    }

    @Override
    public ServiceRequestResponse markInProgress(Long id) throws UserException {
        ServiceRequest sr = getAsProvider(id);
        requireStatus(sr, RequestStatus.ACCEPTED);
        sr.setStatus(RequestStatus.IN_PROGRESS);
        return ServiceRequestMapper.toResponse(serviceRequestRepository.save(sr));
    }

    @Override
    public ServiceRequestResponse markCompleted(Long id) throws UserException {
        ServiceRequest sr = getAsProvider(id);
        requireStatus(sr, RequestStatus.IN_PROGRESS);
        sr.setStatus(RequestStatus.COMPLETED);
        return ServiceRequestMapper.toResponse(serviceRequestRepository.save(sr));
    }

    @Override
    public ServiceRequestResponse confirmCompletion(Long id) throws UserException {
        ServiceRequest sr = getAsClient(id);
        requireStatus(sr, RequestStatus.COMPLETED);
        if (sr.getCompletedAt() != null) {
            throw new UserException("Completion already confirmed");
        }
        sr.setCompletedAt(LocalDateTime.now());
        return ServiceRequestMapper.toResponse(serviceRequestRepository.save(sr));
    }

    @Override
    public ServiceRequestResponse cancel(Long id) throws UserException {
        User current = userService.getCurrentUser();
        ServiceRequest sr = findById(id);

        boolean isClient = sr.getClient().getId().equals(current.getId());
        boolean isProvider = sr.getService().getProvider().getId().equals(current.getId());

        if (!isClient && !isProvider) {
            throw new UserException("Not authorized to cancel this request");
        }
        if (sr.getStatus() == RequestStatus.COMPLETED || sr.getStatus() == RequestStatus.CANCELLED) {
            throw new UserException("Cannot cancel a request in status " + sr.getStatus());
        }

        sr.setStatus(RequestStatus.CANCELLED);
        sr.setCancelledBy(isClient ? CancelledBy.CLIENT : CancelledBy.PROVIDER);
        return ServiceRequestMapper.toResponse(serviceRequestRepository.save(sr));
    }

    @Override
    public List<ServiceRequestResponse> getSentRequests() throws UserException {
        User client = userService.getCurrentUser();
        return ServiceRequestMapper.toResponseList(
                serviceRequestRepository.findByClientId(client.getId()));
    }

    @Override
    public List<ServiceRequestResponse> getReceivedRequests() throws UserException {
        User provider = userService.getCurrentUser();
        return ServiceRequestMapper.toResponseList(
                serviceRequestRepository.findByServiceProviderId(provider.getId()));
    }

    @Override
    public long countAll() {
        return serviceRequestRepository.count();
    }

    private ServiceRequest findById(Long id) throws UserException {
        return serviceRequestRepository.findById(id)
                .orElseThrow(() -> new UserException("Service request not found with id " + id));
    }

    private ServiceRequest getAsProvider(Long id) throws UserException {
        User current = userService.getCurrentUser();
        ServiceRequest sr = findById(id);
        if (!sr.getService().getProvider().getId().equals(current.getId())) {
            throw new UserException("Only the provider can perform this action");
        }
        return sr;
    }

    private ServiceRequest getAsClient(Long id) throws UserException {
        User current = userService.getCurrentUser();
        ServiceRequest sr = findById(id);
        if (!sr.getClient().getId().equals(current.getId())) {
            throw new UserException("Only the client can perform this action");
        }
        return sr;
    }

    private void requireStatus(ServiceRequest sr, RequestStatus expected) throws UserException {
        if (sr.getStatus() != expected) {
            throw new UserException("Request must be in status " + expected + " but is " + sr.getStatus());
        }
    }
}
