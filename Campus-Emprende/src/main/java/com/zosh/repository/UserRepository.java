package com.zosh.repository;

import com.zosh.domain.UserRole;
import com.zosh.modal.User;
import com.zosh.payload.projection.TopStudentProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Set;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);
    Set<User> findByRole(UserRole role);

    @Query(value = """
            SELECT u.id                                                              AS studentId,
                   u.full_name                                                       AS studentName,
                   u.email                                                           AS studentEmail,
                   COUNT(DISTINCT s.id)                                              AS totalServices,
                   COUNT(DISTINCT sr.id)                                             AS totalRequests,
                   COUNT(DISTINCT CASE WHEN sr.status = 'COMPLETED' THEN sr.id END) AS completedRequests,
                   COALESCE(AVG(r.rating), 0)                                       AS averageRating
            FROM users u
                     LEFT JOIN services s ON s.provider_id = u.id
                     LEFT JOIN service_requests sr ON sr.service_id = s.id
                     LEFT JOIN reviews r ON r.service_request_id = sr.id
            WHERE u.role = 'ROLE_STUDENT'
            GROUP BY u.id, u.full_name, u.email
            ORDER BY COALESCE(AVG(r.rating), 0) DESC,
                     COUNT(DISTINCT CASE WHEN sr.status = 'COMPLETED' THEN sr.id END) DESC,
                     COUNT(DISTINCT sr.id) DESC
            LIMIT 5
            """, nativeQuery = true)
    List<TopStudentProjection> findTop5Students();
}
