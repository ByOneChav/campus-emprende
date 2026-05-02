package com.zosh.controller;

import com.zosh.exception.UserException;
import com.zosh.mapper.UserMapper;
import com.zosh.model.User;
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
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController // 📥 Controlador REST (entrada de peticiones)
@RequiredArgsConstructor

// 📚 Agrupa endpoints relacionados a usuarios
@Tag(
    name = "Usuarios",
    description = "Endpoints para gestión, consulta y estadísticas de usuarios del sistema"
)
public class UserController {

	private final UserService userService; // 🔗 Lógica de negocio

	// 👤 PERFIL DEL USUARIO AUTENTICADO (desde JWT)
	@Operation(
        summary = "Obtener perfil del usuario autenticado",
        description = "Obtiene la información del usuario autenticado a partir del token JWT enviado en el header Authorization"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Perfil obtenido correctamente"),
        @ApiResponse(responseCode = "401", description = "Token inválido o no autorizado"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
	@GetMapping("/api/users/profile")
	public ResponseEntity<UserDTO> getUserProfileFromJwtHandler(
			@RequestHeader("Authorization") String jwt) throws UserException {

        // 🔐 Extrae usuario desde el token
		User user = userService.getUserFromJwtToken(jwt);

        // 🔄 Convierte Entity → DTO
		UserDTO userDTO = UserMapper.toDTO(user);

		return new ResponseEntity<>(userDTO, HttpStatus.OK);
	}

	// 📋 LISTA DE USUARIOS
	@Operation(
        summary = "Obtener lista de usuarios",
        description = "Devuelve una lista completa de todos los usuarios registrados en el sistema"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista obtenida correctamente"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
	@GetMapping("/users/list")
	public ResponseEntity<List<User>> getUsersListHandler() throws UserException {

        // 📥 Obtiene todos los usuarios
		List<User> users = userService.getUsers();

		return new ResponseEntity<>(users, HttpStatus.OK);
	}

	// 🔍 USUARIO POR ID
	@Operation(
        summary = "Obtener usuario por ID",
        description = "Obtiene la información de un usuario específico a partir de su ID"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuario encontrado"),
        @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
	@GetMapping("/users/{userId}")
	public ResponseEntity<UserDTO> getUserByIdHandler(
			@PathVariable Long userId
	) throws UserException {

        // 🔍 Busca usuario en BD
		User user = userService.getUserById(userId);

        // 🔄 Entity → DTO
		UserDTO userDTO = UserMapper.toDTO(user);

		return new ResponseEntity<>(userDTO, HttpStatus.OK);
	}

	// 📊 ESTADÍSTICAS (solo ADMIN)
	@Operation(
        summary = "Obtener estadísticas de usuarios (ADMIN)",
        description = "Devuelve estadísticas generales de usuarios, como el total registrado en el sistema. Requiere rol ADMIN"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Estadísticas obtenidas correctamente"),
        @ApiResponse(responseCode = "403", description = "Acceso denegado"),
        @ApiResponse(responseCode = "500", description = "Error interno del servidor")
    })
	@GetMapping("/api/users/statistics")
	@PreAuthorize("hasRole('ADMIN')") // 🔐 Solo ADMIN puede acceder
	public ResponseEntity<UserStatisticsResponse> getUserStatistics() {

        // 📊 Obtiene total de usuarios
		long totalUsers = userService.getTotalUserCount();

        // 📤 Retorna DTO simple
		return ResponseEntity.ok(new UserStatisticsResponse(totalUsers));
	}

    // 📦 DTO interno para estadísticas
	public static class UserStatisticsResponse {

        // Total de usuarios registrados
		public long totalUsers;

		public UserStatisticsResponse(long totalUsers) {
			this.totalUsers = totalUsers;
		}
	}

}