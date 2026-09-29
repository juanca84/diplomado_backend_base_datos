# Guía del Estudiante

## Sesión 3 — Bases de Datos: PostgreSQL y MongoDB

**Módulo:** Arquitectura del Back-End y Bases de Datos
**Proyecto:** TaskFlow
**Duración de la sesión:** 2 horas 15 minutos

---

# 1. Objetivo

En esta sesión aprenderemos los fundamentos de dos tecnologías de bases de datos:

* PostgreSQL → modelo relacional.
* MongoDB → modelo documental NoSQL.

Trabajaremos con un mismo proyecto de ejemplo:

> **TaskFlow — Sistema de gestión de tareas**

Aprenderemos a:

* crear y consultar datos;
* utilizar SQL;
* utilizar consultas MongoDB;
* trabajar con relaciones;
* utilizar `JOIN`;
* realizar agregaciones;
* utilizar filtros y ordenamiento;
* comprender `Embedding` y `References`.

---

# 2. Requisitos previos

Antes de la clase debes tener instalado:

* Docker Desktop
* DBeaver Community
* MongoDB Compass
* Git, opcional pero recomendado

También debes comprobar que Docker funciona correctamente.

---

# 3. Instalación de Docker Desktop

Docker nos permitirá ejecutar PostgreSQL y MongoDB sin instalar directamente los servidores en Windows.

## 3.1 Descargar Docker Desktop

Descarga Docker Desktop desde su sitio oficial:

[Docker Desktop](https://www.docker.com/products/docker-desktop/?utm_source=chatgpt.com)

Selecciona la versión correspondiente a Windows.

---

## 3.2 Comprobar Docker

Después de instalar Docker Desktop, abre PowerShell o CMD:

```bash
docker --version
```

Debes obtener una respuesta similar a:

```text
Docker version 28.x.x
```

También puedes ejecutar:

```bash
docker compose version
```

Debe aparecer una versión de Docker Compose.

---

# 4. Crear el entorno de bases de datos

Crearemos una carpeta para nuestro proyecto:

```text
taskflow-database
```

Dentro tendremos:

```text
taskflow-database/
│
├── docker-compose.yml
│
├── postgres/
│   ├── 01_schema.sql
│   └── 02_seed.sql
│
└── mongodb/
    └── seed.js
```

---

# 5. Docker Compose

Docker Compose nos permite levantar varios servicios utilizando un solo archivo.

Crear:

```text
docker-compose.yml
```

Con el siguiente contenido:

```yaml
services:

  postgres:
    image: postgres:17
    container_name: taskflow-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: taskflow
      POSTGRES_PASSWORD: taskflow
      POSTGRES_DB: taskflow
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  mongodb:
    image: mongo:8
    container_name: taskflow-mongodb
    restart: unless-stopped
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  postgres_data:
  mongodb_data:
```

---

# 6. Levantar PostgreSQL y MongoDB

Desde la carpeta:

```bash
cd taskflow-database
```

ejecutar:

```bash
docker compose up -d
```

Docker descargará las imágenes necesarias si todavía no existen.

Comprobar:

```bash
docker compose ps
```

Debemos tener dos servicios funcionando:

```text
taskflow-postgres
taskflow-mongodb
```

---

# 7. Comprobar PostgreSQL

Podemos entrar directamente al contenedor:

```bash
docker exec -it taskflow-postgres psql -U taskflow -d taskflow
```

Si funciona veremos algo similar a:

```text
taskflow=#
```

Para salir:

```sql
\q
```

---

# 8. Comprobar MongoDB

Podemos entrar al contenedor:

```bash
docker exec -it taskflow-mongodb mongosh
```

Después:

```javascript
show dbs
```

Para salir:

```javascript
exit
```

---

# 9. Herramienta para PostgreSQL: DBeaver

Utilizaremos **DBeaver Community** para visualizar y administrar PostgreSQL.

[DBeaver Community](https://dbeaver.io/download/?utm_source=chatgpt.com)

Descargar:

> DBeaver Community

No necesitamos DBeaver Enterprise.

---

# 10. Crear conexión PostgreSQL en DBeaver

Abrir DBeaver.

Seleccionar:

```text
New Database Connection
```

Buscar:

```text
PostgreSQL
```

Configurar:

| Campo    | Valor     |
| -------- | --------- |
| Host     | localhost |
| Port     | 5432      |
| Database | taskflow  |
| Username | taskflow  |
| Password | taskflow  |

Después seleccionar:

```text
Test Connection
```

Debe indicar que la conexión fue exitosa.

---

# 11. Explorar PostgreSQL

En DBeaver veremos:

```text
taskflow
└── Schemas
    └── public
        └── Tables
            ├── users
            ├── projects
            ├── tasks
            └── project_members
```

Esto nos permitirá visualizar nuestro modelo relacional.

---

# 12. Herramienta para MongoDB

Para MongoDB utilizaremos:

# MongoDB Compass

Es una herramienta gráfica que permite:

* conectarse a MongoDB;
* visualizar databases;
* visualizar collections;
* consultar documentos;
* insertar documentos;
* modificar documentos;
* revisar resultados.

Descarga:

[MongoDB Compass](https://www.mongodb.com/products/tools/compass?utm_source=chatgpt.com)

---

# 13. Conectarse a MongoDB Compass

Abrir MongoDB Compass.

Utilizar:

```text
mongodb://localhost:27017
```

Seleccionar:

```text
Connect
```

Después veremos nuestras bases de datos.

---

# 14. Crear la estructura PostgreSQL

Dentro de:

```text
postgres/
```

crearemos:

```text
01_schema.sql
```

Este archivo crea las tablas y relaciones.

```sql
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(30) NOT NULL,
    priority VARCHAR(20) NOT NULL,
    estimated_hours NUMERIC(5,2),
    user_id INTEGER REFERENCES users(id),
    project_id INTEGER REFERENCES projects(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS project_members (
    user_id INTEGER REFERENCES users(id),
    project_id INTEGER REFERENCES projects(id),
    role VARCHAR(30),
    PRIMARY KEY (user_id, project_id)
);
```

---

# 15. Poblar PostgreSQL

Crear:

```text
02_seed.sql
```

Ejecutar el siguiente script:

```sql
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
('Crear API de usuarios',
 'Implementar endpoints para usuarios',
 'pending',
 'high',
 6,
 1,
 1,
 '2026-09-01 09:00:00'),

('Diseñar base de datos',
 'Crear modelo relacional',
 'completed',
 'high',
 5,
 2,
 1,
 '2026-09-02 10:00:00'),

('Crear autenticación',
 'Implementar autenticación JWT',
 'in_progress',
 'high',
 8,
 1,
 1,
 '2026-09-03 11:00:00'),

('Crear pruebas unitarias',
 'Implementar pruebas para servicios',
 'pending',
 'medium',
 4,
 3,
 2,
 '2026-09-04 12:00:00'),

('Pruebas de API',
 'Crear colección de pruebas',
 'completed',
 'medium',
 3,
 2,
 2,
 '2026-09-05 13:00:00'),

('Diseñar interfaz',
 'Crear diseño inicial',
 'pending',
 'low',
 7,
 4,
 3,
 '2026-09-06 14:00:00'),

('Documentar API',
 'Documentar endpoints',
 'pending',
 'medium',
 3,
 1,
 1,
 '2026-09-07 15:00:00'),

('Configurar CI/CD',
 'Configurar pipeline',
 'in_progress',
 'high',
 5,
 3,
 1,
 '2026-09-08 16:00:00'),

('Revisar seguridad',
 'Revisar configuración de seguridad',
 'pending',
 'high',
 4,
 2,
 1,
 '2026-09-09 17:00:00'),

('Preparar despliegue',
 'Preparar ambiente de producción',
 'completed',
 'high',
 6,
 3,
 1,
 '2026-09-10 18:00:00');

INSERT INTO project_members (user_id, project_id, role)
VALUES
(1, 1, 'developer'),
(2, 1, 'developer'),
(3, 1, 'qa'),
(1, 2, 'developer'),
(2, 2, 'qa'),
(4, 3, 'designer');
```

---

# 16. Ejecutar los scripts PostgreSQL

Podemos utilizar DBeaver.

Abrir:

```text
01_schema.sql
```

Conectarlo a:

```text
taskflow
```

Ejecutar el script.

Después abrir:

```text
02_seed.sql
```

y ejecutarlo.

Actualizar el navegador de DBeaver.

Debemos observar:

```text
users
projects
tasks
project_members
```

---

# 17. Verificar los datos

Ejecutar:

```sql
SELECT * FROM users;
```

Después:

```sql
SELECT * FROM projects;
```

Después:

```sql
SELECT * FROM tasks;
```

Y:

```sql
SELECT * FROM project_members;
```

---

# 18. Consultas PostgreSQL — Nivel básico

## SELECT

```sql
SELECT *
FROM tasks;
```

Seleccionar columnas:

```sql
SELECT id, title, status
FROM tasks;
```

---

# 19. WHERE

```sql
SELECT *
FROM tasks
WHERE status = 'pending';
```

Dos condiciones:

```sql
SELECT *
FROM tasks
WHERE status = 'pending'
AND priority = 'high';
```

---

# 20. Otros filtros

### IN

```sql
SELECT *
FROM tasks
WHERE priority IN ('high', 'medium');
```

### BETWEEN

```sql
SELECT *
FROM tasks
WHERE estimated_hours BETWEEN 3 AND 6;
```

### LIKE

```sql
SELECT *
FROM tasks
WHERE title LIKE '%API%';
```

### IS NULL

```sql
SELECT *
FROM tasks
WHERE description IS NULL;
```

---

# 21. ORDER BY

```sql
SELECT *
FROM tasks
ORDER BY created_at DESC;
```

Últimas cinco:

```sql
SELECT *
FROM tasks
ORDER BY created_at DESC
LIMIT 5;
```

---

# 22. INSERT

```sql
INSERT INTO tasks
(title, description, status, priority, estimated_hours, user_id, project_id)
VALUES
(
    'Crear documentación',
    'Documentar endpoints',
    'pending',
    'medium',
    3,
    1,
    1
);
```

---

# 23. UPDATE

```sql
UPDATE tasks
SET status = 'completed'
WHERE id = 1;
```

### Importante

Antes de ejecutar:

```sql
UPDATE
```

comprobar qué registros serán modificados.

---

# 24. DELETE

```sql
DELETE FROM tasks
WHERE id = 1;
```

### ⚠️ Precaución

No ejecutar:

```sql
DELETE FROM tasks;
```

a menos que realmente queramos eliminar todos los registros.

---

# 25. Funciones de agregación

```sql
SELECT COUNT(*)
FROM tasks;
```

También podemos utilizar:

```sql
SUM()
AVG()
MIN()
MAX()
```

Por ejemplo:

```sql
SELECT AVG(estimated_hours)
FROM tasks;
```

---

# 26. GROUP BY

```sql
SELECT status, COUNT(*)
FROM tasks
GROUP BY status;
```

Podemos obtener:

```text
status          count
---------------------
pending           5
completed         3
in_progress       2
```

---

# 27. HAVING

```sql
SELECT status, COUNT(*)
FROM tasks
GROUP BY status
HAVING COUNT(*) > 2;
```

Recordar:

```text
WHERE
→ filtra registros

HAVING
→ filtra grupos
```

---

# 28. JOIN

Consultar tareas con el nombre del usuario:

```sql
SELECT
    tasks.title,
    users.name
FROM tasks
JOIN users
    ON tasks.user_id = users.id;
```

---

# 29. JOIN con proyectos

```sql
SELECT
    tasks.title,
    users.name AS user_name,
    projects.name AS project_name
FROM tasks
JOIN users
    ON tasks.user_id = users.id
JOIN projects
    ON tasks.project_id = projects.id;
```

---

# 30. LEFT JOIN

```sql
SELECT
    users.name,
    tasks.title
FROM users
LEFT JOIN tasks
    ON tasks.user_id = users.id;
```

---

# 31. MongoDB

MongoDB utiliza:

```text
Database
   ↓
Collection
   ↓
Document
   ↓
Fields
```

Nuestro proyecto tendrá:

```text
taskflow
├── users
├── projects
└── tasks
```

---

# 32. Preparar MongoDB

Crear:

```text
mongodb/seed.js
```

Utilizar el script proporcionado por el docente.

Después ejecutar:

```bash
docker exec -i taskflow-mongodb mongosh < mongodb/seed.js
```

Si utilizamos PowerShell y el comando anterior presenta problemas, podemos abrir `mongosh`:

```bash
docker exec -it taskflow-mongodb mongosh
```

y ejecutar el contenido del script dentro de la consola.

---

# 33. Verificar MongoDB

En MongoDB Compass debemos observar:

```text
taskflow
├── users
├── projects
└── tasks
```

Seleccionar:

```text
taskflow
→ tasks
```

y revisar los documentos.

---

# 34. MongoDB — find()

Todos:

```javascript
db.tasks.find()
```

Filtrar:

```javascript
db.tasks.find({
    status: "pending"
})
```

---

# 35. Múltiples condiciones

```javascript
db.tasks.find({
    status: "pending",
    priority: "high"
})
```

---

# 36. Operadores

### Mayor que

```javascript
db.tasks.find({
    estimatedHours: {
        $gt: 5
    }
})
```

### Menor o igual

```javascript
db.tasks.find({
    estimatedHours: {
        $lte: 5
    }
})
```

### IN

```javascript
db.tasks.find({
    priority: {
        $in: ["high", "medium"]
    }
})
```

---

# 37. Proyección

Mostrar solamente determinados campos:

```javascript
db.tasks.find(
    {
        status: "pending"
    },
    {
        title: 1,
        priority: 1
    }
)
```

---

# 38. Sort y Limit

```javascript
db.tasks.find({
    status: "pending"
})
.sort({
    createdAt: -1
})
.limit(5)
```

---

# 39. Buscar por arrays

Algunos documentos tienen:

```json
{
    "tags": [
        "backend",
        "api"
    ]
}
```

Podemos buscar:

```javascript
db.tasks.find({
    tags: "backend"
})
```

---

# 40. MongoDB CRUD

## Insert

```javascript
db.tasks.insertOne({
    title: "Tarea temporal",
    status: "pending",
    priority: "low"
})
```

## Update

```javascript
db.tasks.updateOne(
    {
        _id: 1
    },
    {
        $set: {
            status: "completed"
        }
    }
)
```

## Delete

```javascript
db.tasks.deleteOne({
    _id: 1
})
```

---

# 41. Embedding

Los datos relacionados pueden estar dentro del mismo documento.

```json
{
    "_id": 1,
    "name": "Juan",
    "tasks": [
        {
            "title": "Crear API",
            "status": "pending"
        }
    ]
}
```

---

# 42. References

También podemos almacenar referencias:

```json
{
    "_id": 1,
    "title": "Crear API",
    "userId": 25
}
```

El usuario se encuentra en otra colección.

---

# 43. PostgreSQL vs MongoDB

| PostgreSQL  | MongoDB        |
| ----------- | -------------- |
| Database    | Database       |
| Table       | Collection     |
| Row         | Document       |
| Column      | Field          |
| Primary Key | `_id`          |
| Foreign Key | Reference      |
| SQL         | Document Query |

---

# 44. Misma necesidad, diferentes consultas

## PostgreSQL

```sql
SELECT *
FROM tasks
WHERE status = 'pending'
ORDER BY created_at DESC
LIMIT 5;
```

## MongoDB

```javascript
db.tasks.find({
    status: "pending"
})
.sort({
    createdAt: -1
})
.limit(5)
```

Ambas consultas responden a la misma necesidad:

> Obtener las cinco tareas pendientes más recientes.

---

# 45. Práctica

## Reto 1 — PostgreSQL

Mostrar todas las tareas pendientes.

---

## Reto 2 — PostgreSQL

Mostrar las cinco tareas más recientes.

---

## Reto 3 — MongoDB

Mostrar las tareas de prioridad `high`.

---

## Reto 4 — Agregación

En PostgreSQL:

> Mostrar cuántas tareas existen por estado.

---

## Reto 5 — MongoDB

Buscar las tareas que tengan la etiqueta:

```text
backend
```

---

# 46. Checklist

Antes de terminar la preparación debes poder responder:

* [ ] Docker funciona.
* [ ] PostgreSQL está funcionando.
* [ ] MongoDB está funcionando.
* [ ] DBeaver está instalado.
* [ ] MongoDB Compass está instalado.
* [ ] PostgreSQL contiene las tablas de TaskFlow.
* [ ] PostgreSQL contiene datos.
* [ ] MongoDB contiene las collections.
* [ ] MongoDB contiene documentos.
* [ ] Puedo ejecutar consultas SQL.
* [ ] Puedo ejecutar consultas MongoDB.

---

# 47. Comandos útiles de Docker

Ver contenedores:

```bash
docker ps
```

Ver todos:

```bash
docker ps -a
```

Levantar servicios:

```bash
docker compose up -d
```

Detener servicios:

```bash
docker compose stop
```

Detener y eliminar contenedores:

```bash
docker compose down
```

Ver logs:

```bash
docker compose logs
```

Ver logs de PostgreSQL:

```bash
docker logs taskflow-postgres
```

Ver logs de MongoDB:

```bash
docker logs taskflow-mongodb
```

---

# 48. Puertos utilizados

| Servicio   | Puerto |
| ---------- | -----: |
| PostgreSQL |   5432 |
| MongoDB    |  27017 |

No es necesario modificar estos puertos salvo que exista un conflicto en el equipo.

---

# 49. Arquitectura de nuestro entorno

```text
                    Docker
                      │
             ┌────────┴────────┐
             │                 │
        PostgreSQL          MongoDB
          :5432              :27017
             │                 │
             │                 │
         DBeaver          MongoDB Compass
```

Posteriormente:

```text
Frontend
    ↓
Backend
    ↓
PostgreSQL / MongoDB
```

---

# 50. Conceptos que debes recordar

### PostgreSQL

```text
Database
Table
Row
Column
Primary Key
Foreign Key
Relationship
SQL
JOIN
GROUP BY
HAVING
```

### MongoDB

```text
Database
Collection
Document
Field
_id
BSON
Query
Embedding
Reference
```

---

# 51. Preparación para la siguiente sesión

Conserva este entorno.

No elimines:

```text
taskflow-postgres
taskflow-mongodb
```

La información que creamos en esta sesión será reutilizada posteriormente para conectar nuestras aplicaciones Backend con las bases de datos.
