package com.zosh.mapper;

import com.zosh.model.User;
import com.zosh.payload.response.UserDTO;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

// 🔄 Mapper de usuario
// Se encarga de convertir entre Entity (User) y DTO (UserDTO)
@Service
public class UserMapper {

    // 🔄 Convierte Entity → DTO
    public static UserDTO toDTO(User user) {
        UserDTO userDTO = new UserDTO();

        // Mapea campos principales
        userDTO.setId(user.getId());
        userDTO.setEmail(user.getEmail());
        userDTO.setFullName(user.getFullName());
        userDTO.setPhone(user.getPhone());
        userDTO.setLastLogin(user.getLastLogin());
        userDTO.setRole(user.getRole());

        return userDTO;
    }

    // 🔄 Convierte lista de Entities → lista de DTOs
    public static List<UserDTO> toDTOList(List<User> users) {
        return users.stream()
                .map(UserMapper::toDTO)
                .collect(Collectors.toList());
    }

    // 🔄 Convierte set de Entities → set de DTOs
    public static Set<UserDTO> toDTOSet(Set<User> users) {
        return users.stream()
                .map(UserMapper::toDTO)
                .collect(Collectors.toSet());
    }

    // 🔄 Convierte DTO → Entity (para crear usuario)
    public static User toEntity(UserDTO userDTO) {

        // Crea nueva entidad User
        User createdUser = new User();

        // Mapea datos desde el DTO
        createdUser.setEmail(userDTO.getEmail());
        createdUser.setPassword(userDTO.getPassword());
        createdUser.setCreatedAt(LocalDateTime.now());
        createdUser.setPhone(userDTO.getPhone());
        createdUser.setFullName(userDTO.getFullName());
        createdUser.setRole(userDTO.getRole());

        return createdUser;
    }
}