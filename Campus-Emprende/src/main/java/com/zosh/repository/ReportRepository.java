package com.zosh.repository;

import com.zosh.domain.ReportStatus;
import com.zosh.model.Report;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

// Repositorio JPA para la entidad Report (CRUD automático)
public interface ReportRepository extends JpaRepository<Report, Long> {

    // Buscar reportes por estado (PENDING, RESUELTO, etc.)
    List<Report> findByStatus(ReportStatus status);

    // Contar reportes por estado (útil para dashboard/admin)
    long countByStatus(ReportStatus status);
}