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

@RestController // 📥 Punto de entrada de las peticiones HTTP
@RequestMapping("/auth") // Ruta base de autenticación
@RequiredArgsConstructor

// 📚 Agrupa endpoints en Swagger
@Tag(name = "Autenticación", description = "Endpoints para login, registro y recuperación de contraseña")
public class AuthController {

    private final AuthService authService; // 🔗 Conecta con la lógica de negocio

    // 📝 REGISTRO DE USUARIO
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

        // Llama al servicio para registrar usuario + generar JWT
        AuthResponse response = authService.signup(req);

        return ResponseEntity.ok(response);
    }

    // 🔐 LOGIN DE USUARIO
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

        // Valida credenciales y genera token
        AuthResponse response = authService.login(req.getEmail(), req.getPassword());

        return ResponseEntity.ok(response);
    }

    // 📩 SOLICITAR RECUPERACIÓN DE CONTRASEÑA
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

        // Genera token y envía correo
        authService.createPasswordResetToken(request.getEmail());

        ApiResponse res = new ApiResponse(
                "Se ha enviado un enlace de restablecimiento a su correo electrónico.", true
        );
        return ResponseEntity.ok(res);
    }

    // 🔑 RESTABLECER CONTRASEÑA
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

        // Valida token y actualiza contraseña
        authService.resetPassword(request.getToken(), request.getPassword());

        ApiResponse res = new ApiResponse(
                "Restablecimiento de contraseña exitosa", true
        );
        return ResponseEntity.ok(res);
    }
}