# Campus Emprende

## Descripcion
Campus Emprende es una plataforma web orientada a la comunidad estudiantil para formalizar servicios entre estudiantes y convertir actividad real en evidencia profesional verificable. No es un marketplace abierto, no procesa pagos y no crea relacion laboral.

## Objetivo
Registrar, moderar y dar trazabilidad a servicios estudiantiles para que el trabajo realizado pueda presentarse como experiencia verificable dentro del contexto academico.

## Reglas del producto
- No se manejan pagos dentro del MVP.
- El alcance se limita a comunidad estudiantil.
- La seguridad base usa JWT y Spring Security.
- La validacion de cuenta se apoya en correo electronico.
- La aprobacion y moderacion administrativa forman parte del flujo.

## Estado funcional real
El MVP cuenta con modulos funcionales de autenticacion, verificacion de correo, perfil, servicios, reviews y comentarios. Los modulos de solicitudes, reportes y administracion se encuentran parcialmente implementados y documentados como estado de avance EV2. OAuth2 permanece en desarrollo.

| Modulo | Estado |
|---|---|
| Auth | Funcional |
| Email Verification | Funcional |
| Profile | Funcional |
| ServiceListing | Funcional |
| ServiceRequest | Parcial |
| Review | Funcional |
| Comment | Funcional |
| Report | Parcial |
| Admin | Parcial |
| OAuth2 Google/GitHub | En desarrollo |

## Stack tecnico
- Backend: Java 21, Spring Boot 3.3.5, Spring Security, JPA, Swagger, Java Mail Sender, JWT, PostgreSQL.
- Frontend: React 19, Vite, Redux Toolkit, React Router DOM, Axios, Tailwind, shadcn/ui, Radix, Sonner.
- CI: GitHub Actions.

## Arquitectura
- Estilo: monolito modular con frontend SPA separado.
- Backend: Controller -> Service -> Repository -> PostgreSQL.
- Frontend: rutas React, store Redux, cliente Axios centralizado por entorno.

## Estructura del repo
- `Campus-Emprende/`: backend Spring Boot.
- `campus-emprende-frontend/`: frontend React.
- `docs/`: lineamientos tecnicos y colaboracion.
- `Entrega_EV2_TPY1101_Grupo8/`: estructura exportable de entrega EV2.

## Instalacion backend
1. Configurar `JAVA_HOME` a Java 21.
2. Revisar `Campus-Emprende/src/main/resources/application-example.yaml`.
3. Exportar variables de entorno requeridas.
4. Ejecutar `cd Campus-Emprende` y luego `./mvnw spring-boot:run` en Linux/macOS o `.\mvnw.cmd spring-boot:run` en Windows.

## Instalacion frontend
1. Revisar `campus-emprende-frontend/.env.example`.
2. Ejecutar `cd campus-emprende-frontend`.
3. Ejecutar `pnpm install`.
4. Ejecutar `pnpm dev`.

## Variables de entorno
Backend:
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`
- `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`
- `JWT_SECRET`, `JWT_EXPIRATION_MS`
- `OAUTH_GITHUB_CLIENT_ID`, `OAUTH_GITHUB_CLIENT_SECRET`
- `FRONTEND_BASE_URL`, `APP_CORS_ALLOWED_ORIGINS`

Frontend:
- `VITE_API_BASE_URL`

## Ejecucion local
- Backend: `http://localhost:8080`
- Frontend: `http://localhost:5173`
- Swagger: `http://localhost:8080/swagger-ui.html`

## Ambiente de pruebas
- Backend: perfil `test` con `application-test.yaml` y H2 en memoria.
- Frontend: Vitest con `jsdom`.

## Testing
- Backend: `.\mvnw.cmd test` con `JAVA_HOME` apuntando a Java 21.
- Frontend: `pnpm lint`, `pnpm build`, `pnpm test`.

## CI
Existe workflow en `.github/workflows/ci.yml` con validacion backend y frontend en `push` y `pull_request` hacia `main`.

## Seguridad
- Secretos retirados de configuracion versionada.
- JWT parametrizado por entorno.
- CORS configurable sin `*` con credenciales.
- DTO de respuesta de usuario sin password.
- Errores globales consistentes sin stacktrace expuesto.

## Flujos principales
1. Registro de usuario.
2. Verificacion por correo.
3. Inicio de sesion con JWT.
4. Creacion y visualizacion de servicios.
5. Solicitud, review, comentario y reporte.
6. Visualizacion administrativa basica.

## Caminos alternativos
- Registro con correo ya usado, password invalida o token vencido.
- Login con credenciales incorrectas, cuenta no verificada o backend no disponible.
- Servicio con datos incompletos, rechazo administrativo o no disponibilidad.
- Solicitudes duplicadas, canceladas o sin respuesta.
- Acceso sin token, con token expirado o con rol insuficiente.

## Evidencia web requerida
La lista base y el estado de cada captura estan en `Entrega_EV2_TPY1101_Grupo8/Documentacion/Evidencias_Web/`. Las imagenes faltantes permanecen en control como `Requiere captura` hasta que existan archivos reales.

## Estructura de entrega EV2
La carpeta `Entrega_EV2_TPY1101_Grupo8/` contiene las secciones `Documentacion`, `Producto` y `Gestion` con fuentes exportables en Markdown y CSV.

## Aportes por integrante
- Elias Delgado: hardening tecnico, retiro de secretos, configuracion por entorno, refactor cliente API, validaciones, errores globales, pruebas base, CI, documentacion EV2, caminos alternativos, evidencia y estructura de entrega.
- Alcido/Alcindo: base inicial, estructura funcional principal, desarrollo inicial del producto y explicacion tecnica del avance para preparar evidencias.

## Proximos pasos
- Capturar evidencia web real desde la aplicacion corriendo.
- Cerrar brechas parciales de solicitudes, reportes y administracion.
- Definir estrategia final de despliegue y observabilidad.
- Completar OAuth2 y endurecimiento adicional para produccion.
