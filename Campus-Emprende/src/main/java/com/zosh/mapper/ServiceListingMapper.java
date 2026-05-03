package com.zosh.mapper;

import com.zosh.model.ServiceListing;
import com.zosh.payload.response.ServiceListingResponse;

import java.util.List;
import java.util.stream.Collectors;

// 🔄 Mapper de ServiceListing
// Convierte Entity → Response DTO
public class ServiceListingMapper {

    // 🔄 Conversión básica (sin comentarios)
    public static ServiceListingResponse toResponse(ServiceListing s) {
        return toResponse(s, 0L);
    }

    // 🔄 Conversión completa (incluye cantidad de comentarios)
    public static ServiceListingResponse toResponse(ServiceListing s, long commentCount) {

        ServiceListingResponse res = new ServiceListingResponse();

        // 🆔 Datos básicos
        res.setId(s.getId());

        // 👤 Datos del proveedor (relación Service → User)
        res.setProviderId(s.getProvider().getId());
        res.setProviderName(s.getProvider().getFullName());

        // 📝 Datos del servicio
        res.setTitle(s.getTitle());
        res.setDescription(s.getDescription());
        res.setCategory(s.getCategory());
        res.setStatus(s.getStatus());

        // ❌ Motivo de rechazo (si aplica)
        res.setRejectionReason(s.getRejectionReason());

        // 🖼️ Imagen
        res.setImageUrl(s.getImageUrl());

        // 💬 Cantidad de comentarios (dato adicional)
        res.setCommentCount(commentCount);

        // 📅 Fechas
        res.setCreatedAt(s.getCreatedAt());
        res.setUpdatedAt(s.getUpdatedAt());

        return res;
    }

    // 🔄 Conversión lista de Entity → lista de DTO
    public static List<ServiceListingResponse> toResponseList(List<ServiceListing> list) {

        return list.stream()
                .map(ServiceListingMapper::toResponse)
                .collect(Collectors.toList());
    }
}