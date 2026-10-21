# Guía del estudiante: API REST de Tasks con NestJS, Prisma y PostgreSQL

**Módulo:** Arquitectura del Back-End y Bases de Datos  
**Práctica:** Construcción de una API REST con operaciones CRUD  
**Proyecto:** TaskFlow API  
**Tecnologías:** NestJS, TypeScript, Prisma ORM 7 y PostgreSQL

---

## 1. Objetivo de la práctica

Al finalizar esta práctica, podrás construir una API REST que permita administrar tareas y almacenar la información en una base de datos PostgreSQL.

Implementarás las siguientes operaciones:

| Método HTTP | Endpoint | Función |
|---|---|---|
| GET | `/tasks` | Listar todas las tareas |
| GET | `/tasks/:id` | Obtener una tarea por ID |
| POST | `/tasks` | Crear una tarea |
| PATCH | `/tasks/:id` | Actualizar una tarea |
| DELETE | `/tasks/:id` | Eliminar una tarea |

Durante la práctica utilizarás DTOs para validar datos, servicios para gestionar la lógica de negocio, un repositorio para acceder a la base de datos e inyección de dependencias para conectar los componentes.

## 2. Arquitectura de la aplicación

La aplicación tendrá la siguiente arquitectura:

```text
Cliente (Postman)
      |
      v
TasksController
      |
      v
TasksService
      |
      v
TasksRepository
      |
      v
PrismaService
      |
      v
PostgreSQL
```

Responsabilidades:

- **Controller:** recibe las peticiones HTTP y devuelve respuestas.
- **Service:** aplica las reglas de negocio y verifica las tareas.
- **Repository:** define las operaciones de acceso a los datos.
- **PrismaService:** administra la conexión y las consultas mediante Prisma.
- **PostgreSQL:** almacena la información de forma persistente.

## 3. Preparar el proyecto

### 3.1. Abrir el proyecto

Abre la terminal de Visual Studio Code y entra en el proyecto NestJS:

```powershell
cd C:\Users\Juan Carlos\dev\taskflow-api
code .
```

Si ya tienes creado el proyecto, conserva los archivos existentes y adapta los necesarios.

### 3.2. Instalar las dependencias

Ejecuta los siguientes comandos si todavía no tienes instaladas las dependencias:

```powershell
npm install @nestjs/mapped-types class-validator class-transformer
npm install @prisma/client @prisma/adapter-pg pg
npm install -D prisma tsx @types/pg
```

### 3.3. Configurar la conexión a PostgreSQL

En el archivo `.env`, configura la conexión:

```env
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/taskflow?schema=public"
```

Reemplaza `TU_PASSWORD` y los demás valores según tu instalación.

La base de datos `taskflow` debe existir y PostgreSQL debe estar en ejecución.

**Importante:** no publiques tus credenciales reales en un repositorio público.

## 4. Definir el modelo de datos con Prisma

### 4.1. Configurar `prisma/schema.prisma`

Abre el archivo `prisma/schema.prisma` y define el modelo `Task`:

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model Task {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  completed   Boolean  @default(false)
  createdAt   DateTime @default(now())
}
```

Descripción de los campos:

- `id`: identificador único autoincremental.
- `title`: título obligatorio de la tarea.
- `description`: descripción opcional.
- `completed`: indica si la tarea está completada. Por defecto es `false`.
- `createdAt`: fecha de creación generada automáticamente.

### 4.2. Configurar Prisma 7

Si el proyecto utiliza `prisma7.config.ts`, verifica que tenga una configuración equivalente a la siguiente:

```typescript
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',

  migrations: {
    path: 'prisma/migrations',
  },

  datasource: {
    url: env('DATABASE_URL'),
  },
});
```

Con esta configuración, Prisma conoce la ubicación del esquema, de las migraciones y de la conexión a la base de datos.

### 4.3. Crear la migración

Ejecuta:

```powershell
npx prisma --config prisma7.config.ts migrate dev --name create_tasks
```

Después, genera el cliente de Prisma:

```powershell
npx prisma --config prisma7.config.ts generate
```

Verifica que se haya creado la carpeta:

```text
src/generated/prisma/
```

Si el proyecto ya tiene un archivo de configuración diferente, utiliza el nombre que corresponda.

## 5. Crear PrismaService

`PrismaService` permite utilizar Prisma desde los componentes de NestJS.

Crea el archivo `src/prisma/prisma.service.ts`:

```typescript
import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error(
        'La variable DATABASE_URL no está configurada',
      );
    }

    const adapter = new PrismaPg({ connectionString });

    super({ adapter });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
```

### ¿Qué debes comprender?

- `PrismaClient` proporciona los métodos para consultar la base de datos.
- `PrismaPg` conecta Prisma con PostgreSQL mediante el adaptador.
- `onModuleInit()` establece la conexión cuando se inicia el módulo.
- `onModuleDestroy()` cierra la conexión cuando la aplicación se detiene.

## 6. Crear PrismaModule

Crea el archivo `src/prisma/prisma.module.ts`:

```typescript
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

El decorador `@Global()` permite utilizar `PrismaService` desde otros módulos sin tener que importar `PrismaModule` en cada uno.

### 6.1. Registrar PrismaModule en AppModule

Abre `src/app.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [PrismaModule, TasksModule],
})
export class AppModule {}
```

Si ya existen otros módulos, consérvalos.

## 7. Definir los tipos de datos

Crea el archivo `src/tasks/types/task.type.ts`:

```typescript
import type { Prisma } from '../../generated/prisma/client';

export type Task = Prisma.TaskGetPayload<{}>;
```

Este tipo representa una tarea devuelta por Prisma.

Al tipar los métodos, TypeScript puede verificar los valores que reciben y devuelven.

| Tipo | Significado |
|---|---|
| `Task` | Una tarea |
| `Task[]` | Una lista de tareas |
| `Task \| null` | Una tarea o ningún resultado |
| `Promise<Task>` | Una promesa que devuelve una tarea |
| `Promise<Task[]>` | Una promesa que devuelve una lista |

## 8. Crear los DTOs

Un DTO (*Data Transfer Object*) define la estructura de los datos que acepta una petición.

### 8.1. DTO para crear tareas

Crea `src/tasks/dto/create-task.dto.ts`:

```typescript
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTaskDto {
  @IsString({
    message: 'El título debe ser un texto',
  })
  @IsNotEmpty({
    message: 'El título es obligatorio',
  })
  title: string;

  @IsOptional()
  @IsString({
    message: 'La descripción debe ser un texto',
  })
  description?: string;

  @IsOptional()
  @IsBoolean({
    message: 'El estado debe ser verdadero o falso',
  })
  completed?: boolean;
}
```

El título es obligatorio. La descripción y el estado son opcionales.

### 8.2. DTO para actualizar tareas

Crea `src/tasks/dto/update-task.dto.ts`:

```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(
  CreateTaskDto,
) {}
```

`PartialType()` convierte todas las propiedades heredadas en opcionales. Esto permite actualizar solamente los campos que el cliente envía.

### 8.3. Activar las validaciones globales

Abre `src/main.ts`:

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
```

- `whitelist: true`: elimina las propiedades que no están definidas en el DTO.
- `transform: true`: permite transformar los datos recibidos según los tipos declarados.

## 9. Crear el repositorio de tareas

Crea `src/tasks/tasks.repository.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import type { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { Task } from './types/task.type';

@Injectable()
export class TasksRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  findAll(): Promise<Task[]> {
    return this.prisma.task.findMany({
      orderBy: { id: 'asc' },
    });
  }

  findById(id: number): Promise<Task | null> {
    return this.prisma.task.findUnique({
      where: { id },
    });
  }

  create(data: Prisma.TaskCreateInput): Promise<Task> {
    return this.prisma.task.create({ data });
  }

  update(
    id: number,
    data: Prisma.TaskUpdateInput,
  ): Promise<Task> {
    return this.prisma.task.update({
      where: { id },
      data,
    });
  }

  delete(id: number): Promise<Task> {
    return this.prisma.task.delete({
      where: { id },
    });
  }
}
```

### Responsabilidad del repositorio

El repositorio ejecuta las operaciones de persistencia. No debe encargarse de decidir los mensajes de error que recibirá el usuario.

| Método | Parámetros | Tipo de retorno |
|---|---|---|
| `findAll()` | Ninguno | `Promise<Task[]>` |
| `findById(id)` | `number` | `Promise<Task \| null>` |
| `create(data)` | `Prisma.TaskCreateInput` | `Promise<Task>` |
| `update(id, data)` | ID y datos de actualización | `Promise<Task>` |
| `delete(id)` | `number` | `Promise<Task>` |

## 10. Implementar la lógica de negocio

Crea o actualiza `src/tasks/tasks.service.ts`:

```typescript
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { TasksRepository } from './tasks.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import type { Task } from './types/task.type';

@Injectable()
export class TasksService {
  constructor(
    private readonly tasksRepository: TasksRepository,
  ) {}

  findAll(): Promise<Task[]> {
    return this.tasksRepository.findAll();
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.tasksRepository.findById(id);

    if (!task) {
      throw new NotFoundException(
        `No se encontró la tarea con ID ${id}`,
      );
    }

    return task;
  }

  create(data: CreateTaskDto): Promise<Task> {
    return this.tasksRepository.create({
      title: data.title,
      description: data.description,
      completed: data.completed,
    });
  }

  async update(
    id: number,
    data: UpdateTaskDto,
  ): Promise<Task> {
    await this.findOne(id);

    return this.tasksRepository.update(id, {
      ...(data.title !== undefined && {
        title: data.title,
      }),
      ...(data.description !== undefined && {
        description: data.description,
      }),
      ...(data.completed !== undefined && {
        completed: data.completed,
      }),
    });
  }

  async remove(id: number): Promise<Task> {
    await this.findOne(id);

    return this.tasksRepository.delete(id);
  }
}
```

### Explicación de los métodos

- `findAll()`: solicita todas las tareas al repositorio.
- `findOne(id)`: busca una tarea y lanza un error HTTP 404 si no existe.
- `create(data)`: recibe los datos validados y crea una tarea.
- `update(id, data)`: verifica que la tarea exista y modifica únicamente los campos enviados.
- `remove(id)`: verifica la existencia de la tarea y solicita su eliminación.

Observa el siguiente fragmento:

```typescript
...(data.completed !== undefined && {
  completed: data.completed,
}),
```

La propiedad `completed` solamente se incluye si fue enviada. Así, si el cliente no envía el estado, se conserva el valor actual.

Es importante no confundir `false` con una propiedad ausente: `false` es un valor válido que debe poder actualizarse.

## 11. Crear el controlador REST

Crea o actualiza `src/tasks/tasks.controller.ts`:

```typescript
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import type { Task } from './types/task.type';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
  ) {}

  @Get()
  findAll(): Promise<Task[]> {
    return this.tasksService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Task> {
    return this.tasksService.findOne(id);
  }

  @Post()
  create(
    @Body() data: CreateTaskDto,
  ): Promise<Task> {
    return this.tasksService.create(data);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.update(id, data);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Task> {
    return this.tasksService.remove(id);
  }
}
```

### Conceptos importantes

- `@Controller('tasks')`: define la ruta base.
- `@Get()`: atiende solicitudes GET.
- `@Post()`: atiende solicitudes POST.
- `@Patch(':id')`: actualiza parcialmente una tarea.
- `@Delete(':id')`: elimina una tarea.
- `@Param()`: obtiene el parámetro de la URL.
- `ParseIntPipe`: convierte el ID a entero y rechaza valores inválidos.
- `@Body()`: obtiene el contenido de la petición.

El controlador delega las operaciones a `TasksService`; no consulta directamente PostgreSQL.

## 12. Registrar los componentes

Abre `src/tasks/tasks.module.ts`:

```typescript
import { Module } from '@nestjs/common';

import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';

@Module({
  controllers: [TasksController],
  providers: [
    TasksService,
    TasksRepository,
  ],
})
export class TasksModule {}
```

NestJS utiliza esta configuración para crear los componentes e inyectar sus dependencias.

Por ejemplo:

1. `TasksController` necesita `TasksService`.
2. `TasksService` necesita `TasksRepository`.
3. `TasksRepository` necesita `PrismaService`.

NestJS resuelve estas dependencias automáticamente. Este mecanismo se conoce como **inyección de dependencias (DI)**.

## 13. Ejecutar la aplicación

Inicia NestJS en modo desarrollo:

```powershell
npm run start:dev
```

La URL base será:

```text
http://localhost:3000
```

Si aparecen errores, verifica:

- Que PostgreSQL esté en ejecución.
- Que `DATABASE_URL` tenga los valores correctos.
- Que la migración se haya ejecutado.
- Que el cliente de Prisma esté generado.
- Que los proveedores estén registrados en sus módulos.

## 14. Probar la API con Postman

Crea una colección llamada `TaskFlow API`. Usa `http://localhost:3000` como URL base.

### 14.1. Crear una tarea

**Método:** `POST`  
**URL:** `http://localhost:3000/tasks`  
**Body → raw → JSON:**

```json
{
  "title": "Estudiar NestJS",
  "description": "Practicar Prisma y PostgreSQL",
  "completed": false
}
```

Resultado esperado: HTTP 201 Created y un objeto con la tarea creada, incluido su ID.

### 14.2. Listar todas las tareas

**Método:** `GET`  
**URL:** `http://localhost:3000/tasks`

No necesitas enviar un cuerpo.

Resultado esperado: HTTP 200 OK y un arreglo JSON con las tareas registradas.

### 14.3. Obtener una tarea por ID

**Método:** `GET`  
**URL:** `http://localhost:3000/tasks/1`

Sustituye `1` por el ID de una tarea existente.

Resultado esperado:

- HTTP 200 OK si la tarea existe.
- HTTP 404 Not Found si la tarea no existe.

### 14.4. Actualizar una tarea

**Método:** `PATCH`  
**URL:** `http://localhost:3000/tasks/1`  
**Body → raw → JSON:**

```json
{
  "completed": true
}
```

Resultado esperado: HTTP 200 OK. El estado cambia a `true`, mientras que el título y la descripción permanecen iguales.

### 14.5. Eliminar una tarea

**Método:** `DELETE`  
**URL:** `http://localhost:3000/tasks/1`

No necesitas enviar un cuerpo.

Resultado esperado: HTTP 200 OK con la tarea eliminada en la respuesta. Si el ID no existe, se devuelve HTTP 404 Not Found.

### 14.6. Probar las validaciones

Intenta crear una tarea sin título:

```json
{
  "description": "Tarea sin título"
}
```

Después, intenta enviar un título numérico:

```json
{
  "title": 123
}
```

Resultado esperado: HTTP 400 Bad Request en ambos casos.

## 15. Verificar la persistencia de los datos

Realiza las siguientes acciones:

1. Crea una tarea mediante `POST /tasks`.
2. Consulta `GET /tasks`.
3. Detén la aplicación NestJS.
4. Inicia nuevamente con `npm run start:dev`.
5. Consulta otra vez `GET /tasks`.

La tarea debe continuar registrada porque se almacena en PostgreSQL y no únicamente en la memoria de la aplicación.

## 16. Errores frecuentes

| Error | Posible causa | Qué revisar |
|---|---|---|
| `DATABASE_URL` no configurada | Variable de entorno ausente | Archivo `.env` y carga de variables |
| Error de conexión a PostgreSQL | Servicio detenido o credenciales incorrectas | Puerto, usuario, contraseña y nombre de base de datos |
| No encuentra `generated/prisma/client` | Cliente no generado o ruta incorrecta | `schema.prisma`, `output` y comando `generate` |
| `UnknownDependenciesException` | Proveedor no registrado | Módulos y `providers` |
| HTTP 400 | Datos o parámetros inválidos | DTOs, `ValidationPipe` e ID |
| HTTP 404 | La tarea no existe | ID utilizado en la petición |
| Error Prisma `P2025` | Registro no encontrado al modificarlo o eliminarlo | Verificar existencia y considerar cambios concurrentes |

## 17. Actividad práctica del estudiante

Marca cada tarea cuando hayas completado la actividad:

- [ ] Definir el modelo `Task` en Prisma.
- [ ] Ejecutar la migración.
- [ ] Generar el cliente de Prisma.
- [ ] Crear `PrismaService` y `PrismaModule`.
- [ ] Definir el tipo `Task`.
- [ ] Crear los DTOs.
- [ ] Activar las validaciones globales.
- [ ] Implementar `TasksRepository`.
- [ ] Implementar `TasksService`.
- [ ] Implementar `TasksController`.
- [ ] Registrar los componentes en `TasksModule`.
- [ ] Probar GET, POST, PATCH y DELETE en Postman.
- [ ] Verificar que los datos persistan después de reiniciar la aplicación.

## 18. Ejercicio de ampliación

Una vez que funcione la API, amplía el modelo para incorporar una prioridad a las tareas.

### Requisitos

1. Añadir el campo `priority` con valores `BAJA`, `MEDIA` y `ALTA`.
2. Actualizar el modelo Prisma.
3. Crear una migración.
4. Actualizar los DTOs para validar la prioridad.
5. Permitir crear y actualizar tareas con ese campo.
6. Probar los cambios mediante Postman.

### Resultado esperado

Una API REST funcional con persistencia real en PostgreSQL, validación de datos, métodos tipados y una arquitectura organizada por responsabilidades.
