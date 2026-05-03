package com.zosh.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zosh.model.EmailVerificationToken;
import com.zosh.model.User;

import java.util.Optional;

// repositorio JPA para tokens de verificación
public interface EmailVerificationTokenRepository extends JpaRepository<EmailVerificationToken, Long> {

    Optional<EmailVerificationToken> findByToken(String token); // buscar token por valor

    void deleteByUser(User user); // eliminar tokens anteriores del usuario
}