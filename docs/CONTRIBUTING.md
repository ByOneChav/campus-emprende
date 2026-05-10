# Contributing

## Ramas
- `main`: rama estable.
- `feature/<owner>-<scope>`: trabajo incremental por entregable.

## Commits
- Usar mensajes claros por area como `docs: ...`, `refactor(backend): ...`, `test: ...` o `ci: ...`.
- Evitar commits mezclando cambios no relacionados.

## Pruebas antes de PR
- Backend: `.\mvnw.cmd test`
- Frontend: `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build`, `pnpm test`

## Variables de entorno
- No versionar secretos.
- Usar `.env`, variables del sistema o archivos locales ignorados.
- Basarse en `application-example.yaml` y `.env.example`.

## Checklist PR
- La rama compila o se documenta el bloqueo real.
- No se exponen secretos.
- Los cambios estan documentados si alteran ejecucion o arquitectura.
- La evidencia visual se actualiza o se mantiene en control como `Requiere captura`.
- No se hace merge automatico sin revision del equipo.
