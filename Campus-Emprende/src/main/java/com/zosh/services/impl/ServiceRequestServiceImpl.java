package com.zosh.services.impl;

import com.zosh.domain.CancelledBy;
import com.zosh.domain.RequestStatus;
import com.zosh.domain.ServiceStatus;
import com.zosh.exception.UserException;
import com.zosh.mapper.ServiceRequestMapper;
import com.zosh.model.ServiceListing;
import com.zosh.model.ServiceRequest;
import com.zosh.model.User;
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

    // 🗄️ Repositorio de solicitudes
    private final ServiceRequestRepository serviceRequestRepository;

    // 🗄️ Repositorio de servicios (para validar estado y proveedor)
    private final ServiceListingRepository serviceListingRepository;

    // 🔐 Servicio para obtener usuario autenticado (JWT)
    private final UserService userService;

    // 🆕 ENVIAR SOLICITUD (cliente → proveedor)
    @Override
    public ServiceRequestResponse sendRequest(ServiceRequestCreate request) throws UserException {

        // 👤 Usuario actual (cliente)
        User client = userService.getCurrentUser();

        // 🔍 Busca el servicio solicitado
        ServiceListing service = serviceListingRepository.findById(request.getServiceId())
                .orElseThrow(() -> new UserException("Servicio no encontrado"));

        // 🚫 Validación: solo servicios aprobados pueden solicitarse
        if (service.getStatus() != ServiceStatus.APROBADO) {
            throw new UserException("No se puede solicitar un servicio que no esté aprobado.");
        }

        // 🚫 Validación: no puedes solicitar tu propio servicio
        if (service.getProvider().getId().equals(client.getId())) {
            throw new UserException("No puedes solicitar tu propio servicio.");
        }

        // 🧱 Construye la solicitud
        ServiceRequest sr = ServiceRequest.builder()
                .service(service)
                .client(client)
                .message(request.getMessage())
                .status(RequestStatus.PENDIENTE) // ⏳ estado inicial
                .build();

        return ServiceRequestMapper.toResponse(serviceRequestRepository.save(sr));
    }

    // ✅ ACEPTAR SOLICITUD (proveedor)
    @Override
    public ServiceRequestResponse accept(Long id) throws UserException {

        ServiceRequest sr = getAsProvider(id); // 🔐 valida proveedor
        requireStatus(sr, RequestStatus.PENDIENTE); // 📌 solo si está pendiente

        sr.setStatus(RequestStatus.ACEPTADO);

        return ServiceRequestMapper.toResponse(serviceRequestRepository.save(sr));
    }

    // ❌ RECHAZAR SOLICITUD (proveedor)
    @Override
    public ServiceRequestResponse decline(Long id) throws UserException {

        ServiceRequest sr = getAsProvider(id);
        requireStatus(sr, RequestStatus.PENDIENTE);

        sr.setStatus(RequestStatus.CANCELADO);
        sr.setCancelledBy(CancelledBy.PROVIDER); // 👑 quién cancela

        return ServiceRequestMapper.toResponse(serviceRequestRepository.save(sr));
    }

    // 🚀 INICIAR SERVICIO
    @Override
    public ServiceRequestResponse markInProgress(Long id) throws UserException {

        ServiceRequest sr = getAsProvider(id);
        requireStatus(sr, RequestStatus.ACEPTADO);

        sr.setStatus(RequestStatus.EN_CURSO);

        return ServiceRequestMapper.toResponse(serviceRequestRepository.save(sr));
    }

    // 🏁 COMPLETAR SERVICIO (proveedor)
    @Override
    public ServiceRequestResponse markCompleted(Long id) throws UserException {

        ServiceRequest sr = getAsProvider(id);
        requireStatus(sr, RequestStatus.EN_CURSO);

        sr.setStatus(RequestStatus.COMPLETADO);

        return ServiceRequestMapper.toResponse(serviceRequestRepository.save(sr));
    }

    // ✔ CONFIRMAR FINALIZACIÓN (cliente)
    @Override
    public ServiceRequestResponse confirmCompletion(Long id) throws UserException {

        ServiceRequest sr = getAsClient(id); // 🔐 valida cliente
        requireStatus(sr, RequestStatus.COMPLETADO);

        // 🚫 evitar doble confirmación
        if (sr.getCompletedAt() != null) {
            throw new UserException("Finalización ya confirmada");
        }

        sr.setCompletedAt(LocalDateTime.now()); // ⏱ marca finalización

        return ServiceRequestMapper.toResponse(serviceRequestRepository.save(sr));
    }

    // 🚫 CANCELAR SOLICITUD (cliente o proveedor)
    @Override
    public ServiceRequestResponse cancel(Long id) throws UserException {

        User current = userService.getCurrentUser();
        ServiceRequest sr = findById(id);

        // 🔐 verificar si es cliente o proveedor
        boolean isClient = sr.getClient().getId().equals(current.getId());
        boolean isProvider = sr.getService().getProvider().getId().equals(current.getId());

        // 🚫 no autorizado
        if (!isClient && !isProvider) {
            throw new UserException("No estoy autorizado a cancelar esta solicitud.");
        }

        // 🚫 no cancelar estados finales
        if (sr.getStatus() == RequestStatus.COMPLETADO || sr.getStatus() == RequestStatus.CANCELADO) {
            throw new UserException("No se puede cancelar una solicitud en estado " + sr.getStatus());
        }

        sr.setStatus(RequestStatus.CANCELADO);

        // 👤 define quién canceló
        sr.setCancelledBy(isClient ? CancelledBy.CLIENT : CancelledBy.PROVIDER);

        return ServiceRequestMapper.toResponse(serviceRequestRepository.save(sr));
    }

    // 📤 SOLICITUDES ENVIADAS (cliente)
    @Override
    public List<ServiceRequestResponse> getSentRequests() throws UserException {

        User client = userService.getCurrentUser();

        return ServiceRequestMapper.toResponseList(
                serviceRequestRepository.findByClientId(client.getId()));
    }

    // 📥 SOLICITUDES RECIBIDAS (proveedor)
    @Override
    public List<ServiceRequestResponse> getReceivedRequests() throws UserException {

        User provider = userService.getCurrentUser();

        return ServiceRequestMapper.toResponseList(
                serviceRequestRepository.findByServiceProviderId(provider.getId()));
    }

    // 📊 MÉTRICA
    @Override
    public long countAll() {
        return serviceRequestRepository.count();
    }

    // 🔍 Buscar por ID
    private ServiceRequest findById(Long id) throws UserException {
        return serviceRequestRepository.findById(id)
                .orElseThrow(() -> new UserException("Solicitud de servicio no encontrada con ID " + id));
    }

    // 🔐 Validar proveedor
    private ServiceRequest getAsProvider(Long id) throws UserException {

        User current = userService.getCurrentUser();
        ServiceRequest sr = findById(id);

        if (!sr.getService().getProvider().getId().equals(current.getId())) {
            throw new UserException("Solo el proveedor puede realizar esta acción.");
        }

        return sr;
    }

    // 🔐 Validar cliente
    private ServiceRequest getAsClient(Long id) throws UserException {

        User current = userService.getCurrentUser();
        ServiceRequest sr = findById(id);

        if (!sr.getClient().getId().equals(current.getId())) {
            throw new UserException("Solo el cliente puede realizar esta acción.");
        }

        return sr;
    }

    // ⚠️ Validar estado esperado (state machine)
    private void requireStatus(ServiceRequest sr, RequestStatus expected) throws UserException {

        if (sr.getStatus() != expected) {
            throw new UserException("La solicitud debe estar en estado " + expected + " pero es " + sr.getStatus());
        }
    }
}