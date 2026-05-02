package com.zosh.repository;

import com.zosh.domain.ReportStatus;
import com.zosh.model.Report;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByStatus(ReportStatus status);
    long countByStatus(ReportStatus status);
}
