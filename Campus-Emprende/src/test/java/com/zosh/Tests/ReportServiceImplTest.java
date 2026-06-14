package com.zosh.Tests;

import com.zosh.domain.ReportStatus;
import com.zosh.exception.UserException;
import com.zosh.mapper.ReportMapper;
import com.zosh.model.Report;
import com.zosh.model.User;
import com.zosh.payload.request.ReportRequest;
import com.zosh.payload.response.ReportResponse;
import com.zosh.repository.ReportRepository;
import com.zosh.services.UserService;
import com.zosh.services.impl.ReportServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

// 🧪 Pruebas unitarias para ReportServiceImpl
// Cubre creación de reportes, listado (con y sin filtro), resolución y conteo de pendientes.
@ExtendWith(MockitoExtension.class)
class ReportServiceImplTest {

    // 🔗 Repositorio de reportes (mockeado)
    @Mock
    private ReportRepository reportRepository;

    // 🔐 Servicio de usuario (mockeado, simula al usuario autenticado por JWT)
    @Mock
    private UserService userService;

    // 🧩 Clase real que se está probando
    @InjectMocks
    private ReportServiceImpl reportService;

    // =====================================================
    // 🚨 submitReport() — Crear reporte
    // =====================================================

    // 🧪 Crea un reporte correctamente y queda en estado PENDING
    @Test
    void submitReport_success() throws UserException {
        // 👤 Usuario que reporta
        User reporter = new User();
        reporter.setId(1L);

        // 📝 Datos del reporte
        ReportRequest request = new ReportRequest();
        request.setReason("Contenido inapropiado");

        // 💾 Reporte que "guardaría" el repositorio
        Report savedReport = Report.builder()
                .reporter(reporter)
                .targetType(request.getTargetType())
                .targetId(request.getTargetId())
                .reason(request.getReason())
                .status(ReportStatus.PENDING)
                .build();
        savedReport.setId(100L);

        // 🎯 Respuesta esperada del mapper
        ReportResponse expectedResponse = new ReportResponse();
        expectedResponse.setStatus(ReportStatus.PENDING);

        when(userService.getCurrentUser()).thenReturn(reporter);
        when(reportRepository.save(any(Report.class))).thenReturn(savedReport);

        try (MockedStatic<ReportMapper> mockedMapper = mockStatic(ReportMapper.class)) {
            mockedMapper.when(() -> ReportMapper.toResponse(savedReport)).thenReturn(expectedResponse);

            ReportResponse result = reportService.submitReport(request);

            assertNotNull(result);
            assertEquals(ReportStatus.PENDING, result.getStatus());
        }

        verify(reportRepository).save(any(Report.class));
    }

    // =====================================================
    // 📊 getReports() — Listar reportes
    // =====================================================

    // 🧪 Filtra correctamente los reportes por estado cuando se indica uno
    @Test
    void getReports_withStatus() {
        Report report = Report.builder().status(ReportStatus.PENDING).build();
        List<Report> reports = List.of(report);

        List<ReportResponse> expectedResponses = List.of(new ReportResponse());

        when(reportRepository.findByStatus(ReportStatus.PENDING)).thenReturn(reports);

        try (MockedStatic<ReportMapper> mockedMapper = mockStatic(ReportMapper.class)) {
            mockedMapper.when(() -> ReportMapper.toResponseList(reports)).thenReturn(expectedResponses);

            List<ReportResponse> result = reportService.getReports(ReportStatus.PENDING);

            assertEquals(1, result.size());
        }

        verify(reportRepository).findByStatus(ReportStatus.PENDING);
        // 🔍 No debería usarse findAll si se especificó un estado
        verify(reportRepository, never()).findAll();
    }

    // 🧪 Devuelve TODOS los reportes cuando no se indica ningún estado (status == null)
    @Test
    void getReports_withoutStatus() {
        Report report1 = Report.builder().status(ReportStatus.PENDING).build();
        Report report2 = Report.builder().status(ReportStatus.RESUELTO).build();
        List<Report> reports = List.of(report1, report2);

        List<ReportResponse> expectedResponses = List.of(new ReportResponse(), new ReportResponse());

        when(reportRepository.findAll()).thenReturn(reports);

        try (MockedStatic<ReportMapper> mockedMapper = mockStatic(ReportMapper.class)) {
            mockedMapper.when(() -> ReportMapper.toResponseList(reports)).thenReturn(expectedResponses);

            List<ReportResponse> result = reportService.getReports(null);

            assertEquals(2, result.size());
        }

        verify(reportRepository).findAll();
        // 🔍 No debería filtrar por estado si no se indicó ninguno
        verify(reportRepository, never()).findByStatus(any(ReportStatus.class));
    }

    // =====================================================
    // ✅ resolveReport() — Resolver reporte
    // =====================================================

    // 🧪 Marca correctamente un reporte como RESUELTO y guarda las notas del admin
    @Test
    void resolveReport_success() throws UserException {
        Report report = Report.builder().status(ReportStatus.PENDING).build();
        report.setId(5L);

        String adminNotes = "Revisado, sin infracciones graves";

        ReportResponse expectedResponse = new ReportResponse();
        expectedResponse.setStatus(ReportStatus.RESUELTO);

        when(reportRepository.findById(5L)).thenReturn(Optional.of(report));
        when(reportRepository.save(any(Report.class))).thenReturn(report);

        try (MockedStatic<ReportMapper> mockedMapper = mockStatic(ReportMapper.class)) {
            mockedMapper.when(() -> ReportMapper.toResponse(report)).thenReturn(expectedResponse);

            ReportResponse result = reportService.resolveReport(5L, adminNotes);

            assertEquals(ReportStatus.RESUELTO, result.getStatus());
        }

        // 🔍 Validar que el estado y las notas se actualizaron en el objeto real
        assertEquals(ReportStatus.RESUELTO, report.getStatus());
        assertEquals(adminNotes, report.getAdminNotes());
    }

    // 🧪 Lanza UserException si el reporte a resolver no existe
    @Test
    void resolveReport_notFound() {
        when(reportRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(UserException.class, () -> reportService.resolveReport(99L, "notas"));

        verify(reportRepository, never()).save(any(Report.class));
    }

    // =====================================================
    // 📈 countPending() — Métrica
    // =====================================================

    // 🧪 Devuelve el conteo de reportes pendientes
    @Test
    void countPending_success() {
        when(reportRepository.countByStatus(ReportStatus.PENDING)).thenReturn(3L);

        long result = reportService.countPending();

        assertEquals(3L, result);
        verify(reportRepository).countByStatus(ReportStatus.PENDING);
    }
}