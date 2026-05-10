# Portada
- Proyecto: Campus Emprende
- Asignatura: TPY1101 Taller Aplicado de Programacion
- Evaluacion: Parcial N 2 Estado de avance 2
- Grupo: 8
- Seccion: no informada en el repositorio al cierre de esta version
- Integrantes: Elias Delgado y Equipo Campus Emprende; los nombres restantes no se registran en este repositorio al cierre de esta version
- Repositorio: https://github.com/ByOneChav/campus-emprende

# Indice
1. Introduccion
2. Resumen de EV1
3. Observaciones del profesor y correcciones aplicadas
4. Problema y oportunidad
5. Objetivos
6. Alcance y fuera de alcance
7. Metodologia de desarrollo
8. Arquitectura y patrones
9. Lenguajes, tecnologias e integraciones
10. Configuracion de servidor y ambiente de pruebas
11. Procedimiento de backup y restore
12. Diseno de solucion
13. Desarrollo del producto
14. Estado funcional real
15. Evidencia del software
16. Plan y resultados de pruebas
17. Gestion del proyecto
18. Aportes por integrante
19. Conclusiones
20. Lecciones aprendidas
21. Anexos

# Introduccion
Campus Emprende es una plataforma academica orientada a formalizar servicios entre estudiantes y a transformar esa actividad en evidencia profesional verificable. Esta entrega EV2 consolida el estado real del MVP, la arquitectura implementada, las pruebas ejecutadas y la estructura documental solicitada por la rubrica.

# Resumen de EV1

## Problema detectado
Los servicios entre estudiantes se publican y coordinan de manera informal, con baja trazabilidad, escasa verificacion de identidad y sin respaldo claro de la experiencia generada.

## Oportunidad
Una plataforma institucional permite ordenar la relacion entre oferentes y solicitantes, agregar moderacion basica y dejar evidencia defendible del trabajo realizado.

## Objetivo general
Disponer de un MVP web que registre servicios estudiantiles y entregue trazabilidad verificable sobre las interacciones del sistema.

## Alcance inicial
Autenticacion, perfiles, publicacion de servicios, solicitudes, reviews, comentarios, reportes y administracion basica.

## Observaciones del docente
- Corregir una restriccion no valida usada en EV1.
- Incorporar caminos alternativos en los flujos funcionales.

## Acciones correctivas
- La restriccion observada fue reemplazada por una formulacion de alcance, priorizacion MVP y control por entregables.
- Se agrego un diagrama especifico de caminos alternativos y una tabla transversal de respuesta del sistema.

# Observaciones del profesor y correcciones aplicadas
- Se ajusto el discurso del proyecto para que el alcance se explique por prioridad funcional y control de entregables.
- Se documentaron caminos alternativos para registro, login, verificacion, servicios, solicitudes, reviews, reportes y seguridad.
- Se ordeno la entrega en las carpetas Documentacion, Producto y Gestion.

# Problema y oportunidad
Campus Emprende responde a un escenario donde estudiantes ofrecen apoyo academico, tecnico o creativo sin una plataforma que centralice identidad, visibilidad y trazabilidad. La oportunidad es construir un entorno controlado que permita mostrar experiencia, moderar contenido y sustentar el avance del proyecto con evidencia verificable.

# Objetivo general y objetivos especificos

## Objetivo general
Implementar un MVP que permita registrar y moderar servicios estudiantiles, resguardar interacciones relevantes y sostener la defensa academica con evidencia real.

## Objetivos especificos
- Verificar identidad y acceso mediante correo y JWT.
- Permitir publicacion, consulta, edicion y baja de servicios.
- Registrar solicitudes, reviews, comentarios y reportes segun el alcance actual del MVP.
- Consolidar ambientes, pruebas, respaldo documental y control de evidencia para EV2.

# Alcance y fuera de alcance

## Alcance
- Registro, login, verificacion de correo, recuperacion y restablecimiento de contrasena.
- Perfil de usuario.
- Publicacion, consulta, edicion y eliminacion de servicios.
- Reviews y comentarios.
- Reportes y administracion basica como avance parcial EV2.

## Fuera de alcance
- No es un marketplace abierto.
- No maneja pagos.
- No genera relacion laboral.
- No incluye una operacion productiva completa ni observabilidad avanzada.

# Metodologia de desarrollo
El proyecto se trabaja con un enfoque iterativo incremental. Las funcionalidades se priorizan como MVP, el avance se controla por entregables parciales y cada modulo se documenta segun su estado real. Esta metodologia evita sobredeclarar cierre funcional y favorece una defensa academica basada en codigo, pruebas y evidencia verificable.

# Arquitectura

## Vista general
- Frontend SPA desarrollado en React.
- Backend REST implementado en Spring Boot.
- Persistencia principal en PostgreSQL.
- Seguridad con Spring Security y JWT.
- Integracion de correo para verificacion y recuperacion de contrasena.
- Swagger como apoyo para la documentacion de endpoints.

## Patrones de diseno
- Arquitectura por capas.
- DTO Pattern.
- Repository Pattern.
- Component-Based Architecture.
- SPA Routing Pattern.
- Manejo centralizado de errores.
- Configuracion por ambiente.

# Lenguajes y tecnologias
- Backend: Java 21, Spring Boot 3.3.5, JPA, Spring Security, OAuth2, JWT, PostgreSQL, Java Mail Sender, PDFBox y Swagger.
- Frontend: React 19, Vite, Redux Toolkit, React Router DOM, Axios, Tailwind, shadcn/ui, Radix y Sonner.
- Herramientas de calidad: JUnit 5, Mockito, MockMvc, Vitest, Testing Library y GitHub Actions.

# Configuracion de servidor

## Desarrollo
- Backend en puerto 8080.
- Frontend en puerto 5173.
- Variables de entorno para base de datos, correo, JWT, OAuth2 y CORS.

## Pruebas
- Backend con perfil `test` y H2 en memoria.
- Frontend con Vitest y `jsdom`.

## Produccion referencial
La documentacion deja una referencia de configuracion por ambiente, pero no declara un despliegue productivo confirmado al cierre de esta entrega.

# Integraciones
- PostgreSQL como persistencia principal.
- Java Mail Sender para verificacion y recuperacion.
- JWT para autenticacion.
- Swagger para consulta de endpoints.
- OAuth2 con GitHub y Google en estado de desarrollo.
- Integracion frontend/backend mediante API REST.

# Ambiente de pruebas
- Backend: `application-test.yaml`, H2, JUnit 5, Mockito y MockMvc.
- Frontend: Vitest, Testing Library y `VITE_API_BASE_URL`.
- Los comandos de validacion quedaron documentados en `COMO_EJECUTAR.md` y en la seccion Producto.

# Procedimiento backup restore
El respaldo y la restauracion de datos quedaron documentados en:
- `Entrega_EV2_TPY1101_Grupo8/Producto/Scripts_BD/backup_postgresql.md`
- `Entrega_EV2_TPY1101_Grupo8/Producto/Scripts_BD/restore_testing.md`

La operacion considera `pg_dump`, restauracion sobre una base de pruebas y verificacion posterior de tablas. Tambien se incluyen datos de prueba seguros en `datos_prueba.sql`.

# Diseno de solucion
- Casos de uso: `Entrega_EV2_TPY1101_Grupo8/Documentacion/UML/Diagrama_Casos_Uso.md`
- Modelo de datos: `Entrega_EV2_TPY1101_Grupo8/Documentacion/MER/`
- Componentes: `Entrega_EV2_TPY1101_Grupo8/Documentacion/UML/Diagrama_Componentes.md`
- Flujo principal: `Entrega_EV2_TPY1101_Grupo8/Documentacion/UML/Diagrama_Actividad_Flujo_Principal.md`
- Caminos alternativos: `Entrega_EV2_TPY1101_Grupo8/Documentacion/UML/Diagrama_Actividad_Caminos_Alternativos.md`
- Wireframes: `Entrega_EV2_TPY1101_Grupo8/Documentacion/Wireframes/Wireframes_Resumen.md`

## Tabla de flujos y caminos alternativos
| Modulo | Flujo principal | Camino alternativo | Respuesta del sistema | Evidencia |
|---|---|---|---|---|
| Registro | Alta con correo institucional | Correo ya registrado o password invalida | Validacion y mensaje claro | Codigo y QA |
| Login | Credenciales validas | Cuenta no verificada o backend no disponible | Rechazo de autenticacion o error controlado | Codigo y QA |
| Verificacion | Token valido | Token vencido o inexistente | Error controlado y reenvio segun flujo | Matriz de capturas |
| Servicios | Crear servicio | Datos incompletos o servicio no disponible | Validacion o cambio de estado | Codigo y UML |
| Solicitudes | Solicitar servicio | Duplicada, cancelada o sin respuesta | Avance parcial segun modulo | Checklist funcional |
| Reviews | Crear resena | Rating invalido o falta de solicitud completada | Validacion o restriccion de negocio | Codigo y UML |
| Reportes | Reportar contenido | Reporte sin fundamento o rol insuficiente | Registro parcial o acceso denegado | Checklist funcional |
| Seguridad | Acceder con JWT | Sin token, token expirado o rol incorrecto | 401 o 403 segun el caso | Codigo y QA |

# Desarrollo del producto

## Backend
Se reforzo la configuracion por variables de entorno, se parametrizaron JWT y CORS, se separaron DTOs de autenticacion y se unifico el manejo global de errores. Estas mejoras se aplicaron como cambios incrementales, sin redisenar la estructura base del proyecto.

## Frontend
Se centralizo el cliente API mediante `VITE_API_BASE_URL`, se mantuvo el manejo de JWT desde el cliente y se agrego una base de pruebas con Vitest. El foco se mantuvo en integracion y estabilidad, no en redisenar la interfaz.

## Seguridad
Se retiraron secretos de archivos versionados y `UserDTO` ya no expone password. El repositorio mantiene una separacion mas segura entre configuracion, datos sensibles y respuestas al cliente.

# Estado funcional real
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

# Evidencia del software
La entrega ya contiene evidencia tecnica documental sobre arquitectura, configuracion, pruebas y control funcional. La evidencia visual sera incorporada como anexo antes de exportar la entrega final, manteniendo en este repositorio la matriz de control de capturas.

# Plan de pruebas
El plan de pruebas se organiza en `Entrega_EV2_TPY1101_Grupo8/Documentacion/QA/Plan_Pruebas.md`, `Casos_Prueba.csv`, `Matriz_Trazabilidad.csv` y `Evidencia_Pruebas.md`.

# Resultados de pruebas
- Backend: 14 tests pasando.
- Frontend: 8 tests pasando.
- Lint frontend: sin errores, con 28 warnings heredados documentados.
- Build frontend: exitoso.

# Gestion del proyecto
La carpeta de gestion incluye carta Gantt, riesgos, KPI, actas, minuta de revision funcional y estados de avance EV1 y EV2. El objetivo de esta seccion es sostener la defensa con control real del proyecto y no solo con descripcion tecnica del producto.

# Aportes por integrante
- Elias Delgado: hardening tecnico, configuracion por entorno, pruebas, CI, documentacion tecnica EV2 y control de evidencia.
- Alcindo/Alcido: base funcional del producto, estructura principal del avance y apoyo a la preparacion de demo y evidencias.
- Equipo Campus Emprende: consolidacion de evidencia visual, gestion de entrega y defensa oral.

# Conclusiones
EV2 deja a Campus Emprende con una base tecnica mas segura, una estructura de entrega completa y un relato funcional defendible. La fortaleza principal de esta etapa no esta en declarar el sistema como terminado, sino en mostrar con claridad que partes funcionan, que partes siguen parciales y que evidencia ya existe para sostener cada afirmacion.

# Lecciones aprendidas
- Documentar estados reales reduce riesgo academico y tecnico.
- Configurar por ambiente evita exposicion de secretos y simplifica pruebas.
- Una base acotada de tests y CI mejora la defendibilidad del avance.
- La evidencia visual necesita planificacion propia y no puede dejarse para el cierre sin control.

# Anexos
- UML
- MER
- QA
- Producto
- Gestion
