# Guía del docente

## Módulo 2 — Arquitectura del Back-End y Bases de Datos

### Sesión 4 — Express + Prisma + PostgreSQL + REST API

**Duración:** 2 horas 15 minutos
**Proyecto transversal:** Task Flow
**Modalidad:** Teórico-práctica
**Sesión anterior:** PostgreSQL + MongoDB + modelado de datos
**Sesión siguiente:** Continuación de la construcción del backend / validación y seguridad

---

# 1. Propósito de la sesión

En la sesión anterior los estudiantes trabajaron directamente con bases de datos y aprendieron conceptos como:

* tablas;
* registros;
* relaciones;
* claves primarias;
* claves foráneas;
* `SELECT`;
* `INSERT`;
* `UPDATE`;
* `DELETE`;
* `JOIN`;
* `WHERE`;
* `ORDER BY`;
* filtros y consultas.

En esta sesión se da el siguiente paso:

> **Integrar la base de datos PostgreSQL con nuestro backend Express para construir una API REST persistente utilizando Prisma.**

El objetivo no es solamente enseñar Prisma.

El objetivo principal es que el estudiante comprenda **cómo una aplicación backend se comunica con una base de datos y cómo organizar ese código correctamente**.

El estudiante debe comprender el siguiente flujo:

```text
Cliente
   ↓
Express
   ↓
Route
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
Prisma
   ↓
PostgreSQL
```

Este flujo será importante posteriormente cuando se estudien:

* validación;
* autenticación;
* autorización;
* manejo de errores;
* testing;
* documentación;
* NestJS.

---

# 2. Objetivos de aprendizaje

Al finalizar la sesión, el estudiante debería ser capaz de:

1. Explicar cómo un backend se conecta con PostgreSQL.
2. Configurar las credenciales de la base de datos mediante variables de entorno.
3. Explicar qué es Prisma y qué problema resuelve.
4. Definir modelos utilizando `schema.prisma`.
5. Crear y ejecutar migraciones.
6. Diferenciar una migración de un seed.
7. Configurar Prisma Client.
8. Explicar conceptualmente qué es un pool de conexiones.
9. Organizar un backend utilizando una arquitectura por capas.
10. Implementar un endpoint conectado realmente a PostgreSQL.
11. Realizar operaciones CRUD persistentes.
12. Utilizar filtros y paginación.
13. Aplicar un manejo básico de errores HTTP.
14. Continuar la implementación del backend Task Flow de manera autónoma.

---

# 3. Conceptos que el docente debe dominar antes de la clase

Antes de iniciar la sesión, verificar que el docente pueda explicar con claridad:

* PostgreSQL
* Node.js
* Express
* API
* REST
* ORM
* Prisma
* Prisma Client
* modelo
* migración
* seed
* variable de entorno
* conexión a base de datos
* pool de conexiones
* persistencia
* CRUD
* Route
* Controller
* Service
* Repository
* HTTP status codes
* query parameters
* paginación

No es necesario profundizar en todos ellos al mismo nivel. Algunos serán conceptos centrales y otros solamente se introducirán.

---

# 4. Preparación antes de la clase

El docente debería verificar previamente:

### PostgreSQL

Que PostgreSQL esté disponible mediante Docker según la configuración preparada para el curso.

Debe existir una base de datos:

```text
task_flow
```

o, si se utilizará una base limpia, permitir que Prisma la prepare según la configuración establecida.

### Node.js

Verificar:

```bash
node --version
npm --version
```

### Proyecto

El proyecto debería comenzar aproximadamente como:

```text
task-flow-api/
├── src/
├── .env
├── package.json
└── README.md
```

### Herramientas

Tener disponibles:

* VS Code
* PostgreSQL
* DBeaver
* Postman
* Docker
* Node.js

El estudiante no debería perder gran parte de la sesión instalando herramientas.

---

# 5. Distribución recomendada del tiempo

|      Tiempo | Actividad                                      |
| ----------: | ---------------------------------------------- |
|       5 min | Introducción y conexión con la sesión anterior |
|      15 min | PostgreSQL + configuración + `.env`            |
|      15 min | Prisma y `schema.prisma`                       |
|      20 min | Migraciones                                    |
|      15 min | Seeds                                          |
|      15 min | Arquitectura por capas                         |
|      25 min | Implementación de `GET /api/tasks`             |
|      15 min | CRUD, persistencia y prueba con Postman        |
|       5 min | Trabajo autónomo y cierre                      |
| **135 min** | **Total**                                      |

La implementación completa del CRUD **no debe convertirse en una obligación de terminar durante la clase**.

El objetivo es construir correctamente el flujo completo y dejar funcionalidades para que el estudiante las complete.

---

# 6. Diapositiva 1 — Portada

## Qué explicar

Presentar la sesión como una continuación natural de la sesión anterior.

En la sesión 3 se estudió la base de datos de Task Flow.

Ahora tenemos que responder:

> ¿Cómo hacemos para que nuestro backend pueda utilizar esa base de datos?

Mostrar:

```text
PostgreSQL
     ↓
Prisma
     ↓
Express
     ↓
REST API
```

Aclarar que no se está comenzando un proyecto nuevo.

Seguimos trabajando sobre:

> **Task Flow**

---

# 7. Diapositiva 2 — ¿Dónde estamos?

## Objetivo

Conectar los conocimientos previos con los nuevos.

Recordar brevemente:

```text
Node.js
   ↓
Express
   ↓
PostgreSQL
   ↓
SQL
```

Preguntar a los estudiantes:

> Si PostgreSQL ya contiene nuestras tareas, ¿cómo hacemos para obtenerlas desde `GET /api/tasks`?

Esperar que aparezcan respuestas como:

* conexión;
* consulta;
* backend;
* API.

Explicar que justamente esa conexión será el objetivo de la sesión.

---

# 8. Diapositiva 3 — De la base de datos a la API

## Concepto: integración

**Integración** significa conectar diferentes componentes de un sistema para que trabajen juntos.

En nuestro caso:

```text
Express
   ↕
Prisma
   ↕
PostgreSQL
```

La API recibe una solicitud:

```http
GET /api/tasks
```

y necesita obtener información de PostgreSQL para responder.

Por lo tanto:

```text
HTTP Request
      ↓
Backend
      ↓
Base de datos
      ↓
Backend
      ↓
HTTP Response
```

### Pregunta al grupo

> ¿Dónde estaba la información de las tareas antes de esta sesión?

Respuesta:

> En PostgreSQL.

> ¿Dónde debe estar la información después de crear una tarea mediante la API?

También:

> En PostgreSQL.

Esto introduce el concepto de **persistencia**.

---

# 9. Diapositiva 4 — El problema que queremos resolver

Explicar que una aplicación real no debería depender de que cada desarrollador cree manualmente las tablas.

Imaginar:

```text
Desarrollador A
   ↓
Crea tablas manualmente

Desarrollador B
   ↓
No sabe exactamente cómo crearlas

Desarrollador C
   ↓
Tiene una estructura diferente
```

Esto produce problemas de consistencia.

Queremos que el proyecto pueda describir y reproducir su estructura de base de datos.

Por eso aparecen:

* Prisma Schema;
* migraciones;
* seeds.

---

# 10. Diapositiva 5 — Arquitectura general

Presentar por primera vez el flujo:

```text
Client
  ↓
Express
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
Prisma
  ↓
PostgreSQL
```

No explicar todavía cada capa en profundidad.

Decir:

> Hoy vamos a construir este camino paso a paso.

Esto sirve como mapa mental de toda la clase.

---

# BLOQUE 1 — CONFIGURACIÓN DE POSTGRESQL

# 11. Diapositiva 6 — Nuestra base de datos

Recordar la configuración:

```text
Host: localhost
Port: 5432
Database: task_flow
User: postgres
```

## Definición: host

El **host** identifica dónde se encuentra el servidor de base de datos.

En nuestro entorno:

```text
localhost
```

significa que PostgreSQL está ejecutándose en nuestra propia máquina o entorno local.

## Definición: puerto

El **puerto** identifica el canal de comunicación utilizado por un servicio.

PostgreSQL utiliza normalmente:

```text
5432
```

## Definición: database

Es el espacio lógico donde PostgreSQL almacena tablas, relaciones, índices, etc.

En nuestro caso:

```text
task_flow
```

---

# 12. Diapositiva 7 — Variables de entorno

Explicar:

> Las variables de entorno permiten mantener información de configuración fuera del código fuente.

Ejemplo:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/task_flow"
PORT=3000
```

## ¿Qué es `DATABASE_URL`?

Es una **cadena de conexión** que contiene la información necesaria para conectarse a la base de datos.

Conceptualmente:

```text
postgresql://
usuario:password
@
host:puerto
/base_de_datos
```

Ejemplo:

```text
postgresql://postgres:postgres@localhost:5432/task_flow
```

Descomponerla con los estudiantes:

```text
postgresql://
postgres
:
postgres
@
localhost
:
5432
/
task_flow
```

---

# 13. ¿Por qué no colocar la conexión directamente en el código?

Explicar que esto no es recomendable:

```js
const password = "postgres123";
```

porque:

* expone información sensible;
* dificulta cambiar de entorno;
* puede terminar en Git;
* mezcla configuración con lógica.

Mejor:

```env
DATABASE_URL="..."
```

y el código obtiene la configuración desde el entorno.

## Concepto: configuración

La **configuración** son los valores que determinan cómo funciona o se conecta una aplicación sin formar parte directamente de su lógica de negocio.

Ejemplos:

```text
Puerto
URL de base de datos
Credenciales
Claves
URLs externas
```

---

# 14. Diapositiva 8 — ¿Qué es Prisma?

Definir:

> **Prisma es un ORM para aplicaciones Node.js/TypeScript que facilita trabajar con bases de datos mediante un modelo de datos, un cliente generado y herramientas de migración.**

## ORM

ORM significa:

> **Object-Relational Mapping**

En español:

> Mapeo Objeto-Relacional.

La idea es representar entidades de una base de datos relacional mediante estructuras que podemos manipular desde nuestro lenguaje de programación.

Por ejemplo:

```text
Tabla Task
      ↕
Modelo Task
      ↕
Objeto utilizado desde Node.js
```

Aclarar:

> Un ORM no elimina la existencia de SQL ni hace innecesario comprender SQL.

El estudiante debe seguir entendiendo:

```text
SELECT
INSERT
UPDATE
DELETE
WHERE
JOIN
ORDER BY
```

Prisma proporciona una abstracción para trabajar con esas operaciones.

---

# 15. Diapositiva 9 — ¿Por qué Prisma?

Explicar cada elemento:

### Modelado

Podemos describir:

```text
User
Project
Task
```

### Relaciones

Por ejemplo:

```text
User 1:N Task
Project 1:N Task
```

### Consultas

Podemos hacer:

```js
prisma.task.findMany()
```

en lugar de construir manualmente una cadena SQL.

### Migraciones

Podemos controlar la evolución de la estructura de la base de datos.

### Prisma Client

Es la herramienta que utilizaremos desde Node.js para realizar operaciones sobre PostgreSQL.

### Seeds

Permite preparar datos iniciales.

---

# 16. Diapositiva 10 — Instalación

Ejecutar:

```bash
npm install prisma @prisma/client
```

Explicar brevemente:

### `prisma`

Contiene las herramientas de desarrollo de Prisma, como:

```bash
npx prisma migrate
npx prisma init
npx prisma db seed
```

### `@prisma/client`

Es el cliente que nuestra aplicación utiliza para comunicarse con la base de datos.

Inicializar:

```bash
npx prisma init
```

---

# 17. Diapositiva 11 — Configuración de Prisma

Explicar:

```prisma
generator client {
  provider = "prisma-client-js"
}
```

El `generator` indica cómo se generará Prisma Client.

Después:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## Definición: datasource

El `datasource` define la fuente de datos que utilizará Prisma.

En nuestro caso:

```text
PostgreSQL
```

## `env("DATABASE_URL")`

Indica que Prisma debe obtener la cadena de conexión desde la variable de entorno.

---

# BLOQUE 2 — MODELO DE DATOS

# 18. Diapositiva 12 — Modelo Task Flow

Retomar el modelo de la sesión 3.

```text
User
 │
 │ 1:N
 ▼
Task
 ▲
 │ N:1
 │
Project
```

Preguntar:

> ¿Puede un usuario tener varias tareas?

Sí.

> ¿Puede una tarea pertenecer a varios usuarios?

En nuestro modelo actual:

No.

> ¿Puede un proyecto tener varias tareas?

Sí.

---

# 19. Diapositivas 13 y 14 — Modelos Prisma

Mostrar:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  tasks     Task[]
  createdAt DateTime @default(now())
}
```

Explicar los elementos fundamentales.

## `model`

Define un modelo de datos.

```prisma
model User
```

representará la entidad `User`.

## `@id`

Indica que el campo es la clave primaria.

## `@default(autoincrement())`

Hace que PostgreSQL genere automáticamente el identificador.

## `@unique`

Indica que no pueden existir dos registros con el mismo valor.

Por ejemplo:

```text
email
```

debe ser único.

## `Task[]`

Representa una relación de uno a muchos desde `User` hacia `Task`.

---

# 20. Modelo Task

Mostrar:

```prisma
model Task {
  id             Int      @id @default(autoincrement())
  title          String
  status         String
  priority       String
  estimatedHours Int?
  userId         Int
  projectId      Int

  user    User    @relation(fields: [userId], references: [id])
  project Project @relation(fields: [projectId], references: [id])
}
```

Explicar:

### `userId`

Es una clave foránea.

### `projectId`

También es una clave foránea.

### `@relation`

Define cómo se relaciona el modelo con otro modelo.

Por ejemplo:

```text
Task.userId
      ↓
User.id
```

y:

```text
Task.projectId
      ↓
Project.id
```

---

# BLOQUE 3 — MIGRACIONES

# 21. Diapositiva 15 — ¿Qué es una migración?

Definir:

> **Una migración es una descripción versionada de un cambio realizado sobre la estructura de una base de datos.**

Ejemplo:

```text
Migration 1
Crear User
Crear Project
Crear Task
```

Posteriormente:

```text
Migration 2
Agregar priority
```

La migración permite que el cambio pueda reproducirse en otros entornos.

---

# 22. Diapositiva 16 — Primera migración

Ejecutar:

```bash
npx prisma migrate dev --name init_task_flow
```

Explicar conceptualmente:

```text
schema.prisma
      ↓
Prisma analiza cambios
      ↓
Genera migration.sql
      ↓
Aplica cambios
      ↓
PostgreSQL
```

Mostrar la carpeta:

```text
prisma/
└── migrations/
    └── ..._init_task_flow/
        └── migration.sql
```

Es importante abrir el archivo `migration.sql` durante la demostración.

No es necesario enseñar cada línea.

La intención es demostrar:

> Prisma está generando SQL que modifica la base de datos.

---

# 23. Relación entre Prisma y SQL

Esta explicación es importante.

El estudiante podría pensar:

> "Como utilizamos Prisma, ya no necesitamos SQL."

Corregir esta idea.

El flujo es:

```text
Prisma Schema
      ↓
Prisma
      ↓
SQL
      ↓
PostgreSQL
```

Por eso los conocimientos de SQL de la sesión 3 siguen siendo fundamentales.

---

# 24. Diapositiva 17 — ¿Por qué utilizar migraciones?

Explicar problemas que resuelven:

### Reproducibilidad

Otro desarrollador puede aplicar las mismas migraciones.

### Historial

Podemos saber qué cambios se hicieron.

### Evolución

La base de datos puede evolucionar junto al código.

### Trabajo en equipo

Los cambios pueden versionarse mediante Git.

---

# BLOQUE 4 — SEEDS

# 25. Diapositiva 18 — ¿Qué es un Seed?

Definir:

> **Un seed es un mecanismo para insertar datos iniciales o de prueba en una base de datos.**

Diferenciar claramente:

```text
Migration
    ↓
estructura

Seed
    ↓
datos
```

Ejemplo:

```text
Migration
→ crea tabla Task

Seed
→ crea 10 tareas
```

---

# 26. Diapositiva 19 — Datos de Task Flow

Utilizar los datos trabajados en la sesión 3.

Por ejemplo:

### Users

```text
Juan
Maria
Pedro
Ana
Luis
```

### Projects

```text
Backend API
QA Platform
Mobile App
```

### Tasks

Utilizar las tareas ya definidas en el dataset de Task Flow.

La intención es que el estudiante reconozca que estamos reutilizando el mismo modelo y no creando un ejemplo nuevo.

---

# 27. Diapositiva 20 — Ejecutar Seed

Ejecutar:

```bash
npx prisma db seed
```

Después comprobar los datos mediante DBeaver.

Mostrar:

```text
task_flow
 ├── User
 ├── Project
 └── Task
```

Y consultar visualmente algunos registros.

---

# 28. Diapositiva 21 — Migration vs Seed

Esta diapositiva merece una explicación explícita.

Preguntar:

> Si borro todos los registros pero mantengo las tablas, ¿necesito otra migración?

No.

Necesitamos un seed si queremos volver a insertar los datos iniciales.

Preguntar:

> Si agregamos una nueva columna a `Task`, ¿necesitamos un seed?

No necesariamente.

Necesitamos una **migración** para modificar la estructura.

Resumen:

```text
Migration = estructura

Seed = datos
```

---

# BLOQUE 5 — CONEXIÓN BACKEND → POSTGRESQL

# 29. Diapositiva 22 — Prisma Client

Crear:

```text
src/config/prisma.js
```

Código:

```js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
```

## Definición: Prisma Client

**Prisma Client** es el cliente generado por Prisma que nuestra aplicación Node.js utiliza para ejecutar operaciones sobre la base de datos.

Por ejemplo:

```js
prisma.task.findMany()
```

---

# 30. Diapositiva 23 — Pool de conexiones

Introducir el concepto.

## Definición: conexión

Una conexión es un canal de comunicación entre nuestra aplicación y el servidor de base de datos.

No queremos crear una conexión nueva cada vez que llega una solicitud.

Por eso existe el concepto de:

## Connection Pool

> Un pool de conexiones es un conjunto administrado de conexiones disponibles que pueden reutilizarse para atender diferentes operaciones.

Mostrar:

```text
                PostgreSQL
                     ▲
                     │
             Connection Pool
             ┌────┬────┬────┐
             │ C1 │ C2 │ C3 │
             └────┴────┴────┘
                     ▲
                     │
                   Prisma
                     ▲
                     │
                   Express
```

Aclarar:

> En esta sesión no vamos a configurar manualmente el pool.

Prisma administra este aspecto de la conexión.

Lo importante es que el estudiante entienda el concepto.

---

# 31. Diapositiva 24 — Flujo completo de conexión

Mostrar:

```text
.env
 │
 │ DATABASE_URL
 ▼
Prisma Client
 │
 ▼
PostgreSQL
 │
 └── task_flow
```

Explicar que la aplicación utiliza `DATABASE_URL` para saber dónde está PostgreSQL.

---

# BLOQUE 6 — ARQUITECTURA POR CAPAS

# 32. Diapositiva 25 — ¿Por qué separar responsabilidades?

Mostrar primero un ejemplo problemático:

```js
app.get("/tasks", async (req, res) => {
   // consulta BD
   // lógica
   // validación
   // respuesta
});
```

Explicar que funciona, pero rápidamente se vuelve difícil de mantener.

Problemas:

* archivos grandes;
* responsabilidades mezcladas;
* dificultad para probar;
* dificultad para reutilizar lógica;
* dificultad para cambiar la tecnología de acceso a datos.

---

# 33. Diapositiva 26 — Arquitectura por capas

Presentar:

```text
Route
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
Prisma
  ↓
PostgreSQL
```

Explicar:

> No se trata simplemente de crear carpetas. Cada capa tiene una responsabilidad.

---

# 34. Diapositiva 27 — Responsabilidades

## Route

Define:

```http
GET /api/tasks
```

## Controller

Trabaja con:

```text
req
res
status codes
```

## Service

Contiene reglas y lógica de negocio.

## Repository

Se ocupa del acceso a datos.

## Prisma

Proporciona la abstracción ORM.

## PostgreSQL

Persiste la información.

---

# 35. Diapositiva 28 — Estructura del proyecto

Crear progresivamente:

```text
src/
├── config/
├── routes/
├── controllers/
├── services/
├── repositories/
├── app.js
└── server.js
```

No crear todavía archivos innecesarios.

Para la demostración inicial:

```text
task.routes.js
task.controller.js
task.service.js
task.repository.js
```

Esto mantiene el foco en `Task`.

---

# BLOQUE 7 — API REST

# 36. Diapositiva 29 — API de Tasks

Presentar:

```text
GET    /api/tasks
GET    /api/tasks/:id
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

Recordar que estamos trabajando con un recurso:

```text
Task
```

## Definición: recurso

En REST, un recurso representa una entidad que la API expone para que pueda ser consultada o modificada.

En nuestro caso:

```text
/tasks
```

representa las tareas.

---

# 37. REST

Explicar brevemente:

REST es un estilo arquitectónico para diseñar servicios web utilizando conceptos como:

* recursos;
* URLs;
* métodos HTTP;
* representaciones;
* códigos de estado.

No presentar REST como un protocolo.

Aclarar:

> HTTP es el protocolo; REST es un estilo arquitectónico para diseñar servicios que normalmente utilizan HTTP.

---

# 38. Diapositiva 30 — Primer endpoint

Construir:

```http
GET /api/tasks
```

Explicar que será nuestra demostración principal.

El objetivo es conseguir:

```text
Cliente
   ↓
GET /api/tasks
   ↓
Route
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
Prisma
   ↓
PostgreSQL
```

---

# 39. Diapositiva 31 — Route

Crear:

```js
router.get("/tasks", getTasks);
```

Explicar:

> La ruta conecta una solicitud HTTP con una función del Controller.

No debería contener la consulta a PostgreSQL.

---

# 40. Diapositiva 32 — Controller

Código:

```js
export async function getTasks(req, res) {

  try {

    const tasks = await taskService.getTasks();

    res.status(200).json(tasks);

  } catch (error) {

    res.status(500).json({
      message: "Error retrieving tasks"
    });

  }
}
```

Definir:

## Controller

> Es la capa que recibe las solicitudes HTTP, coordina la ejecución de la operación correspondiente y construye la respuesta HTTP.

Explicar:

```text
req → información de la solicitud

res → objeto utilizado para construir la respuesta
```

---

# 41. Diapositiva 33 — Service

Código:

```js
export async function getTasks() {

  return await taskRepository.findAll();

}
```

Definir:

## Service

> Es la capa donde colocamos la lógica de negocio y las reglas que determinan cómo debe funcionar una operación.

En esta primera implementación puede parecer muy simple.

Aclarar:

> Que el Service sea pequeño ahora no significa que sea innecesario. Más adelante contendrá reglas de negocio.

---

# 42. Diapositiva 34 — Repository

Código:

```js
export async function findAll() {

  return await prisma.task.findMany({
    include: {
      user: true,
      project: true
    },
    orderBy: {
      id: "asc"
    }
  });

}
```

Definir:

## Repository

> Es la capa responsable de encapsular el acceso y las operaciones de persistencia de los datos.

Aquí aparece Prisma.

El Repository sabe:

```text
cómo consultar Task
cómo guardar Task
cómo actualizar Task
cómo eliminar Task
```

El Controller no debería saber cómo hacerlo.

---

# 43. Diapositiva 35 — Flujo completo

Realizar la primera demostración completa.

Ejecutar:

```bash
npm run dev
```

Después en Postman:

```http
GET http://localhost:3000/api/tasks
```

Mientras se hace la demostración, seguir visualmente:

```text
Postman
   ↓
Express
   ↓
Route
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
Prisma
   ↓
PostgreSQL
```

Este es probablemente **el momento conceptual más importante de la clase**.

Preguntar:

> ¿Dónde se ejecuta realmente la consulta?

Respuesta:

> A través de Prisma, que interactúa con PostgreSQL.

---

# BLOQUE 8 — CRUD PERSISTENTE

# 44. Diapositivas 36–39 — CRUD

Definir:

## CRUD

CRUD representa las cuatro operaciones básicas sobre datos:

```text
Create
Read
Update
Delete
```

Relacionarlas con HTTP:

| CRUD   | HTTP      |
| ------ | --------- |
| Create | POST      |
| Read   | GET       |
| Update | PUT/PATCH |
| Delete | DELETE    |

---

# 45. Create

Ejemplo:

```http
POST /api/tasks
```

Body:

```json
{
  "title": "Implementar autenticación",
  "status": "TODO",
  "priority": "HIGH",
  "estimatedHours": 5,
  "userId": 1,
  "projectId": 1
}
```

Explicar el recorrido:

```text
POST
 ↓
Route
 ↓
Controller
 ↓
Service
 ↓
Repository
 ↓
Prisma
 ↓
INSERT
 ↓
PostgreSQL
```

---

# 46. Read

```http
GET /api/tasks
```

y:

```http
GET /api/tasks/1
```

Explicar:

```text
GET
 ↓
SELECT
 ↓
PostgreSQL
 ↓
JSON
```

---

# 47. Update

```http
PUT /api/tasks/1
```

Ejemplo:

```json
{
  "status": "IN_PROGRESS",
  "priority": "HIGH"
}
```

Conceptualmente:

```text
PUT
 ↓
UPDATE
 ↓
PostgreSQL
```

---

# 48. Delete

```http
DELETE /api/tasks/1
```

Conceptualmente:

```text
DELETE
 ↓
PostgreSQL
```

---

# 49. Diapositiva 40 — Persistencia

Definir:

> **Persistencia** significa que los datos sobreviven al ciclo de ejecución de la aplicación y quedan almacenados en un sistema de almacenamiento.

Comparar:

### No persistente

```text
Node.js
 ↓
memoria RAM
 ↓
reiniciar aplicación
 ↓
datos perdidos
```

### Persistente

```text
Node.js
 ↓
PostgreSQL
 ↓
reiniciar aplicación
 ↓
datos permanecen
```

Este concepto es fundamental para comprender por qué necesitamos una base de datos.

---

# BLOQUE 9 — FILTROS, ORDENAMIENTO Y PAGINACIÓN

# 50. Diapositiva 41 — Query Parameters

Definir:

> Los query parameters son parámetros enviados en la URL después del signo `?` y normalmente se utilizan para modificar o filtrar una consulta.

Ejemplo:

```http
GET /api/tasks?status=TODO
```

Aquí:

```text
status = TODO
```

es un query parameter.

---

# 51. Filtros de Task Flow

Utilizar:

```http
GET /api/tasks?status=TODO
```

```http
GET /api/tasks?priority=HIGH
```

```http
GET /api/tasks?projectId=1
```

```http
GET /api/tasks?userId=2
```

Relacionar con lo aprendido en SQL:

```sql
WHERE status = 'TODO'
```

El objetivo es que el estudiante vea la conexión:

```text
Query Parameter
      ↓
Prisma
      ↓
WHERE
      ↓
PostgreSQL
```

---

# 52. Diapositiva 42 — Combinar filtros

Ejemplo:

```http
GET /api/tasks?status=TODO&priority=HIGH
```

Explicar que:

```text
&
```

permite enviar múltiples parámetros.

Esto representa conceptualmente:

```sql
WHERE status = 'TODO'
AND priority = 'HIGH'
```

No es necesario construir toda la consulta SQL manualmente.

---

# 53. Diapositiva 43 — Ordenamiento

Ejemplo:

```http
GET /api/tasks?sort=createdAt&order=desc
```

Relacionar:

```text
sort/order
    ↓
Prisma
    ↓
ORDER BY
    ↓
PostgreSQL
```

Aclarar que el estudiante deberá implementar esta funcionalidad como parte del trabajo autónomo si no alcanza el tiempo.

---

# 54. Diapositiva 44 — Paginación

Definir:

> La paginación divide un conjunto grande de resultados en grupos o páginas más pequeñas.

Ejemplo:

```http
GET /api/tasks?page=1&limit=10
```

Si existen 1000 tareas, no siempre queremos devolver las 1000.

Prisma utiliza:

```js
const skip = (page - 1) * limit;

prisma.task.findMany({
  skip,
  take: limit
});
```

Relacionar:

```text
skip → OFFSET
take → LIMIT
```

Aclarar que la paginación será una extensión natural del endpoint.

---

# BLOQUE 10 — MANEJO BÁSICO DE ERRORES

# 55. Diapositiva 45 — ¿Qué pasa cuando algo falla?

Una API no solamente debe responder cuando todo funciona.

Debe informar cuando ocurre un problema.

Presentar:

```text
400 → Bad Request
404 → Not Found
500 → Internal Server Error
```

---

# 56. Definiciones de errores

## 400 Bad Request

La solicitud del cliente no es válida.

Ejemplo:

```text
Faltan datos obligatorios.
```

## 404 Not Found

El recurso solicitado no existe.

Ejemplo:

```http
GET /api/tasks/9999
```

cuando esa tarea no existe.

## 500 Internal Server Error

Se produjo un error inesperado en el servidor.

---

# 57. Diapositiva 46 — Task no encontrada

Ejemplo:

```js
if (!task) {

  return res.status(404).json({
    message: "Task not found"
  });

}
```

Explicar:

> No debemos responder `200 OK` cuando el recurso solicitado no existe.

El código HTTP comunica el resultado de la operación.

---

# 58. Diapositiva 47 — Error del servidor

Mostrar:

```js
try {

  // operación

} catch (error) {

  res.status(500).json({
    message: "Internal server error"
  });

}
```

Explicar que este es un manejo básico.

No introducir todavía:

* middleware global;
* clases de errores;
* logger avanzado;
* manejo centralizado.

Esos temas pueden aparecer posteriormente.

---

# BLOQUE 11 — PRÁCTICA

# 59. Diapositiva 48 — Reto Task Flow

Explicar que el docente ya implementó el primer flujo completo.

Ahora el estudiante debe continuar.

Implementar:

```text
GET    /api/tasks/:id
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

Todas deben respetar:

```text
Route
 ↓
Controller
 ↓
Service
 ↓
Repository
 ↓
Prisma
 ↓
PostgreSQL
```

---

# 60. Diapositiva 49 — Segundo reto

Implementar:

```http
GET /api/tasks?status=TODO
```

Opcional:

```http
GET /api/tasks?projectId=1
```

El docente debe verificar que el estudiante no coloque directamente:

```js
prisma.task.findMany()
```

dentro de la Route.

La consulta debe seguir la arquitectura.

---

# 61. Diapositiva 50 — Trabajo autónomo

Explicar claramente que **no es necesario terminar todas las funcionalidades en clase**.

El estudiante deberá completar:

* CRUD;
* filtros;
* ordenamiento;
* paginación;
* manejo básico de errores;
* pruebas con Postman.

Esto evita sacrificar la comprensión conceptual por intentar terminar una cantidad excesiva de código.

---

# 62. Diapositiva 51 — ¿Qué aprendimos?

Hacer una revisión oral.

Preguntar:

### ¿Cómo se conecta Node.js con PostgreSQL?

Esperado:

> Mediante Prisma Client utilizando la configuración de conexión.

### ¿Dónde almacenamos la configuración?

> En variables de entorno.

### ¿Qué es una migración?

> Una versión de un cambio estructural de la base de datos.

### ¿Qué es un seed?

> Datos iniciales o de prueba.

### ¿Qué es Prisma?

> Un ORM que facilita el acceso a la base de datos.

### ¿Qué es un Repository?

> La capa responsable del acceso a datos.

---

# 63. Diapositiva 52 — Flujo que debemos recordar

Repetir:

```text
Cliente
   ↓
Express
   ↓
Route
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
Prisma
   ↓
PostgreSQL
```

Pedir a un estudiante que explique cada paso.

---

# 64. Diapositiva 53 — Conexión con las siguientes sesiones

Explicar que la arquitectura que estamos creando no es solamente para esta clase.

Posteriormente tendremos:

```text
API
 ↓
Validación
 ↓
Autenticación
 ↓
Autorización
 ↓
Seguridad
 ↓
Testing
 ↓
Documentación
```

Y posteriormente veremos cómo conceptos similares se organizan en NestJS.

Por eso es importante que el estudiante comprenda ahora:

```text
Controller
Service
Repository
```

y no simplemente copie código.

---

# 65. Diapositiva 54 — Cierre

Cerrar con la idea:

> Task Flow dejó de ser solamente un modelo de base de datos.

Ahora tenemos:

```text
PostgreSQL
    +
Prisma
    +
Express
    +
REST API
```

El estudiante debe entender que hemos construido la primera conexión real entre:

```text
Cliente → Backend → Base de datos
```

---

# 66. Conceptos fundamentales de la sesión

Esta sección puede utilizarse como referencia rápida del docente.

## Backend

Parte de una aplicación que procesa solicitudes, ejecuta lógica de negocio, accede a datos y devuelve respuestas al cliente.

---

## API

Una interfaz que permite que diferentes sistemas o componentes se comuniquen mediante operaciones definidas.

En nuestro caso:

```text
Cliente
   ↕
Task Flow API
```

---

## REST

Estilo arquitectónico utilizado para diseñar APIs basadas en recursos y operaciones HTTP.

---

## ORM

Object-Relational Mapping.

Mecanismo que permite trabajar con una base de datos relacional mediante abstracciones del lenguaje de programación.

---

## Prisma

ORM utilizado en nuestro proyecto para trabajar con PostgreSQL desde Node.js/TypeScript.

---

## Prisma Client

Cliente generado por Prisma que permite realizar operaciones sobre la base de datos desde nuestra aplicación.

---

## Schema

Definición de la estructura de datos que utilizaremos.

En Prisma:

```text
schema.prisma
```

---

## Migration

Cambio versionado de la estructura de la base de datos.

---

## Seed

Datos iniciales o de prueba utilizados para preparar una base de datos.

---

## Persistencia

Capacidad de conservar los datos más allá de la ejecución actual de la aplicación.

---

## Connection

Canal de comunicación entre la aplicación y el servidor de base de datos.

---

## Connection Pool

Conjunto administrado de conexiones que pueden reutilizarse para diferentes operaciones.

---

## Route

Define qué código debe ejecutarse cuando llega una determinada solicitud HTTP.

---

## Controller

Recibe y procesa la solicitud HTTP y construye la respuesta.

---

## Service

Contiene la lógica de negocio de una operación.

---

## Repository

Encapsula el acceso a los datos.

---

## CRUD

Operaciones fundamentales:

```text
Create
Read
Update
Delete
```

---

## Query Parameter

Parámetro enviado en la URL después de `?`.

Ejemplo:

```http
/api/tasks?status=TODO
```

---

## Path Parameter

Parámetro que forma parte de la ruta.

Ejemplo:

```http
/api/tasks/10
```

Aquí:

```text
10
```

es el identificador de la tarea.

---

## HTTP Status Code

Código numérico que comunica el resultado de una solicitud HTTP.

Ejemplos:

```text
200 OK
201 Created
204 No Content
400 Bad Request
404 Not Found
500 Internal Server Error
```

---

## 67. Errores frecuentes que el docente debe anticipar

### Error: Prisma no encuentra la base de datos

Revisar:

```env
DATABASE_URL
```

y comprobar:

* PostgreSQL está ejecutándose;
* puerto;
* usuario;
* contraseña;
* nombre de base de datos.

---

### Error: `P1001` / no puede conectarse a PostgreSQL

Comprobar:

```text
Docker
PostgreSQL
localhost
5432
```

y que el contenedor esté ejecutándose.

---

### Error: Prisma Client no generado

Ejecutar según la versión/configuración de Prisma utilizada:

```bash
npx prisma generate
```

---

### Error: migración no aplicada

Revisar:

```bash
npx prisma migrate status
```

y la conexión a PostgreSQL.

---

### Error: datos duplicados

Puede producirse por restricciones como:

```prisma
@unique
```

Por ejemplo:

```text
email
```

Explicar que esto no es necesariamente un error de Prisma: es una restricción de integridad de la base de datos.

---

# 68. Preguntas de comprobación durante la clase

Utilizar estas preguntas para verificar comprensión.

### Antes de Prisma

> ¿Por qué nuestra API necesita conectarse a PostgreSQL?

> ¿Dónde están almacenados actualmente nuestros datos?

> ¿Qué información necesitamos para conectarnos a PostgreSQL?

---

### Durante Prisma

> ¿Qué problema resuelve un ORM?

> ¿Prisma elimina la necesidad de conocer SQL?

> ¿Qué contiene `schema.prisma`?

---

### Durante migraciones

> ¿Qué diferencia existe entre una migración y un seed?

> Si agregamos una columna, ¿utilizamos migration o seed?

> Si queremos insertar usuarios de prueba, ¿utilizamos migration o seed?

---

### Durante arquitectura

> ¿Qué responsabilidad tiene el Controller?

> ¿Dónde colocamos la lógica de negocio?

> ¿Dónde realizamos el acceso a datos?

> ¿Por qué no hacemos directamente `prisma.task.findMany()` dentro de la Route?

---

### Durante API

> ¿Qué diferencia existe entre `GET /api/tasks` y `GET /api/tasks/1`?

> ¿Para qué utilizamos `POST`?

> ¿Para qué utilizamos query parameters?

> ¿Qué significa que una operación sea persistente?

---

# 69. Criterios de logro de la sesión

El estudiante alcanza el objetivo mínimo si puede:

### Nivel 1 — Comprensión

Explicar:

```text
Express → Prisma → PostgreSQL
```

y describir el propósito de cada componente.

### Nivel 2 — Configuración

Configurar:

```text
.env
schema.prisma
Prisma Client
```

### Nivel 3 — Base de datos

Crear:

```text
Migration
Seed
```

y verificar los datos en PostgreSQL.

### Nivel 4 — Arquitectura

Crear:

```text
Route
Controller
Service
Repository
```

### Nivel 5 — API

Implementar al menos:

```http
GET /api/tasks
```

siguiendo todas las capas.

### Nivel 6 — Trabajo autónomo

Completar:

```text
CRUD
Filtros
Ordenamiento
Paginación
Errores
```

---

# 70. Mensaje pedagógico central

El docente debe evitar que la clase se convierta en:

> "Copien estos comandos y este código."

La idea que debe quedar en el estudiante es:

```text
La base de datos almacena información.
        ↓
Prisma permite acceder a ella.
        ↓
El Repository encapsula el acceso.
        ↓
El Service contiene la lógica.
        ↓
El Controller maneja HTTP.
        ↓
La Route expone el endpoint.
        ↓
El cliente consume la API.
```

El objetivo de esta sesión no es que el estudiante memorice Prisma.

El objetivo es que comprenda **cómo construir un backend conectado a una base de datos utilizando una estructura organizada y mantenible**.

---

# 71. Resultado esperado al finalizar

El proyecto debería tener aproximadamente:

```text
task-flow-api/
│
├── prisma/
│   ├── schema.prisma
│   ├── seed.js
│   └── migrations/
│
├── src/
│   ├── config/
│   │   └── prisma.js
│   │
│   ├── routes/
│   │   └── task.routes.js
│   │
│   ├── controllers/
│   │   └── task.controller.js
│   │
│   ├── services/
│   │   └── task.service.js
│   │
│   ├── repositories/
│   │   └── task.repository.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── .gitignore
├── package.json
└── README.md
```

Y el flujo mínimo funcionando:

```text
GET /api/tasks
       ↓
    Express
       ↓
     Route
       ↓
   Controller
       ↓
     Service
       ↓
   Repository
       ↓
     Prisma
       ↓
  PostgreSQL
       ↓
    JSON
       ↓
    Cliente
```

Este flujo constituye la **base técnica de Task Flow para las siguientes sesiones**.
