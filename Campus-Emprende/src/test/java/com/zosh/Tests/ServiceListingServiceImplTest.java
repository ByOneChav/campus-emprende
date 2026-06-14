package com.zosh.Tests;

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
import com.zosh.services.UserService;
import com.zosh.services.impl.ServiceListingServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

// 🧪 Pruebas unitarias para ServiceListingServiceImpl
// Cubre creación, edición, desactivación, listados públicos/admin
// y aprobación/rechazo de servicios.
@ExtendWith(MockitoExtension.class)
class ServiceListingServiceImplTest {

    // 🔗 Repositorio de servicios (mockeado)
    @Mock
    private ServiceListingRepository serviceListingRepository;

    // 🔗 Repositorio de comentarios (mockeado, para contar comentarios por servicio)
    @Mock
    private CommentRepository commentRepository;

    // 🔐 Servicio de usuario (mockeado, simula al usuario autenticado por JWT)
    @Mock
    private UserService userService;

    // 🧩 Clase real que se está probando
    @InjectMocks
    private ServiceListingServiceImpl serviceListingService;

    // =====================================================
    // 🧱 Helpers para construir objetos de prueba
    // =====================================================

    // 👤 Crea un usuario simple solo con ID
    private User buildUser(Long id) {
        User user = new User();
        user.setId(id);
        return user;
    }

    // 🛠️ Crea un servicio (ServiceListing) con dueño y estado dados
    private ServiceListing buildServiceListing(Long id, User provider, ServiceStatus status) {
        ServiceListing listing = ServiceListing.builder()
                .provider(provider)
                .status(status)
                .build();
        listing.setId(id);
        return listing;
    }

    // =====================================================
    // 🆕 createService() — Crear servicio
    // =====================================================

    // 🧪 Crea un servicio correctamente y queda en estado PENDIENTE
    @Test
    void createService_success() throws UserException {
        User provider = buildUser(1L);

        ServiceListingRequest request = new ServiceListingRequest();
        request.setTitle("Clases de matemáticas");
        request.setDescription("Apoyo en cálculo y álgebra");
        request.setImageUrl("http://imagen.com/foto.png");

        // 💾 Servicio que "guardaría" el repositorio
        ServiceListing savedListing = ServiceListing.builder()
                .provider(provider)
                .title(request.getTitle())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .status(ServiceStatus.PENDIENTE)
                .build();
        savedListing.setId(10L);

        // 🎯 Respuesta esperada del mapper
        ServiceListingResponse expectedResponse = new ServiceListingResponse();
        expectedResponse.setStatus(ServiceStatus.PENDIENTE);

        when(userService.getCurrentUser()).thenReturn(provider);
        when(serviceListingRepository.save(any(ServiceListing.class))).thenReturn(savedListing);

        try (MockedStatic<ServiceListingMapper> mockedMapper = mockStatic(ServiceListingMapper.class)) {
            mockedMapper.when(() -> ServiceListingMapper.toResponse(savedListing))
                    .thenReturn(expectedResponse);

            ServiceListingResponse result = serviceListingService.createService(request);

            assertNotNull(result);
            assertEquals(ServiceStatus.PENDIENTE, result.getStatus());
        }

        verify(serviceListingRepository).save(any(ServiceListing.class));
    }

    // =====================================================
    // ✏️ updateService() — Actualizar servicio
    // =====================================================

    // 🧪 El propietario actualiza correctamente su servicio y vuelve a quedar PENDIENTE
    @Test
    void updateService_success() throws UserException {
        User owner = buildUser(1L);
        // 📌 estado inicial: ya estaba aprobado, pero al editar vuelve a revisión
        ServiceListing listing = buildServiceListing(10L, owner, ServiceStatus.APROBADO);
        listing.setRejectionReason("Algún motivo previo");

        ServiceListingRequest request = new ServiceListingRequest();
        request.setTitle("Nuevo título");
        request.setDescription("Nueva descripción");
        request.setImageUrl("http://imagen.com/nueva.png");

        ServiceListingResponse expectedResponse = new ServiceListingResponse();
        expectedResponse.setStatus(ServiceStatus.PENDIENTE);

        when(userService.getCurrentUser()).thenReturn(owner);
        when(serviceListingRepository.findById(10L)).thenReturn(Optional.of(listing));
        when(serviceListingRepository.save(any(ServiceListing.class))).thenReturn(listing);

        try (MockedStatic<ServiceListingMapper> mockedMapper = mockStatic(ServiceListingMapper.class)) {
            mockedMapper.when(() -> ServiceListingMapper.toResponse(listing))
                    .thenReturn(expectedResponse);

            ServiceListingResponse result = serviceListingService.updateService(10L, request);

            assertNotNull(result);
            assertEquals(ServiceStatus.PENDIENTE, result.getStatus());
        }

        // 🔍 Validar que los datos y el estado se actualizaron correctamente
        assertEquals("Nuevo título", listing.getTitle());
        assertEquals("Nueva descripción", listing.getDescription());
        assertEquals(ServiceStatus.PENDIENTE, listing.getStatus());
        assertNull(listing.getRejectionReason());
    }

    // 🧪 Lanza UserException si se intenta editar un servicio INACTIVO
    @Test
    void updateService_inactiveThrows() throws UserException {
        User owner = buildUser(1L);
        ServiceListing listing = buildServiceListing(10L, owner, ServiceStatus.INACTIVO);

        ServiceListingRequest request = new ServiceListingRequest();
        request.setTitle("Intento de edición");

        when(userService.getCurrentUser()).thenReturn(owner);
        when(serviceListingRepository.findById(10L)).thenReturn(Optional.of(listing));

        assertThrows(UserException.class, () -> serviceListingService.updateService(10L, request));

        verify(serviceListingRepository, never()).save(any(ServiceListing.class));
    }

    // 🧪 Lanza UserException si el usuario autenticado no es el propietario
    @Test
    void updateService_notOwnerThrows() throws UserException {
        User owner = buildUser(1L);
        User other = buildUser(2L); // 👤 usuario que NO es el dueño
        ServiceListing listing = buildServiceListing(10L, owner, ServiceStatus.APROBADO);

        ServiceListingRequest request = new ServiceListingRequest();
        request.setTitle("Intento de edición ajena");

        when(userService.getCurrentUser()).thenReturn(other);
        when(serviceListingRepository.findById(10L)).thenReturn(Optional.of(listing));

        assertThrows(UserException.class, () -> serviceListingService.updateService(10L, request));

        verify(serviceListingRepository, never()).save(any(ServiceListing.class));
    }

    // =====================================================
    // 🚫 deactivateService() — Desactivar servicio (soft delete)
    // =====================================================

    // 🧪 El propietario desactiva correctamente su servicio
    @Test
    void deactivateService_success() throws UserException {
        User owner = buildUser(1L);
        ServiceListing listing = buildServiceListing(10L, owner, ServiceStatus.APROBADO);

        ServiceListingResponse expectedResponse = new ServiceListingResponse();
        expectedResponse.setStatus(ServiceStatus.INACTIVO);

        when(userService.getCurrentUser()).thenReturn(owner);
        when(serviceListingRepository.findById(10L)).thenReturn(Optional.of(listing));
        when(serviceListingRepository.save(any(ServiceListing.class))).thenReturn(listing);

        try (MockedStatic<ServiceListingMapper> mockedMapper = mockStatic(ServiceListingMapper.class)) {
            mockedMapper.when(() -> ServiceListingMapper.toResponse(listing))
                    .thenReturn(expectedResponse);

            ServiceListingResponse result = serviceListingService.deactivateService(10L);

            assertEquals(ServiceStatus.INACTIVO, result.getStatus());
        }

        assertEquals(ServiceStatus.INACTIVO, listing.getStatus());
    }

    // 🧪 Lanza UserException si quien desactiva no es el propietario
    @Test
    void deactivateService_notOwnerThrows() throws UserException {
        User owner = buildUser(1L);
        User other = buildUser(2L);
        ServiceListing listing = buildServiceListing(10L, owner, ServiceStatus.APROBADO);

        when(userService.getCurrentUser()).thenReturn(other);
        when(serviceListingRepository.findById(10L)).thenReturn(Optional.of(listing));

        assertThrows(UserException.class, () -> serviceListingService.deactivateService(10L));

        verify(serviceListingRepository, never()).save(any(ServiceListing.class));
    }

    // =====================================================
    // 🔍 browseApproved() — Listar servicios aprobados (público)
    // =====================================================

    // 🧪 Devuelve los servicios aprobados con su cantidad de comentarios
    @Test
    void browseApproved_success() {
        User provider = buildUser(1L);
        ServiceListing listing = buildServiceListing(10L, provider, ServiceStatus.APROBADO);

        String keyword = "matemáticas";
        ServiceCategory category = null; // 🔎 sin filtro de categoría

        ServiceListingResponse expectedResponse = new ServiceListingResponse();
        expectedResponse.setStatus(ServiceStatus.APROBADO);

        when(serviceListingRepository.searchApproved(category, keyword)).thenReturn(List.of(listing));
        when(commentRepository.countByServiceId(10L)).thenReturn(3L);

        try (MockedStatic<ServiceListingMapper> mockedMapper = mockStatic(ServiceListingMapper.class)) {
            mockedMapper.when(() -> ServiceListingMapper.toResponse(listing, 3L))
                    .thenReturn(expectedResponse);

            List<ServiceListingResponse> result = serviceListingService.browseApproved(keyword, category);

            assertEquals(1, result.size());
            assertEquals(ServiceStatus.APROBADO, result.get(0).getStatus());
        }

        verify(commentRepository).countByServiceId(10L);
    }

    // =====================================================
    // 📄 getServiceDetail() — Detalle de servicio
    // =====================================================

    // 🧪 Devuelve el detalle del servicio junto con su cantidad de comentarios
    @Test
    void getServiceDetail_success() throws UserException {
        User provider = buildUser(1L);
        ServiceListing listing = buildServiceListing(10L, provider, ServiceStatus.APROBADO);

        ServiceListingResponse expectedResponse = new ServiceListingResponse();
        expectedResponse.setStatus(ServiceStatus.APROBADO);

        when(serviceListingRepository.findById(10L)).thenReturn(Optional.of(listing));
        when(commentRepository.countByServiceId(10L)).thenReturn(5L);

        try (MockedStatic<ServiceListingMapper> mockedMapper = mockStatic(ServiceListingMapper.class)) {
            mockedMapper.when(() -> ServiceListingMapper.toResponse(listing, 5L))
                    .thenReturn(expectedResponse);

            ServiceListingResponse result = serviceListingService.getServiceDetail(10L);

            assertNotNull(result);
            assertEquals(ServiceStatus.APROBADO, result.getStatus());
        }
    }

    // 🧪 Lanza UserException si el servicio no existe
    @Test
    void getServiceDetail_notFound() {
        when(serviceListingRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(UserException.class, () -> serviceListingService.getServiceDetail(99L));
    }

    // =====================================================
    // 👤 getMyServices() — Servicios del usuario autenticado
    // =====================================================

    // 🧪 Devuelve la lista de servicios que pertenecen al usuario autenticado
    @Test
    void getMyServices_success() throws UserException {
        User provider = buildUser(1L);
        ServiceListing listing = buildServiceListing(10L, provider, ServiceStatus.APROBADO);

        List<ServiceListingResponse> expectedResponses = List.of(new ServiceListingResponse());

        when(userService.getCurrentUser()).thenReturn(provider);
        when(serviceListingRepository.findByProviderId(1L)).thenReturn(List.of(listing));

        try (MockedStatic<ServiceListingMapper> mockedMapper = mockStatic(ServiceListingMapper.class)) {
            mockedMapper.when(() -> ServiceListingMapper.toResponseList(List.of(listing)))
                    .thenReturn(expectedResponses);

            List<ServiceListingResponse> result = serviceListingService.getMyServices();

            assertEquals(1, result.size());
        }

        verify(serviceListingRepository).findByProviderId(1L);
    }

    // =====================================================
    // 👑 getAllServices() — Admin: obtener todos
    // =====================================================

    // 🧪 Devuelve todos los servicios registrados (vista admin)
    @Test
    void getAllServices_success() {
        ServiceListing listing1 = buildServiceListing(10L, buildUser(1L), ServiceStatus.APROBADO);
        ServiceListing listing2 = buildServiceListing(11L, buildUser(2L), ServiceStatus.PENDIENTE);
        List<ServiceListing> listings = List.of(listing1, listing2);

        List<ServiceListingResponse> expectedResponses = List.of(
                new ServiceListingResponse(), new ServiceListingResponse());

        when(serviceListingRepository.findAll()).thenReturn(listings);

        try (MockedStatic<ServiceListingMapper> mockedMapper = mockStatic(ServiceListingMapper.class)) {
            mockedMapper.when(() -> ServiceListingMapper.toResponseList(listings))
                    .thenReturn(expectedResponses);

            List<ServiceListingResponse> result = serviceListingService.getAllServices();

            assertEquals(2, result.size());
        }
    }

    // =====================================================
    // 👑 getByStatus() — Admin: filtrar por estado
    // =====================================================

    // 🧪 Devuelve los servicios filtrados por estado (ej. PENDIENTE)
    @Test
    void getByStatus_success() {
        ServiceListing listing = buildServiceListing(10L, buildUser(1L), ServiceStatus.PENDIENTE);
        List<ServiceListing> listings = List.of(listing);

        List<ServiceListingResponse> expectedResponses = List.of(new ServiceListingResponse());

        when(serviceListingRepository.findByStatus(ServiceStatus.PENDIENTE)).thenReturn(listings);

        try (MockedStatic<ServiceListingMapper> mockedMapper = mockStatic(ServiceListingMapper.class)) {
            mockedMapper.when(() -> ServiceListingMapper.toResponseList(listings))
                    .thenReturn(expectedResponses);

            List<ServiceListingResponse> result = serviceListingService.getByStatus(ServiceStatus.PENDIENTE);

            assertEquals(1, result.size());
        }

        verify(serviceListingRepository).findByStatus(ServiceStatus.PENDIENTE);
    }

    // =====================================================
    // 👑 approveService() — Admin: aprobar servicio
    // =====================================================

    // 🧪 El admin aprueba correctamente un servicio PENDIENTE
    @Test
    void approveService_success() throws UserException {
        ServiceListing listing = buildServiceListing(10L, buildUser(1L), ServiceStatus.PENDIENTE);
        listing.setRejectionReason("Motivo anterior"); // 📌 debe limpiarse al aprobar

        ServiceListingResponse expectedResponse = new ServiceListingResponse();
        expectedResponse.setStatus(ServiceStatus.APROBADO);

        when(serviceListingRepository.findById(10L)).thenReturn(Optional.of(listing));
        when(serviceListingRepository.save(any(ServiceListing.class))).thenReturn(listing);

        try (MockedStatic<ServiceListingMapper> mockedMapper = mockStatic(ServiceListingMapper.class)) {
            mockedMapper.when(() -> ServiceListingMapper.toResponse(listing))
                    .thenReturn(expectedResponse);

            ServiceListingResponse result = serviceListingService.approveService(10L);

            assertEquals(ServiceStatus.APROBADO, result.getStatus());
        }

        assertEquals(ServiceStatus.APROBADO, listing.getStatus());
        assertNull(listing.getRejectionReason());
    }

    // 🧪 Lanza UserException si el servicio a aprobar no existe
    @Test
    void approveService_notFound() {
        when(serviceListingRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(UserException.class, () -> serviceListingService.approveService(99L));

        verify(serviceListingRepository, never()).save(any(ServiceListing.class));
    }

    // =====================================================
    // 👑 rejectService() — Admin: rechazar servicio
    // =====================================================

    // 🧪 El admin rechaza correctamente un servicio y registra el motivo
    @Test
    void rejectService_success() throws UserException {
        ServiceListing listing = buildServiceListing(10L, buildUser(1L), ServiceStatus.PENDIENTE);

        String reason = "La descripción no cumple con las normas";

        ServiceListingResponse expectedResponse = new ServiceListingResponse();
        expectedResponse.setStatus(ServiceStatus.RECHAZADO);

        when(serviceListingRepository.findById(10L)).thenReturn(Optional.of(listing));
        when(serviceListingRepository.save(any(ServiceListing.class))).thenReturn(listing);

        try (MockedStatic<ServiceListingMapper> mockedMapper = mockStatic(ServiceListingMapper.class)) {
            mockedMapper.when(() -> ServiceListingMapper.toResponse(listing))
                    .thenReturn(expectedResponse);

            ServiceListingResponse result = serviceListingService.rejectService(10L, reason);

            assertEquals(ServiceStatus.RECHAZADO, result.getStatus());
        }

        assertEquals(ServiceStatus.RECHAZADO, listing.getStatus());
        assertEquals(reason, listing.getRejectionReason());
    }

    // =====================================================
    // 📊 countByStatus() — Métrica
    // =====================================================

    // 🧪 Devuelve el conteo de servicios para un estado dado
    @Test
    void countByStatus_success() {
        when(serviceListingRepository.countByStatus(ServiceStatus.APROBADO)).thenReturn(4L);

        long result = serviceListingService.countByStatus(ServiceStatus.APROBADO);

        assertEquals(4L, result);
    }
}