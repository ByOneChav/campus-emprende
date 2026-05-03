package com.zosh.services.impl;

import com.zosh.domain.ReportStatus;
import com.zosh.exception.UserException;
import com.zosh.mapper.ReportMapper;
import com.zosh.model.Report;
import com.zosh.model.User;
import com.zosh.payload.request.ReportRequest;
import com.zosh.payload.response.ReportResponse;
import com.zosh.repository.ReportRepository;
import com.zosh.services.ReportService;
import com.zosh.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    // 🗄️ Acceso a BD
    private final ReportRepository reportRepository;

    // 🔐 Usuario autenticado
    private final UserService userService;

    // ============================
    // 🚨 CREAR REPORTE
    // ============================
    @Override
    public ReportResponse submitReport(ReportRequest request) throws UserException {

        // 👤 Usuario que reporta
        User reporter = userService.getCurrentUser();

        // 🧱 Construcción del reporte
        Report report = Report.builder()
                .reporter(reporter)
                .targetType(request.getTargetType()) // qué se reporta
                .targetId(request.getTargetId())     // id del objetivo
                .reason(request.getReason())         // motivo
                .status(ReportStatus.PENDING)        // estado inicial
                .build();

        // 💾 Guardar + mapear
        return ReportMapper.toResponse(reportRepository.save(report));
    }

    // ============================
    // 📊 OBTENER REPORTES
    // ============================
    @Override
    public List<ReportResponse> getReports(ReportStatus status) {

        // 🔎 Filtrar por estado o traer todos
        List<Report> reports = (status != null)
                ? reportRepository.findByStatus(status)
                : reportRepository.findAll();

        return ReportMapper.toResponseList(reports);
    }

    // ============================
    // ✅ RESOLVER REPORTE
    // ============================
    @Override
    public ReportResponse resolveReport(Long id, String adminNotes) throws UserException {

        // 🔎 Buscar reporte
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new UserException("Informe no encontrado con ID " + id));

        // ⚖️ Marcar como resuelto
        report.setStatus(ReportStatus.RESUELTO);
        report.setAdminNotes(adminNotes);

        // 💾 Guardar cambios
        return ReportMapper.toResponse(reportRepository.save(report));
    }

    // ============================
    // 📈 CONTAR PENDIENTES
    // ============================
    @Override
    public long countPending() {

        // 📊 Métrica para dashboard admin
        return reportRepository.countByStatus(ReportStatus.PENDING);
    }
}