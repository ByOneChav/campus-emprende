package com.zosh.controller;

import com.zosh.exception.UserException;
import com.zosh.payload.response.ApiResponse;
import com.zosh.services.EmailVerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// Swagger imports
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor

// Agrupa endpoints relacionados a verificación de correo en Swagger
@Tag(
    name = "Verificación de Email",
    description = "Endpoints para verificar correo electrónico y reenviar verificación"
)
public class EmailVerificationController {

    private final EmailVerificationService emailVerificationService;

    // Verifica el correo usando un token enviado por email
    @Operation(summary = "Verificar correo electrónico mediante token")
    @GetMapping("/verify-email")
    public ResponseEntity<ApiResponse> verifyEmail(@RequestParam String token) throws UserException {
        emailVerificationService.verifyEmail(token);
        return ResponseEntity.ok(new ApiResponse("Correo electrónico verificado exitosamente", true));
    }

    // Reenvía el correo de verificación al usuario
    @Operation(summary = "Reenviar correo de verificación")
    @PostMapping("/resend-verification")
    public ResponseEntity<ApiResponse> resendVerification(@RequestParam String email) throws UserException {
        emailVerificationService.resendVerification(email);
        return ResponseEntity.ok(new ApiResponse("Correo electrónico de verificación enviado", true));
    }
}