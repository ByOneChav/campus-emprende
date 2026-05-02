package com.zosh.services;


import com.zosh.domain.UserRole;
import com.zosh.exception.UserException;
import com.zosh.model.User;
import com.zosh.payload.response.TopStudentResponse;

import java.util.List;
import java.util.Set;

// 🧠 Interfaz del servicio de usuarios
// Define las operaciones disponibles del módulo User (sin implementación)
public interface UserService {

	// 🔍 Obtener usuario por email (usado en login o validaciones)
	User getUserByEmail(String email) throws UserException;

	// 🔐 Obtener usuario a partir del JWT
	// Extrae el email del token y busca el usuario
	User getUserFromJwtToken(String jwt) throws UserException;

	// 🔍 Obtener usuario por ID
	User getUserById(Long id) throws UserException;

	// 👥 Obtener usuarios por rol (ADMIN, STUDENT, etc.)
	Set<User> getUserByRole(UserRole role) throws UserException;

	// 📋 Obtener todos los usuarios
	List<User> getUsers() throws UserException;

	// 👤 Obtener usuario actual autenticado (desde contexto de seguridad)
	User getCurrentUser() throws UserException;


	/**
	 * 📊 Obtener total de usuarios (solo ADMIN)
	 */
	long getTotalUserCount();

	// 🏆 Obtener top estudiantes (basado en métricas)
	List<TopStudentResponse> getTopStudents();
}