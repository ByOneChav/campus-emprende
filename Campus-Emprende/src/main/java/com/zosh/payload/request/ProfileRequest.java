package com.zosh.payload.request;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProfileRequest {

    @Size(max = 500, message = "La biografia no puede superar los 500 caracteres")
    private String bio;

    @Size(max = 120, message = "La carrera no puede superar los 120 caracteres")
    private String career;

    @Size(max = 255, message = "La URL del avatar no puede superar los 255 caracteres")
    private String avatarUrl;

    @Size(max = 255, message = "La URL de LinkedIn no puede superar los 255 caracteres")
    private String linkedinUrl;
}
