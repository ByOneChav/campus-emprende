package com.zosh.controller;

import com.zosh.exception.UserException;
import com.zosh.payload.request.ForgotPasswordRequest;
import com.zosh.payload.request.LoginRequest;
import com.zosh.payload.request.ResetPasswordRequest;
import com.zosh.payload.response.ApiResponse;
import com.zosh.payload.response.AuthResponse;
import com.zosh.payload.response.UserDTO;
import com.zosh.services.AuthService;

// Swagger imports
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor

// Agrupa endpoints en Swagger
@Tag(name = "Autenticación", description = "Endpoints para login, registro y recuperación de contraseña")
public class AuthController {

    private final AuthService authService;

    // Registrar un nuevo usuario
    @Operation(
        summary = "Registrar usuario",
        description = "Permite registrar un nuevo usuario en el sistema"
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Usuario registrado correctamente"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Datos inválidos"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signupHandler(
            @RequestBody UserDTO req) throws UserException {

        AuthResponse response = authService.signup(req);
        return ResponseEntity.ok(response);
    }

    // Login de usuario y generación de JWT
    @Operation(
        summary = "Login de usuario",
        description = "Permite autenticar al usuario y obtener un token JWT"
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Login exitoso"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Credenciales incorrectas"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginHandler(
            @RequestBody LoginRequest req) throws UserException {

        AuthResponse response = authService.login(req.getEmail(), req.getPassword());
        return ResponseEntity.ok(response);
    }

    // Solicitar recuperación de contraseña
    @Operation(
        summary = "Solicitar recuperación de contraseña",
        description = "Envía un correo con enlace para restablecer la contraseña"
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Correo enviado correctamente"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Usuario no encontrado"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse> forgotPassword(
            @RequestBody ForgotPasswordRequest request
    ) throws UserException {

        authService.createPasswordResetToken(request.getEmail());

        ApiResponse res = new ApiResponse(
                "Se ha enviado un enlace de restablecimiento a su correo electrónico.", true
        );
        return ResponseEntity.ok(res);
    }

    // Restablecer contraseña usando token
    @Operation(
        summary = "Restablecer contraseña",
        description = "Permite actualizar la contraseña usando un token válido"
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Contraseña actualizada correctamente"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Token inválido o expirado"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse> resetPassword(
            @RequestBody ResetPasswordRequest request) {

        authService.resetPassword(request.getToken(), request.getPassword());

        ApiResponse res = new ApiResponse(
                "Restablecimiento de contraseña exitosa", true
        );
        return ResponseEntity.ok(res);
    }
}