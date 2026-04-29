package com.zosh.services;

import com.zosh.domain.ReportStatus;
import com.zosh.exception.UserException;
import com.zosh.payload.request.ReportRequest;
import com.zosh.payload.response.ReportResponse;

import java.util.List;

public interface ReportService {
    ReportResponse submitReport(ReportRequest request) throws UserException;
    List<ReportResponse> getReports(ReportStatus status);
    ReportResponse resolveReport(Long id, String adminNotes) throws UserException;
    long countPending();
}
