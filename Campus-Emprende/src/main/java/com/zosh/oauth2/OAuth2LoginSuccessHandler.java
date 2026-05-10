package com.zosh.oauth2;

import com.zosh.configurations.JwtProvider;
import com.zosh.model.User;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Collections;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private JwtProvider jwtProvider;

    @Value("${app.frontend.base-url}")
    private String frontendBaseUrl;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {
        OAuth2UserPrincipal oauth2User = (OAuth2UserPrincipal) authentication.getPrincipal();
        User user = oauth2User.getUser();

        Authentication auth = new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                user.getEmail(),
                null,
                Collections.singletonList(new SimpleGrantedAuthority(user.getRole().name()))
        );

        String token = jwtProvider.generateToken(auth);
        String targetUrl = determineTargetUrl(token, user);

        if (response.isCommitted()) {
            logger.debug("La respuesta ya se ha enviado. No se puede redirigir a " + targetUrl);
            return;
        }

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    protected String determineTargetUrl(String token, User user) {
        return UriComponentsBuilder.fromUriString(frontendBaseUrl + "/oauth2/callback")
                .queryParam("token", token)
                .queryParam("email", user.getEmail())
                .queryParam("fullName", user.getFullName())
                .queryParam("role", user.getRole().name())
                .build()
                .toUriString();
    }
}
