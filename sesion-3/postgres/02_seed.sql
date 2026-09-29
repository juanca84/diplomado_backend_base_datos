INSERT INTO users (name, email)
VALUES
('Juan', 'juan@taskflow.com'),
('Maria', 'maria@taskflow.com'),
('Pedro', 'pedro@taskflow.com'),
('Ana', 'ana@taskflow.com'),
('Luis', 'luis@taskflow.com');

INSERT INTO projects (name, description)
VALUES
('Backend API', 'Desarrollo de API REST'),
('QA Platform', 'Plataforma para pruebas de software'),
('Mobile App', 'Aplicación móvil de TaskFlow');

INSERT INTO tasks
(title, description, status, priority, estimated_hours, user_id, project_id, created_at)
VALUES
(
    'Crear API de usuarios',
    'Implementar endpoints para usuarios',
    'pending',
    'high',
    6,
    1,
    1,
    '2026-09-01 09:00:00'
),
(
    'Diseñar base de datos',
    'Crear modelo relacional',
    'completed',
    'high',
    5,
    2,
    1,
    '2026-09-02 10:00:00'
),
(
    'Crear autenticación',
    'Implementar autenticación JWT',
    'in_progress',
    'high',
    8,
    1,
    1,
    '2026-09-03 11:00:00'
),
(
    'Crear pruebas unitarias',
    'Implementar pruebas para servicios',
    'pending',
    'medium',
    4,
    3,
    2,
    '2026-09-04 12:00:00'
),
(
    'Pruebas de API',
    'Crear colección de pruebas',
    'completed',
    'medium',
    3,
    2,
    2,
    '2026-09-05 13:00:00'
),
(
    'Diseñar interfaz',
    'Crear diseño inicial',
    'pending',
    'low',
    7,
    4,
    3,
    '2026-09-06 14:00:00'
),
(
    'Documentar API',
    'Documentar endpoints',
    'pending',
    'medium',
    3,
    1,
    1,
    '2026-09-07 15:00:00'
),
(
    'Configurar CI/CD',
    'Configurar pipeline',
    'in_progress',
    'high',
    5,
    3,
    1,
    '2026-09-08 16:00:00'
),
(
    'Revisar seguridad',
    'Revisar configuración de seguridad',
    'pending',
    'high',
    4,
    2,
    1,
    '2026-09-09 17:00:00'
),
(
    'Preparar despliegue',
    'Preparar ambiente de producción',
    'completed',
    'high',
    6,
    3,
    1,
    '2026-09-10 18:00:00'
);

-- Relación N:M

INSERT INTO project_members (user_id, project_id, role)
VALUES
(1, 1, 'developer'),
(2, 1, 'developer'),
(3, 1, 'qa'),
(1, 2, 'developer'),
(2, 2, 'qa'),
(4, 3, 'designer');

-- se debe verificar:

SELECT * FROM users;
SELECT * FROM projects;
SELECT * FROM tasks;
SELECT * FROM project_members;

-- Después:

SELECT status, COUNT(*)
FROM tasks
GROUP BY status;

-- Y:

SELECT
    tasks.title,
    users.name,
    projects.name
FROM tasks
JOIN users
    ON tasks.user_id = users.id
JOIN projects
    ON tasks.project_id = projects.id;