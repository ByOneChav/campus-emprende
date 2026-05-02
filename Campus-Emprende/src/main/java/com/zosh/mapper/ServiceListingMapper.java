package com.zosh.mapper;

import com.zosh.model.ServiceListing;
import com.zosh.payload.response.ServiceListingResponse;

import java.util.List;
import java.util.stream.Collectors;

public class ServiceListingMapper {

    public static ServiceListingResponse toResponse(ServiceListing s) {
        return toResponse(s, 0L);
    }

    public static ServiceListingResponse toResponse(ServiceListing s, long commentCount) {
        ServiceListingResponse res = new ServiceListingResponse();
        res.setId(s.getId());
        res.setProviderId(s.getProvider().getId());
        res.setProviderName(s.getProvider().getFullName());
        res.setTitle(s.getTitle());
        res.setDescription(s.getDescription());
        res.setCategory(s.getCategory());
        res.setStatus(s.getStatus());
        res.setRejectionReason(s.getRejectionReason());
        res.setImageUrl(s.getImageUrl());
        res.setCommentCount(commentCount);
        res.setCreatedAt(s.getCreatedAt());
        res.setUpdatedAt(s.getUpdatedAt());
        return res;
    }

    public static List<ServiceListingResponse> toResponseList(List<ServiceListing> list) {
        return list.stream().map(ServiceListingMapper::toResponse).collect(Collectors.toList());
    }
}
