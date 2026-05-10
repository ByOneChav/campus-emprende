# Ambiente Pruebas
- Backend con `SPRING_PROFILES_ACTIVE=test`.
- `application-test.yaml` con H2.
- Frontend con `VITE_API_BASE_URL=http://localhost:8080`.
- Comandos:
  - `.\mvnw.cmd test`
  - `pnpm lint`
  - `pnpm build`
  - `pnpm test`
