package com.zosh.controller;

import com.zosh.exception.UserException;
import com.zosh.payload.request.ProfileRequest;
import com.zosh.payload.response.ProfileResponse;
import com.zosh.services.PdfService;
import com.zosh.services.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;
    private final PdfService pdfService;

    @GetMapping("/api/profiles/me")
    public ResponseEntity<ProfileResponse> getMyProfile() throws UserException {
        return ResponseEntity.ok(profileService.getMyProfile());
    }

    @PutMapping("/api/profiles/me")
    public ResponseEntity<ProfileResponse> upsertProfile(@RequestBody ProfileRequest request) throws UserException {
        return ResponseEntity.ok(profileService.upsertProfile(request));
    }

    @GetMapping("/profiles/{userId}")
    public ResponseEntity<ProfileResponse> getPublicProfile(@PathVariable Long userId) throws UserException {
        return ResponseEntity.ok(profileService.getPublicProfile(userId));
    }

    @GetMapping("/api/profiles/me/export-pdf")
    public ResponseEntity<byte[]> exportPdf() throws UserException, IOException {
        byte[] pdf = pdfService.generateProfilePdf();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"portfolio.pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
