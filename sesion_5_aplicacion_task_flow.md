# TaskFlow API — Estado del proyecto después de la Sesión 5

## 1. Descripción del proyecto

**TaskFlow API** es una API REST desarrollada con Node.js y Express que permite gestionar usuarios y proyectos mediante una base de datos PostgreSQL.

Después de la Sesión 5, el sistema incorpora autenticación con JWT, validación de datos con Zod y medidas básicas de seguridad.

### Tecnologías utilizadas

| Tecnología         | Propósito                                       |
| ------------------ | ----------------------------------------------- |
| Node.js            | Entorno de ejecución de JavaScript              |
| Express            | Servidor HTTP y definición de rutas             |
| PostgreSQL         | Base de datos relacional                        |
| Prisma ORM         | Acceso a datos, consultas y migraciones         |
| Zod                | Validación de los datos recibidos               |
| bcryptjs           | Hash de contraseñas                             |
| jsonwebtoken       | Generación y verificación de JWT                |
| Helmet             | Cabeceras HTTP de seguridad                     |
| CORS               | Control de solicitudes entre distintos orígenes |
| express-rate-limit | Limitación de solicitudes                       |
| Postman            | Pruebas de la API                               |

## 2. Funcionalidades implementadas

Al terminar la Sesión 5, el proyecto debe contemplar las siguientes funcionalidades:

* Conexión con PostgreSQL mediante Prisma.
* Registro de usuarios.
* Inicio de sesión.
* Almacenamiento de contraseñas mediante hash.
* Generación y validación de tokens JWT.
* Protección de rutas mediante middleware de autenticación.
* Creación, consulta, actualización y eliminación de proyectos.
* Validación de los datos de entrada con Zod.
* Manejo centralizado de errores.
* Configuración de variables de entorno.
* Medidas básicas de seguridad para el servidor.

**Regla principal:** cada usuario autenticado solo puede consultar y modificar sus propios proyectos.

---

## 3. Estructura de carpetas

La estructura propuesta para el proyecto es la siguiente:

```text
taskflow-api/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── config/
│   │   └── prisma.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── project.controller.js
│   ├── middlewares/
│   │   ├── authenticate.js
│   │   ├── errorHandler.js
│   │   └── validate.js
│   ├── repositories/
│   │   ├── user.repository.js
│   │   └── project.repository.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── project.routes.js
│   ├── schemas/
│   │   ├── auth.schema.js
│   │   └── project.schema.js
│   ├── services/
│   │   ├── auth.service.js
│   │   └── project.service.js
│   ├── app.js
│   └── server.js
├── .env
├── .env.example
├── .gitignore
└── package.json
```

### Responsabilidad de cada capa

| Capa         | Responsabilidad                                          |
| ------------ | -------------------------------------------------------- |
| Routes       | Define los endpoints y el orden de los middlewares       |
| Middlewares  | Valida solicitudes, verifica tokens y procesa errores    |
| Schemas      | Define las reglas de validación con Zod                  |
| Controllers  | Recibe la solicitud y construye la respuesta HTTP        |
| Services     | Implementa las reglas del negocio                        |
| Repositories | Ejecuta las operaciones de acceso a datos con Prisma     |
| Config       | Centraliza la configuración del cliente Prisma           |
| Prisma       | Define los modelos y las migraciones de la base de datos |

El flujo general es:

```text
Cliente / Postman
        |
        v
      Routes
        |
        v
    Middlewares
        |
        v
    Controllers
        |
        v
      Services
        |
        v
    Repositories
        |
        v
      Prisma ORM
        |
        v
    PostgreSQL
```

No todas las rutas necesitan todos los middlewares. Por ejemplo, el registro no requiere autenticación, mientras que las operaciones privadas sobre proyectos sí.

---

## 4. Configuración del proyecto

### 4.1. package.json

Se utiliza JavaScript con módulos ES, por lo que el proyecto debe tener `"type": "module"`.

```json
{
  "name": "taskflow-api",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js",
    "db:migrate": "prisma migrate dev",
    "db:generate": "prisma generate"
  },
  "dependencies": {
    "@prisma/client": "^6.0.0",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "express-rate-limit": "^7.5.0",
    "helmet": "^8.0.0",
    "jsonwebtoken": "^9.0.2",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.7",
    "prisma": "^6.0.0"
  }
}
```

> Las versiones son orientativas para mantener el ejemplo compatible con Prisma 6 y Express 4. Si el proyecto ya tiene dependencias instaladas, se debe conservar el `package.json` existente y agregar únicamente los paquetes que falten.

Instalación de los paquetes:

```bash
npm install express @prisma/client prisma dotenv zod bcryptjs jsonwebtoken cors helmet express-rate-limit
npm install -D nodemon
```

### 4.2. Variables de entorno

Archivo `.env`:

```env
PORT=3000
DATABASE_URL="postgresql://postgres:tu_clave@localhost:5432/taskflow_db?schema=public"
JWT_SECRET="reemplazar_por_un_secreto_largo_y_aleatorio"
JWT_EXPIRES_IN="1h"
CORS_ORIGIN="http://localhost:5173"
```

Reemplazar las credenciales de PostgreSQL por las correspondientes al entorno local.

El valor de `JWT_SECRET` debe ser secreto, aleatorio y distinto en cada entorno. No se debe subir el archivo `.env` al repositorio.

Archivo `.env.example`:

```env
PORT=3000
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=1h
CORS_ORIGIN=http://localhost:5173
```

Archivo `.gitignore`:

```gitignore
node_modules/
.env
coverage/
```

### 4.3. Cliente Prisma

Archivo `src/config/prisma.js`:

```javascript
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
```

Este archivo centraliza la instancia del cliente que utilizarán los repositorios.

---

## 5. Modelo de datos y migraciones

Archivo `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           Int       @id @default(autoincrement())
  name         String    @db.VarChar(100)
  email        String    @unique @db.VarChar(150)
  passwordHash String    @map("password_hash") @db.VarChar(255)
  projects     Project[]
  createdAt    DateTime  @default(now()) @map("created_at")

  @@map("users")
}

model Project {
  id          Int      @id @default(autoincrement())
  name        String   @db.VarChar(150)
  description String?  @db.Text
  ownerId     Int      @map("owner_id")
  owner       User     @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@index([ownerId])
  @@map("projects")
}
```

### ¿Qué representa este modelo?

* `User` representa a los usuarios registrados.
* `Project` representa los proyectos creados por los usuarios.
* `passwordHash` almacena el hash de la contraseña, nunca la contraseña original.
* `ownerId` relaciona cada proyecto con su propietario.
* `@unique` impide registrar dos usuarios con el mismo correo electrónico.
* `onDelete: Cascade` elimina los proyectos asociados cuando se elimina un usuario.
* `createdAt` y `updatedAt` permiten conocer las fechas de creación y actualización.

La relación entre las tablas es de uno a muchos: un usuario puede tener varios proyectos, pero cada proyecto pertenece a un usuario.

### Ejecutar la migración

Si estos modelos se incorporan por primera vez:

```bash
npx prisma migrate dev --name add_auth_and_projects
```

Después, para abrir la interfaz de inspección de datos:

```bash
npx prisma studio
```

Si el proyecto ya tiene migraciones, se debe crear una nueva migración que refleje los cambios del esquema, en lugar de reemplazar las migraciones anteriores.

---

## 6. Validación con Zod

La validación se realiza antes de ejecutar la lógica de negocio. De esta manera, los datos incorrectos se rechazan sin llegar a la base de datos.

### 6.1. Esquemas de autenticación

Archivo `src/schemas/auth.schema.js`:

```javascript
import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(150),
  password: z.string().min(8).max(72)
});

export const loginSchema = z.object({
  email: z.string().trim().email().max(150),
  password: z.string().min(1).max(72)
});
```

La contraseña tiene un máximo de 72 bytes como límite práctico para este ejemplo con bcrypt. Si se necesitan admitir contraseñas Unicode largas, debe definirse y documentarse una política de longitud compatible con el algoritmo utilizado.

### 6.2. Esquemas de proyectos

Archivo `src/schemas/project.schema.js`:

```javascript
import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().trim().min(3).max(150),
  description: z.string().trim().max(2000).optional()
});

export const updateProjectSchema = z.object({
  name: z.string().trim().min(3).max(150).optional(),
  description: z.string().trim().max(2000).nullable().optional()
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: "Debe enviar al menos un campo para actualizar" }
);
```

El cliente no puede elegir el propietario mediante el cuerpo de la solicitud. El propietario se obtiene del usuario autenticado.

### 6.3. Middleware de validación

Archivo `src/middlewares/validate.js`:

```javascript
export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Los datos enviados no son válidos",
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message
        }))
      });
    }

    req.validatedBody = result.data;
    next();
  };
}
```

Este middleware recibe un esquema de Zod, valida el cuerpo de la solicitud y entrega los datos validados a la siguiente etapa.

---

## 7. Acceso a datos: repositorios

### 7.1. Repositorio de usuarios

Archivo `src/repositories/user.repository.js`:

```javascript
import { prisma } from "../config/prisma.js";

export const userRepository = {
  findByEmail(email) {
    return prisma.user.findUnique({
      where: { email }
    });
  },

  create(data) {
    return prisma.user.create({
      data
    });
  }
};
```

### 7.2. Repositorio de proyectos

Archivo `src/repositories/project.repository.js`:

```javascript
import { prisma } from "../config/prisma.js";

export const projectRepository = {
  findAll(ownerId) {
    return prisma.project.findMany({
      where: { ownerId },
      orderBy: { createdAt: "desc" }
    });
  },

  findById(id, ownerId) {
    return prisma.project.findFirst({
      where: { id, ownerId }
    });
  },

  create(data) {
    return prisma.project.create({
      data
    });
  },

  update(id, ownerId, data) {
    return prisma.project.updateMany({
      where: { id, ownerId },
      data
    });
  },

  delete(id, ownerId) {
    return prisma.project.deleteMany({
      where: { id, ownerId }
    });
  }
};
```

El filtro `ownerId` evita que un usuario acceda a proyectos pertenecientes a otro. Para actualizar o eliminar se utiliza el resultado de `updateMany` o `deleteMany` para comprobar si hubo alguna fila afectada.

---

## 8. Lógica de negocio: autenticación

Archivo `src/services/auth.service.js`:

```javascript
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/user.repository.js";

export const authService = {
  async register(data) {
    const email = data.email.toLowerCase();

    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
      const error = new Error("El correo electrónico ya está registrado");
      error.status = 409;
      throw error;
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const user = await userRepository.create({
      name: data.name,
      email,
      passwordHash
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email
    };
  },

  async login(data) {
    const email = data.email.toLowerCase();
    const user = await userRepository.findByEmail(email);

    const validPassword = user
      ? await bcrypt.compare(data.password, user.passwordHash)
      : false;

    if (!validPassword) {
      const error = new Error("Credenciales incorrectas");
      error.status = 401;
      throw error;
    }

    const token = jwt.sign(
      { sub: String(user.id) },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    };
  }
};
```

### ¿Qué hace este servicio?

**Registro:**

1. Comprueba si el correo ya está registrado.
2. Calcula el hash de la contraseña.
3. Crea el usuario en PostgreSQL.
4. Devuelve los datos públicos del usuario.

**Inicio de sesión:**

1. Busca el usuario por correo.
2. Compara la contraseña con el hash almacenado.
3. Si las credenciales son válidas, genera un JWT.
4. Devuelve el token y los datos públicos del usuario.

El servicio no devuelve `passwordHash` al cliente.

> En un sistema real, también deben considerarse la limitación de intentos de inicio de sesión, los mensajes que eviten revelar información innecesaria y una política de renovación y revocación de tokens.

---

## 9. Controladores y rutas de autenticación

### 9.1. Controlador

Archivo `src/controllers/auth.controller.js`:

```javascript
import { authService } from "../services/auth.service.js";

export const authController = {
  async register(req, res, next) {
    try {
      const user = await authService.register(req.validatedBody);

      return res.status(201).json({
        message: "Usuario registrado correctamente",
        user
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const result = await authService.login(req.validatedBody);

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
};
```

### 9.2. Rutas

Archivo `src/routes/auth.routes.js`:

```javascript
import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.js";
import {
  registerSchema,
  loginSchema
} from "../schemas/auth.schema.js";

const router = Router();

router.post(
  "/register",
  validate(registerSchema),
  authController.register
);

router.post(
  "/login",
  validate(loginSchema),
  authController.login
);

export default router;
```

Las rutas de registro e inicio de sesión son públicas. La validación se ejecuta antes de llamar al controlador.

---

## 10. Middleware de autenticación JWT

Archivo `src/middlewares/authenticate.js`:

```javascript
import jwt from "jsonwebtoken";

export function authenticate(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Se requiere autenticación"
    });
  }

  const token = authorization.slice(7);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (typeof payload !== "object" || !payload.sub) {
      return res.status(401).json({
        message: "Token inválido"
      });
    }

    const userId = Number(payload.sub);

    if (!Number.isSafeInteger(userId) || userId <= 0) {
      return res.status(401).json({
        message: "Token inválido"
      });
    }

    req.user = { id: userId };
    next();
  } catch {
    return res.status(401).json({
      message: "Token inválido o expirado"
    });
  }
}
```

### Flujo de autenticación

```text
Usuario
   |
   v
POST /api/auth/login
   |
   v
Validación con Zod
   |
   v
Verificación de credenciales
   |
   v
Generación de JWT
   |
   v
Cliente recibe token
   |
   v
Envía Authorization: Bearer <token>
   |
   v
Middleware authenticate
   |
   v
Acceso a la ruta protegida
```

El JWT permite verificar la identidad asociada a la solicitud. No cifra automáticamente su contenido; por eso no debemos guardar contraseñas ni información sensible dentro del token.

---

## 11. Servicio de proyectos

Archivo `src/services/project.service.js`:

```javascript
import { projectRepository } from "../repositories/project.repository.js";

export const projectService = {
  list(userId) {
    return projectRepository.findAll(userId);
  },

  async getById(id, userId) {
    const project = await projectRepository.findById(id, userId);

    if (!project) {
      const error = new Error("Proyecto no encontrado");
      error.status = 404;
      throw error;
    }

    return project;
  },

  create(data, userId) {
    return projectRepository.create({
      ...data,
      ownerId: userId
    });
  },

  async update(id, userId, data) {
    await this.getById(id, userId);

    await projectRepository.update(id, userId, data);

    return this.getById(id, userId);
  },

  async delete(id, userId) {
    const project = await this.getById(id, userId);

    await projectRepository.delete(id, userId);

    return project;
  }
};
```

El servicio obtiene el identificador del usuario desde la autenticación y aplica las reglas del negocio antes de modificar los datos.

---

## 12. Controlador y rutas de proyectos

### 12.1. Controlador

Archivo `src/controllers/project.controller.js`:

```javascript
import { projectService } from "../services/project.service.js";

export const projectController = {
  async list(req, res, next) {
    try {
      const projects = await projectService.list(req.user.id);
      return res.status(200).json(projects);
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const id = Number(req.params.id);
      const project = await projectService.getById(id, req.user.id);

      return res.status(200).json(project);
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const project = await projectService.create(
        req.validatedBody,
        req.user.id
      );

      return res.status(201).json(project);
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const id = Number(req.params.id);

      const project = await projectService.update(
        id,
        req.user.id,
        req.validatedBody
      );

      return res.status(200).json(project);
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const id = Number(req.params.id);

      await projectService.delete(id, req.user.id);

      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};
```

### 12.2. Rutas

Archivo `src/routes/project.routes.js`:

```javascript
import { Router } from "express";
import { projectController } from "../controllers/project.controller.js";
import { authenticate } from "../middlewares/authenticate.js";
import { validate } from "../middlewares/validate.js";
import {
  createProjectSchema,
  updateProjectSchema
} from "../schemas/project.schema.js";

const router = Router();

router.use(authenticate);

router.get("/", projectController.list);
router.get("/:id", projectController.getById);

router.post(
  "/",
  validate(createProjectSchema),
  projectController.create
);

router.patch(
  "/:id",
  validate(updateProjectSchema),
  projectController.update
);

router.delete("/:id", projectController.delete);

export default router;
```

Todas las rutas de proyectos están protegidas porque `router.use(authenticate)` se ejecuta antes de sus controladores.

Si la Sesión 4 ya implementó filtros, ordenamiento o paginación, se pueden conservar y añadir las restricciones de autenticación y propiedad a esas consultas.

---

## 13. Manejo centralizado de errores

Archivo `src/middlewares/errorHandler.js`:

```javascript
export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error.code === "P2002") {
    return res.status(409).json({
      message: "Ya existe un registro con ese valor"
    });
  }

  if (error.code === "P2025") {
    return res.status(404).json({
      message: "Registro no encontrado"
    });
  }

  const status = error.status || 500;

  if (status >= 500) {
    console.error(error);
  }

  return res.status(status).json({
    message: status >= 500
      ? "Error interno del servidor"
      : error.message
  });
}
```

El middleware centraliza las respuestas de error para que los controladores no tengan que repetir el mismo formato.

Los errores inesperados no deben exponer consultas SQL, credenciales, trazas ni detalles internos al cliente.

---

## 14. Configuración de Express y seguridad

### 14.1. Aplicación

Archivo `src/app.js`:

```javascript
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/project.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

if (!process.env.DATABASE_URL || !process.env.JWT_SECRET) {
  throw new Error("Faltan variables de entorno obligatorias");
}

app.disable("x-powered-by");

app.use(helmet());

app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173"
}));

app.use(express.json({ limit: "100kb" }));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "TaskFlow API"
  });
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Demasiados intentos. Intente nuevamente más tarde."
  }
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/projects", projectRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "Ruta no encontrada"
  });
});

app.use(errorHandler);

export default app;
```

**Importante:** el límite de diez solicitudes por quince minutos es un valor de demostración aplicado a las rutas de autenticación. Debe ajustarse según las necesidades del sistema y configurarse correctamente detrás de un proxy, si lo hubiera.

### 14.2. Servidor

Archivo `src/server.js`:

```javascript
import app from "./app.js";
import { prisma } from "./config/prisma.js";

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`TaskFlow API ejecutándose en el puerto ${PORT}`);
});

async function shutdown() {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
```

El archivo `app.js` configura Express y sus middlewares. El archivo `server.js` se encarga de iniciar el servidor y cerrar la conexión de Prisma al detenerlo.

---

## 15. Endpoints disponibles

| Método | Endpoint             | Autenticación | Función                          |
| ------ | -------------------- | ------------- | -------------------------------- |
| GET    | `/api/health`        | No            | Verificar el estado del servidor |
| POST   | `/api/auth/register` | No            | Registrar usuario                |
| POST   | `/api/auth/login`    | No            | Iniciar sesión                   |
| GET    | `/api/projects`      | Sí            | Listar proyectos propios         |
| GET    | `/api/projects/:id`  | Sí            | Consultar un proyecto propio     |
| POST   | `/api/projects`      | Sí            | Crear proyecto                   |
| PATCH  | `/api/projects/:id`  | Sí            | Actualizar proyecto propio       |
| DELETE | `/api/projects/:id`  | Sí            | Eliminar proyecto propio         |

### Códigos HTTP principales

| Código | Significado           | Ejemplo                                            |
| ------ | --------------------- | -------------------------------------------------- |
| 200    | OK                    | Consulta o actualización exitosa                   |
| 201    | Created               | Usuario o proyecto creado                          |
| 204    | No Content            | Proyecto eliminado                                 |
| 400    | Bad Request           | Datos inválidos                                    |
| 401    | Unauthorized          | Token ausente, inválido o credenciales incorrectas |
| 404    | Not Found             | Recurso inexistente o no perteneciente al usuario  |
| 409    | Conflict              | Correo electrónico duplicado                       |
| 429    | Too Many Requests     | Límite de solicitudes excedido                     |
| 500    | Internal Server Error | Error inesperado del servidor                      |

---

## 16. Pruebas con Postman

### Prueba 1. Registrar un usuario

**Método:** `POST`

**URL:**

```text
http://localhost:3000/api/auth/register
```

**Body → raw → JSON:**

```json
{
  "name": "Juan",
  "email": "juan@example.com",
  "password": "ClaveSegura123"
}
```

Resultado esperado: `201 Created`.

La respuesta debe incluir el identificador, el nombre y el correo del usuario. No debe incluir su contraseña ni el hash.

### Prueba 2. Validar los datos

Enviar un correo inválido:

```json
{
  "name": "Juan",
  "email": "correo-invalido",
  "password": "123"
}
```

Resultado esperado: `400 Bad Request`, con información sobre los campos inválidos.

### Prueba 3. Iniciar sesión

**Método:** `POST`

**URL:**

```text
http://localhost:3000/api/auth/login
```

**Body:**

```json
{
  "email": "juan@example.com",
  "password": "ClaveSegura123"
}
```

Resultado esperado: `200 OK`, con un token JWT y los datos públicos del usuario.

### Prueba 4. Intentar consultar proyectos sin autenticación

**Método:** `GET`

**URL:**

```text
http://localhost:3000/api/projects
```

No enviar el encabezado `Authorization`.

Resultado esperado: `401 Unauthorized`.

### Prueba 5. Crear un proyecto autenticado

**Método:** `POST`

**URL:**

```text
http://localhost:3000/api/projects
```

En la pestaña **Authorization**, seleccionar `Bearer Token` y pegar el token obtenido en el inicio de sesión.

**Body:**

```json
{
  "name": "Proyecto de pruebas",
  "description": "Proyecto para aprender desarrollo backend"
}
```

Resultado esperado: `201 Created`.

El proyecto debe quedar asociado al usuario autenticado.

### Prueba 6. Verificar el aislamiento entre usuarios

1. Registrar un segundo usuario.
2. Iniciar sesión con ese usuario.
3. Intentar consultar o eliminar el proyecto creado por el primer usuario.
4. Verificar que la API responda `404 Not Found`.

Esto comprueba que la autenticación no solo identifica al usuario, sino que también se aplica a las operaciones sobre los recursos.

### Prueba 7. Verificar el límite de solicitudes

Realizar solicitudes repetidas a las rutas de autenticación hasta superar el límite configurado.

Resultado esperado: `429 Too Many Requests`.

---

## 17. Orden recomendado para implementar los cambios

Para mantener el flujo de trabajo de las sesiones anteriores, implementar en este orden:

1. Revisar el proyecto de la Sesión 4 y conservar su configuración funcional.
2. Incorporar los modelos `User` y `Project` en Prisma.
3. Crear y ejecutar la migración.
4. Configurar el repositorio de usuarios.
5. Implementar registro e inicio de sesión.
6. Agregar los esquemas de validación con Zod.
7. Crear el middleware de autenticación JWT.
8. Proteger las rutas de proyectos.
9. Asegurar que las consultas se filtren por el usuario autenticado.
10. Incorporar Helmet, CORS y limitación de solicitudes.
11. Centralizar el manejo de errores.
12. Probar los casos exitosos y los errores desde Postman.

---

## 18. Resultado esperado al finalizar la Sesión 5

Al finalizar esta etapa, TaskFlow API contará con una estructura por capas, persistencia en PostgreSQL y operaciones CRUD sobre proyectos.

Además, tendrá:

* Registro e inicio de sesión.
* Contraseñas almacenadas mediante hash.
* Autenticación mediante JWT.
* Validación de entradas con Zod.
* Rutas protegidas.
* Control de acceso a proyectos por propietario.
* Manejo uniforme de errores.
* Configuración básica de seguridad.

### ¿Qué queda para las siguientes sesiones?

El proyecto no está terminado. Sobre esta base podremos incorporar gradualmente los contenidos posteriores del módulo: pruebas automatizadas, consultas más avanzadas, paginación, documentación de la API, despliegue y mejoras de seguridad.

La prioridad es que cada nueva sesión extienda TaskFlow API sin desechar el trabajo anterior y que cada cambio pueda verificarse mediante pruebas concretas.
