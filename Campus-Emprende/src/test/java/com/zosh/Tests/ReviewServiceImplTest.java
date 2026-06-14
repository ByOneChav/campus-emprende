package com.zosh.Tests;

import com.zosh.domain.RequestStatus;
import com.zosh.exception.UserException;
import com.zosh.mapper.ReviewMapper;
import com.zosh.model.Review;
import com.zosh.model.ServiceRequest;
import com.zosh.model.User;
import com.zosh.payload.request.ReviewRequest;
import com.zosh.payload.response.ReviewResponse;
import com.zosh.repository.ReviewRepository;
import com.zosh.repository.ServiceRequestRepository;
import com.zosh.services.UserService;
import com.zosh.services.impl.ReviewServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

// 🧪 Pruebas unitarias para ReviewServiceImpl
// Cubre todas las validaciones de submitReview() y los métodos de listado de reseñas.
@ExtendWith(MockitoExtension.class)
class ReviewServiceImplTest {

    // 🔗 Repositorio de reseñas (mockeado)
    @Mock
    private ReviewRepository reviewRepository;

    // 🔗 Repositorio de solicitudes (mockeado, valida flujo de la solicitud)
    @Mock
    private ServiceRequestRepository serviceRequestRepository;

    // 🔐 Servicio de usuario (mockeado, simula al usuario autenticado por JWT)
    @Mock
    private UserService userService;

    // 🧩 Clase real que se está probando
    @InjectMocks
    private ReviewServiceImpl reviewService;

    // =====================================================
    // 🧱 Helpers para construir objetos de prueba
    // =====================================================

    // 👤 Crea un usuario simple solo con ID
    private User buildUser(Long id) {
        User user = new User();
        user.setId(id);
        return user;
    }

    // 📄 Crea una solicitud de servicio "lista para reseñar":
    // status COMPLETADO y con fecha de finalización confirmada
    private ServiceRequest buildCompletedRequest(Long id, User client) {
        ServiceRequest sr = ServiceRequest.builder()
                .client(client)
                .status(RequestStatus.COMPLETADO)
                .completedAt(LocalDateTime.now())
                .build();
        sr.setId(id);
        return sr;
    }

    // =====================================================
    // ⭐ submitReview() — Crear reseña
    // =====================================================

    // 🧪 El cliente crea correctamente una reseña cuando la solicitud está completada y confirmada
    @Test
    void submitReview_success() throws UserException {
        User reviewer = buildUser(1L);
        ServiceRequest sr = buildCompletedRequest(50L, reviewer);

        ReviewRequest request = new ReviewRequest();
        request.setRating((short) 5);
        request.setComment("Excelente servicio, muy puntual");

        // 💾 Reseña que "guardaría" el repositorio
        Review savedReview = Review.builder()
                .serviceRequest(sr)
                .reviewer(reviewer)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();
        savedReview.setId(200L);

        // 🎯 Respuesta esperada del mapper
        ReviewResponse expectedResponse = new ReviewResponse();
        expectedResponse.setComment("Excelente servicio, muy puntual");

        when(userService.getCurrentUser()).thenReturn(reviewer);
        when(serviceRequestRepository.findById(50L)).thenReturn(Optional.of(sr));
        when(reviewRepository.existsByServiceRequestId(50L)).thenReturn(false);
        when(reviewRepository.save(any(Review.class))).thenReturn(savedReview);

        try (MockedStatic<ReviewMapper> mockedMapper = mockStatic(ReviewMapper.class)) {
            mockedMapper.when(() -> ReviewMapper.toResponse(savedReview)).thenReturn(expectedResponse);

            ReviewResponse result = reviewService.submitReview(50L, request);

            assertNotNull(result);
            assertEquals("Excelente servicio, muy puntual", result.getComment());
        }

        verify(reviewRepository).save(any(Review.class));
    }

    // 🧪 Lanza UserException si la solicitud de servicio no existe
    @Test
    void submitReview_serviceRequestNotFound() throws UserException {
        User reviewer = buildUser(1L);

        ReviewRequest request = new ReviewRequest();
        request.setRating((short) 5);
        request.setComment("Comentario cualquiera");

        when(userService.getCurrentUser()).thenReturn(reviewer);
        when(serviceRequestRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(UserException.class, () -> reviewService.submitReview(99L, request));

        verify(reviewRepository, never()).save(any(Review.class));
    }

    // 🧪 Lanza UserException si quien reseña NO es el cliente de la solicitud
    @Test
    void submitReview_notTheClient() throws UserException {
        User client = buildUser(1L);
        User other = buildUser(2L); // 👤 usuario distinto al cliente original
        ServiceRequest sr = buildCompletedRequest(50L, client);

        ReviewRequest request = new ReviewRequest();
        request.setRating((short) 5);
        request.setComment("Comentario cualquiera");

        when(userService.getCurrentUser()).thenReturn(other);
        when(serviceRequestRepository.findById(50L)).thenReturn(Optional.of(sr));

        assertThrows(UserException.class, () -> reviewService.submitReview(50L, request));

        verify(reviewRepository, never()).save(any(Review.class));
    }

    // 🧪 Lanza UserException si la solicitud todavía no está COMPLETADO
    @Test
    void submitReview_notCompleted() throws UserException {
        User client = buildUser(1L);

        // 📌 Solicitud aún en curso, sin completar
        ServiceRequest sr = ServiceRequest.builder()
                .client(client)
                .status(RequestStatus.EN_CURSO)
                .build();
        sr.setId(50L);

        ReviewRequest request = new ReviewRequest();
        request.setRating((short) 5);
        request.setComment("Comentario cualquiera");

        when(userService.getCurrentUser()).thenReturn(client);
        when(serviceRequestRepository.findById(50L)).thenReturn(Optional.of(sr));

        assertThrows(UserException.class, () -> reviewService.submitReview(50L, request));

        verify(reviewRepository, never()).save(any(Review.class));
    }

    // 🧪 Lanza UserException si el cliente no ha confirmado la finalización (completedAt == null)
    @Test
    void submitReview_notConfirmed() throws UserException {
        User client = buildUser(1L);

        // 📌 Estado COMPLETADO pero el cliente nunca confirmó (completedAt sigue null)
        ServiceRequest sr = ServiceRequest.builder()
                .client(client)
                .status(RequestStatus.COMPLETADO)
                .build();
        sr.setId(50L);

        ReviewRequest request = new ReviewRequest();
        request.setRating((short) 5);
        request.setComment("Comentario cualquiera");

        when(userService.getCurrentUser()).thenReturn(client);
        when(serviceRequestRepository.findById(50L)).thenReturn(Optional.of(sr));

        assertThrows(UserException.class, () -> reviewService.submitReview(50L, request));

        verify(reviewRepository, never()).save(any(Review.class));
    }

    // 🧪 Lanza UserException si ya existe una reseña para esa solicitud (evita duplicados)
    @Test
    void submitReview_alreadyExists() throws UserException {
        User client = buildUser(1L);
        ServiceRequest sr = buildCompletedRequest(50L, client);

        ReviewRequest request = new ReviewRequest();
        request.setRating((short) 5);
        request.setComment("Comentario cualquiera");

        when(userService.getCurrentUser()).thenReturn(client);
        when(serviceRequestRepository.findById(50L)).thenReturn(Optional.of(sr));
        when(reviewRepository.existsByServiceRequestId(50L)).thenReturn(true);

        assertThrows(UserException.class, () -> reviewService.submitReview(50L, request));

        verify(reviewRepository, never()).save(any(Review.class));
    }

    // =====================================================
    // 📥 getReviewsByService() — Reseñas de un servicio
    // =====================================================

    // 🧪 Devuelve las reseñas asociadas a un servicio
    @Test
    void getReviewsByService_success() {
        Review review = Review.builder().comment("Muy bueno").rating((short) 5).build();
        List<Review> reviews = List.of(review);

        List<ReviewResponse> expectedResponses = List.of(new ReviewResponse());

        when(reviewRepository.findByServiceRequestServiceId(10L)).thenReturn(reviews);

        try (MockedStatic<ReviewMapper> mockedMapper = mockStatic(ReviewMapper.class)) {
            mockedMapper.when(() -> ReviewMapper.toResponseList(reviews)).thenReturn(expectedResponses);

            List<ReviewResponse> result = reviewService.getReviewsByService(10L);

            assertEquals(1, result.size());
        }

        verify(reviewRepository).findByServiceRequestServiceId(10L);
    }

    // =====================================================
    // 👤 getReviewsByProvider() — Reseñas de un proveedor
    // =====================================================

    // 🧪 Devuelve las reseñas recibidas por un proveedor
    @Test
    void getReviewsByProvider_success() {
        Review review = Review.builder().comment("Excelente atención").rating((short) 5).build();
        List<Review> reviews = List.of(review);

        List<ReviewResponse> expectedResponses = List.of(new ReviewResponse());

        when(reviewRepository.findByServiceRequestServiceProviderId(2L)).thenReturn(reviews);

        try (MockedStatic<ReviewMapper> mockedMapper = mockStatic(ReviewMapper.class)) {
            mockedMapper.when(() -> ReviewMapper.toResponseList(reviews)).thenReturn(expectedResponses);

            List<ReviewResponse> result = reviewService.getReviewsByProvider(2L);

            assertEquals(1, result.size());
        }

        verify(reviewRepository).findByServiceRequestServiceProviderId(2L);
    }

    // =====================================================
    // 📊 getAllReviews() — Todas las reseñas (admin)
    // =====================================================

    // 🧪 Devuelve todas las reseñas registradas
    @Test
    void getAllReviews_success() {
        Review review1 = Review.builder().comment("Buena").rating((short) 4).build();
        Review review2 = Review.builder().comment("Regular").rating((short) 3).build();
        List<Review> reviews = List.of(review1, review2);

        List<ReviewResponse> expectedResponses = List.of(new ReviewResponse(), new ReviewResponse());

        when(reviewRepository.findAll()).thenReturn(reviews);

        try (MockedStatic<ReviewMapper> mockedMapper = mockStatic(ReviewMapper.class)) {
            mockedMapper.when(() -> ReviewMapper.toResponseList(reviews)).thenReturn(expectedResponses);

            List<ReviewResponse> result = reviewService.getAllReviews();

            assertEquals(2, result.size());
        }
    }

    // =====================================================
    // 👍 getGoodReviews() — Reseñas positivas (rating >= 4)
    // =====================================================

    // 🧪 Devuelve solo las reseñas con calificación buena (>= 4)
    @Test
    void getGoodReviews_success() {
        Review review = Review.builder().comment("Genial").rating((short) 5).build();
        List<Review> reviews = List.of(review);

        List<ReviewResponse> expectedResponses = List.of(new ReviewResponse());

        when(reviewRepository.findByRatingGreaterThanEqual((short) 4)).thenReturn(reviews);

        try (MockedStatic<ReviewMapper> mockedMapper = mockStatic(ReviewMapper.class)) {
            mockedMapper.when(() -> ReviewMapper.toResponseList(reviews)).thenReturn(expectedResponses);

            List<ReviewResponse> result = reviewService.getGoodReviews();

            assertEquals(1, result.size());
        }

        verify(reviewRepository).findByRatingGreaterThanEqual((short) 4);
    }

    // =====================================================
    // 👎 getBadReviews() — Reseñas negativas (rating <= 2)
    // =====================================================

    // 🧪 Devuelve solo las reseñas con calificación mala (<= 2)
    @Test
    void getBadReviews_success() {
        Review review = Review.builder().comment("Mal servicio").rating((short) 1).build();
        List<Review> reviews = List.of(review);

        List<ReviewResponse> expectedResponses = List.of(new ReviewResponse());

        when(reviewRepository.findByRatingLessThanEqual((short) 2)).thenReturn(reviews);

        try (MockedStatic<ReviewMapper> mockedMapper = mockStatic(ReviewMapper.class)) {
            mockedMapper.when(() -> ReviewMapper.toResponseList(reviews)).thenReturn(expectedResponses);

            List<ReviewResponse> result = reviewService.getBadReviews();

            assertEquals(1, result.size());
        }

        verify(reviewRepository).findByRatingLessThanEqual((short) 2);
    }
}