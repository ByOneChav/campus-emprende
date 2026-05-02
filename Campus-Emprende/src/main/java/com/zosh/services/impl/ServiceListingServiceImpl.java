package com.zosh.services.impl;

import com.zosh.domain.ServiceCategory;
import com.zosh.domain.ServiceStatus;
import com.zosh.exception.UserException;
import com.zosh.mapper.ServiceListingMapper;
import com.zosh.model.ServiceListing;
import com.zosh.model.User;
import com.zosh.payload.request.ServiceListingRequest;
import com.zosh.payload.response.ServiceListingResponse;
import com.zosh.repository.CommentRepository;
import com.zosh.repository.ServiceListingRepository;
import com.zosh.services.ServiceListingService;
import com.zosh.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServiceListingServiceImpl implements ServiceListingService {

    private final ServiceListingRepository serviceListingRepository;
    private final CommentRepository commentRepository;
    private final UserService userService;

    @Override
    public ServiceListingResponse createService(ServiceListingRequest request) throws UserException {
        User provider = userService.getCurrentUser();
        ServiceListing listing = ServiceListing.builder()
                .provider(provider)
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .imageUrl(request.getImageUrl())
                .status(ServiceStatus.PENDIENTE)
                .build();
        return ServiceListingMapper.toResponse(serviceListingRepository.save(listing));
    }

    @Override
    public ServiceListingResponse updateService(Long id, ServiceListingRequest request) throws UserException {
        ServiceListing listing = getOwnedListing(id);
        if (listing.getStatus() == ServiceStatus.INACTIVO) {
            throw new UserException("No se puede editar un servicio inactivo.");
        }
        listing.setTitle(request.getTitle());
        listing.setDescription(request.getDescription());
        listing.setCategory(request.getCategory());
        listing.setImageUrl(request.getImageUrl());
        listing.setStatus(ServiceStatus.PENDIENTE);
        listing.setRejectionReason(null);
        return ServiceListingMapper.toResponse(serviceListingRepository.save(listing));
    }

    @Override
    public ServiceListingResponse deactivateService(Long id) throws UserException {
        ServiceListing listing = getOwnedListing(id);
        listing.setStatus(ServiceStatus.INACTIVO);
        return ServiceListingMapper.toResponse(serviceListingRepository.save(listing));
    }

    @Override
    public List<ServiceListingResponse> browseApproved(String keyword, ServiceCategory category) {
        return serviceListingRepository.searchApproved(category, keyword).stream()
                .map(s -> ServiceListingMapper.toResponse(s, commentRepository.countByServiceId(s.getId())))
                .collect(Collectors.toList());
    }

    @Override
    public ServiceListingResponse getServiceDetail(Long id) throws UserException {
        ServiceListing s = findById(id);
        return ServiceListingMapper.toResponse(s, commentRepository.countByServiceId(s.getId()));
    }

    @Override
    public List<ServiceListingResponse> getMyServices() throws UserException {
        User provider = userService.getCurrentUser();
        return ServiceListingMapper.toResponseList(
                serviceListingRepository.findByProviderId(provider.getId()));
    }

    @Override
    public List<ServiceListingResponse> getAllServices() {
        return ServiceListingMapper.toResponseList(serviceListingRepository.findAll());
    }

    @Override
    public List<ServiceListingResponse> getByStatus(ServiceStatus status) {
        return ServiceListingMapper.toResponseList(serviceListingRepository.findByStatus(status));
    }

    @Override
    public ServiceListingResponse approveService(Long id) throws UserException {
        ServiceListing listing = findById(id);
        listing.setStatus(ServiceStatus.APROBADO);
        listing.setRejectionReason(null);
        return ServiceListingMapper.toResponse(serviceListingRepository.save(listing));
    }

    @Override
    public ServiceListingResponse rejectService(Long id, String reason) throws UserException {
        ServiceListing listing = findById(id);
        listing.setStatus(ServiceStatus.RECHAZADO);
        listing.setRejectionReason(reason);
        return ServiceListingMapper.toResponse(serviceListingRepository.save(listing));
    }

    @Override
    public long countByStatus(ServiceStatus status) {
        return serviceListingRepository.countByStatus(status);
    }

    private ServiceListing findById(Long id) throws UserException {
        return serviceListingRepository.findById(id)
                .orElseThrow(() -> new UserException("Servicio no encontrado con ID " + id));
    }

    private ServiceListing getOwnedListing(Long id) throws UserException {
        User current = userService.getCurrentUser();
        ServiceListing listing = findById(id);
        if (!listing.getProvider().getId().equals(current.getId())) {
            throw new UserException("Usted no es el propietario de este servicio.");
        }
        return listing;
    }
}
