package com.zosh.mapper;

import com.zosh.model.Report;
import com.zosh.payload.response.ReportResponse;

import java.util.List;
import java.util.stream.Collectors;

public class ReportMapper {

    // convierte Report → ReportResponse
    public static ReportResponse toResponse(Report r) {
        ReportResponse res = new ReportResponse();

        res.setId(r.getId()); // id del reporte

        res.setReporterId(r.getReporter().getId()); // id del usuario que reporta
        res.setReporterName(r.getReporter().getFullName()); // nombre del usuario

        res.setTargetType(r.getTargetType()); // tipo de objetivo reportado
        res.setTargetId(r.getTargetId()); // id del objetivo

        res.setReason(r.getReason()); // motivo del reporte

        res.setStatus(r.getStatus()); // estado (PENDING, RESUELTO)

        res.setAdminNotes(r.getAdminNotes()); // notas del admin

        res.setCreatedAt(r.getCreatedAt()); // fecha creación
        res.setUpdatedAt(r.getUpdatedAt()); // fecha actualización

        return res;
    }

    // convierte lista de Report → lista de DTO
    public static List<ReportResponse> toResponseList(List<Report> list) {
        return list.stream()
                .map(ReportMapper::toResponse) // transforma cada elemento
                .collect(Collectors.toList()); // devuelve lista
    }
}