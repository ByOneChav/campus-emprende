package com.zosh.services.impl;


import com.zosh.configurations.JwtProvider;
import com.zosh.domain.UserRole;
import com.zosh.exception.UserException;
import com.zosh.model.User;
import com.zosh.payload.projection.TopStudentProjection;
import com.zosh.payload.response.TopStudentResponse;
import com.zosh.repository.UserRepository;
import com.zosh.services.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service // 🧠 Lógica de negocio del módulo User
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository; // 🗄️ Acceso a BD

	private final JwtProvider jwtProvider; // 🔐 Manejo de JWT


	// 🔍 Obtener usuario por email
	@Override
	public User getUserByEmail(String email) throws UserException {
		User user=userRepository.findByEmail(email);
		if(user==null){
			throw new UserException("Usuario no encontrado con el correo electrónico: "+email);
		}
		return user;
	}

	// 🔐 Obtener usuario desde JWT
	@Override
	public User getUserFromJwtToken(String jwt) throws UserException {

        // Extrae email desde el token
		String email = jwtProvider.getEmailFromJwtToken(jwt);

        // Busca usuario en BD
		User user = userRepository.findByEmail(email);

        // Valida existencia
		if(user==null) throw new UserException("El usuario no existe con ese correo electrónico. YAPO REVISA BIEN WEONO/A "+email);

		return user;
	}

	// 🔍 Obtener usuario por ID
	@Override
	public User getUserById(Long id) throws UserException {

        // Busca por ID (puede devolver null)
		return userRepository.findById(id).orElse(null);
	}

	// 👥 Obtener usuarios por rol
	@Override
	public Set<User> getUserByRole(UserRole role) throws UserException {
		return userRepository.findByRole(role);
	}

	// 👤 Obtener usuario autenticado actual
	@Override
	public User getCurrentUser() {

        // Obtiene email desde el contexto de seguridad (Spring Security)
		String email = SecurityContextHolder.getContext().getAuthentication().getName();

        // Busca usuario en BD
		User user= userRepository.findByEmail(email);

        // Valida existencia
		if(user == null) {
			throw new EntityNotFoundException("Usuario no encontrado");
		}
		return user;
	}


	// 📋 Obtener todos los usuarios
	@Override
	public List<User> getUsers() throws UserException {
		return userRepository.findAll();
	}

	// 📊 Contar total de usuarios
	@Override
	public long getTotalUserCount() {
		return userRepository.count();
	}

	// 🏆 Obtener top estudiantes (ranking)
	@Override
	public List<TopStudentResponse> getTopStudents() {

        // Ejecuta query del repository (proyección)
		List<TopStudentProjection> projections = userRepository.findTop5Students();

        // Convierte Projection → Response DTO
		return projections.stream()
				.map(p -> new TopStudentResponse(
						p.getStudentId(),
						p.getStudentName(),
						p.getStudentEmail(),
						p.getTotalServices(),
						p.getTotalRequests(),
						p.getCompletedRequests(),
						p.getAverageRating()))
				.collect(Collectors.toList());
	}

}