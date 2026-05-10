# Restore Testing
1. Crear base de prueba:
   - `CREATE DATABASE campus_emprende_test;`
2. Restaurar:
   - `pg_restore -d campus_emprende_test backup_campus_emprende_YYYYMMDD.dump`
3. Validar:
   - listar tablas
   - revisar usuarios, servicios y relaciones principales
4. Checklist de seguridad:
   - usar datos dummy o anonimizados
   - no restaurar en produccion por error
