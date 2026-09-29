# Sesión 3 — Bases de Datos: PostgreSQL y MongoDB

## Arquitectura del Back-End y Bases de Datos

---

## Diapositiva 1 — Título

# Bases de Datos

## PostgreSQL y MongoDB

**Módulo 2 — Arquitectura del Back-End y Bases de Datos**

Hoy aprenderemos:

* Modelo relacional
* Modelo NoSQL
* PostgreSQL
* SQL
* MongoDB
* Consultas
* Modelado de datos

---

## Diapositiva 2 — ¿Qué es una base de datos?

Una base de datos permite:

* almacenar información;
* organizar datos;
* consultar información;
* modificar información;
* relacionar datos.

### Ejemplo

TaskFlow necesita almacenar:

```text
Usuarios
Proyectos
Tareas
Estados
Fechas
Prioridades
```

---

## Diapositiva 3 — ¿Por qué necesitamos una base de datos?

Una aplicación Backend necesita conservar información.

```text
Usuario
   ↓
Aplicación Backend
   ↓
Base de Datos
   ↓
Información persistente
```

### Sin persistencia

Los datos podrían perderse cuando la aplicación termina.

### Con persistencia

Los datos permanecen disponibles para futuras consultas.

---

## Diapositiva 4 — Dos modelos de datos

# Relacional vs NoSQL

| Relacional | NoSQL                   |
| ---------- | ----------------------- |
| PostgreSQL | MongoDB                 |
| Tablas     | Documentos              |
| Filas      | Documentos              |
| Columnas   | Campos                  |
| Relaciones | Embedding / References  |
| SQL        | Consultas de documentos |

---

## Diapositiva 5 — PostgreSQL

# PostgreSQL

Sistema de gestión de bases de datos relacional.

Trabajaremos con:

```text
Database
   ↓
Tables
   ↓
Rows + Columns
   ↓
Relationships
```

---

## Diapositiva 6 — Elementos de una tabla

### Tabla `users`

| id | name  | email                                     |
| -: | ----- | ----------------------------------------- |
|  1 | Juan  | [juan@email.com](mailto:juan@email.com)   |
|  2 | María | [maria@email.com](mailto:maria@email.com) |
|  3 | Pedro | [pedro@email.com](mailto:pedro@email.com) |

### Conceptos

* **Column** → característica del dato
* **Row** → registro
* **Primary Key** → identificador único

---

## Diapositiva 7 — Primary Key

# Primary Key

Identifica de manera única cada registro.

```text
users
-------------------
id ← Primary Key
name
email
```

Ejemplo:

```text
1 → Juan
2 → María
3 → Pedro
```

No debería existir:

```text
id = 1
id = 1
```

---

## Diapositiva 8 — Foreign Key

# Foreign Key

Permite relacionar tablas.

```text
users
-----
id
name

       1
       │
       │
       N
     tasks
```

En `tasks`:

```text
user_id → users.id
```

---

## Diapositiva 9 — Relaciones

### 1 : 1

```text
User ─── Profile
```

### 1 : N

```text
User
 │
 ├── Task
 ├── Task
 └── Task
```

### N : M

```text
Users ←→ Projects
```

Normalmente requiere una tabla intermedia.

---

## Diapositiva 10 — Modelo TaskFlow

Nuestro ejemplo:

```text
users
  │
  │ 1:N
  ↓
tasks
  │
  │ N:1
  ↓
projects
```

### Tablas

```text
users
projects
tasks
project_members
```

---

## Diapositiva 11 — SQL

# SQL

Structured Query Language

Permite trabajar con bases de datos relacionales.

Operaciones principales:

```text
SELECT
INSERT
UPDATE
DELETE
```

---

## Diapositiva 12 — SELECT

Consultar datos:

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

## Diapositiva 13 — WHERE

Filtrar resultados:

```sql
SELECT *
FROM tasks
WHERE status = 'pending';
```

Múltiples condiciones:

```sql
SELECT *
FROM tasks
WHERE status = 'pending'
AND priority = 'high';
```

---

## Diapositiva 14 — Operadores de filtrado

SQL permite utilizar:

```text
=
<>
>
<
>=
<=
```

También:

```text
IN
BETWEEN
LIKE
IS NULL
```

Ejemplo:

```sql
SELECT *
FROM tasks
WHERE priority IN ('high', 'medium');
```

---

## Diapositiva 15 — ORDER BY

Ordenar resultados:

```sql
SELECT *
FROM tasks
ORDER BY created_at DESC;
```

### Los últimos registros

```sql
SELECT *
FROM tasks
ORDER BY created_at DESC
LIMIT 5;
```

---

## Diapositiva 16 — INSERT

Crear un registro:

```sql
INSERT INTO tasks
(title, status, priority, user_id, project_id)
VALUES
('Crear API', 'pending', 'high', 1, 1);
```

---

## Diapositiva 17 — UPDATE

Modificar información:

```sql
UPDATE tasks
SET status = 'completed'
WHERE id = 1;
```

### ⚠️ Importante

Revisar siempre el `WHERE`.

---

## Diapositiva 18 — DELETE

Eliminar información:

```sql
DELETE FROM tasks
WHERE id = 1;
```

### ⚠️ Cuidado

Sin `WHERE`:

```sql
DELETE FROM tasks;
```

se eliminan todos los registros.

---

## Diapositiva 19 — Funciones de agregación

Permiten obtener información resumida.

```text
COUNT()
SUM()
AVG()
MIN()
MAX()
```

Ejemplo:

```sql
SELECT COUNT(*)
FROM tasks;
```

---

## Diapositiva 20 — GROUP BY

Agrupar resultados:

```sql
SELECT status, COUNT(*)
FROM tasks
GROUP BY status;
```

Resultado:

```text
pending       5
in_progress   3
completed     8
```

---

## Diapositiva 21 — HAVING

Filtrar grupos:

```sql
SELECT status, COUNT(*)
FROM tasks
GROUP BY status
HAVING COUNT(*) > 3;
```

### Diferencia

```text
WHERE  → filtra registros
HAVING → filtra grupos
```

---

## Diapositiva 22 — JOIN

# JOIN

Permite combinar información de varias tablas.

```sql
SELECT
    tasks.title,
    users.name
FROM tasks
JOIN users
    ON tasks.user_id = users.id;
```

---

## Diapositiva 23 — JOIN con tres tablas

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

Podemos obtener información relacionada en una sola consulta.

---

## Diapositiva 24 — LEFT JOIN

```sql
SELECT
    users.name,
    tasks.title
FROM users
LEFT JOIN tasks
    ON tasks.user_id = users.id;
```

### ¿Qué conseguimos?

Todos los usuarios, incluso aquellos que no tienen tareas.

---

## Diapositiva 25 — CRUD

| Operación | PostgreSQL |
| --------- | ---------- |
| Create    | INSERT     |
| Read      | SELECT     |
| Update    | UPDATE     |
| Delete    | DELETE     |

Estas operaciones aparecerán posteriormente en nuestras APIs.

---

## Diapositiva 26 — MongoDB

# MongoDB

Base de datos orientada a documentos.

```text
Database
   ↓
Collection
   ↓
Document
   ↓
Fields
```

---

## Diapositiva 27 — Documento MongoDB

```json
{
  "_id": 1,
  "title": "Crear API",
  "status": "pending",
  "priority": "high"
}
```

MongoDB almacena documentos utilizando BSON.

---

## Diapositiva 28 — PostgreSQL vs MongoDB

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

## Diapositiva 29 — MongoDB: find()

Todos los documentos:

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

## Diapositiva 30 — Múltiples condiciones

```javascript
db.tasks.find({
  status: "pending",
  priority: "high"
})
```

También podemos utilizar operadores:

```text
$eq
$ne
$gt
$gte
$lt
$lte
$in
```

---

## Diapositiva 31 — Proyección

Podemos seleccionar los campos que queremos obtener:

```javascript
db.tasks.find(
  { status: "pending" },
  {
    title: 1,
    priority: 1
  }
)
```

---

## Diapositiva 32 — Sort y Limit

```javascript
db.tasks.find({
  status: "pending"
})
.sort({
  createdAt: -1
})
.limit(5)
```

Similar a:

```sql
SELECT *
FROM tasks
WHERE status = 'pending'
ORDER BY created_at DESC
LIMIT 5;
```

---

## Diapositiva 33 — MongoDB CRUD

| Operación | MongoDB     |
| --------- | ----------- |
| Create    | insertOne() |
| Read      | find()      |
| Update    | updateOne() |
| Delete    | deleteOne() |

---

## Diapositiva 34 — MongoDB: Update

```javascript
db.tasks.updateOne(
  { _id: 1 },
  {
    $set: {
      status: "completed"
    }
  }
)
```

---

## Diapositiva 35 — MongoDB: Delete

```javascript
db.tasks.deleteOne({
  _id: 1
})
```

---

## Diapositiva 36 — Embedding

Los datos relacionados pueden estar dentro del mismo documento.

```json
{
  "_id": 1,
  "name": "Juan",
  "tasks": [
    {
      "title": "Crear API"
    },
    {
      "title": "Testing"
    }
  ]
}
```

---

## Diapositiva 37 — References

Los datos relacionados pueden mantenerse separados.

```json
{
  "_id": 1,
  "title": "Crear API",
  "userId": 25
}
```

### Pregunta

¿Conviene almacenar juntos los datos o mantenerlos separados?

---

## Diapositiva 38 — Misma necesidad, diferente consulta

### PostgreSQL

```sql
SELECT *
FROM tasks
WHERE status = 'pending'
ORDER BY created_at DESC
LIMIT 5;
```

### MongoDB

```javascript
db.tasks.find({
  status: "pending"
})
.sort({
  createdAt: -1
})
.limit(5)
```

El problema es el mismo.

La forma de consultar es diferente.

---

## Diapositiva 39 — Práctica

### Reto 1

Obtener las tareas pendientes en PostgreSQL.

### Reto 2

Mostrar las 5 tareas más recientes.

### Reto 3

Buscar tareas `high` en MongoDB.

### Reto adicional

Contar tareas por estado.

---

## Diapositiva 40 — Ideas clave

### PostgreSQL

* Modelo relacional
* Tablas
* Relaciones
* SQL
* JOIN
* Agregaciones

### MongoDB

* Modelo documental
* Collections
* Documents
* Fields
* Queries
* Embedding / References

---

## Diapositiva 41 — Relación con Backend

```text
Frontend
   ↓
HTTP Request
   ↓
Backend / API
   ↓
Database
   ↓
Datos
```

En las próximas sesiones conectaremos nuestro Backend con estas bases de datos.

---

## Diapositiva 42 — Cierre

# ¿Qué aprendimos?

1. ¿Qué diferencia existe entre una base relacional y NoSQL?
2. ¿Qué problema resuelve una Foreign Key?
3. ¿Para qué utilizamos JOIN?
4. ¿Qué diferencia existe entre WHERE y HAVING?
5. ¿Qué diferencia existe entre Embedding y References?
6. ¿Cómo se relacionan CRUD y las operaciones de base de datos?

**Siguiente paso: conectar nuestro Backend con la base de datos.**
