# Portada
- Proyecto: Campus Emprende
- Asignatura: TPY1101 Taller Aplicado de Programacion
- Evaluacion: Parcial N 2 Estado de avance 2
- Grupo: 8
- Seccion: por completar
- Integrantes: por completar
- Repositorio: https://github.com/ByOneChav/campus-emprende

# Indice
1. Introduccion
2. Resumen de EV1
3. Observaciones del profesor y correcciones aplicadas
4. Problema y oportunidad
5. Objetivos
6. Alcance
7. Metodologia
8. Arquitectura y patrones
9. Tecnologias e integraciones
10. Ambientes, pruebas y backup
11. Desarrollo del producto
12. Estado funcional real
13. Evidencia del software
14. Gestion del proyecto
15. Conclusiones y lecciones aprendidas
16. Anexos

# Introduccion
Campus Emprende es una plataforma academica para registrar, moderar y dar trazabilidad a servicios estudiantiles. En EV2 se presenta el estado real del MVP, su diseno tecnico, su base de pruebas y la estructura documental exigida por la rubrica.

# Resumen de EV1
## Problema detectado
Los estudiantes prestan servicios de forma informal y sin evidencia verificable.

## Oportunidad
Formalizar la experiencia estudiantil mediante una plataforma institucional con identidad verificada, moderacion y trazabilidad.

## Objetivo general
Convertir actividad real de servicios entre estudiantes en evidencia profesional verificable.

## Alcance inicial
Autenticacion, perfiles, publicacion de servicios, solicitudes, reviews, comentarios y moderacion basica.

## Observaciones del docente
- No volver a usar la carga academica como restriccion.
- Incorporar caminos alternativos en los flujos.

## Acciones correctivas
- Se reemplazo la restriccion por una formulacion de gestion por alcance y entregables.
- Se documento un diagrama especifico de caminos alternativos y una tabla transversal de respuestas del sistema.

# Observaciones del profesor y correcciones aplicadas
- Eliminacion de la carga academica como restriccion del proyecto.
- Incorporacion de caminos alternativos para registro, login, verificacion, servicios, solicitudes, reviews, reportes y seguridad.

# Problema y oportunidad
El ecosistema de servicios estudiantiles es informal, depende de mensajes directos y carece de trazabilidad. La oportunidad consiste en ofrecer una plataforma controlada que permita registrar experiencia, moderar contenido y respaldar el avance del estudiante con evidencia verificable.

# Objetivo general y objetivos especificos
## Objetivo general
Disponer de un MVP web que permita registrar servicios estudiantiles y generar trazabilidad verificable de la actividad.

## Objetivos especificos
- Verificar identidad y acceso mediante correo y JWT.
- Permitir publicacion y consulta de servicios.
- Gestionar solicitudes, reviews, comentarios y reportes.
- Entregar una base documental y de pruebas alineada a EV2.

# Alcance y fuera de alcance
## Alcance
- Registro, login, verificacion, recuperacion y reset de contrasena.
- Perfil de usuario.
- Publicacion, consulta, edicion y desactivacion de servicios.
- Reviews y comentarios.
- Moderacion y administracion basica.

## Fuera de alcance
- No es marketplace abierto.
- No maneja pagos.
- No genera relacion laboral.
- No incluye despliegue productivo completo ni observabilidad avanzada.

# Metodologia de desarrollo
Se adopta un enfoque iterativo incremental, con priorizacion de funcionalidades MVP, distribucion modular de responsabilidades y control de avance por entregables parciales. La evidencia se organiza por modulo funcional, pruebas ejecutadas y documentacion defendible.

# Arquitectura
## Vista general
- Frontend SPA en React.
- Backend REST en Spring Boot.
- Persistencia PostgreSQL.
- Seguridad JWT con Spring Security.
- Correo para verificacion y recuperacion.
- Swagger como evidencia de API.

## Patrones de diseno
- Arquitectura por capas.
- DTO Pattern.
- Repository Pattern.
- Component-Based Architecture.
- SPA Routing Pattern.
- Manejo centralizado de errores.
- Configuracion por ambiente.

# Lenguajes y tecnologias
- Java 21, Spring Boot 3.3.5, JPA, Spring Security, OAuth2, JWT, PostgreSQL, Java Mail Sender, PDFBox, Swagger.
- React 19, Vite, Redux Toolkit, React Router DOM, Axios, Tailwind, shadcn/ui, Radix, Sonner.

# Configuracion de servidor
## Desarrollo
- Backend en puerto 8080.
- Frontend en puerto 5173.
- Variables por entorno.

## Pruebas
- Backend con perfil `test` e H2 en memoria.
- Frontend con Vitest y `jsdom`.

## Produccion referencial
- Se documenta como referencial, no como estado desplegado confirmado.

# Integraciones
- PostgreSQL.
- Java Mail Sender.
- JWT.
- Swagger.
- OAuth2 GitHub en desarrollo.
- Frontend/backend via API REST.

# Ambiente de pruebas
- Backend: `application-test.yaml`, H2, MockMvc, Mockito, JUnit 5.
- Frontend: Vitest, Testing Library y `VITE_API_BASE_URL`.
- Comandos documentados en README y seccion Producto.

# Procedimiento backup/restore
El procedimiento operativo se documenta en `Producto/Scripts_BD/backup_postgresql.md` y `restore_testing.md`, con `pg_dump`, restauracion en base de prueba y validacion posterior de tablas.

# Diseno de solucion
- Casos de uso: ver `Documentacion/UML/Diagrama_Casos_Uso.md`
- Modelo de datos: ver `Documentacion/MER/`
- Componentes: ver `Documentacion/UML/Diagrama_Componentes.md`
- Wireframes: ver `Documentacion/Wireframes/Wireframes_Resumen.md`

## Tabla de flujos y caminos alternativos
| Modulo | Flujo principal | Camino alternativo | Respuesta del sistema | Evidencia |
|---|---|---|---|---|
| Registro | Alta con correo institucional | Correo ya registrado | 400 con mensaje claro | Codigo y prueba |
| Login | Credenciales validas | Cuenta no verificada | rechazo de autenticacion | Codigo |
| Verificacion | Token valido | Token vencido | mensaje de error y reenvio requerido | Requerida |
| Servicios | Crear servicio | Datos incompletos | validacion 400 | Codigo |
| Solicitudes | Solicitar servicio | Duplicada o cancelada | Parcial segun modulo | Codigo |
| Reviews | Crear resena | rating invalido | validacion 400 | Codigo |
| Reportes | Enviar reporte | sin fundamento o rol insuficiente | Parcial / acceso denegado | Codigo |
| Seguridad | Acceso con JWT | sin token o token expirado | 401 / 403 | Codigo y test |

# Desarrollo del producto
## Backend
Se reforzo la configuracion por variables, JWT configurable, CORS parametrizable, respuestas de error consistentes y validacion de requests.

## Frontend
Se centralizo el cliente API con `VITE_API_BASE_URL`, se agrego `env.example` y se incorporo una base de pruebas con Vitest.

## Seguridad
Se eliminaron secretos versionados y `UserDTO` ya no expone password.

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
Las capturas reales requeridas se listan en `Documentacion/Evidencias_Web/lista_capturas_requeridas.csv`. Cuando no existe imagen real, el estado se mantiene como `Requerida`, `Parcial` o `Reemplazada por evidencia de codigo`.

# Plan de pruebas
El plan y los casos se encuentran en `Documentacion/QA/`.

# Resultados de pruebas
- Backend: 14 tests pasando.
- Frontend: 8 tests pasando.
- Lint frontend: sin errores, con warnings heredados documentados.
- Build frontend: exitoso.

# Gestion del proyecto
La estructura de gestion incluye carta Gantt, riesgos, KPI, actas y estado de avance EV1/EV2.

# Aportes por integrante
- Elias Delgado: hardening tecnico, calidad, CI, documentacion EV2 y evidencia.
- Alcido/Alcindo: base inicial, estructura funcional principal y explicacion de avance.
- Integrantes restantes: por completar.

# Conclusiones
EV2 deja al proyecto con una base tecnica mas segura, una trazabilidad documental completa y un estado funcional honesto para defensa academica.

# Lecciones aprendidas
- Documentar estados reales evita sobreprometer.
- Configurar por entorno reduce riesgo de seguridad.
- Una base minima de pruebas y CI mejora la defendibilidad del avance.

# Anexos
- UML
- MER
- QA
- Producto
- Gestion
