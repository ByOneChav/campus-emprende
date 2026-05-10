package com.zosh.controller;

import com.zosh.exception.UserException;
import com.zosh.payload.request.ProfileRequest;
import com.zosh.payload.response.ProfileResponse;
import com.zosh.services.PdfService;
import com.zosh.services.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@Tag(name = "Perfil", description = "Endpoints para gestion del perfil de usuario y exportacion de CV")
public class ProfileController {

    private final ProfileService profileService;
    private final PdfService pdfService;

    @Operation(
            summary = "Obtener perfil del usuario autenticado",
            description = "Devuelve la informacion completa del perfil del usuario actualmente autenticado"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Perfil obtenido correctamente"),
            @ApiResponse(responseCode = "401", description = "No autorizado"),
            @ApiResponse(responseCode = "404", description = "Perfil no encontrado"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/api/profiles/me")
    public ResponseEntity<ProfileResponse> getMyProfile() throws UserException {
        return ResponseEntity.ok(profileService.getMyProfile());
    }

    @Operation(
            summary = "Crear o actualizar perfil del usuario",
            description = "Permite crear un nuevo perfil o actualizar uno existente para el usuario autenticado"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Perfil creado o actualizado correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos invalidos"),
            @ApiResponse(responseCode = "401", description = "No autorizado"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @PutMapping("/api/profiles/me")
    public ResponseEntity<ProfileResponse> upsertProfile(@Valid @RequestBody ProfileRequest request) throws UserException {
        return ResponseEntity.ok(profileService.upsertProfile(request));
    }

    @Operation(
            summary = "Obtener perfil publico de un usuario",
            description = "Permite obtener el perfil publico de cualquier usuario mediante su ID"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Perfil encontrado"),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado"),
            @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
    @GetMapping("/profiles/{userId}")
    public ResponseEntity<ProfileResponse> getPublicProfile(@PathVariable Long userId) throws UserException {
        return ResponseEntity.ok(profileService.getPublicProfile(userId));
    }

    @Operation(
            summary = "Exportar perfil en PDF",
            description = "Genera y descarga el perfil del usuario autenticado en formato PDF"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "PDF generado correctamente"),
            @ApiResponse(responseCode = "401", description = "No autorizado"),
            @ApiResponse(responseCode = "500", description = "Error al generar el PDF")
    })
    @GetMapping("/api/profiles/me/export-pdf")
    public ResponseEntity<byte[]> exportPdf() throws UserException, IOException {
        byte[] pdf = pdfService.generateProfilePdf();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"portfolio.pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
