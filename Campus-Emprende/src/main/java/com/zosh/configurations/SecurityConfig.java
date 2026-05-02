package com.zosh.configurations;

import com.zosh.oauth2.CustomOAuth2UserService;
import com.zosh.oauth2.OAuth2LoginSuccessHandler;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

@Configuration // Clase de configuración de seguridad
@org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity // Permite usar @PreAuthorize, etc.
public class SecurityConfig {

	@Autowired
	private CustomAuthenticationEntryPoint customAuthenticationEntryPoint; // Manejo de errores de autenticación

	@Autowired
	private CustomOAuth2UserService customOAuth2UserService; // Servicio para login con OAuth2

	@Autowired
	private OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler; // Acción al hacer login con OAuth2

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

		return http

            // 🚫 No usa sesiones (API REST con JWT)
			.sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // 🔐 Configuración de rutas y permisos
			.authorizeHttpRequests(Authorize -> Authorize

				// 🔓 Permite acceso libre a Swagger
				.requestMatchers(
						"/swagger-ui/**",
						"/v3/api-docs/**",
						"/swagger-ui.html"
				).permitAll()

				// 🔒 Rutas protegidas (requieren autenticación)
				.requestMatchers("/api/**").authenticated()

				// 👑 Solo ADMIN puede acceder
				.requestMatchers("/api/super-admin/**").hasRole("ADMIN")

				// 🌍 Todo lo demás es público
				.anyRequest().permitAll()
			)

            // 🌐 Configuración OAuth2 (Google login, etc.)
			.oauth2Login(oauth2 -> oauth2
					.userInfoEndpoint(userInfo -> userInfo
							.userService(customOAuth2UserService))
					.successHandler(oAuth2LoginSuccessHandler))

            // 🔐 Agrega filtro JWT antes del filtro de autenticación básica
			.addFilterBefore(new JwtValidator(), BasicAuthenticationFilter.class)

            // ❌ Desactiva CSRF (porque es API REST)
			.csrf(AbstractHttpConfigurer::disable)

            // 🌐 Configuración CORS
			.cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // ⚠️ Manejo de errores de autenticación
			.exceptionHandling(
					exceptionHandler -> exceptionHandler
							.authenticationEntryPoint(customAuthenticationEntryPoint))

			.build();
	}

    // 🔑 Encoder para encriptar contraseñas
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

    // 🌐 Configuración CORS (frontend permitido)
	private CorsConfigurationSource corsConfigurationSource() {
		return request -> {
			CorsConfiguration cfg = new CorsConfiguration();

            // Orígenes permitidos (frontend)
			cfg.setAllowedOrigins(Arrays.asList(
					"http://localhost:3000",
					"http://localhost:5173",
					"http://localhost:5174"
			));

            // Métodos permitidos (GET, POST, etc.)
			cfg.setAllowedMethods(Collections.singletonList("*"));

            // Permite enviar cookies/token
			cfg.setAllowCredentials(true);

            // Headers permitidos
			cfg.setAllowedHeaders(Collections.singletonList("*"));

            // Headers expuestos (ej: Authorization)
			cfg.setExposedHeaders(Arrays.asList("Authorization"));

            // Tiempo de caché CORS
			cfg.setMaxAge(3600L);

			return cfg;
		};
	}
}