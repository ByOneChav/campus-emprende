package com.zosh.configurations;

import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class JwtProviderTest {

    private static final String SECRET = "test-secret-key-for-campus-emprende-1234567890";

    @Test
    void generateTokenAndExtractEmail() {
        JwtProvider provider = new JwtProvider(SECRET, 86400000L);
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                "student@duocuc.cl",
                null,
                List.of(new SimpleGrantedAuthority("ROLE_STUDENT"))
        );

        String token = provider.generateToken(authentication);
        String email = provider.getEmailFromJwtToken("Bearer " + token);
        Claims claims = provider.parseClaims("Bearer " + token);

        assertNotNull(token);
        assertEquals("student@duocuc.cl", email);
        assertEquals("ROLE_STUDENT", claims.get("authorities"));
    }
}
