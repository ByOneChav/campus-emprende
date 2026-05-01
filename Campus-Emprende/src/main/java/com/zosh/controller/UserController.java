package com.zosh.controller;

import com.zosh.exception.UserException;
import com.zosh.mapper.UserMapper;
import com.zosh.modal.User;
import com.zosh.payload.response.UserDTO;
import com.zosh.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// Swagger imports
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequiredArgsConstructor

// Agrupa endpoints relacionados a usuarios
@Tag(
    name = "Usuarios",
    description = "Endpoints para gestión y consulta de usuarios"
)
public class UserController {

	private final UserService userService;

	// Obtener perfil del usuario autenticado a partir del JWT
	@Operation(summary = "Obtener perfil del usuario autenticado")
	@GetMapping("/api/users/profile")
	public ResponseEntity<UserDTO> getUserProfileFromJwtHandler(
			@RequestHeader("Authorization") String jwt) throws UserException {
		User user = userService.getUserFromJwtToken(jwt);
		UserDTO userDTO = UserMapper.toDTO(user);

		return new ResponseEntity<>(userDTO, HttpStatus.OK);
	}

	// Obtener lista de todos los usuarios
	@Operation(summary = "Obtener lista de usuarios")
	@GetMapping("/users/list")
	public ResponseEntity<List<User>> getUsersListHandler() throws UserException {
		List<User> users = userService.getUsers();

		return new ResponseEntity<>(users, HttpStatus.OK);
	}

	// Obtener usuario por ID
	@Operation(summary = "Obtener usuario por ID")
	@GetMapping("/users/{userId}")
	public ResponseEntity<UserDTO> getUserByIdHandler(
			@PathVariable Long userId
	) throws UserException {
		User user = userService.getUserById(userId);
		UserDTO userDTO = UserMapper.toDTO(user);

		return new ResponseEntity<>(userDTO, HttpStatus.OK);
	}

	/**
	 * Get total user statistics (Admin only)
	 * GET /api/users/statistics
	 *
	 * Returns total number of registered users in the system
	 *
	 * Example response:
	 * {
	 *   "totalUsers": 245
	 * }
	 */

	// Obtener estadísticas de usuarios (solo ADMIN)
	@Operation(summary = "Obtener estadísticas de usuarios (ADMIN)")
	@GetMapping("/api/users/statistics")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<UserStatisticsResponse> getUserStatistics() {
		long totalUsers = userService.getTotalUserCount();
		return ResponseEntity.ok(new UserStatisticsResponse(totalUsers));
	}

	/**
	 * Response DTO for user statistics endpoint
	 */

	public static class UserStatisticsResponse {
		public long totalUsers;

		public UserStatisticsResponse(long totalUsers) {
			this.totalUsers = totalUsers;
		}
	}

}