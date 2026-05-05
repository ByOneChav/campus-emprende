package com.zosh.TestUser;

import com.zosh.configurations.JwtProvider;
import com.zosh.domain.UserRole;
import com.zosh.exception.UserException;
import com.zosh.model.User;
import com.zosh.payload.projection.TopStudentProjection;
import com.zosh.payload.response.TopStudentResponse;
import com.zosh.repository.UserRepository;
import com.zosh.services.impl.UserServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtProvider jwtProvider;

    @InjectMocks
    private UserServiceImpl userService;

    // 🧪 Obtiene usuario por email correctamente
    @Test
    void getUserByEmail_success() throws Exception {
        User user = new User();
        user.setEmail("test@mail.com");

        when(userRepository.findByEmail("test@mail.com")).thenReturn(user);

        User result = userService.getUserByEmail("test@mail.com");

        assertNotNull(result);
        verify(userRepository).findByEmail("test@mail.com");
    }

    // 🧪 Lanza excepción si no encuentra usuario por email
    @Test
    void getUserByEmail_notFound() {
        when(userRepository.findByEmail("test@mail.com")).thenReturn(null);

        assertThrows(UserException.class, () -> userService.getUserByEmail("test@mail.com"));
    }

    // 🧪 Obtiene usuario desde JWT correctamente
    @Test
    void getUserFromJwtToken_success() throws Exception {
        User user = new User();
        user.setEmail("test@mail.com");

        when(jwtProvider.getEmailFromJwtToken("token")).thenReturn("test@mail.com");
        when(userRepository.findByEmail("test@mail.com")).thenReturn(user);

        User result = userService.getUserFromJwtToken("token");

        assertNotNull(result);
    }

    // 🧪 Lanza excepción si usuario no existe en JWT
    @Test
    void getUserFromJwtToken_notFound() {
        when(jwtProvider.getEmailFromJwtToken("token")).thenReturn("test@mail.com");
        when(userRepository.findByEmail("test@mail.com")).thenReturn(null);

        assertThrows(UserException.class, () -> userService.getUserFromJwtToken("token"));
    }

    // 🧪 Retorna usuario por ID cuando existe
    @Test
    void getUserById_success() throws Exception {
        User user = new User();
        user.setId(1L);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        User result = userService.getUserById(1L);

        assertNotNull(result);
    }

    // 🧪 ❌ Falla: espera excepción pero el método devuelve null
    @Test
    void getUserById_shouldThrowException_butFails() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(UserException.class, () -> userService.getUserById(1L));
    }

    // 🧪 Retorna null cuando usuario por ID no existe
    @Test
    void getUserById_notFound() throws Exception {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        User result = userService.getUserById(1L);

        assertNull(result);
    }

    // 🧪 ❌ Falla: valida un nombre incorrecto intencionalmente
    @Test
    void getTopStudents_wrongName_shouldFail() {
        TopStudentProjection projection = mock(TopStudentProjection.class);

        when(projection.getStudentId()).thenReturn(1L);
        when(projection.getStudentName()).thenReturn("Juan");
        when(projection.getStudentEmail()).thenReturn("juan@mail.com");
        when(projection.getTotalServices()).thenReturn(10L);
        when(projection.getTotalRequests()).thenReturn(8L);
        when(projection.getCompletedRequests()).thenReturn(6L);
        when(projection.getAverageRating()).thenReturn(4.5);

        when(userRepository.findTop5Students()).thenReturn(List.of(projection));

        List<TopStudentResponse> result = userService.getTopStudents();

        assertEquals("Pedro", result.get(0).getStudentName()); // ❌ fallará
    }

    // 🧪 Obtiene usuarios por rol correctamente
    @Test
    void getUserByRole_success() throws Exception {
        User user = new User();
        user.setRole(UserRole.ROLE_STUDENT);

        when(userRepository.findByRole(UserRole.ROLE_STUDENT)).thenReturn(Set.of(user));

        Set<User> result = userService.getUserByRole(UserRole.ROLE_STUDENT);

        assertEquals(1, result.size());
    }

    // 🧪 Obtiene lista de todos los usuarios
    @Test
    void getUsers_success() throws Exception {
        when(userRepository.findAll()).thenReturn(List.of(new User(), new User()));

        List<User> result = userService.getUsers();

        assertEquals(2, result.size());
    }

    // 🧪 Cuenta total de usuarios correctamente
    @Test
    void getTotalUserCount_success() {
        when(userRepository.count()).thenReturn(5L);

        long result = userService.getTotalUserCount();

        assertEquals(5, result);
    }

    // 🧪 Convierte proyección a TopStudentResponse correctamente
    @Test
    void getTopStudents_success() {
        TopStudentProjection projection = mock(TopStudentProjection.class);

        when(projection.getStudentId()).thenReturn(1L);
        when(projection.getStudentName()).thenReturn("Juan");
        when(projection.getStudentEmail()).thenReturn("juan@mail.com");
        when(projection.getTotalServices()).thenReturn(10L);
        when(projection.getTotalRequests()).thenReturn(8L);
        when(projection.getCompletedRequests()).thenReturn(6L);
        when(projection.getAverageRating()).thenReturn(4.5);

        when(userRepository.findTop5Students()).thenReturn(List.of(projection));

        List<TopStudentResponse> result = userService.getTopStudents();

        assertEquals(1, result.size());
        assertEquals("Juan", result.get(0).getStudentName());
    }

}