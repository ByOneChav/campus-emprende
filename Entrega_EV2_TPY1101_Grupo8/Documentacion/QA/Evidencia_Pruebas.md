# Evidencia de Pruebas

## Validacion automatizada ejecutada
- Backend:
  - Comando: `.\mvnw.cmd test`
  - Resultado: 14 tests pasando en ambiente `test`.
  - Cobertura de esta base: mapper de usuario, proveedor JWT, validacion HTTP y manejo global de errores.
- Frontend:
  - Comandos: `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build`, `pnpm test`
  - Resultado: `build` y `test` pasando; `lint` sin errores y con 28 warnings heredados del repositorio base.

## Evidencia documental disponible
- `Campus-Emprende/src/test/java/com/zosh/mapper/UserMapperTest.java`
- `Campus-Emprende/src/test/java/com/zosh/configurations/JwtProviderTest.java`
- `Campus-Emprende/src/test/java/com/zosh/controller/AuthControllerValidationTest.java`
- `Campus-Emprende/src/test/java/com/zosh/exception/GlobalExceptionHandlerTest.java`
- `campus-emprende-frontend/src/api/client.test.js`
- `campus-emprende-frontend/src/components/layout/ProtectedRoute.test.jsx`
- `campus-emprende-frontend/src/pages/NotFoundPage.test.jsx`

## Evidencia visual aun no incorporada
- Capturas de interfaz en ejecucion para registro, login, dashboard, servicios, review, comentario, reporte y administracion.
- Captura del correo de verificacion recibido.
- Captura de tablas PostgreSQL desde el entorno del equipo.

La evidencia visual sera incorporada como anexo antes de exportar la entrega final, manteniendo en este repositorio la matriz de control de capturas.
