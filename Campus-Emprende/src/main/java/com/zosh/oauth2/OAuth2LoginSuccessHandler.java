package com.zosh.oauth2;

import com.zosh.configurations.JwtProvider;
import com.zosh.model.User;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Collections;

// Handler que se ejecuta cuando el login OAuth2 es exitoso
@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    // Proveedor encargado de generar el token JWT
    @Autowired
    private JwtProvider jwtProvider;

    // Método que se ejecuta al autenticarse correctamente con OAuth2
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {

        // Obtiene el usuario autenticado desde el principal personalizado
        OAuth2UserPrincipal oauth2User = (OAuth2UserPrincipal) authentication.getPrincipal();
        User user = oauth2User.getUser();

        // Crea un objeto de autenticación para generar el JWT
        org.springframework.security.authentication.UsernamePasswordAuthenticationToken auth = new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                user.getEmail(),
                null,
                Collections.singletonList(new SimpleGrantedAuthority(user.getRole().name())));

        // Genera el token JWT
        String token = jwtProvider.generateToken(auth);

        // Construye la URL de redirección hacia el frontend con el token
        String targetUrl = determineTargetUrl(token, user);

        // Verifica si la respuesta ya fue enviada
        if (response.isCommitted()) {
            logger.debug("La respuesta ya se ha enviado. No se puede redirigir a " + targetUrl);
            return;
        }

        // Redirige al frontend con los datos del usuario y el token
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    // Construye la URL de destino con parámetros para el frontend
    protected String determineTargetUrl(String token, User user) {
        // URL del frontend donde se procesará el login OAuth2
        String frontendUrl = "http://localhost:5173/oauth2/callback";

        // Agrega el token y datos del usuario como parámetros en la URL
        return UriComponentsBuilder.fromUriString(frontendUrl)
                .queryParam("token", token)
                .queryParam("email", user.getEmail())
                .queryParam("fullName", user.getFullName())
                .queryParam("role", user.getRole().name())
                .build().toUriString();
    }
}