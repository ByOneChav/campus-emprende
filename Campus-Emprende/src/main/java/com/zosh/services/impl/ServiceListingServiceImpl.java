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

// 🧠 Implementación de la lógica del módulo ServiceListing
@Service
@RequiredArgsConstructor
public class ServiceListingServiceImpl implements ServiceListingService {

    // 🗄️ Repositorio de servicios
    private final ServiceListingRepository serviceListingRepository;

    // 💬 Repositorio de comentarios (para contar comentarios)
    private final CommentRepository commentRepository;

    // 🔐 Servicio para obtener usuario autenticado (JWT)
    private final UserService userService;

    // 🆕 CREAR SERVICIO
    @Override
    public ServiceListingResponse createService(ServiceListingRequest request) throws UserException {

        // Obtiene usuario logueado
        User provider = userService.getCurrentUser();

        // Construye el servicio
        ServiceListing listing = ServiceListing.builder()
                .provider(provider) // 👤 dueño del servicio
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .imageUrl(request.getImageUrl())
                .status(ServiceStatus.PENDIENTE) // ⏳ requiere aprobación
                .build();

        // Guarda y convierte a DTO
        return ServiceListingMapper.toResponse(serviceListingRepository.save(listing));
    }

    // ✏️ ACTUALIZAR SERVICIO
    @Override
    public ServiceListingResponse updateService(Long id, ServiceListingRequest request) throws UserException {

        // Obtiene servicio y valida que sea del usuario
        ServiceListing listing = getOwnedListing(id);

        // 🚫 No permitir editar si está inactivo
        if (listing.getStatus() == ServiceStatus.INACTIVO) {
            throw new UserException("No se puede editar un servicio inactivo.");
        }

        // 🔄 Actualiza datos
        listing.setTitle(request.getTitle());
        listing.setDescription(request.getDescription());
        listing.setCategory(request.getCategory());
        listing.setImageUrl(request.getImageUrl());

        // ⏳ Vuelve a estado pendiente (revisión nuevamente)
        listing.setStatus(ServiceStatus.PENDIENTE);
        listing.setRejectionReason(null);

        return ServiceListingMapper.toResponse(serviceListingRepository.save(listing));
    }

    // 🚫 DESACTIVAR SERVICIO (soft delete)
    @Override
    public ServiceListingResponse deactivateService(Long id) throws UserException {

        // Valida propiedad del servicio
        ServiceListing listing = getOwnedListing(id);

        // Cambia estado a inactivo
        listing.setStatus(ServiceStatus.INACTIVO);

        return ServiceListingMapper.toResponse(serviceListingRepository.save(listing));
    }

    // 🔍 LISTAR SERVICIOS APROBADOS (públicos)
    @Override
    public List<ServiceListingResponse> browseApproved(String keyword, ServiceCategory category) {

        return serviceListingRepository.searchApproved(category, keyword).stream()

                // 🔄 Convierte cada servicio + agrega cantidad de comentarios
                .map(s -> ServiceListingMapper.toResponse(
                        s,
                        commentRepository.countByServiceId(s.getId())))
                .collect(Collectors.toList());
    }

    // 📄 DETALLE DE SERVICIO
    @Override
    public ServiceListingResponse getServiceDetail(Long id) throws UserException {

        // Busca servicio
        ServiceListing s = findById(id);

        // Devuelve con cantidad de comentarios
        return ServiceListingMapper.toResponse(
                s,
                commentRepository.countByServiceId(s.getId()));
    }

    // 👤 SERVICIOS DEL USUARIO AUTENTICADO
    @Override
    public List<ServiceListingResponse> getMyServices() throws UserException {

        // Usuario actual
        User provider = userService.getCurrentUser();

        // Busca servicios por usuario
        return ServiceListingMapper.toResponseList(
                serviceListingRepository.findByProviderId(provider.getId()));
    }

    // 👑 ADMIN: OBTENER TODOS
    @Override
    public List<ServiceListingResponse> getAllServices() {

        return ServiceListingMapper.toResponseList(serviceListingRepository.findAll());
    }

    // 👑 ADMIN: FILTRAR POR ESTADO
    @Override
    public List<ServiceListingResponse> getByStatus(ServiceStatus status) {

        return ServiceListingMapper.toResponseList(
                serviceListingRepository.findByStatus(status));
    }

    // 👑 ADMIN: APROBAR SERVICIO
    @Override
    public ServiceListingResponse approveService(Long id) throws UserException {

        ServiceListing listing = findById(id);

        listing.setStatus(ServiceStatus.APROBADO); // ✅ aprobado
        listing.setRejectionReason(null);

        return ServiceListingMapper.toResponse(serviceListingRepository.save(listing));
    }

    // 👑 ADMIN: RECHAZAR SERVICIO
    @Override
    public ServiceListingResponse rejectService(Long id, String reason) throws UserException {

        ServiceListing listing = findById(id);

        listing.setStatus(ServiceStatus.RECHAZADO); // ❌ rechazado
        listing.setRejectionReason(reason);

        return ServiceListingMapper.toResponse(serviceListingRepository.save(listing));
    }

    // 📊 CONTAR POR ESTADO
    @Override
    public long countByStatus(ServiceStatus status) {

        return serviceListingRepository.countByStatus(status);
    }

    // 🔍 MÉTODO PRIVADO: buscar por ID
    private ServiceListing findById(Long id) throws UserException {

        return serviceListingRepository.findById(id)
                .orElseThrow(() -> new UserException("Servicio no encontrado con ID " + id));
    }

    // 🔐 MÉTODO PRIVADO: validar propietario
    private ServiceListing getOwnedListing(Long id) throws UserException {

        User current = userService.getCurrentUser();

        ServiceListing listing = findById(id);

        // 🚫 Validación de seguridad (ownership)
        if (!listing.getProvider().getId().equals(current.getId())) {
            throw new UserException("Usted no es el propietario de este servicio.");
        }

        return listing;
    }
}