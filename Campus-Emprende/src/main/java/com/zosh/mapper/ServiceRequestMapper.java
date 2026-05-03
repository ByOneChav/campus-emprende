package com.zosh.mapper;

import com.zosh.model.ServiceRequest;
import com.zosh.payload.response.ServiceRequestResponse;

import java.util.List;
import java.util.stream.Collectors;

// 🔄 Mapper de ServiceRequest
// Convierte Entity → DTO (respuesta al frontend)
public class ServiceRequestMapper {

    public static ServiceRequestResponse toResponse(ServiceRequest r) {

        // 📦 Crear objeto de respuesta
        ServiceRequestResponse res = new ServiceRequestResponse();

        // 🆔 ID de la solicitud
        res.setId(r.getId());

        // 📌 Datos del servicio solicitado
        res.setServiceId(r.getService().getId());
        res.setServiceTitle(r.getService().getTitle());

        // 👤 Datos del cliente (quien solicita)
        res.setClientId(r.getClient().getId());
        res.setClientName(r.getClient().getFullName());

        // 👤 Datos del proveedor (dueño del servicio)
        res.setProviderId(r.getService().getProvider().getId());
        res.setProviderName(r.getService().getProvider().getFullName());

        // 💬 Mensaje de la solicitud
        res.setMessage(r.getMessage());

        // 🔄 Estado del workflow
        res.setStatus(r.getStatus());

        // 🚫 Quién canceló (si aplica)
        res.setCancelledBy(r.getCancelledBy());

        // ⏱ Fecha de confirmación de finalización
        res.setCompletedAt(r.getCompletedAt());

        // 📅 Fechas de auditoría
        res.setCreatedAt(r.getCreatedAt());
        res.setUpdatedAt(r.getUpdatedAt());

        return res;
    }

    // 🔄 Conversión lista de solicitudes → lista de DTOs
    public static List<ServiceRequestResponse> toResponseList(List<ServiceRequest> list) {

        return list.stream()
                .map(ServiceRequestMapper::toResponse)
                .collect(Collectors.toList());
    }
}