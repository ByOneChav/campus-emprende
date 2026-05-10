package com.zosh.mapper;

import com.zosh.domain.UserRole;
import com.zosh.model.User;
import com.zosh.payload.response.UserDTO;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class UserMapperTest {

    @Test
    void toDTO_mapsBasicFieldsWithoutPassword() {
        User user = new User();
        user.setId(7L);
        user.setEmail("student@duocuc.cl");
        user.setPassword("secret");
        user.setFullName("Elias Delgado");
        user.setPhone("+56911112222");
        user.setRole(UserRole.ROLE_STUDENT);
        user.setVerified(true);
        user.setLastLogin(LocalDateTime.now());

        UserDTO result = UserMapper.toDTO(user);

        assertEquals(7L, result.getId());
        assertEquals("student@duocuc.cl", result.getEmail());
        assertEquals("Elias Delgado", result.getFullName());
        assertEquals(UserRole.ROLE_STUDENT, result.getRole());
        assertTrue(result.getVerified());
        assertNull(result.getUsername());
    }
}
