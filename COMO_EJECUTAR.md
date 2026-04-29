# Ejecutar Campus Emprende Localmente
 
Un marketplace donde estudiantes ofrecen y solicitan servicios emprendedores — construido con un backend en Spring Boot y un frontend en React.
 
---
 
## Lo que necesitas tener instalado
 
| Herramienta | Versión | Para qué sirve |
|-------------|---------|-----------------|
| **JDK** | 21 | El backend corre sobre Java 21 |
| **Maven** | 3.9+ (o usa `mvnw`) | Compila la aplicación Spring Boot |
| **Node.js** | 20+ | Herramientas del frontend |
| **npm** | última versión | Gestor de paquetes del frontend |
| **PostgreSQL** | 14+ | Base de datos principal |
 
> **Verificación rápida** — pega esto en tu terminal y asegúrate de que no haya errores:
> ```bash
> java -version && mvn -v && node -v && pnpm -v && psql --version
> ```
 
---
 
## 1. Configurar la base de datos
 
Abre una terminal de `psql` y crea la base de datos:
 
```sql
CREATE DATABASE campus_emprende;
```
 
Eso es todo. Hibernate creará todas las tablas automáticamente en el primer arranque (`ddl-auto: update`).
 
---
 
## 2. Iniciar el backend
 
El backend se encuentra en `Campus-Emprende/`.
 
```bash
cd "backend"
```
 
### Variables de entorno (configuraciones opcionales)
 
El archivo `application.yaml` tiene valores por defecto razonables — lo único que podrías necesitar cambiar son las credenciales de la base de datos si las tuyas difieren de los valores predeterminados:
 
| Variable | Valor por defecto |
|----------|-------------------|
| `DB_HOST` | `localhost` |
| `DB_PORT` | `5432` |
| `DB_NAME` | `campus_emprende` |
| `DB_USERNAME` | `postgres` |
| `DB_PASSWORD` | `$7090Ashok` |
 
Configúralas en tu terminal si es necesario:
 
```bash
export DB_USERNAME=tu_usuario
export DB_PASSWORD=tu_contraseña
```
 
### Arrancar el servidor
 
```bash
# Usando el wrapper de Maven (no necesitas tener Maven instalado)
./mvnw spring-boot:run
 
# O si tienes Maven instalado
mvn spring-boot:run
```
 
Espera esta línea — significa que el backend está listo:
 
```
Started CampusEmprendeApplication in X.XXX seconds
```
 
El backend corre en **http://localhost:5000**
 
---
 
## 3. Iniciar el frontend
 
El frontend se encuentra en `campus-emprende-frontend/`.
 
```bash
cd "campus-emprende-frontend"
```
 
### Instalar dependencias
 
```bash
pnpm install
```
 
### Ejecutar el servidor de desarrollo
 
```bash
pnpm dev
```
 
El frontend corre en **http://localhost:5173**
 
---
 
## ¡Listo!
 
| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:5173 |
| API del backend | http://localhost:5000 |
| Health check de la API | http://localhost:5000/api/... |
 
---
 
## Stack tecnológico
 
### Backend — `Campus-Emprende/`
- **Spring Boot 4.0.6** — framework web
- **Spring Security + JWT** — autenticación y autorización
- **Spring OAuth2 Client** — inicio de sesión con Google
- **Spring Data JPA + Hibernate** — ORM de base de datos
- **PostgreSQL** — base de datos relacional
- **Spring Mail** — verificación de correo y restablecimiento de contraseña (vía Gmail SMTP)
- **Apache PDFBox 3.0.2** — exportación de perfil a PDF
- **Lombok** — reducción de código repetitivo
### Frontend — `campus-emprende-frontend/`
- **React 19 + Vite 8** — framework de UI y servidor de desarrollo
- **Tailwind CSS 4** — estilos
- **shadcn/ui + Radix UI** — biblioteca de componentes
- **Redux Toolkit** — gestión de estado global
- **React Router DOM 7** — enrutamiento del lado del cliente
- **Axios** — cliente HTTP
- **Cloudinary** — carga de imágenes
---
 
## Solución de problemas
 
**`Connection refused` en el puerto 5000**
→ El backend no está corriendo. Revisa la terminal en busca de errores. Lo más probable es un problema de conexión a la base de datos — verifica que PostgreSQL esté activo y que las credenciales sean correctas.
 
**`psql: error: connection to server failed`**
→ El servicio de PostgreSQL no está iniciado. En Windows: `net start postgresql-x64-14` (ajusta la versión). En Mac/Linux: `brew services start postgresql` o `sudo systemctl start postgresql`.
 
**`pnpm: command not found`**
→ Instálalo con `npm install -g pnpm`.
 
**Los enlaces de correo (verificación / restablecimiento de contraseña) no funcionan**
→ La contraseña de aplicación de Gmail en `application.yaml` puede haber expirado. Genera una nueva en [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) y actualiza el campo `spring.mail.password`.
 
**Google OAuth no funciona**
→ Asegúrate de que `http://localhost:5000/login/oauth2/code/google` esté listado como URI de redirección autorizada en la [Google Cloud Console](https://console.cloud.google.com/).