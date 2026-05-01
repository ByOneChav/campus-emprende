package com.zosh.controller;

import com.zosh.exception.UserException;
import com.zosh.payload.request.ForgotPasswordRequest;
import com.zosh.payload.request.LoginRequest;
import com.zosh.payload.request.ResetPasswordRequest;
import com.zosh.payload.response.ApiResponse;
import com.zosh.payload.response.AuthResponse;
import com.zosh.payload.response.UserDTO;
import com.zosh.services.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor

@Tag(name = "Autenticación", description = "Endpoints para login, registro y recuperación de contraseña")
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "Registrar usuario")
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signupHandler(
            @RequestBody UserDTO req) throws UserException {

        AuthResponse response = authService.signup(req);
        return ResponseEntity.ok(response);
    }

    
    @Operation(summary = "Login de usuario")
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginHandler(
            @RequestBody LoginRequest req) throws UserException {

        AuthResponse response = authService.login(req.getEmail(), req.getPassword());
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Solicitar recuperación de contraseña")
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

    @Operation(summary = "Restablecer contraseña")
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