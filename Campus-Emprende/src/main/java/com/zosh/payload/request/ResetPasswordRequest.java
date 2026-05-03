package com.zosh.payload.request;

import lombok.Data;

@Data
public class ResetPasswordRequest {

    private String token; // token recibido por email para validar el reset

    private String password; // nueva contraseña del usuario
}