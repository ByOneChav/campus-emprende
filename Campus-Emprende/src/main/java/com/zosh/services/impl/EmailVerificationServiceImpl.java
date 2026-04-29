package com.zosh.services.impl;

import com.zosh.exception.UserException;
import com.zosh.modal.EmailVerificationToken;
import com.zosh.modal.User;
import com.zosh.repository.EmailVerificationTokenRepository;
import com.zosh.repository.UserRepository;
import com.zosh.services.EmailService;
import com.zosh.services.EmailVerificationService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EmailVerificationServiceImpl implements EmailVerificationService {

    private final EmailVerificationTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Value("${app.frontend.verify-url}")
    private String frontendVerifyUrl;

    @Override
    @Transactional
    public void sendVerificationEmail(User user) {
        tokenRepository.deleteByUser(user);

        String token = UUID.randomUUID().toString();
        EmailVerificationToken verificationToken = EmailVerificationToken.builder()
                .user(user)
                .token(token)
                .expiresAt(LocalDateTime.now().plusHours(24))
                .build();
        tokenRepository.save(verificationToken);

        String verifyLink = frontendVerifyUrl + token;
        String subject = "Verify your Campus Emprende account";
        String body = "Welcome to Campus Emprende!\n\n"
                + "Please verify your email address by clicking the link below (valid 24 hours):\n\n"
                + verifyLink + "\n\n"
                + "If you did not create an account, you can safely ignore this email.";
        emailService.sendEmail(user.getEmail(), subject, body);
    }

    @Override
    @Transactional
    public void verifyEmail(String token) throws UserException {
        Optional<EmailVerificationToken> optional = tokenRepository.findByToken(token);
        if (optional.isEmpty()) {
            throw new UserException("Invalid verification token");
        }

        EmailVerificationToken verificationToken = optional.get();

        if (verificationToken.isUsed()) {
            throw new UserException("Verification token already used");
        }
        if (verificationToken.isExpired()) {
            tokenRepository.delete(verificationToken);
            throw new UserException("Verification token has expired. Please request a new one.");
        }

        User user = verificationToken.getUser();
        user.setVerified(true);
        userRepository.save(user);

        verificationToken.setUsedAt(LocalDateTime.now());
        tokenRepository.save(verificationToken);
    }

    @Override
    @Transactional
    public void resendVerification(String email) throws UserException {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UserException("No account found with this email");
        }
        if (Boolean.TRUE.equals(user.getVerified())) {
            throw new UserException("Email is already verified");
        }
        sendVerificationEmail(user);
    }
}
