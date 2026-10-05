# Sesión 4 — Express + Prisma + PostgreSQL + REST API

## Proyecto: Task Flow

> De nuestro modelo de datos a una API funcional.

---

# 1. Portada

## Sesión 4

### Express + Prisma + PostgreSQL + REST API

**Proyecto:** Task Flow

> De nuestro modelo de datos a una API funcional.

---

# 2. ¿Dónde estamos?

## Hasta ahora

```text
Node.js
   ↓
Express
   ↓
PostgreSQL
   ↓
SQL
```

En la sesión anterior aprendimos:

* Tablas
* Registros
* Relaciones
* `SELECT`
* `INSERT`
* `UPDATE`
* `DELETE`
* `JOIN`
* Filtros
* Ordenamiento

### Hoy conectaremos todo esto.

---

# 3. El objetivo de hoy

## De la base de datos a la API

```text
Modelo de datos
      ↓
Prisma
      ↓
PostgreSQL
      ↓
Express
      ↓
REST API
```

### Objetivo

Construir el primer flujo funcional de **Task Flow**.

---

# 4. ¿Qué problema queremos resolver?

## No queremos esto

```text
Crear tablas manualmente
        ↓
Insertar datos manualmente
        ↓
Configurar conexión manualmente
        ↓
Escribir SQL en cada endpoint
```

## Queremos

```text
Proyecto
   ↓
Migraciones
   ↓
Seed
   ↓
API
```

---

# 5. Arquitectura de nuestra solución

```text
              Task Flow API
                    │
                    ▼
                 Express
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
               Prisma ORM
                    │
                    ▼
               PostgreSQL
```

---

# BLOQUE 1 — CONFIGURACIÓN DE POSTGRESQL

# 6. Nuestra base de datos

## PostgreSQL

```text
Host: localhost
Port: 5432
Database: task_flow
User: postgres
```

Nuestra aplicación necesita esta información para conectarse.

---

# 7. Variables de entorno

## `.env`

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/task_flow"

PORT=3000
```

### ¿Por qué?

* Separar configuración del código
* Evitar credenciales en el código
* Facilitar diferentes entornos

---

# 8. ¿Qué es Prisma?

## Prisma

**ORM para Node.js / TypeScript**

Nos permite trabajar con PostgreSQL utilizando JavaScript/TypeScript.

```text
JavaScript / TypeScript
          ↓
        Prisma
          ↓
          SQL
          ↓
      PostgreSQL
```

> Prisma no elimina la necesidad de conocer SQL.

---

# 9. ¿Por qué Prisma?

## Nos ayuda a trabajar con la base de datos

* Modelado
* Consultas
* Relaciones
* Migraciones
* Prisma Client
* Seeds

> Prisma proporciona una abstracción para trabajar con la base de datos.

---

# 10. Instalación

```bash
npm install prisma @prisma/client
```

Inicializar Prisma:

```bash
npx prisma init
```

Resultado:

```text
prisma/
└── schema.prisma

.env
```

---

# 11. Configuración de Prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Conceptos clave

* `generator` → genera Prisma Client
* `datasource` → define nuestra base de datos
* `env()` → obtiene configuración desde `.env`

---

# BLOQUE 2 — MODELO DE DATOS

# 12. Nuestro modelo Task Flow

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

### Entidades

* User
* Project
* Task

---

# 13. Modelo User y Project

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  tasks     Task[]
  createdAt DateTime @default(now())
}
```

```prisma
model Project {
  id        Int      @id @default(autoincrement())
  name      String
  tasks     Task[]
  createdAt DateTime @default(now())
}
```

---

# 14. Modelo Task

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

### Una Task pertenece a:

* Un usuario
* Un proyecto

---

# BLOQUE 3 — MIGRACIONES

# 15. ¿Qué es una migración?

## Migration

Una migración representa un cambio versionado en la estructura de la base de datos.

```text
schema.prisma
      ↓
Migration
      ↓
PostgreSQL
```

Ejemplo:

```text
Crear User
Crear Project
Crear Task
Crear relaciones
```

---

# 16. Crear nuestra primera migración

```bash
npx prisma migrate dev --name init_task_flow
```

Se generará:

```text
prisma/
└── migrations/
    └── ..._init_task_flow/
        └── migration.sql
```

---

# 17. ¿Por qué utilizar migraciones?

## Permiten versionar la base de datos

```text
Migration 1
     ↓
Crear tablas
     ↓
Migration 2
     ↓
Agregar priority
     ↓
Migration 3
     ↓
Agregar estimatedHours
```

### Código + estructura de BD evolucionan juntos.

---

# BLOQUE 4 — SEEDS

# 18. ¿Qué es un Seed?

## Seed

Un seed permite insertar datos iniciales o de prueba.

```text
Migration
   ↓
ESTRUCTURA

Seed
   ↓
DATOS
```

---

# 19. Task Flow Seed

## Users

```text
Juan
Maria
Pedro
Ana
Luis
```

## Projects

```text
Backend API
QA Platform
Mobile App
```

## Tasks

```text
Implementar endpoint
Diseñar modelo
Crear pruebas
...
```

---

# 20. Ejecutar el Seed

```bash
npx prisma db seed
```

Ahora tenemos:

```text
PostgreSQL
     │
     ├── Users
     ├── Projects
     └── Tasks
```

Nuestra aplicación ya tiene datos con los cuales trabajar.

---

# 21. Migration vs Seed

| Migration         | Seed            |
| ----------------- | --------------- |
| Define estructura | Inserta datos   |
| Tablas            | Usuarios        |
| Columnas          | Proyectos       |
| Relaciones        | Tareas          |
| Índices           | Datos de prueba |
| Restricciones     | Datos iniciales |

```text
Migration → ¿Cómo es la base de datos?

Seed → ¿Qué datos iniciales tiene?
```

---

# BLOQUE 5 — CONEXIÓN BACKEND → POSTGRESQL

# 22. Configuración de Prisma Client

```text
src/
└── config/
    └── prisma.js
```

```js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
```

```text
Express
   ↓
Prisma Client
   ↓
PostgreSQL
```

---

# 23. Pool de conexiones

## ¿Por qué necesitamos un pool?

No queremos crear una conexión nueva para cada solicitud:

```text
Request
   ↓
Crear conexión
   ↓
Consultar BD
   ↓
Cerrar conexión
```

En cambio:

```text
              PostgreSQL
                  ▲
                  │
          ┌───────┴───────┐
          │ Connection Pool│
          ├───────────────┤
          │ Connection 1  │
          │ Connection 2  │
          │ Connection 3  │
          │ Connection 4  │
          └───────┬───────┘
                  ▲
                  │
                Prisma
                  ▲
                  │
                Express
```

> Prisma administra este mecanismo por nosotros.

---

# 24. Flujo completo de conexión

```text
.env
 │
 │ DATABASE_URL
 ▼
Prisma
 │
 │ Prisma Client
 ▼
PostgreSQL
 │
 └── task_flow
```

### La aplicación utiliza Prisma para comunicarse con PostgreSQL.

---

# BLOQUE 6 — ARQUITECTURA POR CAPAS

# 25. ¿Por qué separar responsabilidades?

## Evitamos esto

```text
Route
  +
HTTP
  +
Lógica
  +
SQL
```

Todo dentro de un archivo.

### Buscamos

```text
Una responsabilidad
        ↓
Una capa
```

---

# 26. Arquitectura por capas

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

# 27. Responsabilidad de cada capa

| Capa       | Responsabilidad            |
| ---------- | -------------------------- |
| Route      | Define el endpoint         |
| Controller | Maneja HTTP                |
| Service    | Contiene lógica de negocio |
| Repository | Accede a los datos         |
| Prisma     | Abstrae el acceso a la BD  |
| PostgreSQL | Persiste los datos         |

---

# 28. Estructura del proyecto

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

---

# BLOQUE 7 — API REST

# 29. Nuestra API de Tasks

| Método | Endpoint         | Acción     |
| ------ | ---------------- | ---------- |
| GET    | `/api/tasks`     | Listar     |
| GET    | `/api/tasks/:id` | Obtener    |
| POST   | `/api/tasks`     | Crear      |
| PUT    | `/api/tasks/:id` | Actualizar |
| DELETE | `/api/tasks/:id` | Eliminar   |

---

# 30. Primer endpoint

## `GET /api/tasks`

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

### Primera meta de la clase

**Conseguir que este flujo funcione.**

---

# 31. Route

```js
router.get("/tasks", getTasks);
```

La Route responde a:

```http
GET /api/tasks
```

### Responsabilidad

Definir el endpoint.

> La Route no debería consultar directamente la base de datos.

---

# 32. Controller

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

### Responsabilidad

* Recibir la solicitud
* Llamar al Service
* Construir la respuesta HTTP

---

# 33. Service

```js
export async function getTasks() {

  return await taskRepository.findAll();

}
```

### Responsabilidad

**Lógica de negocio**

El Service no debería preocuparse por:

* `req`
* `res`
* rutas
* detalles HTTP

---

# 34. Repository

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

### Responsabilidad

**Acceso a los datos**

---

# 35. El flujo completo

```text
GET /api/tasks
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

### Una solicitud atraviesa todas las capas.

---

# BLOQUE 8 — CRUD PERSISTENTE

# 36. Create

```http
POST /api/tasks
```

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

```text
Request
   ↓
Prisma
   ↓
INSERT
   ↓
PostgreSQL
```

---

# 37. Read

```http
GET /api/tasks
```

```http
GET /api/tasks/1
```

```text
API
 ↓
Prisma
 ↓
SELECT
 ↓
PostgreSQL
```

---

# 38. Update

```http
PUT /api/tasks/1
```

```json
{
  "status": "IN_PROGRESS",
  "priority": "HIGH"
}
```

```text
API
 ↓
Prisma
 ↓
UPDATE
 ↓
PostgreSQL
```

---

# 39. Delete

```http
DELETE /api/tasks/1
```

```text
API
 ↓
Prisma
 ↓
DELETE
 ↓
PostgreSQL
```

---

# 40. CRUD persistente

## ¿Qué significa persistente?

Si creamos:

```text
Task #11
```

la información queda almacenada en:

```text
PostgreSQL
```

Posteriormente podemos recuperarla:

```http
GET /api/tasks/11
```

### La información no vive solamente en la memoria de Node.js.

---

# BLOQUE 9 — FILTROS, ORDENAMIENTO Y PAGINACIÓN

# 41. Filtrar Tasks

## Query Parameters

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

Esto conecta directamente con:

```text
SQL → WHERE
```

---

# 42. Combinar filtros

```http
GET /api/tasks?status=TODO&priority=HIGH
```

También podemos combinar:

```http
GET /api/tasks?status=TODO&projectId=1
```

### Los filtros permiten consultar solamente la información necesaria.

---

# 43. Ordenamiento

```http
GET /api/tasks?sort=createdAt&order=desc
```

Conceptualmente:

```text
Query Parameter
       ↓
Prisma
       ↓
ORDER BY
       ↓
PostgreSQL
```

---

# 44. Paginación

## Evitar devolver todos los registros

```http
GET /api/tasks?page=1&limit=10
```

Prisma:

```js
const skip = (page - 1) * limit;

prisma.task.findMany({
  skip,
  take: limit
});
```

```text
skip → OFFSET
take → LIMIT
```

---

# BLOQUE 10 — MANEJO BÁSICO DE ERRORES

# 45. ¿Qué pasa cuando algo falla?

Nuestra API debe informar correctamente el resultado.

```text
400 → Bad Request
404 → Not Found
500 → Internal Server Error
```

---

# 46. Task no encontrada

```js
if (!task) {

  return res.status(404).json({
    message: "Task not found"
  });

}
```

### El cliente recibe información clara sobre el problema.

---

# 47. Error del servidor

```js
try {

  // operación

} catch (error) {

  res.status(500).json({
    message: "Internal server error"
  });

}
```

### Por ahora

Usaremos manejo básico con `try/catch`.

> Más adelante veremos un middleware global de errores.

---

# BLOQUE 11 — PRÁCTICA

# 48. Reto: Task Flow

## Completar la API

Implementar:

```text
GET    /api/tasks/:id
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

---

# 49. Segundo reto

## Agregar filtros

Implementar:

```http
GET /api/tasks?status=TODO
```

Y opcionalmente:

```http
GET /api/tasks?projectId=1
```

### Debe respetar:

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

# 50. Objetivo del trabajo autónomo

Completar:

* CRUD de Tasks
* Filtros
* Ordenamiento
* Paginación
* Manejo básico de errores
* Pruebas con Postman

### No es necesario terminar todo durante la clase.

---

# BLOQUE 12 — CIERRE

# 51. ¿Qué aprendimos?

Hoy aprendimos a:

* Configurar PostgreSQL
* Configurar Prisma
* Conectar Backend → PostgreSQL
* Comprender el pool de conexiones
* Crear modelos
* Utilizar migraciones
* Crear seeds
* Organizar el backend por capas
* Implementar una API REST
* Persistir información
* Filtrar y paginar
* Manejar errores básicos

---

# 52. El flujo que debemos recordar

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

### Este flujo será la base de nuestro backend Task Flow.

---

# 53. Conexión con las siguientes sesiones

```text
Sesión 3
Base de datos
     ↓
Sesión 4
API + Prisma
     ↓
Sesión 5
Validación / Seguridad
     ↓
Sesión 6
Autenticación
     ↓
Sesiones posteriores
Testing + Documentación + NestJS
```

### Seguimos construyendo sobre el mismo proyecto.

---

# 54. Cierre

# Task Flow ya no es solamente un modelo de datos.

Ahora tenemos:

```text
Base de datos
      +
Backend
      +
API REST
```

### Próximo paso

**Agregar reglas, seguridad y capacidades reales a nuestra API.**
