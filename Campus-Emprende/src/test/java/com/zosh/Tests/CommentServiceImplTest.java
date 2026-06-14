package com.zosh.Tests;

import com.zosh.exception.UserException;
import com.zosh.mapper.CommentMapper;
import com.zosh.model.Comment;
import com.zosh.model.ServiceListing;
import com.zosh.model.User;
import com.zosh.payload.request.CommentRequest;
import com.zosh.payload.response.CommentResponse;
import com.zosh.repository.CommentRepository;
import com.zosh.repository.ServiceListingRepository;
import com.zosh.services.UserService;
import com.zosh.services.impl.CommentServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

// 🧪 Pruebas unitarias para CommentServiceImpl
// Sigue la misma estructura y estilo que UserServiceImplTest:
// @Mock para las dependencias, @InjectMocks para la clase real que probamos.
@ExtendWith(MockitoExtension.class)
class CommentServiceImplTest {

    // 🔗 Repositorio de comentarios (mockeado, no toca la BD real)
    @Mock
    private CommentRepository commentRepository;

    // 🔗 Repositorio de servicios (mockeado, para validar existencia del servicio)
    @Mock
    private ServiceListingRepository serviceListingRepository;

    // 🔐 Servicio de usuario (mockeado, simula al usuario autenticado por JWT)
    @Mock
    private UserService userService;

    // 🧩 Clase real que se está probando, con los mocks de arriba inyectados automáticamente
    @InjectMocks
    private CommentServiceImpl commentService;

    // =====================================================
    // ✍️ addComment()
    // =====================================================

    // 🧪 Agrega un comentario correctamente cuando el servicio existe
    @Test
    void addComment_success() throws UserException {

        // 👤 Usuario autenticado simulado (será el "author" del comentario)
        User author = new User();
        author.setId(1L);
        author.setEmail("test@mail.com");

        // 🛠️ Servicio existente al que se le va a comentar
        ServiceListing service = new ServiceListing();
        service.setId(10L);

        // 📝 Datos que llegan en el request (contenido del comentario)
        CommentRequest request = new CommentRequest();
        request.setContent("Excelente servicio!");

        // 💾 Comentario "guardado" que devolvería el repositorio (simulado)
        Comment savedComment = Comment.builder()
                .service(service)
                .author(author)
                .content(request.getContent())
                .build();

        // 🎯 Respuesta que debería generar el mapper a partir del comentario guardado
        CommentResponse expectedResponse = new CommentResponse();
        expectedResponse.setContent("Excelente servicio!");

        // ⚙️ Configuración de los mocks:
        // - El usuario autenticado es "author"
        // - El servicio con ID 10 existe
        // - Al guardar cualquier Comment, devuelve "savedComment"
        when(userService.getCurrentUser()).thenReturn(author);
        when(serviceListingRepository.findById(10L)).thenReturn(Optional.of(service));
        when(commentRepository.save(any(Comment.class))).thenReturn(savedComment);

        // 🧱 CommentMapper se usa como clase estática (CommentMapper.toResponse(...)),
        // por eso se mockea con MockedStatic dentro de un try-with-resources.
        try (MockedStatic<CommentMapper> mockedMapper = mockStatic(CommentMapper.class)) {
            mockedMapper.when(() -> CommentMapper.toResponse(savedComment))
                    .thenReturn(expectedResponse);

            // ▶️ Ejecución del método real que estamos probando
            CommentResponse result = commentService.addComment(10L, request);

            // ✅ Validaciones del resultado
            assertNotNull(result);
            assertEquals("Excelente servicio!", result.getContent());
        }

        // 🔍 Verifica que el comentario fue guardado en el repositorio
        verify(commentRepository).save(any(Comment.class));
    }

    // 🧪 Lanza UserException si el servicio (al que se comenta) no existe
    @Test
    void addComment_serviceNotFound() throws UserException {

        // 👤 Usuario autenticado simulado
        User author = new User();
        author.setId(1L);

        // 📝 Request con cualquier contenido
        CommentRequest request = new CommentRequest();
        request.setContent("Comentario de prueba");

        // ⚙️ El repositorio NO encuentra el servicio con ID 99
        when(userService.getCurrentUser()).thenReturn(author);
        when(serviceListingRepository.findById(99L)).thenReturn(Optional.empty());

        // ✅ Se espera que lance UserException por servicio no encontrado
        assertThrows(UserException.class, () -> commentService.addComment(99L, request));

        // 🔍 El comentario NUNCA debería guardarse si el servicio no existe
        verify(commentRepository, never()).save(any(Comment.class));
    }

    // =====================================================
    // 📥 getCommentsByService()
    // =====================================================

    // 🧪 Obtiene la lista de comentarios de un servicio correctamente
    @Test
    void getCommentsByService_success() {

        Long serviceId = 10L;

        // 💬 Comentarios simulados que devolvería el repositorio
        Comment comment1 = Comment.builder().content("Primer comentario").build();
        Comment comment2 = Comment.builder().content("Segundo comentario").build();
        List<Comment> comments = List.of(comment1, comment2);

        // 🎯 Respuestas (DTO) esperadas que devolvería el mapper
        CommentResponse response1 = new CommentResponse();
        response1.setContent("Primer comentario");

        CommentResponse response2 = new CommentResponse();
        response2.setContent("Segundo comentario");

        List<CommentResponse> expectedResponses = List.of(response1, response2);

        // ⚙️ El repositorio devuelve la lista de comentarios para ese servicio
        when(commentRepository.findByServiceIdOrderByCreatedAtDesc(serviceId)).thenReturn(comments);

        // 🧱 Mockeo estático de CommentMapper.toResponseList(...)
        try (MockedStatic<CommentMapper> mockedMapper = mockStatic(CommentMapper.class)) {
            mockedMapper.when(() -> CommentMapper.toResponseList(comments))
                    .thenReturn(expectedResponses);

            // ▶️ Ejecución del método real
            List<CommentResponse> result = commentService.getCommentsByService(serviceId);

            // ✅ Validaciones
            assertEquals(2, result.size());
            assertEquals("Primer comentario", result.get(0).getContent());
        }

        // 🔍 Verifica que se consultó el repositorio con el ID correcto
        verify(commentRepository).findByServiceIdOrderByCreatedAtDesc(serviceId);
    }

    // =====================================================
    // ❌ deleteComment()
    // =====================================================

    // 🧪 Elimina un comentario correctamente cuando pertenece al usuario autenticado
    @Test
    void deleteComment_success() throws UserException {

        // 👤 Usuario autenticado simulado
        User current = new User();
        current.setId(1L);

        // 💬 Comentario que SÍ pertenece a este usuario
        Comment comment = Comment.builder()
                .author(current)
                .content("Comentario a eliminar")
                .build();

        // ⚙️ Configuración de los mocks
        when(userService.getCurrentUser()).thenReturn(current);
        when(commentRepository.findByIdAndAuthorId(5L, 1L)).thenReturn(Optional.of(comment));

        // ▶️ Ejecución del método real (no debería lanzar excepción)
        commentService.deleteComment(5L);

        // 🔍 Verifica que el comentario encontrado fue eliminado
        verify(commentRepository).delete(comment);
    }

    // 🧪 Lanza UserException si el comentario no existe o no pertenece al usuario
    @Test
    void deleteComment_notFoundOrNotOwner() throws UserException {

        // 👤 Usuario autenticado simulado
        User current = new User();
        current.setId(1L);

        // ⚙️ El repositorio no encuentra ningún comentario con ese ID para este usuario
        when(userService.getCurrentUser()).thenReturn(current);
        when(commentRepository.findByIdAndAuthorId(5L, 1L)).thenReturn(Optional.empty());

        // ✅ Se espera que lance UserException
        assertThrows(UserException.class, () -> commentService.deleteComment(5L));

        // 🔍 Nunca debería eliminarse nada si no se encontró el comentario
        verify(commentRepository, never()).delete(any(Comment.class));
    }
}