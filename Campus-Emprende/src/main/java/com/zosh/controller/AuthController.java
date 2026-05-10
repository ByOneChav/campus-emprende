package com.zosh.controller;

import com.zosh.exception.UserException;
import com.zosh.payload.request.ForgotPasswordRequest;
import com.zosh.payload.request.LoginRequest;
import com.zosh.payload.request.ResetPasswordRequest;
import com.zosh.payload.request.SignupRequest;
import com.zosh.payload.response.ApiResponse;
import com.zosh.payload.response.AuthResponse;
import com.zosh.services.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticacion", description = "Endpoints para login, registro y recuperacion de contrasena")
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "Registrar usuario", description = "Permite registrar un nuevo usuario en el sistema")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Usuario registrado correctamente"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Datos invalidos"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signupHandler(@Valid @RequestBody SignupRequest req) throws UserException {
        return ResponseEntity.ok(authService.signup(req));
    }

    @Operation(summary = "Login de usuario", description = "Permite autenticar al usuario y obtener un token JWT")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Login exitoso"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Credenciales incorrectas"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginHandler(@Valid @RequestBody LoginRequest req) throws UserException {
        return ResponseEntity.ok(authService.login(req.getEmail(), req.getPassword()));
    }

    @Operation(
            summary = "Solicitar recuperacion de contrasena",
            description = "Envia un correo con enlace para restablecer la contrasena"
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Correo enviado correctamente"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Usuario no encontrado"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) throws UserException {
        authService.createPasswordResetToken(request.getEmail());
        return ResponseEntity.ok(new ApiResponse(
                "Se ha enviado un enlace de restablecimiento a su correo electronico.",
                true
        ));
    }

    @Operation(
            summary = "Restablecer contrasena",
            description = "Permite actualizar la contrasena usando un token valido"
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Contrasena actualizada correctamente"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Token invalido o expirado"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request.getToken(), request.getPassword());
        return ResponseEntity.ok(new ApiResponse("Restablecimiento de contrasena exitoso", true));
    }
}
