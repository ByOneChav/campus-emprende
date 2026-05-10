# Como Ejecutar Campus Emprende

## Requisitos
- Java 21
- Maven Wrapper o Maven 3.9+
- Node.js 22 o compatible con Corepack
- pnpm
- PostgreSQL 14+

## Backend
1. Crear una base de datos PostgreSQL para desarrollo.
2. Configurar variables:
   - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`
   - `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`
   - `JWT_SECRET`, `JWT_EXPIRATION_MS`
   - `FRONTEND_BASE_URL`, `APP_CORS_ALLOWED_ORIGINS`
3. Revisar `Campus-Emprende/src/main/resources/application-example.yaml`.
4. Ejecutar:

```powershell
$env:JAVA_HOME="C:\Program Files\Java\jdk-21.0.10"
cd Campus-Emprende
.\mvnw.cmd spring-boot:run
```

## Frontend
1. Crear `campus-emprende-frontend/.env` a partir de `.env.example`.
2. Ejecutar:

```powershell
cd campus-emprende-frontend
pnpm install
pnpm dev
```

## URLs locales
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`
- Swagger: `http://localhost:8080/swagger-ui.html`

## Ambiente de pruebas
Backend:

```powershell
$env:JAVA_HOME="C:\Program Files\Java\jdk-21.0.10"
cd Campus-Emprende
.\mvnw.cmd test
```

Frontend:

```powershell
cd campus-emprende-frontend
pnpm install --frozen-lockfile
pnpm lint
pnpm build
pnpm test
```
