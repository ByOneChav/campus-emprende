package com.zosh.Tests;

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
import com.zosh.services.UserService;
import com.zosh.services.impl.ServiceRequestServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

// 🧪 Pruebas unitarias para ServiceRequestServiceImpl
// Cubre el ciclo de vida completo de una solicitud de servicio:
// PENDIENTE -> ACEPTADO -> EN_CURSO -> COMPLETADO, además de RECHAZADO/CANCELADO.
@ExtendWith(MockitoExtension.class)
class ServiceRequestServiceImplTest {

    // 🔗 Repositorio de solicitudes (mockeado)
    @Mock
    private ServiceRequestRepository serviceRequestRepository;

    // 🔗 Repositorio de servicios (mockeado, valida estado y proveedor)
    @Mock
    private ServiceListingRepository serviceListingRepository;

    // 🔐 Servicio de usuario (mockeado, simula al usuario autenticado por JWT)
    @Mock
    private UserService userService;

    // 🧩 Clase real que se está probando
    @InjectMocks
    private ServiceRequestServiceImpl serviceRequestService;

    // =====================================================
    // 🧱 Helpers para construir objetos de prueba
    // =====================================================

    // 👤 Crea un usuario simple solo con ID
    private User buildUser(Long id) {
        User user = new User();
        user.setId(id);
        return user;
    }

    // 🛠️ Crea un servicio (ServiceListing) con estado y proveedor
    private ServiceListing buildServiceListing(Long id, ServiceStatus status, User provider) {
        ServiceListing service = new ServiceListing();
        service.setId(id);
        service.setStatus(status);
        service.setProvider(provider);
        return service;
    }

    // 📄 Crea una solicitud de servicio (ServiceRequest) con estado inicial
    private ServiceRequest buildServiceRequest(Long id, ServiceListing service, User client, RequestStatus status) {
        ServiceRequest sr = ServiceRequest.builder()
                .service(service)
                .client(client)
                .status(status)
                .build();
        sr.setId(id);
        return sr;
    }

    // =====================================================
    // 🆕 sendRequest() — Enviar solicitud (cliente -> proveedor)
    // =====================================================

    // 🧪 Crea la solicitud correctamente cuando el servicio existe, está aprobado y no es propio
    @Test
    void sendRequest_success() throws UserException {
        User client = buildUser(1L);
        User provider = buildUser(2L);
        ServiceListing service = buildServiceListing(10L, ServiceStatus.APROBADO, provider);

        ServiceRequestCreate request = new ServiceRequestCreate();
        request.setServiceId(10L);
        request.setMessage("Necesito este servicio");

        // 💾 Solicitud que "guardaría" el repositorio
        ServiceRequest savedRequest = ServiceRequest.builder()
                .service(service)
                .client(client)
                .message(request.getMessage())
                .status(RequestStatus.PENDIENTE)
                .build();

        // 🎯 Respuesta esperada del mapper
        ServiceRequestResponse expectedResponse = new ServiceRequestResponse();
        expectedResponse.setStatus(RequestStatus.PENDIENTE);

        when(userService.getCurrentUser()).thenReturn(client);
        when(serviceListingRepository.findById(10L)).thenReturn(Optional.of(service));
        when(serviceRequestRepository.save(any(ServiceRequest.class))).thenReturn(savedRequest);

        try (MockedStatic<ServiceRequestMapper> mockedMapper = mockStatic(ServiceRequestMapper.class)) {
            mockedMapper.when(() -> ServiceRequestMapper.toResponse(savedRequest))
                    .thenReturn(expectedResponse);

            ServiceRequestResponse result = serviceRequestService.sendRequest(request);

            assertNotNull(result);
            assertEquals(RequestStatus.PENDIENTE, result.getStatus());
        }

        verify(serviceRequestRepository).save(any(ServiceRequest.class));
    }

    // 🧪 Lanza UserException si el servicio solicitado no existe
    @Test
    void sendRequest_serviceNotFound() throws UserException {
        User client = buildUser(1L);

        ServiceRequestCreate request = new ServiceRequestCreate();
        request.setServiceId(99L);

        when(userService.getCurrentUser()).thenReturn(client);
        when(serviceListingRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(UserException.class, () -> serviceRequestService.sendRequest(request));

        verify(serviceRequestRepository, never()).save(any(ServiceRequest.class));
    }

    // 🧪 Lanza UserException si el servicio aún no está APROBADO
    // ⚠️ Nota: se asume que ServiceStatus tiene un valor "PENDIENTE" además de "APROBADO".
    // Si tu enum usa otro nombre (ej. RECHAZADO), ajusta esta línea.
    @Test
    void sendRequest_serviceNotApproved() throws UserException {
        User client = buildUser(1L);
        User provider = buildUser(2L);
        ServiceListing service = buildServiceListing(10L, ServiceStatus.PENDIENTE, provider);

        ServiceRequestCreate request = new ServiceRequestCreate();
        request.setServiceId(10L);

        when(userService.getCurrentUser()).thenReturn(client);
        when(serviceListingRepository.findById(10L)).thenReturn(Optional.of(service));

        assertThrows(UserException.class, () -> serviceRequestService.sendRequest(request));

        verify(serviceRequestRepository, never()).save(any(ServiceRequest.class));
    }

    // 🧪 Lanza UserException si el usuario intenta solicitar su propio servicio
    @Test
    void sendRequest_ownService() throws UserException {
        User client = buildUser(1L);
        // 🔁 El mismo usuario es el proveedor del servicio
        ServiceListing service = buildServiceListing(10L, ServiceStatus.APROBADO, client);

        ServiceRequestCreate request = new ServiceRequestCreate();
        request.setServiceId(10L);

        when(userService.getCurrentUser()).thenReturn(client);
        when(serviceListingRepository.findById(10L)).thenReturn(Optional.of(service));

        assertThrows(UserException.class, () -> serviceRequestService.sendRequest(request));

        verify(serviceRequestRepository, never()).save(any(ServiceRequest.class));
    }

    // =====================================================
    // ✅ accept() — Aceptar solicitud (proveedor)
    // =====================================================

    // 🧪 El proveedor acepta correctamente una solicitud PENDIENTE
    @Test
    void accept_success() throws UserException {
        User client = buildUser(1L);
        User provider = buildUser(2L);
        ServiceListing service = buildServiceListing(10L, ServiceStatus.APROBADO, provider);
        ServiceRequest sr = buildServiceRequest(100L, service, client, RequestStatus.PENDIENTE);

        ServiceRequestResponse expectedResponse = new ServiceRequestResponse();
        expectedResponse.setStatus(RequestStatus.ACEPTADO);

        when(userService.getCurrentUser()).thenReturn(provider);
        when(serviceRequestRepository.findById(100L)).thenReturn(Optional.of(sr));
        when(serviceRequestRepository.save(any(ServiceRequest.class))).thenReturn(sr);

        try (MockedStatic<ServiceRequestMapper> mockedMapper = mockStatic(ServiceRequestMapper.class)) {
            mockedMapper.when(() -> ServiceRequestMapper.toResponse(sr)).thenReturn(expectedResponse);

            ServiceRequestResponse result = serviceRequestService.accept(100L);

            assertNotNull(result);
            assertEquals(RequestStatus.ACEPTADO, result.getStatus());
        }

        // 🔍 El estado interno de la solicitud cambió correctamente
        assertEquals(RequestStatus.ACEPTADO, sr.getStatus());
    }

    // 🧪 Lanza UserException si quien intenta aceptar NO es el proveedor del servicio
    @Test
    void accept_notProvider() throws UserException {
        User client = buildUser(1L);
        User provider = buildUser(2L);
        User outsider = buildUser(3L); // 👤 usuario ajeno a la solicitud

        ServiceListing service = buildServiceListing(10L, ServiceStatus.APROBADO, provider);
        ServiceRequest sr = buildServiceRequest(100L, service, client, RequestStatus.PENDIENTE);

        when(userService.getCurrentUser()).thenReturn(outsider);
        when(serviceRequestRepository.findById(100L)).thenReturn(Optional.of(sr));

        assertThrows(UserException.class, () -> serviceRequestService.accept(100L));

        verify(serviceRequestRepository, never()).save(any(ServiceRequest.class));
    }

    // 🧪 Lanza UserException si la solicitud no está en estado PENDIENTE
    @Test
    void accept_wrongStatus() throws UserException {
        User client = buildUser(1L);
        User provider = buildUser(2L);
        ServiceListing service = buildServiceListing(10L, ServiceStatus.APROBADO, provider);
        // 🔁 Ya fue aceptada anteriormente
        ServiceRequest sr = buildServiceRequest(100L, service, client, RequestStatus.ACEPTADO);

        when(userService.getCurrentUser()).thenReturn(provider);
        when(serviceRequestRepository.findById(100L)).thenReturn(Optional.of(sr));

        assertThrows(UserException.class, () -> serviceRequestService.accept(100L));

        verify(serviceRequestRepository, never()).save(any(ServiceRequest.class));
    }

    // =====================================================
    // ❌ decline() — Rechazar solicitud (proveedor)
    // =====================================================

    // 🧪 El proveedor rechaza correctamente una solicitud PENDIENTE
    @Test
    void decline_success() throws UserException {
        User client = buildUser(1L);
        User provider = buildUser(2L);
        ServiceListing service = buildServiceListing(10L, ServiceStatus.APROBADO, provider);
        ServiceRequest sr = buildServiceRequest(100L, service, client, RequestStatus.PENDIENTE);

        ServiceRequestResponse expectedResponse = new ServiceRequestResponse();
        expectedResponse.setStatus(RequestStatus.CANCELADO);

        when(userService.getCurrentUser()).thenReturn(provider);
        when(serviceRequestRepository.findById(100L)).thenReturn(Optional.of(sr));
        when(serviceRequestRepository.save(any(ServiceRequest.class))).thenReturn(sr);

        try (MockedStatic<ServiceRequestMapper> mockedMapper = mockStatic(ServiceRequestMapper.class)) {
            mockedMapper.when(() -> ServiceRequestMapper.toResponse(sr)).thenReturn(expectedResponse);

            ServiceRequestResponse result = serviceRequestService.decline(100L);

            assertEquals(RequestStatus.CANCELADO, result.getStatus());
        }

        // 🔍 Se marcó correctamente quién canceló (el proveedor)
        assertEquals(RequestStatus.CANCELADO, sr.getStatus());
        assertEquals(CancelledBy.PROVIDER, sr.getCancelledBy());
    }

    // =====================================================
    // 🚀 markInProgress() — Iniciar servicio (proveedor)
    // =====================================================

    // 🧪 El proveedor marca como EN_CURSO una solicitud ACEPTADA
    @Test
    void markInProgress_success() throws UserException {
        User client = buildUser(1L);
        User provider = buildUser(2L);
        ServiceListing service = buildServiceListing(10L, ServiceStatus.APROBADO, provider);
        ServiceRequest sr = buildServiceRequest(100L, service, client, RequestStatus.ACEPTADO);

        ServiceRequestResponse expectedResponse = new ServiceRequestResponse();
        expectedResponse.setStatus(RequestStatus.EN_CURSO);

        when(userService.getCurrentUser()).thenReturn(provider);
        when(serviceRequestRepository.findById(100L)).thenReturn(Optional.of(sr));
        when(serviceRequestRepository.save(any(ServiceRequest.class))).thenReturn(sr);

        try (MockedStatic<ServiceRequestMapper> mockedMapper = mockStatic(ServiceRequestMapper.class)) {
            mockedMapper.when(() -> ServiceRequestMapper.toResponse(sr)).thenReturn(expectedResponse);

            ServiceRequestResponse result = serviceRequestService.markInProgress(100L);

            assertEquals(RequestStatus.EN_CURSO, result.getStatus());
        }

        assertEquals(RequestStatus.EN_CURSO, sr.getStatus());
    }

    // =====================================================
    // 🏁 markCompleted() — Completar servicio (proveedor)
    // =====================================================

    // 🧪 El proveedor marca como COMPLETADO una solicitud EN_CURSO
    @Test
    void markCompleted_success() throws UserException {
        User client = buildUser(1L);
        User provider = buildUser(2L);
        ServiceListing service = buildServiceListing(10L, ServiceStatus.APROBADO, provider);
        ServiceRequest sr = buildServiceRequest(100L, service, client, RequestStatus.EN_CURSO);

        ServiceRequestResponse expectedResponse = new ServiceRequestResponse();
        expectedResponse.setStatus(RequestStatus.COMPLETADO);

        when(userService.getCurrentUser()).thenReturn(provider);
        when(serviceRequestRepository.findById(100L)).thenReturn(Optional.of(sr));
        when(serviceRequestRepository.save(any(ServiceRequest.class))).thenReturn(sr);

        try (MockedStatic<ServiceRequestMapper> mockedMapper = mockStatic(ServiceRequestMapper.class)) {
            mockedMapper.when(() -> ServiceRequestMapper.toResponse(sr)).thenReturn(expectedResponse);

            ServiceRequestResponse result = serviceRequestService.markCompleted(100L);

            assertEquals(RequestStatus.COMPLETADO, result.getStatus());
        }

        assertEquals(RequestStatus.COMPLETADO, sr.getStatus());
    }

    // =====================================================
    // ✔ confirmCompletion() — Confirmar finalización (cliente)
    // =====================================================

    // 🧪 El cliente confirma correctamente la finalización de una solicitud COMPLETADO
    @Test
    void confirmCompletion_success() throws UserException {
        User client = buildUser(1L);
        User provider = buildUser(2L);
        ServiceListing service = buildServiceListing(10L, ServiceStatus.APROBADO, provider);
        // 📌 completedAt aún es null -> no ha sido confirmada
        ServiceRequest sr = buildServiceRequest(100L, service, client, RequestStatus.COMPLETADO);

        ServiceRequestResponse expectedResponse = new ServiceRequestResponse();
        expectedResponse.setStatus(RequestStatus.COMPLETADO);

        when(userService.getCurrentUser()).thenReturn(client);
        when(serviceRequestRepository.findById(100L)).thenReturn(Optional.of(sr));
        when(serviceRequestRepository.save(any(ServiceRequest.class))).thenReturn(sr);

        try (MockedStatic<ServiceRequestMapper> mockedMapper = mockStatic(ServiceRequestMapper.class)) {
            mockedMapper.when(() -> ServiceRequestMapper.toResponse(sr)).thenReturn(expectedResponse);

            ServiceRequestResponse result = serviceRequestService.confirmCompletion(100L);

            assertNotNull(result);
        }

        // 🔍 Se registró la fecha/hora de finalización
        assertNotNull(sr.getCompletedAt());
    }

    // 🧪 Lanza UserException si la finalización ya había sido confirmada antes
    @Test
    void confirmCompletion_alreadyConfirmed() throws UserException {
        User client = buildUser(1L);
        User provider = buildUser(2L);
        ServiceListing service = buildServiceListing(10L, ServiceStatus.APROBADO, provider);
        ServiceRequest sr = buildServiceRequest(100L, service, client, RequestStatus.COMPLETADO);
        // 🔁 Ya tiene fecha de finalización -> doble confirmación
        sr.setCompletedAt(LocalDateTime.now());

        when(userService.getCurrentUser()).thenReturn(client);
        when(serviceRequestRepository.findById(100L)).thenReturn(Optional.of(sr));

        assertThrows(UserException.class, () -> serviceRequestService.confirmCompletion(100L));

        verify(serviceRequestRepository, never()).save(any(ServiceRequest.class));
    }

    // =====================================================
    // 🚫 cancel() — Cancelar solicitud (cliente o proveedor)
    // =====================================================

    // 🧪 El cliente cancela correctamente una solicitud PENDIENTE
    @Test
    void cancel_successAsClient() throws UserException {
        User client = buildUser(1L);
        User provider = buildUser(2L);
        ServiceListing service = buildServiceListing(10L, ServiceStatus.APROBADO, provider);
        ServiceRequest sr = buildServiceRequest(100L, service, client, RequestStatus.PENDIENTE);

        ServiceRequestResponse expectedResponse = new ServiceRequestResponse();
        expectedResponse.setStatus(RequestStatus.CANCELADO);

        when(userService.getCurrentUser()).thenReturn(client);
        when(serviceRequestRepository.findById(100L)).thenReturn(Optional.of(sr));
        when(serviceRequestRepository.save(any(ServiceRequest.class))).thenReturn(sr);

        try (MockedStatic<ServiceRequestMapper> mockedMapper = mockStatic(ServiceRequestMapper.class)) {
            mockedMapper.when(() -> ServiceRequestMapper.toResponse(sr)).thenReturn(expectedResponse);

            ServiceRequestResponse result = serviceRequestService.cancel(100L);

            assertEquals(RequestStatus.CANCELADO, result.getStatus());
        }

        // 🔍 Se marcó que fue el cliente quien canceló
        assertEquals(CancelledBy.CLIENT, sr.getCancelledBy());
    }

    // 🧪 El proveedor también puede cancelar una solicitud PENDIENTE
    @Test
    void cancel_successAsProvider() throws UserException {
        User client = buildUser(1L);
        User provider = buildUser(2L);
        ServiceListing service = buildServiceListing(10L, ServiceStatus.APROBADO, provider);
        ServiceRequest sr = buildServiceRequest(100L, service, client, RequestStatus.PENDIENTE);

        ServiceRequestResponse expectedResponse = new ServiceRequestResponse();
        expectedResponse.setStatus(RequestStatus.CANCELADO);

        when(userService.getCurrentUser()).thenReturn(provider);
        when(serviceRequestRepository.findById(100L)).thenReturn(Optional.of(sr));
        when(serviceRequestRepository.save(any(ServiceRequest.class))).thenReturn(sr);

        try (MockedStatic<ServiceRequestMapper> mockedMapper = mockStatic(ServiceRequestMapper.class)) {
            mockedMapper.when(() -> ServiceRequestMapper.toResponse(sr)).thenReturn(expectedResponse);

            ServiceRequestResponse result = serviceRequestService.cancel(100L);

            assertEquals(RequestStatus.CANCELADO, result.getStatus());
        }

        // 🔍 Se marcó que fue el proveedor quien canceló
        assertEquals(CancelledBy.PROVIDER, sr.getCancelledBy());
    }

    // 🧪 Lanza UserException si un usuario ajeno intenta cancelar la solicitud
    @Test
    void cancel_notAuthorized() throws UserException {
        User client = buildUser(1L);
        User provider = buildUser(2L);
        User outsider = buildUser(3L);

        ServiceListing service = buildServiceListing(10L, ServiceStatus.APROBADO, provider);
        ServiceRequest sr = buildServiceRequest(100L, service, client, RequestStatus.PENDIENTE);

        when(userService.getCurrentUser()).thenReturn(outsider);
        when(serviceRequestRepository.findById(100L)).thenReturn(Optional.of(sr));

        assertThrows(UserException.class, () -> serviceRequestService.cancel(100L));

        verify(serviceRequestRepository, never()).save(any(ServiceRequest.class));
    }

    // 🧪 Lanza UserException si se intenta cancelar una solicitud en estado final (COMPLETADO)
    @Test
    void cancel_finalStateNotAllowed() throws UserException {
        User client = buildUser(1L);
        User provider = buildUser(2L);
        ServiceListing service = buildServiceListing(10L, ServiceStatus.APROBADO, provider);
        ServiceRequest sr = buildServiceRequest(100L, service, client, RequestStatus.COMPLETADO);

        when(userService.getCurrentUser()).thenReturn(client);
        when(serviceRequestRepository.findById(100L)).thenReturn(Optional.of(sr));

        assertThrows(UserException.class, () -> serviceRequestService.cancel(100L));

        verify(serviceRequestRepository, never()).save(any(ServiceRequest.class));
    }

    // =====================================================
    // 📤 getSentRequests() — Solicitudes enviadas (cliente)
    // =====================================================

    // 🧪 Obtiene la lista de solicitudes enviadas por el cliente autenticado
    @Test
    void getSentRequests_success() throws UserException {
        User client = buildUser(1L);

        ServiceRequest sr1 = buildServiceRequest(100L, null, client, RequestStatus.PENDIENTE);
        ServiceRequest sr2 = buildServiceRequest(101L, null, client, RequestStatus.ACEPTADO);
        List<ServiceRequest> requests = List.of(sr1, sr2);

        List<ServiceRequestResponse> expectedResponses = List.of(
                new ServiceRequestResponse(), new ServiceRequestResponse());

        when(userService.getCurrentUser()).thenReturn(client);
        when(serviceRequestRepository.findByClientId(1L)).thenReturn(requests);

        try (MockedStatic<ServiceRequestMapper> mockedMapper = mockStatic(ServiceRequestMapper.class)) {
            mockedMapper.when(() -> ServiceRequestMapper.toResponseList(requests))
                    .thenReturn(expectedResponses);

            List<ServiceRequestResponse> result = serviceRequestService.getSentRequests();

            assertEquals(2, result.size());
        }

        verify(serviceRequestRepository).findByClientId(1L);
    }

    // =====================================================
    // 📥 getReceivedRequests() — Solicitudes recibidas (proveedor)
    // =====================================================

    // 🧪 Obtiene la lista de solicitudes recibidas por el proveedor autenticado
    @Test
    void getReceivedRequests_success() throws UserException {
        User provider = buildUser(2L);

        ServiceRequest sr1 = buildServiceRequest(100L, null, null, RequestStatus.PENDIENTE);
        List<ServiceRequest> requests = List.of(sr1);

        List<ServiceRequestResponse> expectedResponses = List.of(new ServiceRequestResponse());

        when(userService.getCurrentUser()).thenReturn(provider);
        when(serviceRequestRepository.findByServiceProviderId(2L)).thenReturn(requests);

        try (MockedStatic<ServiceRequestMapper> mockedMapper = mockStatic(ServiceRequestMapper.class)) {
            mockedMapper.when(() -> ServiceRequestMapper.toResponseList(requests))
                    .thenReturn(expectedResponses);

            List<ServiceRequestResponse> result = serviceRequestService.getReceivedRequests();

            assertEquals(1, result.size());
        }

        verify(serviceRequestRepository).findByServiceProviderId(2L);
    }

    // =====================================================
    // 📊 countAll() — Métrica
    // =====================================================

    // 🧪 Retorna el conteo total de solicitudes
    @Test
    void countAll_success() {
        when(serviceRequestRepository.count()).thenReturn(7L);

        long result = serviceRequestService.countAll();

        assertEquals(7L, result);
    }
}