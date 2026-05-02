package com.zosh.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zosh.model.EmailVerificationToken;
import com.zosh.model.User;

import java.util.Optional;

public interface EmailVerificationTokenRepository extends JpaRepository<EmailVerificationToken, Long> {
    Optional<EmailVerificationToken> findByToken(String token);
    void deleteByUser(User user);
}
