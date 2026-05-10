# Contributing

## Ramas
- `main`: rama estable.
- `feature/<owner>-<scope>`: trabajo incremental por entregable.

## Commits
- Usar mensajes claros por area, por ejemplo `docs: ...`, `refactor(backend): ...`, `test: ...`, `ci: ...`.
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
- Se actualiza la evidencia o se marca como requerida.
- No se hace merge automatico sin revision del equipo.
