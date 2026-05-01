package com.zosh.configurations;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

/**
 * Configuración principal de Swagger (OpenAPI)
 * Define la información general de la API y el esquema de seguridad JWT
 */
@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "API Campus Emprende",
        version = "1.0",
        description = "Documentación de la API para la gestión de usuarios, autenticación, servicios y funcionalidades del sistema Campus Emprende"
    )
)
@SecurityScheme(
    name = "bearerAuth", // nombre que usaremos en los controllers
    type = SecuritySchemeType.HTTP,
    scheme = "bearer",
    bearerFormat = "JWT"
)
public class SwaggerConfig {
}