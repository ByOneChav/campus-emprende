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
import io.swagger.v3.oas.annotations.responses.ApiResponses;

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
    @Operation(
        summary = "Verificar correo electrónico mediante token",
        description = "Permite validar el correo electrónico de un usuario mediante un token enviado por email"
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Correo verificado correctamente"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Token inválido o expirado"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Usuario no encontrado"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/verify-email")
    public ResponseEntity<ApiResponse> verifyEmail(@RequestParam String token) throws UserException {

        // Se valida el token de verificación
        emailVerificationService.verifyEmail(token);

        // Se retorna respuesta de éxito
        return ResponseEntity.ok(new ApiResponse("Correo electrónico verificado exitosamente", true));
    }

    // Reenvía el correo de verificación al usuario
    @Operation(
        summary = "Reenviar correo de verificación",
        description = "Permite reenviar el correo de verificación a un usuario que aún no ha validado su cuenta"
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Correo de verificación reenviado correctamente"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Email inválido"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Usuario no encontrado"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PostMapping("/resend-verification")
    public ResponseEntity<ApiResponse> resendVerification(@RequestParam String email) throws UserException {

        // Se envía nuevamente el correo de verificación
        emailVerificationService.resendVerification(email);

        // Se retorna respuesta de éxito
        return ResponseEntity.ok(new ApiResponse("Correo electrónico de verificación enviado", true));
    }
}