package com.zosh.mapper;

import com.zosh.modal.Report;
import com.zosh.payload.response.ReportResponse;

import java.util.List;
import java.util.stream.Collectors;

public class ReportMapper {

    public static ReportResponse toResponse(Report r) {
        ReportResponse res = new ReportResponse();
        res.setId(r.getId());
        res.setReporterId(r.getReporter().getId());
        res.setReporterName(r.getReporter().getFullName());
        res.setTargetType(r.getTargetType());
        res.setTargetId(r.getTargetId());
        res.setReason(r.getReason());
        res.setStatus(r.getStatus());
        res.setAdminNotes(r.getAdminNotes());
        res.setCreatedAt(r.getCreatedAt());
        res.setUpdatedAt(r.getUpdatedAt());
        return res;
    }

    public static List<ReportResponse> toResponseList(List<Report> list) {
        return list.stream().map(ReportMapper::toResponse).collect(Collectors.toList());
    }
}
