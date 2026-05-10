package com.zosh.payload.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SignupRequest {

    @NotBlank(message = "El nombre completo es obligatorio")
    @Size(min = 2, max = 120, message = "El nombre completo debe tener entre 2 y 120 caracteres")
    private String fullName;

    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "El correo debe tener un formato valido")
    private String email;

    @NotBlank(message = "La contrasena es obligatoria")
    @Size(min = 8, message = "La contrasena debe tener al menos 8 caracteres")
    private String password;

    @Size(max = 30, message = "El telefono no puede superar los 30 caracteres")
    private String phone;
}
