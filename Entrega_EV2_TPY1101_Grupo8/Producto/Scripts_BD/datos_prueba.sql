-- Datos de prueba seguros para EV2
-- No usar passwords reales en texto plano.

INSERT INTO users (full_name, email, password, role, verified, auth_provider)
VALUES
('Elias Delgado', 'elia.delgado@duocuc.cl', '$2a$10$dummyhashdummyhashdummyhashdummyhashdummyhash12', 'ROLE_STUDENT', true, 'LOCAL');

-- Insertar datos adicionales segun estructura real del equipo antes de demo.
