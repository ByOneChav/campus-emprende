package com.zosh.configurations;

// Importaciones necesarias para manejo de excepciones y seguridad
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

// Componente que maneja errores de autenticación (no autorizado)
@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint{

	// Método que se ejecuta cuando un usuario no está autenticado
	@Override
	public void commence(HttpServletRequest request, HttpServletResponse response,
			AuthenticationException authException) throws IOException, ServletException {
		
		 // Define que la respuesta será en formato JSON
		 response.setContentType("application/json");
		 
	     // Establece el código HTTP 401 (No autorizado)
	     response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
	     
	     // Retorna un mensaje de error con la causa de la autenticación fallida
	     response.getWriter().write("{\"message\": \"" + authException.getMessage() + "\"}");
	       
		
	}

}