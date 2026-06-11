package com.zosh.Tests;

import com.zosh.domain.CancelledBy;
import com.zosh.domain.RequestStatus;
import com.zosh.exception.UserException;
import com.zosh.model.ServiceListing;
import com.zosh.model.ServiceRequest;
import com.zosh.model.User;
import com.zosh.repository.ServiceListingRepository;
import com.zosh.repository.ServiceRequestRepository;
import com.zosh.services.UserService;
import com.zosh.services.impl.ServiceRequestServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ServiceRequestServiceImplTest {

    @Mock
    private ServiceRequestRepository serviceRequestRepository;

    @Mock
    private ServiceListingRepository serviceListingRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private ServiceRequestServiceImpl serviceRequestService;

    // 🧪 Aceptar solicitud correctamente
    @Test
    void accept_success() throws Exception {

        User provider = mock(User.class);
        when(provider.getId()).thenReturn(1L);

        User current = mock(User.class);
        when(current.getId()).thenReturn(1L);

        ServiceListing service = mock(ServiceListing.class);
        when(service.getProvider()).thenReturn(provider);

        ServiceRequest request = mock(ServiceRequest.class);
        when(request.getService()).thenReturn(service);
        when(request.getStatus()).thenReturn(RequestStatus.PENDIENTE);

        when(userService.getCurrentUser()).thenReturn(current);
        when(serviceRequestRepository.findById(1L))
                .thenReturn(Optional.of(request));

        assertDoesNotThrow(() -> serviceRequestService.accept(1L));

        verify(request).setStatus(RequestStatus.ACEPTADO);
    }

    // 🧪 Error si estado no es pendiente
    // 🧪 Error si estado no es pendiente
    @Test
    void accept_wrongStatus() throws Exception {

        User provider = mock(User.class);
        when(provider.getId()).thenReturn(1L);

        User current = mock(User.class);
        when(current.getId()).thenReturn(1L);

        ServiceListing service = mock(ServiceListing.class);
        when(service.getProvider()).thenReturn(provider);

        ServiceRequest request = mock(ServiceRequest.class);
        when(request.getService()).thenReturn(service);
        when(request.getStatus()).thenReturn(RequestStatus.CANCELADO);

        when(userService.getCurrentUser()).thenReturn(current);
        when(serviceRequestRepository.findById(1L))
                .thenReturn(Optional.of(request));

        assertThrows(UserException.class,
                () -> serviceRequestService.accept(1L));
    }

    // 🧪 Rechazar solicitud correctamente
    @Test
    void decline_success() throws Exception {

        User provider = mock(User.class);
        when(provider.getId()).thenReturn(1L);

        User current = mock(User.class);
        when(current.getId()).thenReturn(1L);

        ServiceListing service = mock(ServiceListing.class);
        when(service.getProvider()).thenReturn(provider);

        ServiceRequest request = mock(ServiceRequest.class);
        when(request.getService()).thenReturn(service);
        when(request.getStatus()).thenReturn(RequestStatus.PENDIENTE);

        when(userService.getCurrentUser()).thenReturn(current);
        when(serviceRequestRepository.findById(1L))
                .thenReturn(Optional.of(request));

        assertDoesNotThrow(() -> serviceRequestService.decline(1L));

        verify(request).setStatus(RequestStatus.CANCELADO);
        verify(request).setCancelledBy(CancelledBy.PROVIDER);
    }

    // 🧪 Iniciar servicio correctamente
    @Test
    void markInProgress_success() throws Exception {

        User provider = mock(User.class);
        when(provider.getId()).thenReturn(1L);

        User current = mock(User.class);
        when(current.getId()).thenReturn(1L);

        ServiceListing service = mock(ServiceListing.class);
        when(service.getProvider()).thenReturn(provider);

        ServiceRequest request = mock(ServiceRequest.class);
        when(request.getService()).thenReturn(service);
        when(request.getStatus()).thenReturn(RequestStatus.ACEPTADO);

        when(userService.getCurrentUser()).thenReturn(current);
        when(serviceRequestRepository.findById(1L))
                .thenReturn(Optional.of(request));

        assertDoesNotThrow(() -> serviceRequestService.markInProgress(1L));

        verify(request).setStatus(RequestStatus.EN_CURSO);
    }

    // 🧪 Completar servicio correctamente
    @Test
    void markCompleted_success() throws Exception {

        User provider = mock(User.class);
        when(provider.getId()).thenReturn(1L);

        User current = mock(User.class);
        when(current.getId()).thenReturn(1L);

        ServiceListing service = mock(ServiceListing.class);
        when(service.getProvider()).thenReturn(provider);

        ServiceRequest request = mock(ServiceRequest.class);
        when(request.getService()).thenReturn(service);
        when(request.getStatus()).thenReturn(RequestStatus.EN_CURSO);

        when(userService.getCurrentUser()).thenReturn(current);
        when(serviceRequestRepository.findById(1L))
                .thenReturn(Optional.of(request));

        assertDoesNotThrow(() -> serviceRequestService.markCompleted(1L));

        verify(request).setStatus(RequestStatus.COMPLETADO);
    }

    // 🧪 Confirmar finalización correctamente
    @Test
    void confirmCompletion_success() throws Exception {

        User client = mock(User.class);
        when(client.getId()).thenReturn(10L);

        ServiceRequest request = mock(ServiceRequest.class);
        when(request.getClient()).thenReturn(client);
        when(request.getStatus()).thenReturn(RequestStatus.COMPLETADO);
        when(request.getCompletedAt()).thenReturn(null);

        when(userService.getCurrentUser()).thenReturn(client);
        when(serviceRequestRepository.findById(1L))
                .thenReturn(Optional.of(request));

        assertDoesNotThrow(() -> serviceRequestService.confirmCompletion(1L));

        verify(request).setCompletedAt(any(LocalDateTime.class));
    }

    // 🧪 Evitar doble confirmación
    // 🧪 Evitar doble confirmación
    @Test
    void confirmCompletion_alreadyConfirmed() throws Exception {

        User client = mock(User.class);
        when(client.getId()).thenReturn(10L);

        ServiceRequest request = mock(ServiceRequest.class);
        when(request.getClient()).thenReturn(client);
        when(request.getStatus()).thenReturn(RequestStatus.COMPLETADO);
        when(request.getCompletedAt()).thenReturn(LocalDateTime.now());

        when(userService.getCurrentUser()).thenReturn(client);
        when(serviceRequestRepository.findById(1L))
                .thenReturn(Optional.of(request));

        assertThrows(UserException.class,
                () -> serviceRequestService.confirmCompletion(1L));
    }

    // 🧪 Cancelar como cliente
    @Test
    void cancel_byClient_success() throws Exception {

        User client = mock(User.class);
        when(client.getId()).thenReturn(1L);

        User provider = mock(User.class);
        when(provider.getId()).thenReturn(2L);

        ServiceListing service = mock(ServiceListing.class);
        when(service.getProvider()).thenReturn(provider);

        ServiceRequest request = mock(ServiceRequest.class);
        when(request.getClient()).thenReturn(client);
        when(request.getService()).thenReturn(service);
        when(request.getStatus()).thenReturn(RequestStatus.PENDIENTE);

        when(userService.getCurrentUser()).thenReturn(client);
        when(serviceRequestRepository.findById(1L))
                .thenReturn(Optional.of(request));

        assertDoesNotThrow(() -> serviceRequestService.cancel(1L));

        verify(request).setStatus(RequestStatus.CANCELADO);
        verify(request).setCancelledBy(CancelledBy.CLIENT);
    }

    // 🧪 Usuario no autorizado
    // 🧪 Usuario no autorizado
    @Test
    void cancel_unauthorized() throws Exception {

        User current = mock(User.class);
        when(current.getId()).thenReturn(99L);

        User client = mock(User.class);
        when(client.getId()).thenReturn(1L);

        User provider = mock(User.class);
        when(provider.getId()).thenReturn(2L);

        ServiceListing service = mock(ServiceListing.class);
        when(service.getProvider()).thenReturn(provider);

        ServiceRequest request = mock(ServiceRequest.class);
        when(request.getClient()).thenReturn(client);
        when(request.getService()).thenReturn(service);

        when(userService.getCurrentUser()).thenReturn(current);
        when(serviceRequestRepository.findById(1L))
                .thenReturn(Optional.of(request));

        assertThrows(UserException.class,
                () -> serviceRequestService.cancel(1L));
    }

    // 🧪 Contar solicitudes
    @Test
    void countAll_success() {

        when(serviceRequestRepository.count()).thenReturn(7L);

        long result = serviceRequestService.countAll();

        assertEquals(7L, result);
    }
}