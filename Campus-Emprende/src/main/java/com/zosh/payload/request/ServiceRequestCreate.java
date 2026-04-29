package com.zosh.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ServiceRequestCreate {

    @NotNull(message = "Service ID is required")
    private Long serviceId;

    @NotBlank(message = "Message is required")
    private String message;
}
