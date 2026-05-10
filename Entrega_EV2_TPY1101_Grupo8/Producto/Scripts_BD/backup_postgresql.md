# Backup PostgreSQL
1. Definir variables:
   - `PGHOST`
   - `PGPORT`
   - `PGUSER`
   - `PGPASSWORD`
   - `PGDATABASE`
2. Ejecutar:
   - `pg_dump -Fc -f backup_campus_emprende_YYYYMMDD.dump %PGDATABASE%`
3. Validar:
   - verificar que el archivo exista
   - registrar fecha y responsable
4. Seguridad:
   - no subir backups con datos reales al repositorio
   - usar entornos controlados
