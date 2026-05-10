# Diseno del Sistema

## Vision
Campus Emprende organiza servicios estudiantiles dentro de un flujo controlado de registro, validacion, moderacion, solicitud, feedback y evidencia.

## Arquitectura
- Frontend SPA en React.
- Backend REST en Spring Boot.
- Persistencia en PostgreSQL.
- Seguridad con JWT y Spring Security.
- Integracion de correo para verificacion y recuperacion.

## Patrones
- Arquitectura por capas.
- DTO Pattern.
- Repository Pattern.
- Component-Based Architecture.
- SPA Routing Pattern.
- Manejo centralizado de errores.
- Configuracion por ambiente.

## Flujos relevantes
- Registro y verificacion de cuenta.
- Login y consumo de endpoints protegidos con JWT.
- Creacion y moderacion de servicios.
- Solicitudes entre estudiantes.
- Reviews, comentarios y reportes.

## Limitaciones del MVP
- No hay pagos.
- No hay relacion laboral.
- OAuth2 sigue en desarrollo.
- Solicitudes, reportes y administracion aun estan en estado parcial EV2.
