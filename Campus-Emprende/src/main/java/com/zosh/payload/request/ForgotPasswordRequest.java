package com.zosh.payload.request;

import lombok.Data;

@Data
public class ForgotPasswordRequest {
    private String email; // email del usuario que solicita recuperar contraseña
}