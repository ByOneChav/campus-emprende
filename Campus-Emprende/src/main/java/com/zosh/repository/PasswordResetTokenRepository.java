package com.zosh.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.zosh.model.PasswordResetToken;

import java.time.LocalDateTime;
import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
    void deleteAllByExpiryDateBefore(LocalDateTime dateTime);
}
