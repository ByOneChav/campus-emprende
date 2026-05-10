# Distribucion de tiempo
- 30 minutos de exposicion.
- 10 minutos de preguntas.

# Propuesta por integrante
- Elias: correcciones EV1, arquitectura, seguridad, pruebas y CI.
- Integrante 2: problema, oportunidad, metodologia, gestion y riesgos.
- Integrante 3: flujo funcional, evidencia web, frontend y demo.

# Que debe decir cada uno
- Elias: explicar hardening tecnico, estados reales del sistema, ambiente de pruebas y por que las mejoras son incrementales.
- Integrante 2: explicar necesidad del proyecto, alcance, fuera de alcance, KPI y gestion del avance.
- Integrante 3: conducir el flujo demo recomendado y distinguir modulos funcionales de modulos parciales.

# Flujo recomendado para demo
1. Registro de usuario.
2. Recepcion del correo de verificacion.
3. Verificacion de cuenta.
4. Inicio de sesion con JWT.
5. Crear un servicio.
6. Otro usuario solicita el servicio.
7. Crear review.
8. Crear comentario.
9. Reportar publicacion.
10. Visualizar datos desde Admin.

# Preguntas probables del profesor y respuestas tecnicas sugeridas
## Que problema resuelve Campus Emprende?
Formaliza servicios estudiantiles y entrega trazabilidad verificable de la experiencia.

## Por que no es marketplace?
Porque no maneja pagos, no intermedia relacion comercial abierta y se acota a comunidad estudiantil y evidencia academica.

## Que modulos estan funcionales?
Auth, verificacion de correo, perfil, servicios, reviews y comentarios.

## Que modulos estan parciales?
Solicitudes, reportes y administracion.

## Que caminos alternativos agregaron?
Registro invalido, cuenta no verificada, token vencido, servicio rechazado, acceso sin token y acceso con rol incorrecto, entre otros.

## Como se configura el ambiente de pruebas?
Backend con perfil `test` e H2. Frontend con Vitest y variable `VITE_API_BASE_URL`.

## Como se respalda y restaura la base de datos?
Con `pg_dump`, restauracion en base de prueba y validacion posterior de tablas.

## Que pruebas ejecutaron?
Tests backend de mapper, JWT, validacion HTTP y errores. Tests frontend del cliente API, ruta protegida y pagina 404.

## Como se protege el sistema?
JWT configurable, CORS parametrizado, validaciones de request y errores sin exponer stacktrace.

## Que aporta Elias?
Hardening tecnico, calidad, CI, documentacion EV2 y estructura de entrega.

## Que aporta Alcindo?
Base inicial del producto, estructura funcional principal y contexto tecnico del avance. Nombre a confirmar en documentos finales.

## Que falta para produccion?
Completar modulos parciales, cerrar deuda frontend, completar OAuth2, capturar evidencia final y definir despliegue productivo real.

## Como se ejecuta localmente?
Backend con Maven Wrapper y variables de entorno. Frontend con pnpm y `.env`.

## Que evidencia web tienen?
La lista requerida esta documentada. Solo se marca como capturada cuando exista archivo real.
