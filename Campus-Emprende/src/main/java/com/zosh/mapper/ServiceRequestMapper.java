package com.zosh.mapper;

import com.zosh.model.ServiceRequest;
import com.zosh.payload.response.ServiceRequestResponse;

import java.util.List;
import java.util.stream.Collectors;

public class ServiceRequestMapper {

    public static ServiceRequestResponse toResponse(ServiceRequest r) {
        ServiceRequestResponse res = new ServiceRequestResponse();
        res.setId(r.getId());
        res.setServiceId(r.getService().getId());
        res.setServiceTitle(r.getService().getTitle());
        res.setClientId(r.getClient().getId());
        res.setClientName(r.getClient().getFullName());
        res.setProviderId(r.getService().getProvider().getId());
        res.setProviderName(r.getService().getProvider().getFullName());
        res.setMessage(r.getMessage());
        res.setStatus(r.getStatus());
        res.setCancelledBy(r.getCancelledBy());
        res.setCompletedAt(r.getCompletedAt());
        res.setCreatedAt(r.getCreatedAt());
        res.setUpdatedAt(r.getUpdatedAt());
        return res;
    }

    public static List<ServiceRequestResponse> toResponseList(List<ServiceRequest> list) {
        return list.stream().map(ServiceRequestMapper::toResponse).collect(Collectors.toList());
    }
}
