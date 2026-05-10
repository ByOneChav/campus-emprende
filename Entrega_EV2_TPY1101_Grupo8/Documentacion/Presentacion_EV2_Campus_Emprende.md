# Slide 1
- Titulo: Portada
- Mensaje clave: Campus Emprende presenta en EV2 un MVP funcional con evidencia tecnica verificable y brechas aun abiertas declaradas con honestidad.
- Puntos principales:
  - TPY1101 Taller Aplicado de Programacion
  - Evaluacion Parcial N 2
  - Grupo 8
  - Repositorio oficial del proyecto
- Evidencia asociada: `README.md`
- Nota oral: Abrir la presentacion explicando que la exposicion mostrara el estado real del producto y no una promesa de cierre total.

# Slide 2
- Titulo: Agenda
- Mensaje clave: La defensa recorre problema, solucion, arquitectura, avance real, pruebas, riesgos y cierre.
- Puntos principales:
  - Contexto y problema
  - Arquitectura y stack
  - Estado funcional y caminos alternativos
  - Pruebas, riesgos y cierre
- Evidencia asociada: `Entrega_EV2_TPY1101_Grupo8/Documentacion/Guion_Defensa_EV2.md`
- Nota oral: Marcar desde el inicio que la presentacion dura 30 minutos y deja 10 minutos para preguntas.

# Slide 3
- Titulo: Contexto del proyecto
- Mensaje clave: El proyecto nace para ordenar servicios estudiantiles que hoy circulan sin trazabilidad formal.
- Puntos principales:
  - Publicacion informal de servicios
  - Falta de identidad verificada
  - Ausencia de historial y respaldo
  - Necesidad de evidencia profesional
- Evidencia asociada: `Entrega_EV2_TPY1101_Grupo8/Documentacion/Informe_EV2_Campus_Emprende.md`
- Nota oral: Explicar que el foco esta en comunidad estudiantil y respaldo verificable de la actividad realizada.

# Slide 4
- Titulo: Problema detectado
- Mensaje clave: El problema principal es la falta de control y trazabilidad en la relacion entre estudiantes que ofrecen y solicitan servicios.
- Puntos principales:
  - No existe un flujo institucional
  - La validacion de usuarios es debil
  - No hay historial ordenado de interacciones
  - La moderacion depende de canales informales
- Evidencia asociada: `Entrega_EV2_TPY1101_Grupo8/Gestion/1.1.2_Documento_Registro_Definicion_Identificacion_Proyecto.md`
- Nota oral: Aclarar que el proyecto no se plantea como marketplace de pagos ni como relacion laboral.

# Slide 5
- Titulo: Solucion propuesta
- Mensaje clave: Campus Emprende organiza el ciclo completo de registro, servicio, solicitud, feedback y moderacion basica.
- Puntos principales:
  - Registro y verificacion por correo
  - Publicacion y consulta de servicios
  - Solicitudes entre estudiantes
  - Reviews, comentarios y reportes
- Evidencia asociada: `DISENO_DEL_SISTEMA.md`
- Nota oral: Conectar la solucion con el objetivo academico de dejar evidencia verificable del trabajo realizado.

# Slide 6
- Titulo: Correcciones desde EV1
- Mensaje clave: EV2 corrige observaciones del profesor y ordena la entrega con un criterio tecnico mas defendible.
- Puntos principales:
  - Se reemplazo una restriccion no valida del proyecto
  - Se incorporaron caminos alternativos
  - Se ordeno la entrega en Documentacion Producto y Gestion
  - Se transparento el estado parcial de algunos modulos
- Evidencia asociada: `Entrega_EV2_TPY1101_Grupo8/Documentacion/UML/Diagrama_Actividad_Caminos_Alternativos.md`
- Nota oral: Mostrar que la correccion no fue cosmetica, sino que afecto contenido, discurso y evidencia.

# Slide 7
- Titulo: Arquitectura general
- Mensaje clave: El sistema sigue una arquitectura de monolito modular con frontend SPA y backend REST.
- Puntos principales:
  - React como frontend
  - Spring Boot como backend
  - PostgreSQL como persistencia
  - JWT y correo como integraciones de soporte
- Evidencia asociada: `Entrega_EV2_TPY1101_Grupo8/Documentacion/UML/Diagrama_Componentes.md`
- Nota oral: Explicar la separacion por capas y por que esa estructura favorece mantenibilidad y defensa tecnica.

# Slide 8
- Titulo: Stack tecnologico
- Mensaje clave: El stack elegido responde al alcance del MVP y a la necesidad de integrar seguridad, persistencia y SPA.
- Puntos principales:
  - Java 21 y Spring Boot 3.3.5
  - React 19 y Vite
  - PostgreSQL y Swagger
  - GitHub Actions para validacion continua
- Evidencia asociada: `README.md`
- Nota oral: Relacionar tecnologias con necesidades concretas del producto en lugar de enumerarlas aisladamente.

# Slide 9
- Titulo: Modelo de datos
- Mensaje clave: El modelo se centra en usuarios, servicios y trazabilidad de interacciones.
- Puntos principales:
  - User y Profile
  - ServiceListing y ServiceRequest
  - Review y Comment
  - Report y tokens de seguridad
- Evidencia asociada: `Entrega_EV2_TPY1101_Grupo8/Documentacion/MER/Modelo_Entidad_Relacion.md`
- Nota oral: Resaltar que el modelo permite seguir el ciclo completo de una publicacion y su retroalimentacion.

# Slide 10
- Titulo: Flujo funcional principal
- Mensaje clave: El flujo principal del MVP permite demostrar valor desde el alta de cuenta hasta la retroalimentacion final.
- Puntos principales:
  - Registro y verificacion de cuenta
  - Login con JWT
  - Creacion y visualizacion de servicio
  - Solicitud, review y comentario
- Evidencia asociada: `Entrega_EV2_TPY1101_Grupo8/Documentacion/UML/Diagrama_Actividad_Flujo_Principal.md`
- Nota oral: Este es el flujo recomendado para la demo del equipo.

# Slide 11
- Titulo: Caminos alternativos
- Mensaje clave: La defensa ya no se limita al flujo feliz y contempla respuestas del sistema frente a errores y desvíos frecuentes.
- Puntos principales:
  - Correo no valido o ya registrado
  - Cuenta no verificada o token vencido
  - Servicio rechazado o no disponible
  - Acceso sin token o con rol incorrecto
- Evidencia asociada: `Entrega_EV2_TPY1101_Grupo8/Documentacion/UML/Diagrama_Actividad_Caminos_Alternativos.md`
- Nota oral: Este punto responde directamente a la observacion recibida en EV1.

# Slide 12
- Titulo: Ambiente de pruebas
- Mensaje clave: El proyecto ya cuenta con un ambiente de pruebas ejecutable sin depender de servicios externos reales.
- Puntos principales:
  - Backend con perfil `test`
  - H2 en memoria para pruebas
  - Frontend con Vitest y `jsdom`
  - Variables controladas por entorno
- Evidencia asociada: `Entrega_EV2_TPY1101_Grupo8/Producto/Configuracion/ambiente_pruebas.md`
- Nota oral: Explicar que el objetivo no fue cobertura total, sino una base defendible y compilable.

# Slide 13
- Titulo: Procedimiento backup restore
- Mensaje clave: La entrega incluye una operacion documentada para resguardar y restaurar datos en PostgreSQL.
- Puntos principales:
  - Respaldo con `pg_dump`
  - Restauracion en base de pruebas
  - Verificacion posterior de tablas
  - Uso de datos de prueba seguros
- Evidencia asociada: `Entrega_EV2_TPY1101_Grupo8/Producto/Scripts_BD/backup_postgresql.md`
- Nota oral: Presentar este punto como capacidad operativa documentada para EV2.

# Slide 14
- Titulo: Avance backend
- Mensaje clave: El backend quedo mas seguro, configurable y consistente sin redisenar la aplicacion completa.
- Puntos principales:
  - Secretos retirados de archivos versionados
  - JWT y CORS parametrizados
  - Requests con validacion reforzada
  - Errores globales consistentes
- Evidencia asociada: `docs/TECHNICAL_AUDIT.md`
- Nota oral: Aterrizar la explicacion en mejoras incrementales que se pueden defender con codigo y pruebas.

# Slide 15
- Titulo: Avance frontend
- Mensaje clave: El frontend mantiene su estructura funcional y ahora centraliza mejor la integracion con la API.
- Puntos principales:
  - Cliente API por `VITE_API_BASE_URL`
  - Token centralizado en interceptores
  - Base de pruebas con Vitest
  - Advertencias heredadas documentadas
- Evidencia asociada: `docs/TECHNICAL_AUDIT.md`
- Nota oral: Aclarar que el objetivo fue estabilizar la integracion, no redisenar la interfaz.

# Slide 16
- Titulo: Evidencia pagina web
- Mensaje clave: La matriz de capturas controla lo que falta por anexar sin declarar imagenes inexistentes.
- Puntos principales:
  - Registro y login
  - Dashboard y perfil
  - Servicios, review y comentario
  - Reporte, admin y Swagger
- Evidencia asociada: Captura web pendiente de incorporar por el equipo antes de exportar.
- Nota oral: Explicar que la entrega ya deja la trazabilidad de la evidencia visual, aunque varias imagenes aun no se han anexado.

# Slide 17
- Titulo: Seguridad aplicada
- Mensaje clave: La seguridad base del MVP se apoya en configuracion por entorno, JWT y exposicion minima de datos.
- Puntos principales:
  - Secretos fuera del repositorio
  - JWT configurable
  - DTO de usuario sin password
  - Manejo de errores sin stacktrace expuesto
- Evidencia asociada: `README.md`
- Nota oral: Mostrar que la seguridad se fortalecio sin romper el flujo principal ya funcional.

# Slide 18
- Titulo: Plan de pruebas
- Mensaje clave: La matriz QA conecta requisitos, casos de prueba y evidencia tecnica o visual disponible.
- Puntos principales:
  - Casos funcionales y de validacion
  - Cobertura inicial backend y frontend
  - Casos operacionales de backup y restore
  - Trazabilidad por modulo
- Evidencia asociada: `Entrega_EV2_TPY1101_Grupo8/Documentacion/QA/Plan_Pruebas.md`
- Nota oral: Distinguir pruebas automatizadas, pruebas documentadas y evidencia visual pendiente.

# Slide 19
- Titulo: Evidencia de pruebas
- Mensaje clave: El repositorio ya demuestra ejecucion automatizada real y deja documentada la evidencia faltante.
- Puntos principales:
  - 14 tests backend pasando
  - 8 tests frontend pasando
  - `build` frontend exitoso
  - `lint` sin errores y con 28 warnings heredados
- Evidencia asociada: `Entrega_EV2_TPY1101_Grupo8/Documentacion/QA/Evidencia_Pruebas.md`
- Nota oral: No ocultar los warnings heredados y explicarlos como deuda conocida del proyecto base.

# Slide 20
- Titulo: KPI de avance
- Mensaje clave: Los KPI muestran avance real del MVP y tambien dejan visibles las brechas que aun no cierran.
- Puntos principales:
  - Base de pruebas automatizada completa
  - Documentacion EV2 consolidada
  - Modulos MVP aun con cierres parciales
  - Evidencia visual con avance incompleto
- Evidencia asociada: `Entrega_EV2_TPY1101_Grupo8/Gestion/Control_Avance/KPI_Avance.csv`
- Nota oral: Usar porcentajes conservadores para sostener una defensa creible.

# Slide 21
- Titulo: Riesgos y mitigaciones
- Mensaje clave: La entrega identifica riesgos concretos y deja acciones activas para cerrarlos antes del despacho final.
- Puntos principales:
  - Capturas web faltantes
  - Modulos parciales en solicitudes reportes y admin
  - OAuth2 en desarrollo
  - Dependencias locales de PostgreSQL y SMTP
- Evidencia asociada: `Entrega_EV2_TPY1101_Grupo8/Gestion/Riesgos/Matriz_Riesgos.csv`
- Nota oral: Mostrar que el equipo conoce las brechas y ya tiene una forma de controlarlas.

# Slide 22
- Titulo: Aportes por integrante
- Mensaje clave: La entrega distingue aportes tecnicos y de avance sin atribuir trabajo no confirmado.
- Puntos principales:
  - Elias Delgado: hardening, pruebas, CI y documentacion tecnica
  - Alcindo/Alcido: base funcional, avance del producto y contexto de demo
  - Equipo: evidencia visual, defensa y cierre de entrega
- Evidencia asociada: `README.md`
- Nota oral: Mantener el foco en aportes verificables por repositorio y documentacion.

# Slide 23
- Titulo: Conclusiones
- Mensaje clave: EV2 deja un MVP defendible, con avances funcionales claros y con brechas explicitadas sin exageracion.
- Puntos principales:
  - Autenticacion, perfil, servicios, reviews y comentarios funcionales
  - Solicitudes, reportes y admin en estado parcial
  - Documentacion y control de evidencia consolidados
  - Base de pruebas y CI operativa
- Evidencia asociada: `Entrega_EV2_TPY1101_Grupo8/Documentacion/Informe_EV2_Campus_Emprende.md`
- Nota oral: Cerrar remarcando que el valor de EV2 esta en la honestidad tecnica y la defendibilidad del avance.

# Slide 24
- Titulo: Lecciones aprendidas
- Mensaje clave: La experiencia EV2 reforzo la necesidad de documentar temprano, validar por entorno y no sobredeclarar estados.
- Puntos principales:
  - La configuracion por entorno evita riesgos de seguridad
  - Una base pequena de pruebas mejora la defensa tecnica
  - Los estados parciales deben declararse sin ambiguedad
  - La evidencia visual necesita gestion dedicada
- Evidencia asociada: `docs/TECHNICAL_AUDIT.md`
- Nota oral: Conectar el aprendizaje tecnico con la organizacion del equipo para la entrega final.

# Slide 25
- Titulo: Preguntas
- Mensaje clave: El cierre deja abierto el espacio para profundizar en arquitectura, seguridad, pruebas, demo y roadmap.
- Puntos principales:
  - Problema y alcance
  - Estado funcional real
  - Seguridad y pruebas
  - Proximos pasos
- Evidencia asociada: `Entrega_EV2_TPY1101_Grupo8/Documentacion/Guion_Defensa_EV2.md`
- Nota oral: Abrir el bloque de preguntas manteniendo a mano el informe, el checklist funcional y la matriz de capturas.
