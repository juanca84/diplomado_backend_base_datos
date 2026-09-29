# Guía del Docente

## Sesión 3 — Bases de Datos: PostgreSQL y MongoDB

**Módulo:** Arquitectura del Back-End y Bases de Datos
**Duración:** 2 horas 15 minutos

---

# 1. Objetivo de la sesión

El estudiante comprenderá las diferencias entre el modelo relacional y el modelo documental y podrá realizar consultas básicas e intermedias en PostgreSQL y MongoDB.

La sesión utiliza **TaskFlow** como contexto común.

---

# 2. Preparación previa

Antes de comenzar, verificar que los estudiantes tengan:

* Docker instalado.
* PostgreSQL funcionando.
* MongoDB funcionando.
* Un cliente para PostgreSQL.
* MongoDB Compass o acceso a `mongosh`.
* Los scripts de la sesión descargados.
* Las bases de datos pobladas.

## Importante

La instalación de estas herramientas **no se realiza durante la sesión**.

Debe estar explicada en la Guía del Estudiante.

---

# 3. Material necesario

El docente debe tener preparado:

```text
sesion-3/
│
├── postgres/
│   ├── 01_schema.sql
│   └── 02_seed.sql
│
└── mongodb/
    └── seed.js
```

Además:

```text
docker compose
PostgreSQL
MongoDB
```

---

# 4. Diapositivas 1–3 — Introducción

## Objetivo

Activar conocimientos previos.

Preguntar:

> ¿Dónde se almacenan los usuarios de una aplicación cuando cerramos el navegador?

Esperar respuestas como:

* memoria;
* archivo;
* base de datos.

Explicar que el Backend normalmente necesita una solución de persistencia.

### Idea clave

Una base de datos permite conservar y consultar información.

---

# 5. Diapositiva 4 — Relacional vs NoSQL

Presentar las dos familias de bases de datos.

No decir que una es "mejor" que la otra.

Explicar que la elección depende de:

* estructura de datos;
* relaciones;
* consultas;
* requisitos del sistema;
* escalabilidad;
* necesidades de la aplicación.

---

# 6. Diapositivas 5–10 — PostgreSQL

## Explicación

Utilizar TaskFlow para explicar:

```text
users
projects
tasks
project_members
```

Preguntar:

> ¿Una tarea pertenece a un usuario o un usuario puede tener muchas tareas?

La respuesta esperada:

```text
User 1:N Task
```

Después:

> ¿Una tarea pertenece a un proyecto?

```text
Project 1:N Task
```

Finalmente explicar:

```text
User N:M Project
```

mediante `project_members`.

---

# 7. Momento práctico 1 — Mostrar PostgreSQL

Abrir el cliente PostgreSQL.

Mostrar:

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

No explicar todavía todas las consultas.

La finalidad es que el estudiante vea que el modelo que acabamos de explicar realmente existe.

---

# 8. Diapositivas 11–15 — SQL

Explicar que SQL permite comunicarnos con PostgreSQL.

Comenzar con:

```sql
SELECT *
FROM tasks;
```

Después seleccionar columnas:

```sql
SELECT title, status
FROM tasks;
```

Continuar con:

```sql
WHERE
ORDER BY
LIMIT
```

## Pregunta al estudiante

> ¿Qué diferencia existe entre `SELECT *` y seleccionar columnas específicas?

La respuesta esperada:

`SELECT *` devuelve todas las columnas; seleccionar columnas permite obtener únicamente la información necesaria.

---

# 9. Filtros

Demostrar:

```sql
SELECT *
FROM tasks
WHERE status = 'pending';
```

Después:

```sql
SELECT *
FROM tasks
WHERE status = 'pending'
AND priority = 'high';
```

Introducir:

```text
IN
BETWEEN
LIKE
IS NULL
```

No es necesario memorizar todos los operadores todavía.

El objetivo es que el estudiante sepa que SQL permite expresar condiciones.

---

# 10. Diapositivas 16–18 — CRUD

Explicar:

```text
INSERT → crear
SELECT → consultar
UPDATE → modificar
DELETE → eliminar
```

Utilizar la analogía:

```text
Create
Read
Update
Delete
```

## Advertencia importante

Mostrar:

```sql
UPDATE tasks
SET status = 'completed';
```

y preguntar:

> ¿Qué ocurriría?

Explicar que se modificarían todas las tareas.

Después mostrar:

```sql
UPDATE tasks
SET status = 'completed'
WHERE id = 1;
```

La misma advertencia debe hacerse con `DELETE`.

---

# 11. Diapositivas 19–21 — Agregaciones

Explicar que no siempre queremos obtener todos los registros.

A veces queremos responder preguntas como:

* ¿Cuántas tareas existen?
* ¿Cuántas están completadas?
* ¿Cuántas tareas existen por estado?

Ejecutar:

```sql
SELECT COUNT(*)
FROM tasks;
```

Después:

```sql
SELECT status, COUNT(*)
FROM tasks
GROUP BY status;
```

Finalmente:

```sql
SELECT status, COUNT(*)
FROM tasks
GROUP BY status
HAVING COUNT(*) > 3;
```

## Concepto fundamental

Explicar claramente:

```text
WHERE
  ↓
filtra registros

GROUP BY
  ↓
crea grupos

HAVING
  ↓
filtra grupos
```

---

# 12. Diapositivas 22–24 — JOIN

Esta es una de las partes más importantes de la sesión.

Primero preguntar:

> Si el título de la tarea está en `tasks`, pero el nombre del usuario está en `users`, ¿cómo obtenemos ambos?

Introducir `JOIN`.

Ejecutar:

```sql
SELECT
    tasks.title,
    users.name
FROM tasks
JOIN users
    ON tasks.user_id = users.id;
```

Después aumentar complejidad:

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

Explicar que `JOIN` utiliza las relaciones existentes entre las tablas.

---

# 13. LEFT JOIN

Ejecutar:

```sql
SELECT
    users.name,
    tasks.title
FROM users
LEFT JOIN tasks
    ON tasks.user_id = users.id;
```

Es importante tener al menos un usuario sin tareas en los datos de prueba.

Preguntar:

> ¿Por qué aparece un usuario aunque no tenga tareas?

Explicar que `LEFT JOIN` conserva los registros de la tabla izquierda.

---

# 14. Diapositivas 26–28 — MongoDB

Cambiar de paradigma.

Mostrar:

```text
PostgreSQL

Table
 ↓
Rows
 ↓
Columns
```

frente a:

```text
MongoDB

Collection
 ↓
Documents
 ↓
Fields
```

Mostrar un documento real:

```json
{
  "_id": 1,
  "title": "Crear API",
  "status": "pending",
  "priority": "high"
}
```

Explicar que MongoDB utiliza BSON internamente.

---

# 15. Momento práctico 2 — MongoDB

Abrir MongoDB Compass o `mongosh`.

Ejecutar:

```javascript
use taskflow
```

Después:

```javascript
db.tasks.find()
```

Luego:

```javascript
db.tasks.find({
  status: "pending"
})
```

---

# 16. Diapositivas 29–32 — Consultas MongoDB

Explicar primero:

```javascript
db.tasks.find()
```

Después:

```javascript
db.tasks.find({
  status: "pending",
  priority: "high"
})
```

Mostrar operadores:

```javascript
db.tasks.find({
  estimatedHours: {
    $gt: 4
  }
})
```

Luego proyección:

```javascript
db.tasks.find(
  { status: "pending" },
  {
    title: 1,
    priority: 1
  }
)
```

Finalmente:

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

# 17. Comparación SQL vs MongoDB

Ejecutar primero PostgreSQL:

```sql
SELECT *
FROM tasks
WHERE status = 'pending'
ORDER BY created_at DESC
LIMIT 5;
```

Después MongoDB:

```javascript
db.tasks.find({
  status: "pending"
})
.sort({
  createdAt: -1
})
.limit(5)
```

Preguntar:

> ¿Qué estamos haciendo en ambos casos?

Respuesta:

> Obteniendo las cinco tareas pendientes más recientes.

Esto ayuda al estudiante a separar **el problema de negocio** de la tecnología utilizada para resolverlo.

---

# 18. Diapositivas 33–35 — CRUD MongoDB

Mostrar:

```javascript
db.tasks.insertOne(...)
```

```javascript
db.tasks.updateOne(...)
```

```javascript
db.tasks.deleteOne(...)
```

Relacionarlo con:

```text
INSERT
UPDATE
DELETE
```

No es necesario profundizar en todas las opciones de cada método.

---

# 19. Diapositivas 36–37 — Embedding y References

Utilizar la pregunta:

> Si un usuario tiene tareas, ¿guardamos las tareas dentro del usuario o las mantenemos en otra colección?

Mostrar ambos modelos.

### Embedding

Adecuado cuando los datos relacionados se consultan frecuentemente juntos y forman parte natural del documento.

### References

Adecuado cuando los datos tienen vida propia o pueden crecer considerablemente.

Aclarar:

> No existe una regla universal. El diseño depende del patrón de acceso a los datos.

---

# 20. Diapositiva 38 — Comparación

Esta diapositiva sirve para consolidar.

Hacer énfasis:

> La necesidad de negocio no cambia porque cambiemos de base de datos.

Ejemplo:

> "Obtener las cinco tareas pendientes más recientes."

Puede resolverse con SQL o con una consulta MongoDB.

---

# 21. Diapositiva 39 — Práctica

Dar aproximadamente 5 minutos.

## Reto 1

PostgreSQL:

> Mostrar todas las tareas pendientes.

## Reto 2

PostgreSQL:

> Mostrar las cinco tareas más recientes.

## Reto 3

MongoDB:

> Mostrar las tareas de prioridad `high`.

## Reto adicional

Para estudiantes que terminen:

> Mostrar cuántas tareas existen por estado.

---

# 22. Cierre

Utilizar las preguntas de la diapositiva 42.

Especialmente:

> ¿Qué diferencia existe entre `WHERE` y `HAVING`?

> ¿Para qué utilizamos `JOIN`?

> ¿Qué diferencia existe entre Embedding y References?

Finalizar conectando con la siguiente etapa:

```text
Base de datos
      ↑
      │
Backend
      ↑
      │
API
      ↑
      │
Frontend
```

En las siguientes sesiones comenzaremos a conectar nuestro Backend con las bases de datos.

---

# 23. Errores frecuentes que debe vigilar el docente

## SQL

### Error

```sql
SELECT * tasks;
```

### Correcto

```sql
SELECT * FROM tasks;
```

---

### Error

```sql
UPDATE tasks
SET status = 'completed';
```

Explicar que modifica todos los registros.

---

### Error

Usar una columna inexistente.

Por eso los estudiantes deben trabajar sobre el esquema proporcionado.

---

## MongoDB

### Error

Confundir:

```javascript
_id
```

con:

```javascript
id
```

Explicar que `_id` es el identificador del documento en MongoDB.

---

### Error

Escribir:

```javascript
status = "pending"
```

fuera de la estructura de consulta.

Correcto:

```javascript
{
  status: "pending"
}
```

---

# 24. Conceptos que el estudiante debería recordar

Al terminar la clase:

```text
PostgreSQL
 ├── Database
 ├── Table
 ├── Row
 ├── Column
 ├── Primary Key
 ├── Foreign Key
 ├── JOIN
 └── SQL

MongoDB
 ├── Database
 ├── Collection
 ├── Document
 ├── Field
 ├── _id
 ├── Query
 ├── Embedding
 └── Reference
```
