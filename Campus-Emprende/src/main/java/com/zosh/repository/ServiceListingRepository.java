package com.zosh.repository;

import com.zosh.domain.ServiceCategory;
import com.zosh.domain.ServiceStatus;
import com.zosh.model.ServiceListing;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ServiceListingRepository extends JpaRepository<ServiceListing, Long> {

    List<ServiceListing> findByStatus(ServiceStatus status);

    List<ServiceListing> findByProviderId(Long providerId);

    @Query("SELECT s FROM ServiceListing s WHERE s.status = 'APROBADO' " +
           "AND (:category IS NULL OR s.category = :category) " +
           "AND (:keyword IS NULL OR (LOWER(s.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "     OR LOWER(s.description) LIKE LOWER(CONCAT('%', :keyword, '%'))))")
    List<ServiceListing> searchApproved(@Param("category") ServiceCategory category,
                                        @Param("keyword") String keyword);

    long countByStatus(ServiceStatus status);
}
