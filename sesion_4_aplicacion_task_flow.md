# Sesión 4 --- TaskFlow después de integrar Express, PostgreSQL y Prisma

Esta guía muestra cómo queda el proyecto **TaskFlow** al terminar la
Sesión 4. El objetivo es construir una API REST con Express que guarde
los proyectos en PostgreSQL mediante Prisma y migraciones.

> **Alcance de la sesión:** CRUD de proyectos, persistencia en
> PostgreSQL, separación por capas, filtros, ordenamiento, paginación y
> manejo básico de errores. La autenticación y la validación con Zod
> corresponden a la Sesión 5.

## 1. ¿Qué cambia en la aplicación?

Antes, las rutas podían responder con datos de ejemplo o lógica
concentrada en un solo archivo. Después de esta sesión:

-   Express recibe las solicitudes HTTP.
-   Las rutas dirigen cada solicitud al controlador correspondiente.
-   El controlador interpreta la solicitud y prepara la respuesta.
-   La capa de acceso a datos consulta o modifica la base de datos
    usando Prisma.
-   PostgreSQL conserva los datos aunque se reinicie el servidor.
-   Prisma Migrate mantiene la estructura de la base de datos
    versionada.

Flujo de una solicitud:

``` text
Cliente (Postman / frontend)
          |
          | HTTP: GET, POST, PATCH, DELETE
          v
       Express
          |
          v
        Routes
          |
          v
      Controller
          |
          v
   Data Access (Prisma)
          |
          v
      PostgreSQL
```

## 2. Estructura final del proyecto

``` text
taskflow/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── config/
│   │   └── prisma.js
│   ├── controllers/
│   │   └── project.controller.js
│   ├── repositories/
│   │   └── project.repository.js
│   ├── routes/
│   │   └── project.routes.js
│   ├── app.js
│   └── server.js
├── .env
├── .env.example
├── .gitignore
└── package.json
```

**Responsabilidad de cada archivo**

  ------------------------------------------------------------------------------
  Archivo                                    Responsabilidad
  ------------------------------------------ -----------------------------------
  `src/server.js`                            Inicia el servidor HTTP.

  `src/app.js`                               Configura Express y registra las
                                             rutas.

  `src/routes/project.routes.js`             Define los endpoints de proyectos.

  `src/controllers/project.controller.js`    Lee parámetros, llama al
                                             repositorio y responde con HTTP.

  `src/repositories/project.repository.js`   Ejecuta operaciones de datos usando
                                             Prisma.

  `src/config/prisma.js`                     Crea una instancia compartida de
                                             Prisma Client.

  `prisma/schema.prisma`                     Define el modelo y la conexión
                                             lógica de Prisma.

  `.env`                                     Guarda la configuración local de
                                             conexión.
  ------------------------------------------------------------------------------

## 3. Preparar el proyecto

Desde la carpeta `taskflow`, inicializa npm si aún no existe
`package.json`:

``` bash
npm init -y
npm pkg set type="module"
npm install express dotenv @prisma/client
npm install -D prisma
```

Usaremos módulos ES (`import` / `export`) en todos los archivos.

### `package.json`

Puedes dejar que npm agregue las dependencias con los comandos
anteriores y asegurarte de que exista la configuración equivalente a
esta:

``` json
{
  "name": "taskflow",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "node --watch src/server.js",
    "start": "node src/server.js",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio"
  },
  "dependencies": {
    "@prisma/client": "^6.0.0",
    "dotenv": "^16.0.0",
    "express": "^4.21.0"
  },
  "devDependencies": {
    "prisma": "^6.0.0"
  }
}
```

Si npm ya instaló versiones más recientes compatibles, conserva las
versiones que figuran en tu `package.json`; no es necesario
reemplazarlas manualmente.

## 4. Configurar PostgreSQL

Asegúrate de que PostgreSQL esté iniciado y de conocer el nombre de la
base de datos, el usuario, la contraseña, el host y el puerto. Si estás
usando Docker de la sesión anterior, utiliza el puerto publicado por tu
contenedor.

### `.env.example`

``` dotenv
PORT=3000
DATABASE_URL="postgresql://postgres:tu_password@localhost:5432/taskflow_db?schema=public"
```

Copia este archivo como `.env` y reemplaza `tu_password` con la
contraseña real de tu entorno.

Ejemplo en terminal:

``` bash
cp .env.example .env
```

En Windows puedes copiar el archivo manualmente si `cp` no está
disponible en tu terminal.

**Importante:** no subas `.env` a Git ni escribas contraseñas reales en
el repositorio.

### `.gitignore`

``` gitignore
node_modules/
.env
```

## 5. Definir el modelo de datos con Prisma

Inicializa Prisma si todavía no existe la carpeta `prisma`:

``` bash
npx prisma init
```

Reemplaza el contenido de `prisma/schema.prisma` por:

``` prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Project {
  id          Int      @id @default(autoincrement())
  name        String   @db.VarChar(150)
  description String?
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("projects")
}
```

### ¿Qué significa el modelo?

-   `id`: identificador único autoincremental.
-   `name`: nombre obligatorio, de hasta 150 caracteres.
-   `description`: descripción opcional.
-   `createdAt`: fecha de creación automática.
-   `updatedAt`: fecha que Prisma actualiza al modificar el registro.
-   `@@map("projects")`: la tabla en PostgreSQL se llamará `projects`,
    aunque el modelo de Prisma se llame `Project`.

## 6. Crear la tabla mediante una migración

Ejecuta:

``` bash
npx prisma migrate dev --name create_projects
```

Este comando crea una migración y aplica los cambios a la base de datos
de desarrollo. Luego genera el cliente de Prisma, si corresponde.

Para abrir una interfaz de consulta de los datos:

``` bash
npx prisma studio
```

No necesitas crear la tabla manualmente si la migración se ejecutó
correctamente.

## 7. Crear el cliente compartido de Prisma

### `src/config/prisma.js`

``` javascript
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
```

Este módulo exporta una instancia que reutilizarán los repositorios. Así
evitamos crear una instancia nueva para cada solicitud HTTP.

## 8. Crear la capa de acceso a datos

### `src/repositories/project.repository.js`

``` javascript
import { prisma } from "../config/prisma.js";

export const projectRepository = {
  findMany({ search, sortBy, order, skip, take }) {
    return prisma.project.findMany({
      where: search
        ? {
            name: {
              contains: search,
              mode: "insensitive",
            },
          }
        : undefined,
      orderBy: {
        [sortBy]: order,
      },
      skip,
      take,
    });
  },

  count({ search }) {
    return prisma.project.count({
      where: search
        ? {
            name: {
              contains: search,
              mode: "insensitive",
            },
          }
        : undefined,
    });
  },

  findById(id) {
    return prisma.project.findUnique({
      where: { id },
    });
  },

  create(data) {
    return prisma.project.create({
      data,
    });
  },

  update(id, data) {
    return prisma.project.update({
      where: { id },
      data,
    });
  },

  delete(id) {
    return prisma.project.delete({
      where: { id },
    });
  },
};
```

El repositorio conoce Prisma y las consultas, pero no conoce los objetos
`req` y `res` de Express. Esta separación facilita mantener y probar el
código.

## 9. Crear el controlador

### `src/controllers/project.controller.js`

``` javascript
import { Prisma } from "@prisma/client";
import { projectRepository } from "../repositories/project.repository.js";

function parseProjectId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function isPrismaNotFound(error) {
  return error instanceof Prisma.PrismaClientKnownRequestError
    && error.code === "P2025";
}

export const projectController = {
  async list(req, res, next) {
    try {
      const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
      const limit = Math.min(
        Math.max(Number.parseInt(req.query.limit, 10) || 10, 1),
        100
      );

      const allowedSortFields = ["name", "createdAt", "updatedAt"];
      const requestedSort = req.query.sortBy;
      const sortBy = allowedSortFields.includes(requestedSort)
        ? requestedSort
        : "createdAt";

      const order = req.query.order === "asc" ? "asc" : "desc";
      const search = typeof req.query.search === "string"
        ? req.query.search.trim()
        : "";

      const query = {
        search,
        sortBy,
        order,
        skip: (page - 1) * limit,
        take: limit,
      };

      const [projects, total] = await Promise.all([
        projectRepository.findMany(query),
        projectRepository.count({ search }),
      ]);

      return res.status(200).json({
        data: projects,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const id = parseProjectId(req.params.id);

      if (!id) {
        return res.status(400).json({
          error: "El ID debe ser un número entero positivo.",
        });
      }

      const project = await projectRepository.findById(id);

      if (!project) {
        return res.status(404).json({
          error: "No se encontró el proyecto.",
        });
      }

      return res.status(200).json({ data: project });
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const { name, description } = req.body ?? {};

      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
          error: "El campo name es obligatorio.",
        });
      }

      if (name.trim().length > 150) {
        return res.status(400).json({
          error: "El campo name no puede superar los 150 caracteres.",
        });
      }

      if (
        description !== undefined
        && description !== null
        && typeof description !== "string"
      ) {
        return res.status(400).json({
          error: "El campo description debe ser texto.",
        });
      }

      const project = await projectRepository.create({
        name: name.trim(),
        description: typeof description === "string"
          ? description.trim() || null
          : null,
      });

      return res.status(201).json({ data: project });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const id = parseProjectId(req.params.id);

      if (!id) {
        return res.status(400).json({
          error: "El ID debe ser un número entero positivo.",
        });
      }

      const { name, description } = req.body ?? {};
      const data = {};

      if (name !== undefined) {
        if (typeof name !== "string" || !name.trim()) {
          return res.status(400).json({
            error: "Si se envía name, debe ser un texto no vacío.",
          });
        }

        if (name.trim().length > 150) {
          return res.status(400).json({
            error: "El campo name no puede superar los 150 caracteres.",
          });
        }

        data.name = name.trim();
      }

      if (description !== undefined) {
        if (description !== null && typeof description !== "string") {
          return res.status(400).json({
            error: "El campo description debe ser texto o null.",
          });
        }

        data.description = typeof description === "string"
          ? description.trim() || null
          : null;
      }

      if (Object.keys(data).length === 0) {
        return res.status(400).json({
          error: "Envía al menos un campo para actualizar.",
        });
      }

      const project = await projectRepository.update(id, data);
      return res.status(200).json({ data: project });
    } catch (error) {
      if (isPrismaNotFound(error)) {
        return res.status(404).json({
          error: "No se encontró el proyecto.",
        });
      }

      next(error);
    }
  },

  async remove(req, res, next) {
    try {
      const id = parseProjectId(req.params.id);

      if (!id) {
        return res.status(400).json({
          error: "El ID debe ser un número entero positivo.",
        });
      }

      await projectRepository.delete(id);

      return res.status(204).send();
    } catch (error) {
      if (isPrismaNotFound(error)) {
        return res.status(404).json({
          error: "No se encontró el proyecto.",
        });
      }

      next(error);
    }
  },
};
```

**Nota didáctica:** las comprobaciones incluidas son validaciones
básicas para que la API no acepte datos evidentemente incorrectos. En la
Sesión 5 se centralizará la validación de entradas usando Zod y
middlewares.

## 10. Definir las rutas REST

### `src/routes/project.routes.js`

``` javascript
import { Router } from "express";
import { projectController } from "../controllers/project.controller.js";

const router = Router();

router.get("/", projectController.list);
router.get("/:id", projectController.getById);
router.post("/", projectController.create);
router.patch("/:id", projectController.update);
router.delete("/:id", projectController.remove);

export default router;
```

Las rutas solo asocian un método y una URL con la función del
controlador. No contienen consultas SQL ni lógica de persistencia.

## 11. Configurar Express

### `src/app.js`

``` javascript
import express from "express";
import projectRoutes from "./routes/project.routes.js";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/projects", projectRoutes);

// Ruta para endpoints que no existen.
app.use((_req, res) => {
  res.status(404).json({
    error: "Endpoint no encontrado.",
  });
});

// Middleware general de errores: debe estar después de las rutas.
app.use((error, _req, res, _next) => {
  console.error(error);

  res.status(500).json({
    error: "Ocurrió un error interno del servidor.",
  });
});

export default app;
```

El middleware de errores evita devolver detalles internos al cliente.
Durante el desarrollo, el error completo se registra en la consola para
ayudar a investigarlo.

## 12. Iniciar el servidor

### `src/server.js`

``` javascript
import "dotenv/config";
import app from "./app.js";
import { prisma } from "./config/prisma.js";

const PORT = Number(process.env.PORT) || 3000;

const server = app.listen(PORT, () => {
  console.log(`TaskFlow API disponible en http://localhost:${PORT}`);
});

async function shutdown() {
  console.log("Cerrando servidor...");
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
```

## 13. Ejecutar la aplicación

Primero, verifica que PostgreSQL esté iniciado y que `.env` tenga una
`DATABASE_URL` correcta. Después ejecuta las migraciones y levanta la
API:

``` bash
npx prisma migrate dev
npm run dev
```

Prueba la ruta de salud en el navegador o en Postman:

``` http
GET http://localhost:3000/health
```

Respuesta esperada:

``` json
{
  "status": "ok"
}
```

## 14. Endpoints disponibles

Base URL: `http://localhost:3000/api/projects`

  ----------------------------------------------------------------------------
  Método            Endpoint              Función           Respuesta habitual
  ----------------- --------------------- ----------------- ------------------
  `GET`             `/api/projects`       Listar proyectos  `200 OK`

  `GET`             `/api/projects/:id`   Consultar un      `200 OK` o
                                          proyecto          `404 Not Found`

  `POST`            `/api/projects`       Crear un proyecto `201 Created`

  `PATCH`           `/api/projects/:id`   Actualizar campos `200 OK`
                                          de un proyecto    

  `DELETE`          `/api/projects/:id`   Eliminar un       `204 No Content`
                                          proyecto          
  ----------------------------------------------------------------------------

### Crear un proyecto

Solicitud:

``` http
POST http://localhost:3000/api/projects
Content-Type: application/json
```

Body:

``` json
{
  "name": "Proyecto de prueba",
  "description": "Proyecto creado desde Postman"
}
```

Respuesta de ejemplo (`201 Created`):

``` json
{
  "data": {
    "id": 1,
    "name": "Proyecto de prueba",
    "description": "Proyecto creado desde Postman",
    "createdAt": "2026-10-08T14:00:00.000Z",
    "updatedAt": "2026-10-08T14:00:00.000Z"
  }
}
```

Las fechas e identificadores reales dependerán de los datos creados en
tu base de datos.

### Listar y paginar

``` http
GET http://localhost:3000/api/projects?page=1&limit=10
```

Ejemplo de respuesta:

``` json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0
  }
}
```

### Buscar y ordenar

``` http
GET http://localhost:3000/api/projects?search=prueba&sortBy=name&order=asc
```

-   `search`: busca coincidencias en el nombre.
-   `sortBy`: admite `name`, `createdAt` o `updatedAt`.
-   `order`: admite `asc` o `desc`.
-   `page`: página solicitada, comienza en 1.
-   `limit`: registros por página; el máximo es 100.

### Consultar un proyecto

``` http
GET http://localhost:3000/api/projects/1
```

### Actualizar un proyecto

``` http
PATCH http://localhost:3000/api/projects/1
Content-Type: application/json
```

Body:

``` json
{
  "name": "Proyecto actualizado"
}
```

### Eliminar un proyecto

``` http
DELETE http://localhost:3000/api/projects/1
```

Si se elimina correctamente, la API responde con `204 No Content` y no
devuelve un cuerpo.

## 15. Códigos HTTP principales

  Código                        Uso en esta API
  ----------------------------- ----------------------------------------------
  `200 OK`                      Consulta o actualización exitosa.
  `201 Created`                 Se creó un proyecto.
  `204 No Content`              Se eliminó un proyecto.
  `400 Bad Request`             ID o datos de entrada incorrectos.
  `404 Not Found`               No existe el proyecto o endpoint solicitado.
  `500 Internal Server Error`   Error inesperado del servidor.

## 16. ¿Qué significa el pool de conexiones?

Abrir una conexión nueva a PostgreSQL para cada consulta puede ser
costoso. Un **pool de conexiones** permite reutilizar conexiones
abiertas y limita cuántas se usan simultáneamente.

En este proyecto Prisma administra las conexiones mediante su
motor/adapter según la configuración y versión utilizada. Para esta
sesión basta con entender el propósito: reutilizar conexiones y evitar
crear manualmente una conexión por cada petición. La configuración
avanzada del pool depende de la versión y del entorno de despliegue.

## 17. Lista de verificación de la sesión

-   [ ] PostgreSQL está iniciado y la conexión de `.env` funciona.
-   [ ] La migración `create_projects` se aplicó correctamente.
-   [ ] `GET /health` devuelve `200`.
-   [ ] `POST /api/projects` crea un registro.
-   [ ] `GET /api/projects` muestra los registros persistidos.
-   [ ] La búsqueda, ordenación y paginación funcionan.
-   [ ] `GET /api/projects/99999` devuelve `404` si ese ID no existe.
-   [ ] `PATCH` modifica un registro existente.
-   [ ] `DELETE` elimina el registro.
-   [ ] Los datos continúan en PostgreSQL al reiniciar el servidor.

## 18. Qué queda para la Sesión 5

En esta sesión todavía no implementamos autenticación. En la siguiente
sesión se puede ampliar la aplicación con:

-   Validación centralizada usando Zod y middlewares.
-   Autenticación JWT y lectura de `Authorization: Bearer ...`.
-   Hash de contraseñas.
-   Variables de entorno para secretos.
-   CORS, Helmet y limitación de solicitudes.
-   Tratamiento más específico de errores y seguridad de entradas.

**Resultado final:** TaskFlow cuenta con una API REST de proyectos
organizada por capas y conectada a PostgreSQL mediante Prisma. La base
de datos conserva la información y las operaciones pueden probarse desde
Postman.
