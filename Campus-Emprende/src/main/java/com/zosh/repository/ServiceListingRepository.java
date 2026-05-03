package com.zosh.repository;

import com.zosh.domain.ServiceCategory;
import com.zosh.domain.ServiceStatus;
import com.zosh.model.ServiceListing;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

// 🗄️ Repositorio de ServiceListing
// Maneja acceso a base de datos para servicios
public interface ServiceListingRepository extends JpaRepository<ServiceListing, Long> {

    // 🔎 Buscar servicios por estado (PENDIENTE, APROBADO, etc.)
    List<ServiceListing> findByStatus(ServiceStatus status);

    // 👤 Buscar servicios por ID del usuario (provider)
    List<ServiceListing> findByProviderId(Long providerId);

    // 🔍 Búsqueda pública con filtros (categoría + keyword)
    // Solo devuelve servicios APROBADOS
    @Query("SELECT s FROM ServiceListing s WHERE s.status = 'APROBADO' " +
           "AND (:category IS NULL OR s.category = :category) " +
           "AND (:keyword IS NULL OR (LOWER(s.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "     OR LOWER(s.description) LIKE LOWER(CONCAT('%', :keyword, '%'))))")
    List<ServiceListing> searchApproved(@Param("category") ServiceCategory category,
                                        @Param("keyword") String keyword);

    // 📊 Contar servicios por estado
    long countByStatus(ServiceStatus status);
}