# Guía del estudiante: Ampliación de TaskFlow API con Users, Projects y Tasks

## Módulo 2: Arquitectura del Back-End y Bases de Datos

**Tecnologías:** NestJS, TypeScript, PostgreSQL, Prisma 7 y Postman.  
**Modalidad:** práctica guiada.  
**Proyecto base:** TaskFlow API desarrollado en la sesión 9.

---

# 1. Objetivo de la práctica

Ampliar la API REST TaskFlow incorporando usuarios y proyectos, y establecer relaciones entre las tres entidades.

Al finalizar, podrás:

- Crear y consultar usuarios.
- Crear y consultar proyectos.
- Asociar proyectos con sus propietarios.
- Asociar tareas con proyectos.
- Asignar tareas a usuarios.
- Consultar las relaciones entre entidades.
- Validar los datos de entrada mediante DTOs.
- Manejar errores HTTP con excepciones de NestJS.
- Aplicar migraciones de Prisma para actualizar PostgreSQL.

## 1.1. Funcionalidades que construiremos

| Recurso | Método | Endpoint | Función |
|---|---|---|---|
| Users | POST | `/users` | Registrar un usuario |
| Users | GET | `/users` | Listar usuarios |
| Users | GET | `/users/:id` | Consultar un usuario |
| Projects | POST | `/projects` | Crear un proyecto |
| Projects | GET | `/projects` | Listar proyectos |
| Projects | GET | `/projects/:id` | Consultar un proyecto |
| Tasks | POST | `/tasks` | Crear una tarea relacionada |
| Tasks | GET | `/tasks` | Listar tareas con relaciones |
| Tasks | GET | `/tasks/:id` | Consultar una tarea y sus relaciones |

En esta práctica implementaremos estas operaciones para ampliar el proyecto existente. No es necesario volver a construir todo el CRUD de tareas que ya desarrollamos.

---

# 2. Comprender el modelo de datos

Antes de escribir código, debemos definir cómo se relacionarán las entidades.

## 2.1. Relaciones de TaskFlow

Un usuario puede tener varios proyectos. Cada proyecto pertenece a un usuario.

Un proyecto puede tener muchas tareas. Cada tarea pertenece a un proyecto.

Un usuario puede tener varias tareas asignadas. Una tarea puede no tener usuario asignado o tener uno.

```text
User
 |
 | 1:N (propietario)
 |
 v
Project
 |
 | 1:N
 |
 v
Task
 ^
 |
 | N:1 (asignación opcional)
 |
User
```

Las relaciones se interpretan de la siguiente manera:

- `User → Project`: un usuario puede ser propietario de varios proyectos.
- `Project → Task`: un proyecto puede contener muchas tareas.
- `User → Task`: un usuario puede tener varias tareas asignadas.

**Importante:** en esta versión cada proyecto tiene un único propietario y cada tarea pertenece a un único proyecto. No implementaremos todavía múltiples propietarios ni varios usuarios asignados a una misma tarea.

## 2.2. Ejemplo de información relacionada

Imaginemos los siguientes datos:

**Usuario**

```json
{
  "id": 1,
  "name": "Ana Pérez",
  "email": "ana@example.com"
}
```

**Proyecto**

```json
{
  "id": 1,
  "name": "Sistema de inventario",
  "description": "Desarrollo de una API de inventarios",
  "ownerId": 1
}
```

**Tarea**

```json
{
  "id": 1,
  "title": "Crear endpoint de productos",
  "description": "Implementar el endpoint REST",
  "projectId": 1,
  "assigneeId": 1
}
```

Los campos `ownerId`, `projectId` y `assigneeId` permiten establecer las relaciones entre los registros.

---

# 3. Revisar la estructura del proyecto

La estructura aproximada que utilizaremos será la siguiente:

```text
src/
├── app.module.ts
├── main.ts
├── prisma/
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── users/
│   ├── dto/
│   │   └── create-user.dto.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── projects/
│   ├── dto/
│   │   └── create-project.dto.ts
│   ├── projects.controller.ts
│   ├── projects.service.ts
│   └── projects.module.ts
└── tasks/
    ├── dto/
    │   ├── create-task.dto.ts
    │   └── update-task.dto.ts
    ├── tasks.controller.ts
    ├── tasks.service.ts
    └── tasks.module.ts

prisma/
└── schema.prisma

prisma7.config.ts
.env
```

Si los módulos `tasks` y `prisma` ya existen, conserva sus archivos y modifica solamente lo necesario.

---

# 4. Paso 1: actualizar el modelo de Prisma

## 4.1. Abrir `prisma/schema.prisma`

Primero revisa el modelo `Task` que construiste en la sesión 9.

Vamos a incorporar los modelos `User` y `Project` y establecer las relaciones.

El siguiente ejemplo representa el modelo objetivo de esta práctica. Si tu modelo `Task` tiene campos adicionales, consérvalos.

```prisma
model User {
  id            Int       @id @default(autoincrement())
  name          String
  email         String    @unique
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  projects      Project[] @relation("ProjectOwner")
  assignedTasks Task[]    @relation("TaskAssignee")
}

model Project {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  ownerId     Int
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  owner User   @relation("ProjectOwner", fields: [ownerId], references: [id])
  tasks Task[]

  @@index([ownerId])
}

model Task {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  status      String   @default("PENDING")
  projectId   Int
  assigneeId  Int?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  project  Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  assignee User?   @relation("TaskAssignee", fields: [assigneeId], references: [id], onDelete: SetNull)

  @@index([projectId])
  @@index([assigneeId])
}
```

### Explicación de los campos importantes

| Campo | Explicación |
|---|---|
| `ownerId` | Identificador del propietario del proyecto. |
| `projectId` | Identificador del proyecto al que pertenece la tarea. |
| `assigneeId` | Identificador opcional del usuario asignado a la tarea. |
| `@relation(...)` | Define la relación entre los modelos. |
| `fields: [...]` | Indica el campo que almacena la clave foránea. |
| `references: [...]` | Indica el campo referenciado en el otro modelo. |
| `@unique` | Evita valores duplicados en la columna correspondiente. |
| `@@index` | Crea un índice para facilitar determinadas consultas. |
| `onDelete: Cascade` | Permite eliminar las tareas asociadas al eliminar su proyecto. |
| `onDelete: SetNull` | Deja la tarea sin asignación cuando se elimina el usuario asignado. |

En este modelo, eliminar un proyecto elimina sus tareas. Esta decisión debe ser coherente con las reglas del negocio; en una aplicación real podría ser preferible impedir el borrado o archivar los proyectos.

### ¿Por qué `assigneeId` es opcional?

Porque una tarea puede crearse antes de que se asigne a un responsable.

En cambio, `projectId` es obligatorio: no permitiremos tareas sin proyecto en este diseño.

### Importante sobre Prisma 7

No reemplaces la configuración existente del datasource ni `prisma7.config.ts` por configuraciones de versiones anteriores. Conserva la configuración de Prisma 7 que ya funciona en el proyecto.

Si tu modelo actual utiliza un identificador UUID, otro nombre de tabla o campos distintos, adapta el ejemplo en lugar de sobrescribirlo sin revisar.

---

# 5. Paso 2: ejecutar la migración

Después de modificar el esquema, necesitamos actualizar la base de datos.

Ejecuta:

```bash
npx prisma migrate dev --name add_users_projects_relations
```

Este comando crea una migración y actualiza la base de datos de desarrollo.

Después, genera el cliente de Prisma según la configuración del proyecto:

```bash
npx prisma generate
```

Si la migración o la generación fallan, revisa el error antes de continuar.

**No elimines la base de datos ni las migraciones anteriores para resolver un error de esquema.** Primero comprueba el modelo y la configuración existentes.

### Verificación

Comprueba que la migración haya creado las tablas y las claves foráneas correspondientes.

Puedes utilizar Prisma Studio:

```bash
npx prisma studio
```

Verifica que estén disponibles las tablas `User`, `Project` y `Task`.

---

# 6. Paso 3: crear el módulo Users

NestJS permite generar módulos, controladores y servicios mediante la CLI.

Desde la raíz del proyecto, ejecuta:

```bash
nest g module users
nest g controller users
nest g service users
```

Si la CLI no está instalada globalmente, puedes utilizar:

```bash
npx nest g module users
npx nest g controller users
npx nest g service users
```

Crea la carpeta `src/users/dto`.

## 6.1. Crear `create-user.dto.ts`

Archivo: `src/users/dto/create-user.dto.ts`

```typescript
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'El nombre debe ser texto.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @MaxLength(100, {
    message: 'El nombre no puede superar los 100 caracteres.',
  })
  name: string;

  @IsEmail({}, {
    message: 'Debe proporcionar un correo electrónico válido.',
  })
  email: string;
}
```

### Explicación

- `@IsString()` valida el tipo de dato.
- `@IsNotEmpty()` rechaza un nombre vacío.
- `@MaxLength(100)` limita la longitud.
- `@IsEmail()` comprueba el formato del correo.

El DTO no incluye `id`, porque Prisma lo genera automáticamente.

Tampoco incluye `createdAt` ni `updatedAt`, porque son administrados por la aplicación y la base de datos mediante el modelo.

## 6.2. Crear `users.service.ts`

Archivo: `src/users/users.service.ts`

El siguiente servicio implementa la creación y consulta de usuarios.

```typescript
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateUserDto) {
    try {
      return await this.prisma.user.create({
        data: dto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Ya existe un usuario con ese correo electrónico.',
        );
      }

      throw error;
    }
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(
        `No existe un usuario con ID ${id}.`,
      );
    }

    return user;
  }
}
```

**Nota sobre la importación de Prisma:** el ejemplo utiliza la importación tradicional del tipo de error `Prisma` desde `@prisma/client`. Si tu configuración de Prisma 7 genera el cliente en una ruta personalizada, importa el tipo desde la ubicación del cliente generado. Conserva el patrón de manejo del error `P2002`.

### ¿Qué hace este servicio?

- `create()`: registra un usuario.
- `findAll()`: devuelve la lista de usuarios.
- `findOne()`: busca un usuario por ID.
- `ConflictException`: devuelve un error 409 cuando el correo ya existe.
- `NotFoundException`: devuelve un error 404 cuando no encuentra el usuario.

La restricción `@unique` en Prisma es la que garantiza que dos registros no tengan el mismo correo. La comprobación en el servicio transforma ese conflicto en una respuesta HTTP clara.

## 6.3. Crear `users.controller.ts`

Archivo: `src/users/users.controller.ts`

```typescript
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }
}
```

`ParseIntPipe` permite rechazar un ID que no sea un entero válido.

## 6.4. Revisar `users.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```

El `PrismaService` debe estar disponible para el servicio de usuarios.

Si `PrismaModule` ya es global, puede utilizarse sin importarlo en cada módulo. Si no lo es, importa `PrismaModule` en `UsersModule`, asegurándote de que exporte `PrismaService`.

## 6.5. Registrar UsersModule

En `src/app.module.ts`, incorpora `UsersModule` sin eliminar los módulos existentes.

Ejemplo:

```typescript
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    UsersModule,
    TasksModule,
  ],
})
export class AppModule {}
```

Este fragmento ilustra los imports necesarios. Si ya tienes `ConfigModule` y `PrismaModule`, consérvalos.

---

# 7. Paso 4: crear el módulo Projects

Genera el módulo, controlador y servicio:

```bash
npx nest g module projects
npx nest g controller projects
npx nest g service projects
```

Crea la carpeta `src/projects/dto`.

## 7.1. Crear `create-project.dto.ts`

Archivo: `src/projects/dto/create-project.dto.ts`

```typescript
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProjectDto {
  @IsString({ message: 'El nombre debe ser texto.' })
  @IsNotEmpty({ message: 'El nombre del proyecto es obligatorio.' })
  @MaxLength(100, {
    message: 'El nombre no puede superar los 100 caracteres.',
  })
  name: string;

  @IsOptional()
  @IsString({
    message: 'La descripción debe ser texto.',
  })
  description?: string;

  @IsInt({
    message: 'El identificador del propietario debe ser un entero.',
  })
  @Min(1, {
    message: 'El identificador del propietario debe ser mayor que cero.',
  })
  ownerId: number;
}
```

### Explicación

`ownerId` identifica al usuario propietario del proyecto.

El DTO comprueba que sea un entero positivo, pero eso no garantiza que el usuario exista. La existencia se comprobará al guardar el proyecto mediante la relación de Prisma.

## 7.2. Crear `projects.service.ts`

Archivo: `src/projects/projects.service.ts`

```typescript
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateProjectDto) {
    const owner = await this.prisma.user.findUnique({
      where: { id: dto.ownerId },
    });

    if (!owner) {
      throw new NotFoundException(
        `No existe el usuario propietario con ID ${dto.ownerId}.`,
      );
    }

    return this.prisma.project.create({
      data: {
        name: dto.name,
        description: dto.description,
        ownerId: dto.ownerId,
      },
      include: {
        owner: true,
      },
    });
  }

  async findAll() {
    return this.prisma.project.findMany({
      include: {
        owner: true,
      },
    });
  }

  async findOne(id: number) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        owner: true,
        tasks: true,
      },
    });

    if (!project) {
      throw new NotFoundException(
        `No existe un proyecto con ID ${id}.`,
      );
    }

    return project;
  }
}
```

### Conceptos importantes

**`include`**

Permite recuperar información relacionada en la misma consulta.

Por ejemplo:

```typescript
include: {
  owner: true,
}
```

devuelve el proyecto junto con la información del usuario propietario.

**Clave foránea**

Si se intenta crear un proyecto con un `ownerId` que no existe, la base de datos también puede rechazar la operación. Comprobar la existencia antes permite generar un mensaje más claro.

## 7.3. Crear `projects.controller.ts`

Archivo: `src/projects/projects.controller.ts`

```typescript
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
  ) {}

  @Post()
  create(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.findOne(id);
  }
}
```

## 7.4. Revisar `projects.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
```

Igual que en `UsersModule`, asegúrate de que `PrismaService` esté disponible.

Finalmente, incorpora `ProjectsModule` a los imports de `AppModule`.

---

# 8. Paso 5: actualizar el DTO de Tasks

Ahora vamos a modificar el DTO de creación de tareas para recibir los identificadores de las relaciones.

## 8.1. Modificar `create-task.dto.ts`

Archivo: `src/tasks/dto/create-task.dto.ts`

Conserva las propiedades que ya tiene tu DTO y añade los campos de relación.

Ejemplo completo para el modelo definido en esta guía:

```typescript
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateTaskDto {
  @IsString({ message: 'El título debe ser texto.' })
  @IsNotEmpty({ message: 'El título es obligatorio.' })
  @MaxLength(100, {
    message: 'El título no puede superar los 100 caracteres.',
  })
  title: string;

  @IsOptional()
  @IsString({
    message: 'La descripción debe ser texto.',
  })
  description?: string;

  @IsOptional()
  @IsString({
    message: 'El estado debe ser texto.',
  })
  status?: string;

  @IsInt({
    message: 'El identificador del proyecto debe ser un entero.',
  })
  @Min(1, {
    message: 'El identificador del proyecto debe ser mayor que cero.',
  })
  projectId: number;

  @IsOptional()
  @IsInt({
    message: 'El identificador del usuario asignado debe ser un entero.',
  })
  @Min(1, {
    message: 'El identificador del usuario asignado debe ser mayor que cero.',
  })
  assigneeId?: number;
}
```

En una aplicación real, conviene definir los valores permitidos de `status` mediante un enum de TypeScript y validarlos con `@IsEnum()`. Para simplificar esta ampliación, el ejemplo mantiene `status` como texto.

## 8.2. Actualizar el servicio de tareas

En `src/tasks/tasks.service.ts`, conserva los métodos existentes y adapta el método `create()`.

```typescript
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateTaskDto) {
    const project = await this.prisma.project.findUnique({
      where: { id: dto.projectId },
    });

    if (!project) {
      throw new NotFoundException(
        `No existe el proyecto con ID ${dto.projectId}.`,
      );
    }

    if (dto.assigneeId !== undefined) {
      const user = await this.prisma.user.findUnique({
        where: { id: dto.assigneeId },
      });

      if (!user) {
        throw new NotFoundException(
          `No existe el usuario asignado con ID ${dto.assigneeId}.`,
        );
      }
    }

    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status ?? 'PENDING',
        projectId: dto.projectId,
        assigneeId: dto.assigneeId,
      },
      include: {
        project: true,
        assignee: true,
      },
    });
  }

  async findAll() {
    return this.prisma.task.findMany({
      include: {
        project: true,
        assignee: true,
      },
    });
  }

  async findOne(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        project: true,
        assignee: true,
      },
    });

    if (!task) {
      throw new NotFoundException(
        `No existe la tarea con ID ${id}.`,
      );
    }

    return task;
  }
}
```

**Importante:** este fragmento muestra el servicio con los métodos de creación y consulta de esta guía. Si tu servicio ya tiene `update()` y `remove()`, consérvalos. Integra los métodos necesarios en lugar de reemplazar todo el archivo.

Si tu DTO actual tiene otras propiedades, agrégalas al `data` de Prisma cuando correspondan al modelo y deban aceptarse en la creación.

### ¿Por qué validamos la existencia del proyecto?

Porque `projectId` puede ser un entero válido y aun así no corresponder a ningún proyecto.

La validación del DTO comprueba la forma del dato; el servicio comprueba que la referencia exista.

### ¿Por qué `assigneeId` es opcional?

Porque se permite crear una tarea sin responsable. Si se proporciona el identificador, el servicio verifica que el usuario exista.

---

# 9. Paso 6: revisar TasksController

El controlador debe recibir el DTO actualizado y llamar al servicio.

En `src/tasks/tasks.controller.ts`, las operaciones principales deben seguir este patrón:

```typescript
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
  ) {}

  @Post()
  create(@Body() dto: CreateTaskDto) {
    return this.tasksService.create(dto);
  }

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.findOne(id);
  }
}
```

Si ya tienes otros endpoints, como PATCH y DELETE, no los elimines. Este ejemplo solo muestra los métodos necesarios para la práctica.

La ruta `GET /tasks/:id` utiliza `ParseIntPipe`, mientras que `ValidationPipe` valida el cuerpo de la solicitud mediante el DTO.

---

# 10. Paso 7: verificar la validación global

En `src/main.ts`, verifica que exista una configuración equivalente a esta:

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);
```

Asegúrate de que estén presentes los imports correspondientes:

```typescript
import { ValidationPipe } from '@nestjs/common';
```

Esta configuración permite que los DTOs de Users, Projects y Tasks se validen de manera global.

No registres el mismo Pipe global varias veces sin necesidad.

---

# 11. Paso 8: ejecutar y probar la API

Inicia la aplicación con el comando que utiliza tu proyecto. En una instalación NestJS habitual:

```bash
npm run start:dev
```

Comprueba que no existan errores de compilación antes de comenzar las pruebas.

En los ejemplos siguientes se supone que la API se ejecuta en `http://localhost:3000`.

## 11.1. Crear un usuario

**Solicitud**

```http
POST http://localhost:3000/users
Content-Type: application/json
```

Cuerpo:

```json
{
  "name": "Ana Pérez",
  "email": "ana@example.com"
}
```

Resultado esperado: HTTP 201 Created, con el usuario creado y su identificador.

Guarda el ID devuelto; lo utilizarás en los siguientes pasos.

## 11.2. Consultar usuarios

```http
GET http://localhost:3000/users
```

Deberías recibir una lista de usuarios.

Para consultar uno en particular:

```http
GET http://localhost:3000/users/1
```

Reemplaza `1` por el identificador real.

## 11.3. Crear un proyecto

```http
POST http://localhost:3000/projects
Content-Type: application/json
```

Cuerpo:

```json
{
  "name": "Sistema de inventario",
  "description": "Proyecto de práctica de NestJS",
  "ownerId": 1
}
```

Utiliza el ID del usuario creado anteriormente.

Resultado esperado: el proyecto creado con información del propietario.

Si el usuario no existe, el servicio devuelve HTTP 404.

## 11.4. Consultar proyectos

```http
GET http://localhost:3000/projects
```

La respuesta debe incluir la información del propietario porque utilizamos `include: { owner: true }`.

Para consultar un proyecto con sus tareas:

```http
GET http://localhost:3000/projects/1
```

La respuesta incluye el propietario y la colección de tareas asociadas.

## 11.5. Crear una tarea relacionada

```http
POST http://localhost:3000/tasks
Content-Type: application/json
```

Cuerpo:

```json
{
  "title": "Crear endpoint de productos",
  "description": "Implementar el endpoint REST",
  "projectId": 1,
  "assigneeId": 1
}
```

Utiliza los identificadores reales que devolvieron los pasos anteriores.

Resultado esperado: una tarea con información del proyecto y del usuario asignado.

### Crear una tarea sin asignación

Como `assigneeId` es opcional, también puedes enviar:

```json
{
  "title": "Documentar la API",
  "description": "Preparar la documentación",
  "projectId": 1
}
```

La tarea debe quedar sin un usuario asignado.

## 11.6. Consultar las tareas

Listar todas las tareas:

```http
GET http://localhost:3000/tasks
```

Consultar una tarea:

```http
GET http://localhost:3000/tasks/1
```

La respuesta debe incluir el proyecto y, si existe, el usuario asignado.

---

# 12. Paso 9: probar los casos de error

No basta con comprobar que las operaciones correctas funcionan. También debemos verificar cómo responde la API ante datos inválidos.

## Caso A. Correo electrónico incorrecto

```json
{
  "name": "Ana Pérez",
  "email": "correo-invalido"
}
```

Resultado esperado: HTTP 400 Bad Request.

## Caso B. Correo duplicado

Enviar dos veces el mismo correo electrónico.

Resultado esperado: la segunda solicitud devuelve HTTP 409 Conflict.

## Caso C. Proyecto con propietario inexistente

```json
{
  "name": "Proyecto de prueba",
  "ownerId": 99999
}
```

Resultado esperado: HTTP 404 si el servicio comprueba que el propietario no existe.

## Caso D. Tarea sin proyecto

```json
{
  "title": "Tarea sin proyecto"
}
```

Resultado esperado: HTTP 400 porque `projectId` es obligatorio.

## Caso E. Tarea con proyecto inexistente

```json
{
  "title": "Tarea de prueba",
  "projectId": 99999
}
```

Resultado esperado: HTTP 404 porque no existe el proyecto.

## Caso F. Tarea con usuario asignado inexistente

```json
{
  "title": "Tarea de prueba",
  "projectId": 1,
  "assigneeId": 99999
}
```

Resultado esperado: HTTP 404 porque el usuario asignado no existe.

## Caso G. Identificador no numérico

```http
GET http://localhost:3000/users/abc
```

Resultado esperado: HTTP 400 debido a `ParseIntPipe`.

---

# 13. Paso 10: comprender las consultas relacionadas

Prisma permite recuperar entidades relacionadas utilizando `include`.

## Consultar proyectos con su propietario

```typescript
return this.prisma.project.findMany({
  include: {
    owner: true,
  },
});
```

## Consultar proyectos con sus tareas

```typescript
return this.prisma.project.findMany({
  include: {
    owner: true,
    tasks: true,
  },
});
```

## Consultar tareas con su proyecto y usuario asignado

```typescript
return this.prisma.task.findMany({
  include: {
    project: true,
    assignee: true,
  },
});
```

### Pregunta importante

¿Por qué no basta con devolver únicamente `projectId` y `assigneeId`?

Porque los identificadores permiten establecer las relaciones, pero `include` permite recuperar también los datos relacionados en la respuesta.

En una API de producción, no siempre conviene devolver todas las propiedades relacionadas. Para limitar los datos expuestos, se puede utilizar `select` y construir respuestas específicas.

---

# 14. Actividad práctica individual

## Requisitos

Amplía TaskFlow para cumplir con los siguientes puntos:

- [ ] Crear y consultar usuarios.
- [ ] Validar el nombre y el correo electrónico.
- [ ] Evitar correos electrónicos duplicados.
- [ ] Crear proyectos asociados a un usuario.
- [ ] Consultar proyectos con su propietario.
- [ ] Crear tareas asociadas a un proyecto.
- [ ] Permitir tareas sin usuario asignado.
- [ ] Consultar tareas con el proyecto y el usuario asignado.
- [ ] Utilizar `ValidationPipe` y `ParseIntPipe`.
- [ ] Manejar errores con excepciones HTTP apropiadas.

## Evidencias que debes presentar

1. Captura de la creación de un usuario.
2. Captura de la creación de un proyecto asociado a ese usuario.
3. Captura de la creación de una tarea asociada a un proyecto y a un usuario.
4. Captura de una consulta que muestre las relaciones.
5. Captura de una solicitud inválida que devuelva HTTP 400.
6. Captura de una referencia inexistente que devuelva HTTP 404.
7. Migración creada y esquema actualizado.

---

# 15. Preguntas de repaso

**1. ¿Cuál es la diferencia entre una relación de uno a muchos y una de muchos a uno?**

**2. ¿Qué función cumple `ownerId` en el modelo Project?**

**3. ¿Por qué `projectId` es obligatorio en Task?**

**4. ¿Qué diferencia existe entre validar que un ID sea un entero y comprobar que el registro exista?**

**5. ¿Para qué sirve `include` en Prisma?**

**6. ¿Qué ventaja tiene utilizar DTOs en lugar de recibir directamente un objeto sin validar?**

**7. ¿Qué código HTTP corresponde a un correo duplicado?**

**8. ¿Qué sucede con las tareas asignadas a un usuario cuando se elimina ese usuario en el modelo de esta práctica?**

**9. ¿Qué sucede con las tareas de un proyecto cuando se elimina ese proyecto?**

**10. ¿Por qué debemos ejecutar una migración después de modificar `schema.prisma`?**

---

# 16. Resultado final

Al finalizar esta práctica, TaskFlow contará con tres entidades relacionadas y una API capaz de crear y consultar usuarios, proyectos y tareas con sus respectivas relaciones.

La arquitectura seguirá separando responsabilidades:

```text
Controller
    |
    v
Service
    |
    v
Prisma
    |
    v
PostgreSQL
```

Los DTOs y los Pipes validarán las entradas; los servicios comprobarán las reglas de negocio; las excepciones comunicarán los errores y Prisma administrará el acceso a los datos.

**Resultado esperado:** una API REST ampliada, con relaciones persistentes en PostgreSQL, validación de entradas y respuestas HTTP coherentes.