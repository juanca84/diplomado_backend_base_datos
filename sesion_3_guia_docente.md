# GUÍA DEL DOCENTE

# Sesión 3 — PostgreSQL, SQL y MongoDB

**Módulo:** Arquitectura del Back-End y Bases de Datos
**Sesión:** 03
**Duración:** 2 horas 15 minutos
**Modalidad:** Teoría + demostración guiada + práctica corta

---

# 1. Propósito de la sesión

En esta sesión el estudiante conocerá dos formas diferentes de almacenar y consultar información:

* **PostgreSQL**, como ejemplo de base de datos relacional.
* **MongoDB**, como ejemplo de base de datos NoSQL documental.

El objetivo no es convertir la sesión en una clase exhaustiva de administración de bases de datos.

El objetivo es que el estudiante comprenda:

1. qué problema resuelve una base de datos;
2. cómo funciona el modelo relacional;
3. cómo se representan las relaciones entre datos;
4. cómo consultar información utilizando SQL;
5. cómo funciona el modelo documental de MongoDB;
6. cómo consultar documentos;
7. qué diferencias existen entre SQL y NoSQL;
8. cuándo puede ser conveniente utilizar cada enfoque.

---

# 2. Resultado esperado

Al finalizar la sesión, el estudiante debería poder explicar algo similar a:

> "PostgreSQL organiza la información en tablas relacionadas y utiliza SQL para consultar y modificar los datos. MongoDB utiliza colecciones de documentos y permite trabajar con estructuras más flexibles. La elección depende de las características de los datos, las relaciones, las necesidades de consistencia y la forma en que la aplicación consulta la información."

Además, debería poder realizar consultas básicas en ambas tecnologías.

---

# 3. Preparación previa del docente

Antes de iniciar la clase verificar que:

* Docker esté instalado.
* PostgreSQL esté ejecutándose.
* MongoDB esté ejecutándose.
* Los scripts de inicialización estén disponibles.
* Los seeds hayan sido ejecutados.
* DBeaver esté instalado.
* MongoDB Compass esté instalado o exista una herramienta equivalente.
* Los estudiantes tengan acceso a los scripts utilizados en la clase.

## Importante

No dedicar una parte importante de la clase a crear manualmente toda la estructura.

El entorno debe estar preparado para que todos trabajen con los mismos datos.

La estructura conceptual será:

```text
PostgreSQL
│
├── users
├── projects
├── tasks
└── project_members
```

MongoDB tendrá colecciones equivalentes para permitir comparar ambos modelos.

---

# 4. Distribución del tiempo

| Bloque                  | Diapositivas |      Tiempo |
| ----------------------- | -----------: | ----------: |
| Introducción            |          1–4 |      10 min |
| Modelo relacional       |         5–13 |      25 min |
| SQL y consultas         |        14–25 |      30 min |
| MongoDB y NoSQL         |        26–34 |      25 min |
| Comparación y modelado  |        35–38 |      10 min |
| Ejemplo/práctica guiada |        39–40 |      15 min |
| Práctica individual     |           41 |      15 min |
| Cierre                  |           42 |       5 min |
| **Total**               |              | **135 min** |

La distribución es orientativa. Si una explicación genera buenas preguntas, el docente puede extenderla ligeramente y reducir ejemplos secundarios.

---

# 5. Metodología

Utilizar siempre esta secuencia:

```text
CONCEPTO
   ↓
EJEMPLO
   ↓
PREGUNTA
   ↓
DEMOSTRACIÓN
   ↓
INTERPRETACIÓN
```

No comenzar directamente escribiendo consultas.

Primero debe quedar claro **qué problema estamos intentando resolver**.

---

# DIAPOSITIVA 1 — Portada

## PostgreSQL, SQL y MongoDB

### Qué debe explicar el docente

Presentar la sesión como una continuación natural de las dos anteriores.

En la Sesión 1 se aprendió cómo funciona un Backend.

En la Sesión 2 se construyeron endpoints con Express.

Ahora aparece una pregunta natural:

> "¿Dónde vamos a guardar los datos de nuestra aplicación?"

Explicar que hasta ahora los endpoints podían trabajar con datos temporales o estructuras en memoria, pero una aplicación real necesita persistir información.

Ejemplo:

```text
Cliente
   ↓
API Express
   ↓
¿Dónde guardamos los datos?
   ↓
Base de datos
```

### Mensaje clave

> Una API necesita una estrategia para almacenar y recuperar información de manera persistente.

---

# DIAPOSITIVA 2 — Objetivos

### Qué debe explicar el docente

No leer simplemente la lista.

Explicar la progresión:

```text
Base de datos
      ↓
Modelo relacional
      ↓
PostgreSQL
      ↓
SQL
      ↓
Modelo NoSQL
      ↓
MongoDB
      ↓
Comparación
```

### Pregunta inicial

> ¿Qué bases de datos conocen?

Permitir que los estudiantes mencionen tecnologías.

Después aclarar:

> PostgreSQL y MongoDB no son solamente dos herramientas diferentes. Representan dos formas diferentes de modelar los datos.

---

# DIAPOSITIVA 3 — ¿Qué es una base de datos?

### Explicación

Una base de datos es un sistema que permite almacenar, organizar, consultar y administrar información de manera persistente.

No debemos reducir la definición a:

> "Es donde guardamos datos."

También permite:

* buscar información;
* modificar información;
* eliminar información;
* relacionar información;
* controlar integridad;
* administrar acceso;
* realizar consultas.

### Ejemplo

Una aplicación de tareas necesita guardar:

```text
Usuarios
Proyectos
Tareas
```

Preguntar:

> ¿Podríamos guardar todo solamente en variables de JavaScript?

La respuesta es que podríamos hacerlo temporalmente, pero perderíamos la información cuando el proceso terminara.

### Concepto que debe recordar

**Persistencia:** capacidad de conservar los datos aunque la aplicación se detenga.

---

# DIAPOSITIVA 4 — Dos grandes enfoques

Presentar:

```text
                  BASES DE DATOS
                        │
             ┌──────────┴──────────┐
             │                     │
        RELACIONALES             NoSQL
             │                     │
        PostgreSQL              MongoDB
             │                     │
          Tablas              Documentos
```

### Explicación

Aquí no queremos decir que:

> SQL = PostgreSQL

ni que:

> NoSQL = MongoDB.

SQL y NoSQL son categorías/enfoques.

PostgreSQL es un sistema de gestión de bases de datos relacional.

MongoDB es un sistema de base de datos documental NoSQL.

### Pregunta

> ¿La diferencia principal es solamente que una utiliza tablas y la otra documentos?

Esperar que respondan.

Explicar que la diferencia más importante está en **cómo se modelan, relacionan, consultan y mantienen los datos**.

---

# DIAPOSITIVA 5 — Modelo relacional

### Explicar

En el modelo relacional la información se organiza principalmente en:

* tablas;
* filas;
* columnas;
* relaciones.

Ejemplo:

```text
users

id | name  | email
---|-------|----------------
1  | Juan  | juan@email.com
2  | Ana   | ana@email.com
```

### Conceptos

**Tabla:** representa una entidad o conjunto de datos.

**Fila/registro:** representa una instancia.

**Columna:** representa una propiedad.

### Pregunta

> Si `users` representa usuarios, ¿qué representa una fila?

Respuesta:

> Un usuario específico.

---

# DIAPOSITIVA 6 — Tabla, registro y columna

Utilizar el ejemplo:

```text
users
--------------------------------
id | name | email | created_at
--------------------------------
1  | Juan | ...   | ...
2  | Ana  | ...   | ...
```

Explicar:

```text
users
  ↓
tabla

id, name, email
  ↓
columnas

1, Juan, ...
  ↓
registro
```

### Concepto importante

La estructura de la tabla define qué tipo de información puede almacenar cada columna.

---

# DIAPOSITIVA 7 — Primary Key

### Definición

La **Primary Key** identifica de forma única un registro dentro de una tabla.

Ejemplo:

```sql
id SERIAL PRIMARY KEY
```

### Explicar

Dos usuarios pueden llamarse:

```text
Juan
```

pero no deberían tener el mismo identificador:

```text
id = 1
id = 2
```

### Propiedades importantes

Una clave primaria debe identificar de forma única cada registro.

### Pregunta

> ¿Por qué no usamos simplemente el nombre como identificador?

Porque podría repetirse.

### Mensaje clave

> La Primary Key identifica un registro.

---

# DIAPOSITIVA 8 — Foreign Key

Aquí introducir la relación entre tablas.

Ejemplo:

```text
users
-----
id
name

projects
--------
id
name
owner_id
```

`owner_id` puede referenciar:

```text
users.id
```

### Explicar

Una **Foreign Key** permite establecer una relación entre registros de diferentes tablas.

Ejemplo:

```text
project.owner_id = user.id
```

### Pregunta

> Si `owner_id = 3`, ¿qué significa?

Respuesta:

> El proyecto pertenece al usuario cuyo `id` es 3.

### Concepto clave

**Primary Key → identifica**

**Foreign Key → relaciona**

---

# DIAPOSITIVA 9 — Relaciones 1:1

### Explicación

Una relación uno a uno significa que un registro de una entidad se relaciona con un registro de otra entidad.

Ejemplo conceptual:

```text
User
  │
  └── Profile
```

Un usuario tiene un perfil.

No profundizar demasiado porque no será el tipo de relación principal del ejemplo TaskFlow.

### Pregunta

> ¿Una persona podría tener varios perfiles utilizando este modelo?

No, si la relación está diseñada estrictamente como 1:1.

---

# DIAPOSITIVA 10 — Relaciones 1:N

Esta es una relación fundamental para la clase.

Ejemplo:

```text
User
 │
 ├── Project
 ├── Project
 └── Project
```

Un usuario puede tener varios proyectos.

Pero cada proyecto tiene un propietario.

En SQL:

```text
users
  1
  │
  │
  N
projects
```

### Ejemplo

```text
users.id
   ↑
   │
projects.owner_id
```

### Mensaje clave

> Una Foreign Key normalmente aparece en el lado "muchos" de una relación 1:N.

---

# DIAPOSITIVA 11 — Relaciones N:N

Ejemplo:

```text
Users
  │
  │ N
  │
  │
  N
Projects
```

Un usuario puede participar en muchos proyectos.

Un proyecto puede tener muchos usuarios.

No podemos representar directamente esta relación simplemente agregando una única FK.

Necesitamos una tabla intermedia.

```text
users
projects
project_members
```

### Ejemplo

```text
project_members

user_id
project_id
```

Esto representa:

```text
Juan → Proyecto A
Juan → Proyecto B
Ana  → Proyecto A
```

### Concepto clave

**N:N → tabla intermedia.**

---

# DIAPOSITIVA 12 — Modelo TaskFlow

Presentar el dominio que utilizaremos durante la sesión.

```text
User
 │
 ├───────────────┐
 │               │
 ▼               ▼
Project      ProjectMember
 │
 ▼
Task
```

Explicar las entidades:

### Users

Personas que utilizan el sistema.

### Projects

Proyectos creados dentro de TaskFlow.

### Tasks

Tareas pertenecientes a un proyecto.

### Project Members

Relación entre usuarios y proyectos.

### Mensaje

No estamos creando tablas arbitrarias para practicar SQL.

Estamos modelando un pequeño dominio de negocio.

---

# DIAPOSITIVA 13 — Estructura completa

Mostrar:

```text
users
  │
  ├───────────────┐
  │               │
  ▼               ▼
projects     project_members
  │               │
  ▼               ▼
tasks           users
```

### Explicar las claves

```text
users.id
projects.owner_id

projects.id
tasks.project_id

users.id
project_members.user_id

projects.id
project_members.project_id
```

### Demostración

Abrir DBeaver.

Mostrar visualmente las tablas.

No crear todavía las tablas.

### Pregunta

> ¿Qué tabla necesitamos consultar si queremos saber qué usuarios participan en un proyecto?

Respuesta:

`project_members`.

---

# DIAPOSITIVA 14 — SQL

### Definición

SQL significa **Structured Query Language**.

Es el lenguaje utilizado para trabajar con bases de datos relacionales.

Permite realizar operaciones como:

```text
Consultar
Crear
Modificar
Eliminar
```

### Mostrar

```sql
SELECT * FROM users;
```

### Explicar

No leer el código solamente.

Descomponer:

```text
SELECT
    ↓
qué queremos obtener

*
    ↓
todas las columnas

FROM
    ↓
de dónde obtenemos los datos

users
    ↓
tabla
```

### Concepto clave

SQL permite expresar qué información queremos obtener de la base de datos.

---

# DIAPOSITIVA 15 — SELECT

Ahora pasar a DBeaver.

Ejecutar:

```sql
SELECT *
FROM users;
```

Después:

```sql
SELECT *
FROM projects;
```

### Preguntas

> ¿Qué tabla estamos consultando?

> ¿Qué columnas estamos solicitando?

> ¿Qué representa cada fila?

Después mostrar una consulta más específica:

```sql
SELECT id, name
FROM users;
```

### Concepto

No siempre necesitamos obtener todas las columnas.

---

# DIAPOSITIVA 16 — INSERT

Explicar que `INSERT` permite crear registros.

Ejemplo:

```sql
INSERT INTO users (name, email)
VALUES ('Carlos', 'carlos@example.com');
```

Explicar:

```text
INSERT INTO
    ↓
tabla

(name, email)
    ↓
columnas

VALUES
    ↓
valores
```

### Advertencia

No es necesario ejecutarlo si queremos conservar exactamente el seed preparado.

Puede demostrarse conceptualmente o ejecutarse y luego eliminar el registro.

### Pregunta

> ¿Qué operación HTTP se relaciona conceptualmente con crear un recurso?

Respuesta:

`POST`.

Aclarar que SQL y HTTP son conceptos diferentes; la comparación es conceptual.

---

# DIAPOSITIVA 17 — UPDATE

Mostrar:

```sql
UPDATE users
SET name = 'Carlos Pérez'
WHERE id = 1;
```

### Punto crítico

Explicar la importancia de:

```sql
WHERE
```

Sin `WHERE`:

```sql
UPDATE users
SET name = 'Carlos Pérez';
```

podría modificar todos los registros.

### Regla de seguridad

> Antes de ejecutar UPDATE, comprobar siempre qué registros serán afectados.

Primero podemos comprobar:

```sql
SELECT *
FROM users
WHERE id = 1;
```

y después ejecutar el `UPDATE`.

---

# DIAPOSITIVA 18 — DELETE

Ejemplo:

```sql
DELETE FROM users
WHERE id = 5;
```

Explicar nuevamente el riesgo de olvidar `WHERE`.

```sql
DELETE FROM users;
```

eliminaría todos los registros de la tabla.

### Regla para recordar

> Antes de `UPDATE` o `DELETE`, primero ejecutar un `SELECT` con el mismo `WHERE`.

Por ejemplo:

```sql
SELECT *
FROM users
WHERE id = 5;
```

Luego:

```sql
DELETE FROM users
WHERE id = 5;
```

---

# DIAPOSITIVA 19 — WHERE

`WHERE` permite filtrar registros.

Ejemplo:

```sql
SELECT *
FROM users
WHERE id = 1;
```

Otro ejemplo:

```sql
SELECT *
FROM tasks
WHERE status = 'completed';
```

### Explicar

Sin `WHERE`:

```text
todos los registros
```

Con `WHERE`:

```text
solo los registros que cumplen la condición
```

### Pregunta

> ¿Qué sucede si necesitamos usuarios cuyo nombre sea Juan?

```sql
SELECT *
FROM users
WHERE name = 'Juan';
```

---

# DIAPOSITIVA 20 — ORDER BY y LIMIT

### ORDER BY

Permite ordenar resultados.

```sql
SELECT *
FROM tasks
ORDER BY title ASC;
```

También:

```sql
ORDER BY title DESC;
```

### LIMIT

Permite limitar la cantidad de resultados.

```sql
SELECT *
FROM tasks
LIMIT 5;
```

### Combinar

```sql
SELECT *
FROM tasks
ORDER BY created_at DESC
LIMIT 5;
```

Explicar:

> "Dame las cinco tareas más recientes."

### Concepto importante

Aquí comenzamos a ver que SQL permite expresar necesidades de negocio mediante consultas.

---

# DIAPOSITIVA 21 — Agregaciones

Introducir funciones de agregación:

```sql
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

Pregunta:

> ¿Cuántas tareas existen?

Otro ejemplo:

```sql
SELECT COUNT(*)
FROM users;
```

### Explicar

Estas funciones no devuelven necesariamente cada registro.

Permiten obtener información resumida.

---

# DIAPOSITIVA 22 — GROUP BY

Explicar que `GROUP BY` permite agrupar registros.

Ejemplo:

```sql
SELECT status, COUNT(*)
FROM tasks
GROUP BY status;
```

Resultado conceptual:

```text
status       count
-----------  -----
pending       4
in_progress   3
completed     3
```

### Explicación

Primero agrupamos:

```text
pending
in_progress
completed
```

Después contamos cuántas tareas existen en cada grupo.

### Pregunta

> ¿Qué pregunta de negocio responde esta consulta?

Respuesta:

> ¿Cuántas tareas existen por estado?

---

# DIAPOSITIVA 23 — HAVING

Aquí explicar la diferencia entre `WHERE` y `HAVING`.

### WHERE

Filtra registros **antes de agrupar**.

### HAVING

Filtra grupos **después de agrupar**.

Ejemplo:

```sql
SELECT status, COUNT(*)
FROM tasks
GROUP BY status
HAVING COUNT(*) > 2;
```

Significa:

> Mostrar solamente los estados que tengan más de dos tareas.

### Regla fácil

```text
WHERE
 ↓
filtra filas

GROUP BY
 ↓
agrupa

HAVING
 ↓
filtra grupos
```

---

# DIAPOSITIVA 24 — JOIN

Esta es una de las partes más importantes de PostgreSQL.

Preguntar:

> Si tenemos los datos separados en `users` y `projects`, ¿cómo obtenemos información combinada?

Respuesta:

`JOIN`.

Ejemplo:

```sql
SELECT
    users.name,
    projects.name
FROM users
JOIN projects
    ON projects.owner_id = users.id;
```

### Explicar visualmente

```text
users.id
    │
    │ = 
    │
projects.owner_id
```

El `JOIN` combina información relacionada.

### Pregunta

> ¿Por qué no guardamos simplemente el nombre del usuario dentro de `projects`?

Porque queremos mantener los datos normalizados y evitar duplicación innecesaria.

---

# DIAPOSITIVA 25 — LEFT JOIN

Explicar que `LEFT JOIN` permite conservar todos los registros de la tabla izquierda aunque no exista coincidencia.

Ejemplo:

```sql
SELECT
    users.name,
    projects.name
FROM users
LEFT JOIN projects
    ON projects.owner_id = users.id;
```

Esto permite encontrar usuarios aunque no tengan proyectos.

### Comparación

```text
JOIN
↓
solo coincidencias

LEFT JOIN
↓
todos los registros de la izquierda
+ coincidencias cuando existen
```

### Pregunta

> ¿Qué consulta utilizaríamos si queremos listar todos los usuarios, incluso quienes todavía no tienen proyectos?

Respuesta:

`LEFT JOIN`.

---

# DIAPOSITIVA 26 — ¿Qué es NoSQL?

Ahora realizar una transición.

Decir:

> "Hasta ahora hemos trabajado pensando en tablas y relaciones. Ahora vamos a cambiar el modelo."

NoSQL significa **Not Only SQL**.

No significa:

> "No utiliza ningún tipo de estructura."

MongoDB sigue teniendo estructura, pero utiliza un modelo documental.

### Concepto clave

```text
Relacional → tablas
MongoDB    → documentos
```

---

# DIAPOSITIVA 27 — MongoDB

Explicar los conceptos:

```text
MongoDB
   ↓
Database
   ↓
Collection
   ↓
Document
```

Equivalencia aproximada:

| PostgreSQL  | MongoDB    |
| ----------- | ---------- |
| Database    | Database   |
| Table       | Collection |
| Row         | Document   |
| Column      | Field      |
| Primary Key | `_id`      |

Aclarar que estas equivalencias sirven para comprender los conceptos, pero no significan que ambos motores funcionen exactamente igual.

---

# DIAPOSITIVA 28 — Documento MongoDB

Mostrar un documento:

```json
{
  "_id": "...",
  "name": "TaskFlow",
  "description": "Project management system",
  "status": "active"
}
```

Explicar:

* `_id` identifica el documento.
* Los campos contienen los datos.
* Un documento puede contener objetos.
* Un documento puede contener arrays.

### Pregunta

> ¿Qué diferencia observamos respecto a una tabla?

La estructura puede ser más flexible y permite representar información anidada.

---

# DIAPOSITIVA 29 — BSON y JSON

Explicar que MongoDB utiliza BSON internamente.

Para el estudiante:

```text
JSON
 ↓
representación familiar

BSON
 ↓
formato binario utilizado internamente por MongoDB
```

No profundizar en implementación interna.

El objetivo es que comprendan por qué los documentos MongoDB se parecen tanto a JSON.

---

# DIAPOSITIVA 30 — find()

Mostrar la primera consulta MongoDB.

```javascript
db.users.find()
```

Explicar:

```text
db
 ↓
base de datos actual

users
 ↓
collection

find()
 ↓
buscar documentos
```

Luego:

```javascript
db.users.find({
  name: "Juan"
})
```

### Demostración

Abrir MongoDB Compass.

Mostrar visualmente la colección.

Ejecutar las consultas.

---

# DIAPOSITIVA 31 — findOne()

Explicar:

```javascript
db.users.findOne({
  email: "juan@example.com"
})
```

La diferencia conceptual:

```text
find()
    ↓
puede devolver múltiples documentos

findOne()
    ↓
devuelve un documento
```

### Pregunta

> Si queremos buscar un usuario por un valor que esperamos que sea único, ¿cuál puede resultar conveniente?

`findOne()`.

---

# DIAPOSITIVA 32 — Filtros MongoDB

Introducir operadores básicos.

Ejemplo:

```javascript
db.tasks.find({
  status: "completed"
})
```

Después:

```javascript
db.tasks.find({
  priority: {
    $gt: 3
  }
})
```

Explicar:

```text
$gt
↓
greater than
```

Otros operadores que pueden mencionarse:

```text
$lt
$gte
$lte
$ne
$in
```

No es necesario enseñar todos en profundidad.

---

# DIAPOSITIVA 33 — Proyección

Explicar que podemos seleccionar qué campos queremos mostrar.

Ejemplo:

```javascript
db.users.find(
  {},
  {
    name: 1,
    email: 1
  }
)
```

La idea es equivalente a:

```sql
SELECT name, email
FROM users;
```

### Concepto

No siempre necesitamos devolver todo el documento.

---

# DIAPOSITIVA 34 — Sort y Limit

MongoDB también permite ordenar y limitar resultados.

```javascript
db.tasks
  .find()
  .sort({ createdAt: -1 })
  .limit(5)
```

Explicar:

```text
sort
 ↓
ordenar

-1
 ↓
descendente

limit
 ↓
cantidad máxima
```

Comparar inmediatamente con SQL:

```sql
SELECT *
FROM tasks
ORDER BY created_at DESC
LIMIT 5;
```

### Mensaje pedagógico

> La necesidad es la misma; cambia la forma de expresar la consulta.

---

# DIAPOSITIVA 35 — CRUD en MongoDB

Presentar las operaciones principales:

```text
Create
insertOne()

Read
find()
findOne()

Update
updateOne()

Delete
deleteOne()
```

Ejemplo:

```javascript
db.users.insertOne({
  name: "Carlos",
  email: "carlos@example.com"
})
```

Actualizar:

```javascript
db.users.updateOne(
  { name: "Carlos" },
  { $set: { name: "Carlos Pérez" } }
)
```

Eliminar:

```javascript
db.users.deleteOne({
  name: "Carlos Pérez"
})
```

### Advertencia

Igual que en SQL, debemos tener cuidado con las operaciones de modificación.

---

# DIAPOSITIVA 36 — Embedding

Introducir una de las decisiones fundamentales de MongoDB.

Podemos guardar información relacionada dentro del mismo documento.

Ejemplo:

```json
{
  "name": "Juan",
  "address": {
    "city": "La Paz",
    "country": "Bolivia"
  }
}
```

Aquí `address` está embebido.

### Explicar

En lugar de tener necesariamente:

```text
users
addresses
```

podemos representar:

```text
user
 └── address
```

### Cuándo resulta interesante

Cuando la información:

* pertenece claramente al documento principal;
* suele consultarse junto con él;
* no necesita existir independientemente.

---

# DIAPOSITIVA 37 — References

MongoDB también puede utilizar referencias.

Ejemplo conceptual:

```json
{
  "projectId": "..."
}
```

El documento guarda el identificador de otro documento.

Conceptualmente:

```text
Project
   │
   └── userId
          │
          ▼
        User
```

### Comparación

```text
PostgreSQL
    ↓
Foreign Key

MongoDB
    ↓
Reference
```

Pero aclarar:

> Una referencia en MongoDB no equivale exactamente a una Foreign Key de PostgreSQL. MongoDB no impone automáticamente las mismas restricciones relacionales.

---

# DIAPOSITIVA 38 — ¿Embedding o References?

Esta diapositiva debe utilizarse para hablar de **modelado**.

Preguntar:

> ¿Deberíamos siempre embebir los datos?

No.

La decisión depende de cómo se utilizarán los datos.

### Embedding

```text
User
 └── Address
```

Puede ser conveniente cuando la información se consulta junta y pertenece claramente al documento.

### References

```text
Project
   │
   └── userId
```

Puede ser conveniente cuando la entidad relacionada:

* tiene vida propia;
* se reutiliza;
* puede crecer mucho;
* se consulta independientemente.

### Mensaje clave

> En MongoDB no se trata simplemente de convertir cada tabla SQL en una colección.

Hay que **diseñar el modelo según los patrones de acceso a los datos**.

---

# DIAPOSITIVA 39 — PostgreSQL vs MongoDB

Aquí detenerse y comparar.

| Aspecto        | PostgreSQL       | MongoDB                                         |
| -------------- | ---------------- | ----------------------------------------------- |
| Modelo         | Relacional       | Documental                                      |
| Estructura     | Tablas           | Documentos                                      |
| Relaciones     | FK + JOIN        | Embedding / References                          |
| Consulta       | SQL              | MongoDB Query Language                          |
| Esquema        | Más estructurado | Más flexible                                    |
| Transacciones  | ACID robusto     | Soporte transaccional, según diseño y operación |
| Agrupaciones   | GROUP BY         | Aggregation Pipeline                            |
| Datos anidados | Menos natural    | Natural en documentos                           |

### Pregunta

> ¿Cuál es mejor?

No responder con un ganador.

Responder:

> Depende de las características del sistema.

---

# DIAPOSITIVA 40 — La misma necesidad en ambos modelos

Esta es una diapositiva muy importante.

Plantear:

> "Necesitamos obtener las cinco tareas más recientes."

### PostgreSQL

```sql
SELECT *
FROM tasks
ORDER BY created_at DESC
LIMIT 5;
```

### MongoDB

```javascript
db.tasks
  .find()
  .sort({ createdAt: -1 })
  .limit(5)
```

### Explicar

La necesidad de negocio es exactamente la misma:

```text
Obtener 5 tareas
       ↓
ordenadas por fecha
       ↓
de la más reciente a la más antigua
```

Lo que cambia es la forma de expresar esa necesidad.

### Mensaje clave

> La tecnología cambia, pero el problema de negocio permanece.

---

# DIAPOSITIVA 41 — Práctica del estudiante

## Objetivo

Realizar consultas básicas en PostgreSQL y MongoDB.

La práctica debe ser corta.

### Parte 1 — PostgreSQL

Solicitar:

#### Consulta 1

Obtener todos los usuarios.

```sql
SELECT *
FROM users;
```

#### Consulta 2

Obtener solamente nombre y correo.

```sql
SELECT name, email
FROM users;
```

#### Consulta 3

Buscar las tareas completadas.

```sql
SELECT *
FROM tasks
WHERE status = 'completed';
```

#### Consulta 4

Mostrar las 5 tareas más recientes.

```sql
SELECT *
FROM tasks
ORDER BY created_at DESC
LIMIT 5;
```

#### Consulta 5

Contar tareas por estado.

```sql
SELECT status, COUNT(*)
FROM tasks
GROUP BY status;
```

### Parte 2 — MongoDB

Realizar consultas equivalentes:

```javascript
db.users.find()
```

```javascript
db.users.find(
  {},
  {
    name: 1,
    email: 1
  }
)
```

```javascript
db.tasks.find({
  status: "completed"
})
```

```javascript
db.tasks
  .find()
  .sort({ createdAt: -1 })
  .limit(5)
```

### Durante la práctica

El docente debe circular y observar especialmente:

* si confunden tabla con colección;
* si olvidan `WHERE`;
* si confunden `find()` con `findOne()`;
* si utilizan incorrectamente `sort`;
* si entienden qué representa una relación.

No convertir la práctica en una competencia de velocidad.

---

# DIAPOSITIVA 42 — Resumen y cierre

## Repaso

Preguntar oralmente:

### Pregunta 1

> ¿Cuál es la diferencia principal entre una base de datos relacional y una documental?

Respuesta esperada:

> La relacional organiza los datos principalmente en tablas relacionadas; la documental los organiza en documentos dentro de colecciones.

### Pregunta 2

> ¿Qué diferencia existe entre Primary Key y Foreign Key?

Respuesta:

> La Primary Key identifica un registro; la Foreign Key permite relacionarlo con otro registro.

### Pregunta 3

> ¿Qué hace un JOIN?

Respuesta:

> Combina información de tablas relacionadas.

### Pregunta 4

> ¿Qué hace WHERE?

Respuesta:

> Filtra registros según una condición.

### Pregunta 5

> ¿Qué hace GROUP BY?

Respuesta:

> Agrupa registros para poder realizar operaciones de agregación sobre esos grupos.

### Pregunta 6

> ¿Qué representa una colección en MongoDB?

Respuesta:

> Un conjunto de documentos y es conceptualmente comparable con una tabla, aunque no funciona exactamente igual.

### Pregunta 7

> ¿MongoDB no tiene estructura?

Respuesta:

> No. Tiene estructura, pero utiliza un modelo documental más flexible que el modelo relacional tradicional.

---

# 6. Conceptos que el estudiante debe recordar

Al terminar la sesión, comprobar que puedan explicar:

### Base de datos

Sistema que permite almacenar y gestionar información de manera persistente.

### Base de datos relacional

Organiza los datos mediante tablas relacionadas.

### Tabla

Conjunto de registros estructurados mediante columnas.

### Registro

Una instancia individual dentro de una tabla.

### Primary Key

Identificador único de un registro.

### Foreign Key

Campo utilizado para establecer una relación con otra tabla.

### JOIN

Permite combinar información de tablas relacionadas.

### SQL

Lenguaje utilizado para trabajar con bases de datos relacionales.

### NoSQL

Familia de enfoques de bases de datos que no utilizan necesariamente el modelo relacional tradicional.

### MongoDB

Base de datos NoSQL orientada a documentos.

### Collection

Conjunto de documentos en MongoDB.

### Document

Unidad de información almacenada en MongoDB.

### Embedding

Almacenamiento de información relacionada dentro del mismo documento.

### Reference

Almacenamiento de una referencia hacia otro documento.

---

# 7. Errores frecuentes que debe evitar el docente

## Error 1 — Presentar SQL como una base de datos

SQL es un lenguaje.

PostgreSQL es un sistema de gestión de bases de datos.

No decir:

> "SQL es una base de datos."

Decir:

> "SQL es el lenguaje que utilizamos para trabajar con bases de datos relacionales como PostgreSQL."

---

## Error 2 — Decir que NoSQL significa "sin estructura"

Incorrecto:

> "MongoDB no tiene estructura."

Correcto:

> "MongoDB utiliza un modelo documental con una estructura más flexible."

---

## Error 3 — Presentar MongoDB como reemplazo universal de PostgreSQL

No enseñar:

> "MongoDB es mejor porque es más moderno."

Ni:

> "PostgreSQL es mejor porque es relacional."

La decisión depende del problema.

---

## Error 4 — Hacer demasiado énfasis en crear tablas

La clase no debe convertirse en una clase de diseño exhaustivo de bases de datos.

Mostrar:

```sql
CREATE TABLE ...
```

para que el estudiante comprenda cómo se define una estructura.

Pero utilizar los scripts preparados para que la mayor parte de la clase se concentre en:

```text
Modelo
   ↓
Datos
   ↓
Consultas
   ↓
Interpretación
```

---

## Error 5 — Ejecutar UPDATE/DELETE sin explicar el riesgo

Siempre recordar:

```sql
UPDATE ...
WHERE ...
```

y:

```sql
DELETE ...
WHERE ...
```

Antes de ejecutar una modificación, comprobar primero con:

```sql
SELECT ...
WHERE ...
```

---

## Error 6 — Convertir la sesión en memorización de sintaxis

El objetivo no es que memoricen veinte consultas.

Queremos que comprendan:

```text
¿Qué información necesito?
        ↓
¿Dónde está?
        ↓
¿Cómo está relacionada?
        ↓
¿Qué consulta necesito?
        ↓
¿Cómo interpreto el resultado?
```

---

# 8. Mensaje pedagógico final

La idea más importante de esta sesión es:

> **Una base de datos no es solamente un lugar donde guardamos información. El modelo que elegimos determina cómo organizamos, relacionamos y consultamos esa información.**

Y una segunda idea:

> **PostgreSQL y MongoDB resuelven necesidades similares utilizando modelos diferentes.**

Finalmente:

```text
Necesidad de negocio
        ↓
Modelo de datos
        ↓
Base de datos
        ↓
Consulta
        ↓
Resultado
```

El estudiante debe comenzar a pensar en la base de datos como **parte de la arquitectura del Backend**, no como una herramienta aislada.
