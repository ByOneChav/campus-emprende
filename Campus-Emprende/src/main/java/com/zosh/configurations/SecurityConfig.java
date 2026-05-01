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

@Configuration
@org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
public class SecurityConfig {

	@Autowired
	private CustomAuthenticationEntryPoint customAuthenticationEntryPoint;

	@Autowired
	private CustomOAuth2UserService customOAuth2UserService;

	@Autowired
	private OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

		return http
			.sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

			.authorizeHttpRequests(Authorize -> Authorize

				// 🔥 PERMITIR SWAGGER (IMPORTANTE)
				.requestMatchers(
						"/swagger-ui/**",
						"/v3/api-docs/**",
						"/swagger-ui.html"
				).permitAll()

				// 🔐 tus rutas protegidas
				.requestMatchers("/api/**").authenticated()
				.requestMatchers("/api/super-admin/**").hasRole("ADMIN")

				// todo lo demás libre
				.anyRequest().permitAll()
			)

			.oauth2Login(oauth2 -> oauth2
					.userInfoEndpoint(userInfo -> userInfo
							.userService(customOAuth2UserService))
					.successHandler(oAuth2LoginSuccessHandler))

			// 🔐 filtro JWT
			.addFilterBefore(new JwtValidator(), BasicAuthenticationFilter.class)

			.csrf(AbstractHttpConfigurer::disable)

			.cors(cors -> cors.configurationSource(corsConfigurationSource()))

			.exceptionHandling(
					exceptionHandler -> exceptionHandler
							.authenticationEntryPoint(customAuthenticationEntryPoint))

			.build();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	// 🌐 configuración CORS
	private CorsConfigurationSource corsConfigurationSource() {
		return request -> {
			CorsConfiguration cfg = new CorsConfiguration();
			cfg.setAllowedOrigins(Arrays.asList(
					"http://localhost:3000",
					"http://localhost:5173",
					"http://localhost:5174"
			));
			cfg.setAllowedMethods(Collections.singletonList("*"));
			cfg.setAllowCredentials(true);
			cfg.setAllowedHeaders(Collections.singletonList("*"));
			cfg.setExposedHeaders(Arrays.asList("Authorization"));
			cfg.setMaxAge(3600L);
			return cfg;
		};
	}
}