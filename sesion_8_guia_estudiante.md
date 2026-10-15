# Guía del estudiante — Sesión 8
# NestJS: Modules, Controllers, Services y Dependency Injection

**Módulo:** Arquitectura del Back-End y Bases de Datos  
**Proyecto:** TaskFlow API  
**Tecnologías:** NestJS, TypeScript, Node.js y Postman

---

## 1. Objetivo de la práctica

En esta sesión continuarás desarrollando la API TaskFlow iniciada en la sesión anterior.

Aprenderás a:

- Organizar una funcionalidad mediante módulos, controladores y servicios.
- Comprender cómo NestJS administra las dependencias.
- Implementar la inyección de dependencias mediante el constructor.
- Crear tareas mediante una solicitud HTTP `POST`.
- Probar los endpoints de la API utilizando Postman.

**Importante:** continúa trabajando en el proyecto de la sesión 7. No crees un proyecto nuevo si ya tienes uno funcionando.

---

## 2. Preparar el proyecto

Abre una terminal en la carpeta de tu proyecto NestJS.

Ejecuta:

```bash
npm run start:dev
```

Este comando inicia la aplicación en modo de desarrollo.

Abre otra terminal y revisa la estructura de `src`:

```text
src/
├── main.ts
├── app.module.ts
└── tasks/
    ├── tasks.module.ts
    ├── tasks.controller.ts
    └── tasks.service.ts
```

Tu proyecto puede contener archivos adicionales. No los elimines si son necesarios para su funcionamiento.

### Verificar los endpoints existentes

Antes de realizar cambios, prueba en Postman:

| Método | Endpoint | Resultado |
|---|---|---|
| GET | `/tasks` | Lista de tareas |
| GET | `/tasks/1` | Una tarea por ID |

Utiliza como dirección base:

```text
http://localhost:3000
```

Si tu aplicación utiliza otro puerto, adapta las direcciones.

---

## 3. Paso 1. Crear el DTO para las nuevas tareas

Un DTO (*Data Transfer Object*) define la estructura de los datos que recibe una operación.

Crearemos una clase para representar los datos necesarios al registrar una tarea.

### Crear el archivo

```text
src/tasks/dto/create-task.dto.ts
```

Si la carpeta `dto` no existe, créala dentro de `src/tasks`.

### Código

```typescript
export class CreateTaskDto {
  title: string;
  description: string;
}
```

### Comprender el código

- `CreateTaskDto` es una clase que representa los datos de entrada.
- `title` contiene el título de la tarea.
- `description` contiene la descripción.
- `string` indica que ambas propiedades deben ser cadenas de texto desde la perspectiva de TypeScript.

Este DTO define la estructura esperada, pero todavía no valida automáticamente los datos recibidos.

---

## 4. Paso 2. Implementar la lógica de negocio

Ahora trabajaremos con el servicio.

El servicio será responsable de almacenar temporalmente las tareas, listarlas, buscarlas y crearlas.

### Abrir el archivo

```text
src/tasks/tasks.service.ts
```

### Código completo

```typescript
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateTaskDto } from './dto/create-task.dto';

interface Task {
  id: number;
  title: string;
  description: string;
}

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    {
      id: 1,
      title: 'Estudiar NestJS',
      description: 'Comprender su arquitectura',
    },
    {
      id: 2,
      title: 'Practicar TypeScript',
      description: 'Trabajar con clases y tipos',
    },
  ];

  findAll(): Task[] {
    return this.tasks;
  }

  findOne(id: number): Task {
    const task = this.tasks.find(
      (item) => item.id === id,
    );

    if (!task) {
      throw new NotFoundException(
        `No existe la tarea con ID ${id}`,
      );
    }

    return task;
  }

  create(createTaskDto: CreateTaskDto): Task {
    const nextId =
      this.tasks.length > 0
        ? Math.max(...this.tasks.map((task) => task.id)) + 1
        : 1;

    const newTask: Task = {
      id: nextId,
      title: createTaskDto.title,
      description: createTaskDto.description,
    };

    this.tasks.push(newTask);

    return newTask;
  }
}
```

### Comprender las partes principales

**1. La interfaz `Task`**

Define la estructura de cada tarea:

```typescript
interface Task {
  id: number;
  title: string;
  description: string;
}
```

**2. El arreglo `tasks`**

```typescript
private tasks: Task[] = [];
```

En nuestro código, el arreglo está inicializado con dos tareas de ejemplo.

- `private` limita el acceso directo a la propiedad desde fuera de la clase.
- `Task[]` indica que es un arreglo de tareas.

**3. El método `findAll()`**

Devuelve todas las tareas almacenadas.

**4. El método `findOne(id)`**

Busca una tarea por su identificador. Si no existe, lanza una excepción HTTP 404.

**5. El método `create(createTaskDto)`**

Realiza las siguientes operaciones:

1. Calcula un nuevo identificador.
2. Construye el objeto de la tarea.
3. Añade la tarea al arreglo.
4. Devuelve la tarea creada.

**6. El decorador `@Injectable()`**

Permite que la clase participe en el sistema de inyección de dependencias de NestJS.

Para que NestJS pueda resolverla como proveedor, también debemos registrarla en el módulo correspondiente.

---

## 5. Paso 3. Implementar el controlador

El controlador recibirá las solicitudes HTTP y delegará las operaciones en el servicio.

### Abrir el archivo

```text
src/tasks/tasks.controller.ts
```

### Código completo

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

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.tasksService.findOne(id);
  }

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }
}
```

### Comprender los decoradores

| Decorador | Función |
|---|---|
| `@Controller('tasks')` | Define la ruta base `/tasks`. |
| `@Get()` | Atiende solicitudes GET a `/tasks`. |
| `@Get(':id')` | Atiende solicitudes GET a `/tasks/:id`. |
| `@Post()` | Atiende solicitudes POST a `/tasks`. |
| `@Param()` | Obtiene parámetros de la URL. |
| `@Body()` | Obtiene el cuerpo de la solicitud HTTP. |

### Comprender la inyección de dependencias

Observa este fragmento:

```typescript
constructor(
  private readonly tasksService: TasksService,
) {}
```

Esta es una de las partes más importantes de la sesión.

- `TasksService` es la dependencia que necesita el controlador.
- `tasksService` es la propiedad que permitirá utilizarla.
- `private` restringe el acceso directo a la propiedad desde fuera de la clase.
- `readonly` impide reasignar la propiedad después de su inicialización.
- El constructor declara qué necesita el controlador para funcionar.

NestJS utiliza esta declaración y la configuración del módulo para resolver la dependencia e inyectar la instancia correspondiente.

Por eso no necesitamos escribir:

```typescript
this.tasksService = new TasksService();
```

NestJS administra la creación y resolución de los proveedores registrados.

### Comprender el endpoint POST

```typescript
@Post()
create(@Body() createTaskDto: CreateTaskDto) {
  return this.tasksService.create(createTaskDto);
}
```

Cuando el cliente envía una solicitud POST:

1. NestJS dirige la petición al método `create()`.
2. `@Body()` proporciona el cuerpo recibido.
3. El controlador llama a `TasksService.create()`.
4. El servicio crea y almacena la tarea.
5. El resultado se devuelve al cliente como respuesta HTTP.

El controlador no necesita implementar directamente la lógica de almacenamiento.

---

## 6. Paso 4. Configurar el módulo

El módulo conecta los componentes de la funcionalidad de tareas.

### Abrir el archivo

```text
src/tasks/tasks.module.ts
```

### Código

```typescript
import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
```

### Comprender la configuración

**`controllers`**

Registra los controladores administrados por el módulo.

```typescript
controllers: [TasksController]
```

**`providers`**

Registra los servicios y otros proveedores que NestJS puede resolver dentro del módulo.

```typescript
providers: [TasksService]
```

**¿Por qué es importante?**

El controlador necesita `TasksService`, pero NestJS debe conocer ese proveedor para poder inyectarlo.

Si el servicio no está registrado en el contexto apropiado, la aplicación normalmente mostrará un error de resolución de dependencias al iniciarse.

### Revisar el módulo raíz

Abre:

```text
src/app.module.ts
```

Comprueba que `TasksModule` está importado:

```typescript
import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [TasksModule],
})
export class AppModule {}
```

Si tu archivo ya tiene otros módulos o componentes, conserva su configuración y añade `TasksModule` a la lista existente.

---

## 7. Paso 5. Ejecutar la aplicación

En la terminal del proyecto ejecuta:

```bash
npm run start:dev
```

Revisa los mensajes de compilación.

Si aparece un error, comprueba:

- Que las rutas de los imports sean correctas.
- Que `TasksService` esté registrado en `providers`.
- Que `TasksController` esté registrado en `controllers`.
- Que `TasksModule` esté importado en `AppModule`.
- Que los nombres de los archivos coincidan con los imports.

No continúes con las pruebas hasta que la aplicación se haya iniciado correctamente.

---

## 8. Paso 6. Probar los endpoints con Postman

### Prueba 1. Listar tareas

**Método:** GET

```text
http://localhost:3000/tasks
```

Resultado esperado: una lista con las dos tareas iniciales.

### Prueba 2. Buscar una tarea

**Método:** GET

```text
http://localhost:3000/tasks/1
```

Resultado esperado:

```json
{
  "id": 1,
  "title": "Estudiar NestJS",
  "description": "Comprender su arquitectura"
}
```

### Prueba 3. Buscar una tarea inexistente

**Método:** GET

```text
http://localhost:3000/tasks/999
```

Resultado esperado: código HTTP `404 Not Found`.

### Prueba 4. Crear una tarea

**Método:** POST

```text
http://localhost:3000/tasks
```

En Postman:

1. Selecciona la pestaña **Body**.
2. Selecciona **raw**.
3. Elige el formato **JSON**.
4. Envía el siguiente contenido:

```json
{
  "title": "Aprender inyección de dependencias",
  "description": "Comprender cómo NestJS conecta los componentes"
}
```

Resultado esperado:

```json
{
  "id": 3,
  "title": "Aprender inyección de dependencias",
  "description": "Comprender cómo NestJS conecta los componentes"
}
```

La respuesta debe contener la nueva tarea.

### Prueba 5. Comprobar la creación

Ejecuta nuevamente:

```text
GET http://localhost:3000/tasks
```

Comprueba que ahora existen tres tareas.

---

## 9. Ejercicio individual

Amplía el servicio y el controlador con una nueva operación:

### Objetivo

Implementar:

```text
GET /tasks/count
```

El endpoint debe devolver la cantidad de tareas almacenadas.

### Requisitos

1. Crear un método `count()` en `TasksService`.
2. Hacer que el método devuelva la cantidad de tareas.
3. Crear un endpoint en `TasksController`.
4. Utilizar la inyección de dependencias existente.
5. Probar el resultado en Postman.

**Pista:** un arreglo de JavaScript dispone de la propiedad `length`.

**Importante:** declara la ruta `@Get('count')` antes de la ruta dinámica `@Get(':id')` para evitar que `count` sea interpretado como el identificador de una tarea.

---

## 10. Errores frecuentes

### Error: NestJS no puede resolver `TasksService`

Revisa que el servicio esté registrado en `providers` y que el controlador esté registrado en `controllers` dentro de `TasksModule`.

### Error: la ruta devuelve 404

Comprueba que la ruta, el método HTTP y el puerto sean correctos.

### Error: los datos desaparecen después de reiniciar

Es el comportamiento esperado: las tareas están almacenadas en memoria y no en una base de datos.

### Error: el DTO no impide recibir un título vacío

El DTO actual define la estructura de los datos, pero no incorpora validación automática. Esto se estudiará en una sesión posterior.

---

## 11. Lista de verificación

Marca las tareas completadas:

- [ ] Revisé el proyecto TaskFlow de la sesión 7.
- [ ] Comprendí la estructura de módulos, controladores y servicios.
- [ ] Creé `CreateTaskDto`.
- [ ] Implementé la operación `create()` en `TasksService`.
- [ ] Implementé `POST /tasks` en `TasksController`.
- [ ] Verifiqué la inyección de dependencias.
- [ ] Revisé la configuración de `TasksModule`.
- [ ] Probé los endpoints en Postman.
- [ ] Implementé el ejercicio `GET /tasks/count`.

---

## 12. Preguntas de repaso

Responde con tus propias palabras:

1. ¿Cuál es la responsabilidad de `TasksModule`?
2. ¿Por qué no conviene colocar toda la lógica de negocio en `TasksController`?
3. ¿Qué significa que `TasksService` sea una dependencia del controlador?
4. ¿Qué función cumple el constructor en la inyección de dependencias?
5. ¿Por qué no escribimos `new TasksService()` en el controlador?
6. ¿Qué función cumple `providers` en `TasksModule`?
7. ¿Qué limitación tiene almacenar tareas en un arreglo en memoria?

---

## Resultado final

Al terminar la práctica, tendrás una API TaskFlow con los siguientes endpoints:

| Método | Endpoint | Función |
|---|---|---|
| GET | `/tasks` | Listar tareas |
| GET | `/tasks/:id` | Consultar una tarea |
| POST | `/tasks` | Crear una tarea |
| GET | `/tasks/count` | Contar tareas, como ejercicio |

La aplicación utilizará módulos, controladores, servicios e inyección de dependencias para mantener el código organizado y facilitar su ampliación en las siguientes sesiones.