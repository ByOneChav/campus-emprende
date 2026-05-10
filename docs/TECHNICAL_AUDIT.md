# Technical Audit

## Resumen ejecutivo
La auditoria tecnica EV2 detecto exposicion de secretos, configuracion fija de seguridad, DTOs con riesgo de exponer password, manejo de errores inconsistente, cliente API acoplado a localhost y una base de pruebas insuficiente. Se aplicaron mejoras incrementales sin rediseno mayor del producto.

## Hallazgos iniciales
- `application.yaml` contenia credenciales sensibles versionadas.
- JWT y CORS estaban hardcodeados.
- `UserDTO` incluia `password`.
- `GlobalExceptionHandler` devolvia mensajes no profesionales y con datos internos.
- El frontend dependia de `http://localhost:8080` fijo.
- No existia `.gitignore` raiz.
- Los tests backend incluian casos intencionalmente fallidos.
- No habia workflow CI.

## Riesgos corregidos
- Retiro de secretos desde configuracion versionada.
- Inicializacion de admin opt-in por variables.
- Validaciones de requests de auth y modulos clave.
- Respuesta uniforme de errores sin stacktrace expuesto.
- Cliente frontend parametrizado por entorno.

## Cambios aplicados
- Parametrizacion backend con `application-example.yaml` y `application-test.yaml`.
- Hardening de `JwtProvider`, `JwtValidator`, `SecurityConfig`, `AuthController` y `AuthServiceImpl`.
- Tests backend con JUnit 5, MockMvc y Mockito.
- Tests frontend con Vitest y Testing Library.
- CI GitHub Actions para backend y frontend.

## Archivos modificados
- Backend: configuracion, auth, excepciones, DTOs, tests.
- Frontend: cliente API, config Vitest, package.json, tests.
- Docs: README, documentacion de ejecucion, auditoria y estructura EV2.

## Pruebas ejecutadas
- Backend: `.\mvnw.cmd test` con `JAVA_HOME` Java 21 y cache local.
- Frontend: `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build`, `pnpm test`.

## Resultados
- Backend: 14 tests pasando.
- Frontend: `build` y `test` pasando; `lint` pasa con 28 warnings heredados del repo base, sin errores.

## Pendientes reales
- Reducir warnings heredados del frontend.
- Completar OAuth2 y cierre funcional de solicitudes/reportes/admin.
- Capturar evidencia web real para la entrega final.

| Area | Cambio | Responsable | Evidencia |
|---|---|---|---|
| Seguridad | Secretos retirados y JWT por entorno | Elias Delgado | `Campus-Emprende/src/main/resources/application.yaml` |
| Backend | Validacion y errores consistentes | Elias Delgado | tests backend y `GlobalExceptionHandler` |
| Frontend | Cliente API por entorno | Elias Delgado | `campus-emprende-frontend/src/api/client.js` |
| Calidad | Base de tests | Elias Delgado | suites JUnit/Vitest |
| Integracion | CI fullstack | Elias Delgado | `.github/workflows/ci.yml` |
| Entrega EV2 | Estructura documental | Elias Delgado | `Entrega_EV2_TPY1101_Grupo8/` |
