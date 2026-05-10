package com.zosh.mapper;

import com.zosh.model.User;
import com.zosh.payload.request.SignupRequest;
import com.zosh.payload.response.UserDTO;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserMapper {

    public static UserDTO toDTO(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setEmail(user.getEmail());
        userDTO.setFullName(user.getFullName());
        userDTO.setPhone(user.getPhone());
        userDTO.setLastLogin(user.getLastLogin());
        userDTO.setRole(user.getRole());
        userDTO.setVerified(user.getVerified());
        return userDTO;
    }

    public static List<UserDTO> toDTOList(List<User> users) {
        return users.stream()
                .map(UserMapper::toDTO)
                .collect(Collectors.toList());
    }

    public static Set<UserDTO> toDTOSet(Set<User> users) {
        return users.stream()
                .map(UserMapper::toDTO)
                .collect(Collectors.toSet());
    }

    public static User toEntity(SignupRequest request) {
        User createdUser = new User();
        createdUser.setEmail(request.getEmail());
        createdUser.setPassword(request.getPassword());
        createdUser.setCreatedAt(LocalDateTime.now());
        createdUser.setPhone(request.getPhone());
        createdUser.setFullName(request.getFullName());
        return createdUser;
    }
}
