package com.zosh.controller;

import com.zosh.exception.UserException;
import com.zosh.payload.response.ApiResponse;
import com.zosh.services.EmailVerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class EmailVerificationController {

    private final EmailVerificationService emailVerificationService;

    @GetMapping("/verify-email")
    public ResponseEntity<ApiResponse> verifyEmail(@RequestParam String token) throws UserException {
        emailVerificationService.verifyEmail(token);
        return ResponseEntity.ok(new ApiResponse("Email verified successfully", true));
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<ApiResponse> resendVerification(@RequestParam String email) throws UserException {
        emailVerificationService.resendVerification(email);
        return ResponseEntity.ok(new ApiResponse("Verification email sent", true));
    }
}
