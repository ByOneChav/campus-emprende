# Campus Emprende — Referencia de Funcionalidades y Entidades

---

## Funcionalidades

### Autenticación y Cuentas
- **F01** — Registro con correo institucional (requiere verificación)
- **F02** — Inicio de sesión / Cierre de sesión
- **F03** — Flujo de verificación de correo (basado en token)
- **F04** — Control de acceso basado en roles (ESTUDIANTE / ADMIN)

### Perfil Profesional
- **F05** — Crear y editar perfil personal (biografía, carrera, avatar)
- **F06** — Ver el perfil público de cualquier estudiante
- **F07** — Exportar perfil como portafolio en PDF

### Publicación de Servicios
- **F08** — Crear una oferta de servicio (proveedor)
- **F09** — Editar / desactivar un servicio
- **F10** — Explorar y buscar servicios publicados
- **F11** — Ver el detalle de un servicio

### Moderación Administrativa
- **F12** — Revisar servicios pendientes (aprobar / rechazar con motivo)
- **F13** — Moderar contenido reportado (servicios, reseñas, usuarios)
- **F14** — Panel de administración — vista general de actividad

### Solicitudes de Servicio
- **F15** — El cliente envía una solicitud de servicio con un mensaje
- **F16** — El proveedor acepta o rechaza la solicitud
- **F17** — El proveedor marca el servicio como en progreso
- **F18** — El proveedor marca el servicio como completado
- **F19** — El cliente confirma la finalización
- **F20** — El cliente o proveedor cancela una solicitud

### Calificaciones y Reseñas
- **F21** — El cliente deja una calificación (1–5) + reseña escrita al finalizar
- **F22** — Las reseñas son visibles en el detalle del servicio y perfil del proveedor

### Reportes
- **F23** — Reportar un servicio, reseña o usuario
- **F24** — El administrador revisa y resuelve reportes

---

## Entidades

### 1. Usuario
Representa a cada persona en la plataforma (estudiantes y administradores).

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID / BIGINT PK | |
| email | VARCHAR(255) UNIQUE | Solo correo institucional |
| password_hash | VARCHAR | Bcrypt |
| full_name | VARCHAR(100) | |
| role | ENUM(ESTUDIANTE, ADMIN) | Por defecto: ESTUDIANTE |
| email_verified | BOOLEAN | Por defecto: false |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

---

### 2. Perfil
Detalles profesionales extendidos para un usuario estudiante (1 a 1 con Usuario).

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID / BIGINT PK | |
| user_id | FK → Usuario | UNIQUE |
| bio | TEXT | |
| career | VARCHAR(100) | Carrera / programa académico |
| avatar_url | VARCHAR | Opcional |
| linkedin_url | VARCHAR | Opcional |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

---

### 3. Servicio
Un servicio publicado por un estudiante proveedor.

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID / BIGINT PK | |
| provider_id | FK → Usuario | Debe ser ESTUDIANTE |
| title | VARCHAR(150) | |
| description | TEXT | |
| category | ENUM(DESARROLLO_WEB, DISEÑO_GRAFICO, SOPORTE_TECNICO, TUTORIAS, FOTOGRAFIA, OTRO) | |
| status | ENUM(PENDIENTE, APROBADO, RECHAZADO, INACTIVO) | Por defecto: PENDIENTE |
| rejection_reason | TEXT | Nullable; definido por admin al rechazar |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

---

### 4. SolicitudServicio
Solicitud de un estudiante cliente para usar un servicio publicado.

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID / BIGINT PK | |
| service_id | FK → Servicio | |
| client_id | FK → Usuario | Debe ser distinto del proveedor |
| message | TEXT | Mensaje inicial del cliente |
| status | ENUM(PENDIENTE, ACEPTADO, EN_PROGRESO, COMPLETADO, CANCELADO) | Por defecto: PENDIENTE |
| cancelled_by | ENUM(CLIENTE, PROVEEDOR) | Nullable |
| completed_at | TIMESTAMP | Nullable; se establece al completar |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

---

### 5. Reseña
Calificación y comentario dejado por el cliente tras completar un servicio.

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID / BIGINT PK | |
| service_request_id | FK → SolicitudServicio | UNIQUE (una reseña por solicitud) |
| reviewer_id | FK → Usuario | Debe ser el cliente |
| rating | SMALLINT | 1–5 |
| comment | TEXT | Opcional |
| created_at | TIMESTAMP | |

---

### 6. Reporte
Reportes de moderación enviados por los usuarios.

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID / BIGINT PK | |
| reporter_id | FK → Usuario | Quién reporta |
| target_type | ENUM(SERVICIO, RESEÑA, USUARIO) | Qué se está reportando |
| target_id | BIGINT | ID de la entidad reportada |
| reason | TEXT | |
| status | ENUM(PENDIENTE, REVISADO, RESUELTO) | Por defecto: PENDIENTE |
| admin_notes | TEXT | Nullable; completado por admin |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

---

### 7. TokenVerificacionEmail
Token de corta duración enviado para verificar el correo institucional.

| Campo | Tipo | Notas |
|---|---|---|
| id | UUID / BIGINT PK | |
| user_id | FK → Usuario | |
| token | VARCHAR UNIQUE | Token seguro aleatorio |
| expires_at | TIMESTAMP | |
| used_at | TIMESTAMP | Nullable; se establece al usar |
| created_at | TIMESTAMP | |

---

## Resumen de Relaciones
