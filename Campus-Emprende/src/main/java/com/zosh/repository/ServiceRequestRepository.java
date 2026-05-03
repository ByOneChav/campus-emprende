package com.zosh.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zosh.model.ServiceRequest;

import java.util.List;

// 🗄️ Repositorio de ServiceRequest
// Maneja acceso a base de datos para solicitudes de servicio
public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {

    // 📤 Buscar solicitudes enviadas por el cliente
    List<ServiceRequest> findByClientId(Long clientId);

    // 📥 Buscar solicitudes recibidas por el proveedor
    // (navega relación: ServiceRequest → Service → Provider)
    List<ServiceRequest> findByServiceProviderId(Long providerId);
}