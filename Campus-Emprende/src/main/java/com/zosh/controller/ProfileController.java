package com.zosh.controller;

import com.zosh.exception.UserException;
import com.zosh.payload.request.ProfileRequest;
import com.zosh.payload.response.ProfileResponse;
import com.zosh.services.PdfService;
import com.zosh.services.ProfileService;
import io.swagger.v3.oas.annotations.Operation; // Swagger: describe endpoints
import io.swagger.v3.oas.annotations.tags.Tag;   // Swagger: agrupa endpoints
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequiredArgsConstructor

// Swagger: nombre y descripción del grupo en Swagger UI
@Tag(name = "Perfil", description = "Endpoints para gestión del perfil de usuario y exportación de CV")
public class ProfileController {

    private final ProfileService profileService;
    private final PdfService pdfService;

    // Obtener perfil del usuario autenticado
    @Operation(summary = "Obtener perfil del usuario autenticado")
    @GetMapping("/api/profiles/me")
    public ResponseEntity<ProfileResponse> getMyProfile() throws UserException {
        return ResponseEntity.ok(profileService.getMyProfile());
    }

    // Crear o actualizar perfil
    @Operation(summary = "Crear o actualizar perfil del usuario")
    @PutMapping("/api/profiles/me")
    public ResponseEntity<ProfileResponse> upsertProfile(@RequestBody ProfileRequest request) throws UserException {
        return ResponseEntity.ok(profileService.upsertProfile(request));
    }

    // Obtener perfil público por ID
    @Operation(summary = "Obtener perfil público de un usuario")
    @GetMapping("/profiles/{userId}")
    public ResponseEntity<ProfileResponse> getPublicProfile(@PathVariable Long userId) throws UserException {
        return ResponseEntity.ok(profileService.getPublicProfile(userId));
    }

    // Exportar perfil en PDF
    @Operation(summary = "Exportar perfil del usuario autenticado en PDF")
    @GetMapping("/api/profiles/me/export-pdf")
    public ResponseEntity<byte[]> exportPdf() throws UserException, IOException {
        byte[] pdf = pdfService.generateProfilePdf();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"portfolio.pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}