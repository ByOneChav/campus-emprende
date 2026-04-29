package com.zosh.services.impl;

import com.zosh.domain.ReportStatus;
import com.zosh.exception.UserException;
import com.zosh.mapper.ReportMapper;
import com.zosh.modal.Report;
import com.zosh.modal.User;
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

    private final ReportRepository reportRepository;
    private final UserService userService;

    @Override
    public ReportResponse submitReport(ReportRequest request) throws UserException {
        User reporter = userService.getCurrentUser();
        Report report = Report.builder()
                .reporter(reporter)
                .targetType(request.getTargetType())
                .targetId(request.getTargetId())
                .reason(request.getReason())
                .status(ReportStatus.PENDING)
                .build();
        return ReportMapper.toResponse(reportRepository.save(report));
    }

    @Override
    public List<ReportResponse> getReports(ReportStatus status) {
        List<Report> reports = (status != null)
                ? reportRepository.findByStatus(status)
                : reportRepository.findAll();
        return ReportMapper.toResponseList(reports);
    }

    @Override
    public ReportResponse resolveReport(Long id, String adminNotes) throws UserException {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new UserException("Report not found with id " + id));
        report.setStatus(ReportStatus.RESOLVED);
        report.setAdminNotes(adminNotes);
        return ReportMapper.toResponse(reportRepository.save(report));
    }

    @Override
    public long countPending() {
        return reportRepository.countByStatus(ReportStatus.PENDING);
    }
}
