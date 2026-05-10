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
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtProvider jwtProvider;

    @InjectMocks
    private UserServiceImpl userService;

    @Test
    void getUserByEmailSuccess() throws Exception {
        User user = new User();
        user.setEmail("test@mail.com");

        when(userRepository.findByEmail("test@mail.com")).thenReturn(user);

        User result = userService.getUserByEmail("test@mail.com");

        assertNotNull(result);
    }

    @Test
    void getUserByEmailNotFound() {
        when(userRepository.findByEmail("test@mail.com")).thenReturn(null);

        assertThrows(UserException.class, () -> userService.getUserByEmail("test@mail.com"));
    }

    @Test
    void getUserFromJwtTokenSuccess() throws Exception {
        User user = new User();
        user.setEmail("test@mail.com");

        when(jwtProvider.getEmailFromJwtToken("token")).thenReturn("test@mail.com");
        when(userRepository.findByEmail("test@mail.com")).thenReturn(user);

        User result = userService.getUserFromJwtToken("token");

        assertNotNull(result);
    }

    @Test
    void getUserByIdReturnsNullWhenMissing() throws Exception {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertNull(userService.getUserById(1L));
    }

    @Test
    void getUserByRoleSuccess() throws Exception {
        User user = new User();
        user.setRole(UserRole.ROLE_STUDENT);

        when(userRepository.findByRole(UserRole.ROLE_STUDENT)).thenReturn(Set.of(user));

        Set<User> result = userService.getUserByRole(UserRole.ROLE_STUDENT);

        assertEquals(1, result.size());
    }

    @Test
    void getUsersSuccess() throws Exception {
        when(userRepository.findAll()).thenReturn(List.of(new User(), new User()));

        List<User> result = userService.getUsers();

        assertEquals(2, result.size());
    }

    @Test
    void getTotalUserCountSuccess() {
        when(userRepository.count()).thenReturn(5L);

        assertEquals(5L, userService.getTotalUserCount());
    }

    @Test
    void getTopStudentsSuccess() {
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
