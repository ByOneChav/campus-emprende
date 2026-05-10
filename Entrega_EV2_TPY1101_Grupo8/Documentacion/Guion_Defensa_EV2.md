# Distribucion de la defensa
- Exposicion: 30 minutos.
- Preguntas del profesor: 10 minutos.

# Orden de intervencion
- Elias Delgado: correcciones EV1, arquitectura, seguridad, pruebas y cierre tecnico.
- Alcindo/Alcido: base funcional del producto, contexto del avance y recorrido de demo.
- Tercer expositor del equipo: problema, alcance, gestion, KPI, riesgos y cierre general.

# Mensaje por expositor

## Elias Delgado
- Explicar que EV2 se construyo sobre el repositorio oficial y con cambios incrementales verificables.
- Mostrar la correccion de restricciones no validas, la incorporacion de caminos alternativos y el estado funcional real del sistema.
- Resumir el hardening aplicado: secretos fuera del repositorio, JWT configurable, validaciones y errores globales consistentes.
- Cerrar el bloque tecnico con las pruebas ejecutadas, CI y deuda real documentada.

## Alcindo/Alcido
- Presentar la base funcional existente del producto y el flujo recomendado para demo.
- Diferenciar modulos funcionales de modulos parciales sin exagerar el alcance.
- Relacionar el avance del software con la experiencia real de uso en registro, login, servicios, review y comentario.
- Explicar que solicitudes, reportes y administracion se muestran como avance EV2 y no como producto terminado.

## Tercer expositor del equipo
- Explicar el problema que resuelve Campus Emprende y por que no se posiciona como marketplace de pagos.
- Presentar el alcance, el fuera de alcance, la gestion del proyecto, KPI y riesgos.
- Mostrar el control de evidencia visual y el criterio usado para no marcar capturas inexistentes.
- Cerrar con conclusiones, lecciones aprendidas y proximos pasos.

# Flujo recomendado para demo
1. Registrar una cuenta de prueba.
2. Mostrar el correo de verificacion recibido.
3. Confirmar la verificacion de la cuenta.
4. Iniciar sesion con JWT.
5. Crear un servicio.
6. Ingresar con un segundo usuario y solicitar el servicio.
7. Mostrar review y comentario.
8. Reportar la publicacion.
9. Acceder al panel administrativo disponible.

# Preguntas probables y respuesta tecnica sugerida

## Que problema resuelve Campus Emprende
Ordena servicios estudiantiles que hoy circulan de forma informal y agrega identidad verificada, trazabilidad y moderacion basica.

## Por que no es marketplace
Porque el MVP no maneja pagos, no crea una relacion laboral y restringe su alcance a la comunidad estudiantil.

## Que modulos estan funcionales
Autenticacion, verificacion de correo, perfil, servicios, reviews y comentarios.

## Que modulos estan parciales
Solicitudes, reportes y administracion.

## Que caminos alternativos agregaron
Se incorporaron escenarios como correo invalido, cuenta no verificada, token vencido, servicio rechazado, solicitud duplicada, acceso sin token y acceso con rol incorrecto.

## Como se configura el ambiente de pruebas
El backend usa perfil `test` con H2, MockMvc y JUnit 5. El frontend usa Vitest, Testing Library y `VITE_API_BASE_URL`.

## Como se respalda y restaura la base de datos
Con `pg_dump`, restauracion en una base de prueba y validacion posterior de tablas, segun los documentos de Producto.

## Que pruebas ejecutaron
Se ejecutaron pruebas backend para mapper, JWT, validacion HTTP y errores globales. En frontend se probaron cliente API, ruta protegida y pagina 404. Ademas corrieron `lint`, `build` y `test`.

## Como se protege el sistema
Con JWT parametrizado por entorno, CORS configurable, DTO seguro sin password en respuesta y manejo global de errores sin stacktrace expuesto.

## Que aporta Elias
Hardening tecnico, control de configuracion, pruebas, CI y consolidacion documental EV2.

## Que aporta Alcindo
Base funcional del producto, estructura inicial del avance y contexto tecnico para la demostracion del software.

## Que falta para produccion
Completar solicitudes, reportes y administracion, cerrar deuda heredada del frontend, terminar OAuth2, anexar evidencia visual completa y definir una estrategia real de despliegue.

## Como se ejecuta localmente
El backend corre con Maven Wrapper y variables de entorno. El frontend corre con pnpm y `VITE_API_BASE_URL`, segun `COMO_EJECUTAR.md`.

## Que evidencia web tienen
La matriz de control de capturas ya esta preparada. Las imagenes faltantes siguen registradas como `Requiere captura` hasta que el equipo las incorpore.
