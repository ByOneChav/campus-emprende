package com.zosh.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zosh.model.Profile;
import com.zosh.model.User;

import java.util.Optional;

// 🗄️ Repositorio de Profile
// Maneja acceso a la base de datos para perfiles
public interface ProfileRepository extends JpaRepository<Profile, Long> {

    // 🔍 Busca perfil por entidad User
    // Usado para obtener el perfil del usuario autenticado
    Optional<Profile> findByUser(User user);

    // 🔍 Busca perfil por ID de usuario
    // Usado para perfiles públicos
    Optional<Profile> findByUserId(Long userId);
}