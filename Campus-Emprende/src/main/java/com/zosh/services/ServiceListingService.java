package com.zosh.services;

import com.zosh.domain.ServiceCategory;
import com.zosh.domain.ServiceStatus;
import com.zosh.exception.UserException;
import com.zosh.payload.request.ServiceListingRequest;
import com.zosh.payload.response.ServiceListingResponse;

import java.util.List;

// 🧠 Interfaz del servicio de ServiceListing
// Define todas las operaciones disponibles (sin implementación)
public interface ServiceListingService {

    // 🆕 Crear servicio
    ServiceListingResponse createService(ServiceListingRequest request) throws UserException;

    // ✏️ Actualizar servicio
    ServiceListingResponse updateService(Long id, ServiceListingRequest request) throws UserException;

    // 🚫 Desactivar servicio (soft delete)
    ServiceListingResponse deactivateService(Long id) throws UserException;

    // 🔍 Listar servicios aprobados (con filtros)
    List<ServiceListingResponse> browseApproved(String keyword, ServiceCategory category);

    // 📄 Obtener detalle de servicio
    ServiceListingResponse getServiceDetail(Long id) throws UserException;

    // 👤 Obtener servicios del usuario autenticado
    List<ServiceListingResponse> getMyServices() throws UserException;

    // 👑 FUNCIONES ADMIN

    // 📋 Obtener todos los servicios
    List<ServiceListingResponse> getAllServices();

    // 🔎 Filtrar por estado (PENDING, APPROVED, etc.)
    List<ServiceListingResponse> getByStatus(ServiceStatus status);

    // ✅ Aprobar servicio
    ServiceListingResponse approveService(Long id) throws UserException;

    // ❌ Rechazar servicio con motivo
    ServiceListingResponse rejectService(Long id, String reason) throws UserException;

    // 📊 Contar servicios por estado
    long countByStatus(ServiceStatus status);
}