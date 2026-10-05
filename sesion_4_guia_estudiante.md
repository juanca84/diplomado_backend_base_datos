# Guía del estudiante

## Sesión 4 — Express + Prisma + PostgreSQL + REST API

---

## 1. Objetivo de la sesión

En esta sesión conectaremos nuestro backend **Task Flow** con PostgreSQL utilizando **Prisma ORM**.

Al finalizar la sesión deberás comprender y aplicar el siguiente flujo:

```text
Cliente
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

También trabajaremos con:

* Prisma ORM
* Prisma Client
* `schema.prisma`
* Migraciones
* Seeds
* Persistencia de datos
* Arquitectura por capas
* CRUD
* Filtros
* Ordenamiento
* Paginación
* Manejo básico de errores
* Postman

---

# 2. Requisitos previos

Antes de comenzar debes tener instalado:

* Node.js
* npm
* Visual Studio Code
* Git
* PostgreSQL mediante Docker
* DBeaver
* Postman

Además, debes tener disponible el proyecto **Task Flow** desarrollado en las sesiones anteriores.

---

# 3. Estructura inicial del proyecto

Nuestro proyecto tendrá una estructura similar a:

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
│   │   ├── task.routes.js
│   │   ├── user.routes.js
│   │   └── project.routes.js
│   │
│   ├── controllers/
│   │   ├── task.controller.js
│   │   ├── user.controller.js
│   │   └── project.controller.js
│   │
│   ├── services/
│   │   ├── task.service.js
│   │   ├── user.service.js
│   │   └── project.service.js
│   │
│   ├── repositories/
│   │   ├── task.repository.js
│   │   ├── user.repository.js
│   │   └── project.repository.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── .gitignore
├── package.json
└── README.md
```

Durante la sesión nos concentraremos principalmente en el recurso **Task**.

---

# 4. Verificar PostgreSQL

Antes de trabajar con Prisma debemos asegurarnos de que PostgreSQL esté funcionando.

Si utilizas Docker:

```bash
docker ps
```

Debes encontrar el contenedor de PostgreSQL ejecutándose.

Por ejemplo:

```text
CONTAINER ID   IMAGE         PORTS
abc123         postgres      0.0.0.0:5432->5432/tcp
```

También puedes verificar la conexión utilizando **DBeaver**.

### Datos de conexión

Utiliza los datos definidos en tu configuración de Docker.

Ejemplo:

```text
Host: localhost
Port: 5432
Database: task_flow
User: postgres
Password: postgres
```

> Los valores pueden variar dependiendo de tu configuración.

---

# 5. Instalar Prisma

Desde la carpeta del proyecto:

```bash
npm install prisma @prisma/client
```

Después inicializamos Prisma:

```bash
npx prisma init
```

Esto crea principalmente:

```text
prisma/
└── schema.prisma

.env
```

---

# 6. Configurar la conexión con PostgreSQL

Abrimos:

```text
.env
```

Y configuramos:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/task_flow"
PORT=3000
```

La estructura general de la URL es:

```text
postgresql://USUARIO:PASSWORD@HOST:PUERTO/BASE_DE_DATOS
```

Por ejemplo:

```text
postgresql://postgres:postgres@localhost:5432/task_flow
```

### Importante

No debemos colocar las credenciales directamente en nuestro código.

Incorrecto:

```js
const password = "postgres";
```

Preferimos:

```text
.env
```

y desde Prisma:

```prisma
url = env("DATABASE_URL")
```

---

# 7. Configurar Prisma

Abrimos:

```text
prisma/schema.prisma
```

Configuramos:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Tenemos dos conceptos importantes:

### Generator

Indica que Prisma debe generar el cliente que utilizaremos desde Node.js.

```prisma
generator client {
  provider = "prisma-client-js"
}
```

### Datasource

Indica qué base de datos utilizaremos.

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

---

# 8. Crear nuestro modelo de datos

Ahora definiremos las entidades de **Task Flow**.

## User

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  tasks     Task[]
  createdAt DateTime @default(now())
}
```

## Project

```prisma
model Project {
  id        Int      @id @default(autoincrement())
  name      String
  tasks     Task[]
  createdAt DateTime @default(now())
}
```

## Task

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

Nuestro modelo representa:

```text
User
  │
  │ 1:N
  ↓
Task
  ↑
  │ N:1
  │
Project
```

Una tarea pertenece a un usuario y a un proyecto.

---

# 9. ¿Qué es una migración?

Una **migración** permite llevar los cambios realizados en nuestro modelo hacia la base de datos.

Nuestro flujo es:

```text
schema.prisma
      ↓
   Migration
      ↓
 PostgreSQL
```

Por ejemplo, si agregamos:

```prisma
priority String
```

Prisma puede generar una migración para modificar la estructura de PostgreSQL.

---

# 10. Crear nuestra primera migración

Ejecutamos:

```bash
npx prisma migrate dev --name init_task_flow
```

Prisma realizará los cambios necesarios en PostgreSQL.

También creará una carpeta similar a:

```text
prisma/
└── migrations/
    └── 20261005120000_init_task_flow/
        └── migration.sql
```

La carpeta de migraciones debe formar parte de nuestro proyecto.

---

# 11. Verificar la base de datos

Después de ejecutar la migración podemos utilizar DBeaver para verificar las tablas.

Deberíamos encontrar:

```text
users
projects
tasks
```

También podemos revisar las relaciones entre ellas.

---

# 12. ¿Qué es un Seed?

Un **Seed** permite insertar datos iniciales en nuestra base de datos.

La diferencia principal es:

| Elemento  | Propósito                  |
| --------- | -------------------------- |
| Migration | Crear/modificar estructura |
| Seed      | Insertar datos             |

Por ejemplo:

```text
Migration
    ↓
Crea las tablas

Seed
    ↓
Inserta Users, Projects y Tasks
```

---

# 13. Crear nuestro Seed

Creamos:

```text
prisma/seed.js
```

Ejemplo:

```js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const juan = await prisma.user.create({
    data: {
      name: "Juan",
      email: "juan@taskflow.com"
    }
  });

  const maria = await prisma.user.create({
    data: {
      name: "Maria",
      email: "maria@taskflow.com"
    }
  });

  const backendProject = await prisma.project.create({
    data: {
      name: "Backend API"
    }
  });

  const qaProject = await prisma.project.create({
    data: {
      name: "QA Platform"
    }
  });

  await prisma.task.createMany({
    data: [
      {
        title: "Diseñar API de Tasks",
        status: "TODO",
        priority: "HIGH",
        estimatedHours: 5,
        userId: juan.id,
        projectId: backendProject.id
      },
      {
        title: "Crear pruebas de API",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        estimatedHours: 4,
        userId: maria.id,
        projectId: qaProject.id
      }
    ]
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

> El objetivo del Seed es tener datos iniciales para poder probar nuestra API.

---

# 14. Configurar el Seed

En `package.json` configuramos:

```json
{
  "prisma": {
    "seed": "node prisma/seed.js"
  }
}
```

Después ejecutamos:

```bash
npx prisma db seed
```

Podemos comprobar los datos desde DBeaver.

---

# 15. Prisma Client

Ahora necesitamos utilizar Prisma desde nuestra aplicación Express.

Creamos:

```text
src/config/prisma.js
```

Contenido:

```js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
```

Este objeto será utilizado por nuestros repositories.

---

# 16. ¿Qué es la persistencia?

La **persistencia** significa que los datos permanecen almacenados aunque nuestra aplicación se detenga.

Por ejemplo:

```text
Node.js
   ↓
crear Task
   ↓
PostgreSQL
   ↓
se guarda el dato
```

Si detenemos el servidor:

```text
Servidor detenido
```

y posteriormente lo volvemos a iniciar:

```text
Servidor iniciado
```

la Task continúa existiendo porque está almacenada en PostgreSQL.

Esto es diferente de almacenar datos solamente en memoria:

```js
const tasks = [];
```

Si el proceso se reinicia, esos datos se pierden.

---

# 17. Pool de conexiones

Cuando nuestra aplicación necesita comunicarse con PostgreSQL necesita utilizar conexiones.

En lugar de crear una nueva conexión para cada operación, podemos trabajar con un **connection pool**.

Conceptualmente:

```text
Express
   ↓
Prisma
   ↓
Connection Pool
   ↓
PostgreSQL
```

Prisma administra este mecanismo por nosotros.

En esta sesión no necesitamos crear manualmente el pool.

Lo importante es comprender que:

> El pool permite administrar y reutilizar conexiones con la base de datos.

---

# 18. Arquitectura por capas

Para evitar colocar toda la lógica en un único archivo, dividiremos nuestras responsabilidades.

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

Cada capa tiene una responsabilidad diferente.

---

# 19. Route

La Route define qué URL y método HTTP utilizará nuestra API.

Creamos:

```text
src/routes/task.routes.js
```

Ejemplo:

```js
import { Router } from "express";
import { getTasks } from "../controllers/task.controller.js";

const router = Router();

router.get("/tasks", getTasks);

export default router;
```

---

# 20. Controller

El Controller recibe la petición HTTP y construye la respuesta.

Creamos:

```text
src/controllers/task.controller.js
```

Ejemplo:

```js
import * as taskService from "../services/task.service.js";

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

El Controller se preocupa principalmente por:

* Request
* Response
* HTTP Status
* Respuesta al cliente

---

# 21. Service

El Service contiene la lógica de negocio.

Creamos:

```text
src/services/task.service.js
```

Ejemplo:

```js
import * as taskRepository from "../repositories/task.repository.js";

export async function getTasks() {
  return await taskRepository.findAll();
}
```

El Service permite evitar colocar toda la lógica dentro del Controller.

---

# 22. Repository

El Repository encapsula el acceso a los datos.

Creamos:

```text
src/repositories/task.repository.js
```

Ejemplo:

```js
import prisma from "../config/prisma.js";

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

Aquí es donde trabajamos directamente con Prisma.

---

# 23. Conectar la Route con Express

En nuestro `app.js`:

```js
import express from "express";
import taskRoutes from "./routes/task.routes.js";

const app = express();

app.use(express.json());

app.use("/api", taskRoutes);

export default app;
```

Ahora tenemos:

```text
GET /api/tasks
```

---

# 24. El flujo completo

Cuando un cliente realiza:

```http
GET /api/tasks
```

ocurre:

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
   ↓
Prisma
   ↓
Repository
   ↓
Service
   ↓
Controller
   ↓
JSON
   ↓
Cliente
```

Este flujo es uno de los conceptos más importantes de la sesión.

---

# 25. Probar nuestro primer endpoint

Iniciamos el servidor:

```bash
npm run dev
```

o el comando configurado en nuestro proyecto.

En Postman:

```http
GET http://localhost:3000/api/tasks
```

Esperamos recibir una respuesta similar a:

```json
[
  {
    "id": 1,
    "title": "Diseñar API de Tasks",
    "status": "TODO",
    "priority": "HIGH"
  }
]
```

---

# 26. CRUD de Tasks

Nuestra API debe permitir realizar las operaciones principales:

| Operación       | Método | Endpoint         |
| --------------- | ------ | ---------------- |
| Listar Tasks    | GET    | `/api/tasks`     |
| Obtener Task    | GET    | `/api/tasks/:id` |
| Crear Task      | POST   | `/api/tasks`     |
| Actualizar Task | PUT    | `/api/tasks/:id` |
| Eliminar Task   | DELETE | `/api/tasks/:id` |

CRUD significa:

```text
Create
Read
Update
Delete
```

---

# 27. Obtener una Task

Endpoint:

```http
GET /api/tasks/:id
```

Ejemplo:

```http
GET /api/tasks/1
```

El `1` es un **Path Parameter**.

En Express podemos obtenerlo mediante:

```js
req.params.id
```

Ejemplo:

```js
const id = Number(req.params.id);
```

---

# 28. Crear una Task

Endpoint:

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

En Express obtenemos la información mediante:

```js
req.body
```

Ejemplo:

```js
const taskData = req.body;
```

---

# 29. Actualizar una Task

Endpoint:

```http
PUT /api/tasks/1
```

Body:

```json
{
  "title": "Implementar autenticación JWT",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "estimatedHours": 8,
  "userId": 1,
  "projectId": 1
}
```

El ID viene desde:

```js
req.params.id
```

Los nuevos datos vienen desde:

```js
req.body
```

---

# 30. Eliminar una Task

Endpoint:

```http
DELETE /api/tasks/1
```

Aquí solamente necesitamos identificar qué Task queremos eliminar.

```js
const id = Number(req.params.id);
```

Después el Repository puede utilizar Prisma para eliminarla.

---

# 31. Filtros

Nuestra API también debe permitir consultar solamente determinadas Tasks.

Ejemplo:

```http
GET /api/tasks?status=TODO
```

`status` es un **Query Parameter**.

En Express:

```js
req.query.status
```

Ejemplo:

```js
const { status } = req.query;
```

---

# 32. Filtro por proyecto

También podemos utilizar:

```http
GET /api/tasks?projectId=1
```

Y obtener:

```js
req.query.projectId
```

Podemos convertirlo a número:

```js
const projectId = Number(req.query.projectId);
```

---

# 33. Combinar filtros

Podemos utilizar más de un filtro:

```http
GET /api/tasks?status=TODO&priority=HIGH
```

Otro ejemplo:

```http
GET /api/tasks?status=TODO&projectId=1
```

Conceptualmente esto equivale a utilizar condiciones similares a:

```sql
WHERE status = 'TODO'
AND priority = 'HIGH'
```

Prisma nos permite expresar estas condiciones mediante JavaScript.

---

# 34. Ordenamiento

Nuestra API puede permitir ordenar las Tasks.

Ejemplo:

```http
GET /api/tasks?sort=createdAt&order=desc
```

Podemos interpretar:

```text
sort
 ↓
campo utilizado para ordenar

order
 ↓
asc / desc
```

Conceptualmente corresponde a:

```sql
ORDER BY created_at DESC
```

---

# 35. Paginación

Cuando tenemos muchos registros no es conveniente devolverlos todos de una sola vez.

Podemos utilizar:

```http
GET /api/tasks?page=1&limit=10
```

Donde:

```text
page = página solicitada
limit = cantidad de registros
```

Para calcular cuántos registros debemos saltar:

```js
const skip = (page - 1) * limit;
```

Con Prisma:

```js
prisma.task.findMany({
  skip,
  take: limit
});
```

Conceptualmente:

```text
skip → OFFSET
take → LIMIT
```

---

# 36. Códigos HTTP

Nuestra API debe utilizar códigos HTTP apropiados.

| Código | Significado           |
| ------ | --------------------- |
| 200    | OK                    |
| 201    | Created               |
| 204    | No Content            |
| 400    | Bad Request           |
| 404    | Not Found             |
| 500    | Internal Server Error |

Ejemplo:

```js
res.status(200).json(tasks);
```

Para crear:

```js
res.status(201).json(task);
```

Cuando una Task no existe:

```js
res.status(404).json({
  message: "Task not found"
});
```

---

# 37. Manejo básico de errores

No debemos asumir que todas las operaciones tendrán éxito.

Por ejemplo:

```js
try {
  // operación
} catch (error) {
  res.status(500).json({
    message: "Error retrieving tasks"
  });
}
```

En esta sesión trabajaremos con un manejo básico.

Más adelante estudiaremos estrategias más completas para:

* Validación
* Errores
* Seguridad
* Middleware especializado

---

# 38. Práctica guiada

## Reto 1 — Completar el CRUD

Implementa:

```text
GET    /api/tasks
GET    /api/tasks/:id
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

Todas las operaciones deben utilizar:

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

No coloques directamente las consultas Prisma dentro de las Routes.

---

# 39. Reto 2 — Filtro por estado

Implementa:

```http
GET /api/tasks?status=TODO
```

Debe devolver únicamente las Tasks cuyo estado sea:

```text
TODO
```

También prueba:

```http
GET /api/tasks?status=IN_PROGRESS
```

---

# 40. Reto 3 — Filtro por proyecto

Implementa:

```http
GET /api/tasks?projectId=1
```

La API debe devolver solamente las Tasks pertenecientes al proyecto indicado.

---

# 41. Trabajo autónomo

Si no terminamos toda la implementación durante la sesión, completa posteriormente:

### Obligatorio

* [ ] GET `/api/tasks`
* [ ] GET `/api/tasks/:id`
* [ ] POST `/api/tasks`
* [ ] PUT `/api/tasks/:id`
* [ ] DELETE `/api/tasks/:id`
* [ ] Filtro por `status`
* [ ] Filtro por `projectId`
* [ ] Manejo básico de Task no encontrada
* [ ] Pruebas mediante Postman

### Recomendado

* [ ] Combinar filtros
* [ ] Ordenamiento
* [ ] Paginación
* [ ] Mejorar mensajes de error
* [ ] Documentar endpoints en README

---

# 42. Pruebas en Postman

Debemos crear una colección:

```text
Task Flow API
```

Con las siguientes solicitudes:

```text
GET    /api/tasks
GET    /api/tasks/1
POST   /api/tasks
PUT    /api/tasks/1
DELETE /api/tasks/1

GET    /api/tasks?status=TODO
GET    /api/tasks?projectId=1
GET    /api/tasks?status=TODO&priority=HIGH
GET    /api/tasks?page=1&limit=10
```

Para cada solicitud debemos comprobar:

* Código HTTP
* Estructura de la respuesta
* Datos retornados
* Comportamiento ante errores

---

# 43. Checklist de la sesión

Antes de considerar terminada la sesión verifica:

### PostgreSQL

* [ ] PostgreSQL está ejecutándose.
* [ ] La base de datos `task_flow` existe.
* [ ] DBeaver puede conectarse.

### Prisma

* [ ] Prisma está instalado.
* [ ] `schema.prisma` está configurado.
* [ ] `DATABASE_URL` está configurado.
* [ ] La migración fue ejecutada.
* [ ] El Seed fue ejecutado.
* [ ] Existen datos en PostgreSQL.

### Backend

* [ ] Prisma Client está configurado.
* [ ] Existe la arquitectura por capas.
* [ ] Existe `task.routes.js`.
* [ ] Existe `task.controller.js`.
* [ ] Existe `task.service.js`.
* [ ] Existe `task.repository.js`.

### API

* [ ] GET funciona.
* [ ] POST funciona.
* [ ] PUT funciona.
* [ ] DELETE funciona.
* [ ] Los filtros funcionan.
* [ ] Se utilizan códigos HTTP apropiados.
* [ ] Las pruebas se realizaron desde Postman.

---

# 44. Conceptos que debes poder explicar

Al terminar esta sesión deberías poder responder:

### ¿Qué es Prisma?

Es un ORM que permite trabajar con una base de datos desde nuestra aplicación utilizando JavaScript/TypeScript.

### ¿Qué es una migración?

Es una forma versionada de modificar la estructura de nuestra base de datos.

### ¿Qué es un Seed?

Es un mecanismo para insertar datos iniciales o de prueba.

### ¿Qué es persistencia?

Es la capacidad de conservar los datos en un almacenamiento permanente como PostgreSQL.

### ¿Qué es un Repository?

Es la capa responsable de encapsular el acceso a los datos.

### ¿Qué hace el Service?

Contiene la lógica de negocio de la aplicación.

### ¿Qué hace el Controller?

Recibe la petición HTTP y construye la respuesta.

### ¿Qué hace una Route?

Define el endpoint y conecta la petición con el Controller.

### ¿Qué es un Query Parameter?

Es un parámetro enviado en la URL después de `?`.

Ejemplo:

```text
/api/tasks?status=TODO
```

### ¿Qué es un Path Parameter?

Es un parámetro incluido dentro de la ruta.

Ejemplo:

```text
/api/tasks/10
```

---

# 45. Flujo que debemos recordar

El concepto principal de esta sesión es:

```text
                    TASK FLOW

Cliente
   │
   ▼
Route
   │
   ▼
Controller
   │
   ▼
Service
   │
   ▼
Repository
   │
   ▼
Prisma
   │
   ▼
PostgreSQL
```

Cada componente tiene una responsabilidad.

La separación nos permite construir un backend más organizado, mantenible y fácil de probar.

---

# 46. Conexión con las siguientes sesiones

En las siguientes sesiones iremos agregando nuevas capacidades a nuestro backend.

Por ejemplo:

```text
Express
   ↓
Prisma + PostgreSQL
   ↓
CRUD
   ↓
Validación
   ↓
Autenticación
   ↓
Seguridad
   ↓
Testing
   ↓
Documentación
   ↓
NestJS
```

Por eso es importante que el código desarrollado en esta sesión tenga una estructura clara.

---

# 47. Resultado esperado

Al finalizar esta etapa, **Task Flow** debe contar con un backend capaz de:

```text
✔ Conectarse a PostgreSQL
✔ Utilizar Prisma
✔ Crear y modificar la estructura mediante migraciones
✔ Insertar datos mediante Seed
✔ Consultar datos persistentes
✔ Crear Tasks
✔ Consultar Tasks
✔ Actualizar Tasks
✔ Eliminar Tasks
✔ Filtrar Tasks
✔ Utilizar códigos HTTP
✔ Ser probado mediante Postman
```

Y, sobre todo, debemos comprender el flujo:

```text
HTTP
 ↓
Express
 ↓
Arquitectura por capas
 ↓
Prisma
 ↓
PostgreSQL
```

---

# 48. Actividad final

Antes de finalizar, verifica que puedas realizar desde Postman:

```http
GET /api/tasks
```

y obtener información almacenada realmente en PostgreSQL.

Después crea una nueva Task:

```http
POST /api/tasks
```

con:

```json
{
  "title": "Preparar pruebas de Task Flow",
  "status": "TODO",
  "priority": "MEDIUM",
  "estimatedHours": 3,
  "userId": 1,
  "projectId": 1
}
```

Finalmente vuelve a ejecutar:

```http
GET /api/tasks
```

y comprueba que la nueva Task permanece almacenada.

### Pregunta final

> ¿Qué sucede con nuestra Task si detenemos Node.js y volvemos a iniciar el servidor?

La respuesta debería llevarnos al concepto de **persistencia en PostgreSQL**.
