# Guía del estudiante: Sesión 7
## TypeScript y primeros pasos con NestJS

**Módulo:** Arquitectura del Back-End y Bases de Datos  
**Tema:** Fundamentos de TypeScript e introducción a NestJS  
**Proyecto de práctica:** TaskFlow API

---

## 1. Objetivos de aprendizaje

Al finalizar esta sesión, podrás:

- Comprender los fundamentos de TypeScript aplicados al desarrollo backend.
- Diferenciar tipos, funciones y clases.
- Comprender la inyección de dependencias y su utilidad.
- Reconocer la estructura básica de un proyecto NestJS.
- Crear una API sencilla utilizando controladores y servicios.
- Probar endpoints mediante Postman.


## 3. Requisitos previos

Antes de comenzar, verifica que tengas instalado Node.js y npm.

Abre una terminal y ejecuta:

```bash
node --version
npm --version
```

Si ambos comandos muestran sus respectivas versiones, puedes continuar.

También necesitarás:

- Visual Studio Code.
- Postman.
- Conocimientos básicos de JavaScript.
- Comprensión básica de APIs REST y métodos HTTP.

---

## 4. Fundamentos de TypeScript

TypeScript es un lenguaje basado en JavaScript que incorpora un sistema de tipos estáticos. Esto permite detectar ciertos errores durante el desarrollo, antes de ejecutar la aplicación.

### 4.1. Tipos de datos

Ejemplo en TypeScript:

```typescript
const name: string = 'Juan Carlos';
const age: number = 30;
const active: boolean = true;
```

Los tipos indican qué clase de dato puede almacenar una variable.

| Tipo | Descripción | Ejemplo |
|---|---|---|
| `string` | Texto | `'Estudiar'` |
| `number` | Número | `10` |
| `boolean` | Verdadero o falso | `true` |
| `string[]` | Arreglo de textos | `['API', 'BD']` |

### 4.2. Definición de tipos para objetos

En una aplicación backend, frecuentemente trabajamos con objetos que representan entidades del sistema.

Por ejemplo, una tarea:

```typescript
type Task = {
  id: number;
  title: string;
  completed: boolean;
};

const task: Task = {
  id: 1,
  title: 'Aprender TypeScript',
  completed: false,
};

console.log(task.title);
```

El tipo `Task` establece la estructura que debe tener una tarea.

Si intentas asignar un texto al campo `id`, TypeScript detectará un error de tipo.

### 4.3. Funciones con tipos

También podemos definir los tipos de los parámetros y del valor que devuelve una función.

```typescript
function sum(a: number, b: number): number {
  return a + b;
}

const result = sum(10, 5);

console.log(result);
```

En este ejemplo:

- `a: number` indica que el primer parámetro debe ser numérico.
- `b: number` indica que el segundo parámetro debe ser numérico.
- `: number` después de los paréntesis indica el tipo de retorno.

### Actividad breve

1. Crea un tipo llamado `User` con los campos `id`, `name` y `active`.
2. Declara un objeto que cumpla con ese tipo.
3. Crea una función que reciba un objeto `User` y muestre su nombre.

---

## 5. Clases e inyección de dependencias

### 5.1. ¿Qué es una clase?

Una clase permite definir la estructura y el comportamiento de un objeto.

```typescript
class TaskManager {
  private tasks: string[] = [];

  addTask(title: string): void {
    this.tasks.push(title);
  }

  getTasks(): string[] {
    return this.tasks;
  }
}

const manager = new TaskManager();

manager.addTask('Estudiar NestJS');

console.log(manager.getTasks());
```

Conceptos importantes:

- `class`: define una clase.
- `private`: limita el acceso directo al atributo desde fuera de la clase.
- `public`: permite el acceso desde fuera; es el nivel de acceso predeterminado.
- `void`: indica que una función no devuelve un valor.
- `this`: hace referencia a la instancia actual.

### 5.2. ¿Qué es la inyección de dependencias?

La inyección de dependencias es un mecanismo mediante el cual una clase recibe los objetos o servicios que necesita, en lugar de crearlos directamente.

Por ejemplo, un controlador necesita un servicio para consultar las tareas.

En lugar de crear manualmente el servicio dentro del controlador, NestJS puede proporcionarlo mediante su sistema de inyección de dependencias.

Esto facilita:

- La separación de responsabilidades.
- El mantenimiento del código.
- Las pruebas unitarias.
- La sustitución de dependencias cuando sea necesario.

En las siguientes secciones veremos cómo NestJS implementa este mecanismo.

---

## 6. Introducción a NestJS

NestJS es un framework de Node.js para construir aplicaciones backend estructuradas, generalmente utilizando TypeScript.

A diferencia de una aplicación Express pequeña, NestJS promueve una organización basada en módulos, controladores y proveedores.

### 6.1. Crear el proyecto

Instala la interfaz de línea de comandos de NestJS:

```bash
npm install -g @nestjs/cli
```

Crea un proyecto:

```bash
nest new taskflow-api
```

Cuando el asistente lo solicite, selecciona el gestor de paquetes que tengas instalado, por ejemplo, npm.

Ingresa al directorio:

```bash
cd taskflow-api
```

Inicia el servidor en modo desarrollo:

```bash
npm run start:dev
```

Por defecto, la aplicación estará disponible en:

```text
http://localhost:3000
```

Abre esa dirección en el navegador para comprobar que la aplicación funciona.

### 6.2. Estructura básica del proyecto

Entre los archivos principales encontrarás:

```text
taskflow-api/
├── src/
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── test/
├── package.json
└── tsconfig.json
```

| Archivo | Responsabilidad |
|---|---|
| `main.ts` | Inicia la aplicación. |
| `app.module.ts` | Define el módulo principal. |
| `app.controller.ts` | Gestiona las rutas del controlador inicial. |
| `app.service.ts` | Contiene la lógica del servicio inicial. |
| `package.json` | Define scripts y dependencias. |
| `tsconfig.json` | Configura el compilador TypeScript. |

### 6.3. Generar los componentes de tareas

Desde la raíz del proyecto, ejecuta:

```bash
nest g module tasks
nest g controller tasks
nest g service tasks
```

Estos comandos generan los archivos necesarios para organizar la funcionalidad de tareas.

La estructura resultante será similar a esta:

```text
src/
├── tasks/
│   ├── tasks.controller.ts
│   ├── tasks.module.ts
│   └── tasks.service.ts
├── app.module.ts
└── main.ts
```

### 6.4. Responsabilidades de cada componente

**Módulo (`Module`)**

Agrupa los componentes que pertenecen a una funcionalidad.

**Controlador (`Controller`)**

Recibe las solicitudes HTTP, define las rutas y devuelve las respuestas.

**Servicio (`Service`)**

Contiene la lógica de negocio y las operaciones que utiliza el controlador.

En esta práctica utilizaremos la siguiente estructura:

```text
Cliente / Postman
       |
       v
TasksController
       |
       v
TasksService
       |
       v
Arreglo temporal de tareas
```

Por ahora no utilizaremos una base de datos. Los datos estarán almacenados en memoria.

---

## 7. Práctica guiada: crear la API TaskFlow

### 7.1. Crear el servicio

Abre el archivo `src/tasks/tasks.service.ts` y reemplaza su contenido por:

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';

export type Task = {
  id: number;
  title: string;
  completed: boolean;
};

@Injectable()
export class TasksService {
  private readonly tasks: Task[] = [
    {
      id: 1,
      title: 'Aprender TypeScript',
      completed: true,
    },
    {
      id: 2,
      title: 'Crear mi primera API con NestJS',
      completed: false,
    },
    {
      id: 3,
      title: 'Probar endpoints con Postman',
      completed: false,
    },
  ];

  findAll(): Task[] {
    return this.tasks;
  }

  findOne(id: number): Task {
    const task = this.tasks.find((item) => item.id === id);

    if (!task) {
      throw new NotFoundException(
        `No existe una tarea con ID ${id}`,
      );
    }

    return task;
  }
}
```

#### Explicación del código

- `@Injectable()` indica que la clase puede participar en el sistema de inyección de dependencias de NestJS.
- `Task` define la estructura de una tarea.
- `private readonly tasks` declara un arreglo de tareas que no puede reasignarse a otro arreglo desde esta clase; sus elementos todavía pueden modificarse.
- `findAll()` devuelve todas las tareas.
- `findOne(id)` busca una tarea por su identificador.
- `NotFoundException` genera una respuesta HTTP 404 cuando no se encuentra la tarea.

### 7.2. Crear el controlador

Abre `src/tasks/tasks.controller.ts` y utiliza el siguiente código:

```typescript
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import { TasksService } from './tasks.service';
import type { Task } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
  ) {}

  @Get()
  findAll(): Task[] {
    return this.tasksService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Task {
    return this.tasksService.findOne(id);
  }
}
```

#### Explicación del código

**`@Controller('tasks')`**

Define la ruta base del controlador. En este caso, `/tasks`.

**`@Get()`**

Atiende solicitudes GET a la ruta base.

**`@Get(':id')`**

Atiende solicitudes GET que incluyen un identificador en la URL.

**`@Param('id', ParseIntPipe)`**

Obtiene el parámetro `id` de la URL y lo convierte en número entero. Si el valor no es válido, NestJS devuelve un error HTTP 400.

**Inyección del servicio**

```typescript
constructor(
  private readonly tasksService: TasksService,
) {}
```

NestJS proporciona una instancia de `TasksService` al controlador. Por eso no es necesario crearla manualmente con `new TasksService()`.

---

## 8. Configurar el módulo de tareas

Abre `src/tasks/tasks.module.ts` y verifica que tenga este contenido:

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

En este módulo:

- `controllers` registra el controlador.
- `providers` registra el servicio que NestJS debe administrar e inyectar.

### 8.1. Registrar el módulo en la aplicación

Abre `src/app.module.ts`.

Agrega la importación de `TasksModule`:

```typescript
import { TasksModule } from './tasks/tasks.module';
```

Inclúyelo en el arreglo `imports` del decorador `@Module`.

Por ejemplo:

```typescript
@Module({
  imports: [TasksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

**Importante:** el ejemplo anterior muestra únicamente la estructura relevante. Si tu archivo original contiene otras importaciones, controladores o servicios, consérvalos y agrega `TasksModule` al arreglo `imports`.

Guarda los archivos. Si el servidor está ejecutándose con `npm run start:dev`, NestJS normalmente detectará los cambios y recompilará la aplicación.

---

## 9. Probar la API con Postman

Asegúrate de que el servidor esté activo en el puerto 3000.

### Prueba 1: obtener todas las tareas

**Método:** GET

```text
http://localhost:3000/tasks
```

Resultado esperado: HTTP 200 OK.

La respuesta debe incluir las tres tareas registradas en el servicio.

### Prueba 2: obtener una tarea existente

**Método:** GET

```text
http://localhost:3000/tasks/2
```

Resultado esperado: HTTP 200 OK.

Respuesta esperada:

```json
{
  "id": 2,
  "title": "Crear mi primera API con NestJS",
  "completed": false
}
```

### Prueba 3: buscar una tarea inexistente

**Método:** GET

```text
http://localhost:3000/tasks/99
```

Resultado esperado: HTTP 404 Not Found.

La respuesta debe indicar que no existe una tarea con ese identificador.

### Prueba 4: enviar un identificador inválido

**Método:** GET

```text
http://localhost:3000/tasks/abc
```

Resultado esperado: HTTP 400 Bad Request.

El error se produce porque `ParseIntPipe` no puede convertir `abc` en un número entero.

### Resumen de las pruebas

| Caso | Endpoint | Resultado esperado |
|---|---|---|
| Consultar todas las tareas | `GET /tasks` | 200 |
| Consultar tarea existente | `GET /tasks/2` | 200 |
| Consultar tarea inexistente | `GET /tasks/99` | 404 |
| Enviar ID inválido | `GET /tasks/abc` | 400 |

---

## 10. Actividad práctica individual

Completa las siguientes tareas:

1. Agrega una cuarta tarea al arreglo del servicio:
   - ID: `4`
   - Título: `Practicar arquitectura backend`
   - Completada: `false`
2. Comprueba que aparezca al consultar `GET /tasks`.
3. Consulta individualmente `GET /tasks/4`.
4. Prueba un identificador inexistente.
5. Prueba un identificador que no sea numérico.
6. Explica con tus propias palabras la diferencia entre un controlador y un servicio.

### Preguntas de reflexión

1. ¿Qué responsabilidad tiene `TasksController`?
2. ¿Por qué la lógica de búsqueda se encuentra en `TasksService`?
3. ¿Qué función cumple `TasksModule`?
4. ¿Por qué utilizamos `ParseIntPipe`?
5. ¿Qué limitación tiene almacenar las tareas en un arreglo en memoria?

---

## 11. Errores frecuentes

| Problema | Posible solución |
|---|---|
| `nest` no se reconoce como comando | Comprueba la instalación de Nest CLI o utiliza los scripts de npm cuando corresponda. |
| El servidor no inicia | Revisa el mensaje de error en la terminal y las dependencias instaladas. |
| La ruta devuelve 404 | Verifica que `TasksModule` esté registrado en `AppModule`. |
| Error de dependencia de `TasksService` | Comprueba que esté registrado en `providers` de `TasksModule`. |
| Error de importación | Verifica las rutas relativas y los nombres de los archivos. |
| Los cambios no aparecen | Guarda los archivos y revisa que el servidor se haya recompilado correctamente. |
| Los datos desaparecen al reiniciar | Es normal: las tareas están almacenadas en memoria y no en una base de datos. |

---

## 12. Conclusiones

En esta sesión aprendimos que:

- TypeScript permite definir tipos para variables, objetos y funciones.
- Las clases permiten organizar datos y comportamientos.
- NestJS utiliza módulos para organizar funcionalidades.
- Los controladores reciben las solicitudes HTTP.
- Los servicios concentran la lógica de negocio.
- La inyección de dependencias permite que NestJS proporcione los servicios necesarios.
- Postman permite verificar el comportamiento de los endpoints.
- Las excepciones de NestJS permiten devolver respuestas HTTP apropiadas.

La API desarrollada es una primera aproximación a una arquitectura backend estructurada. En las siguientes sesiones podremos ampliar TaskFlow con validación de datos, DTO, persistencia en PostgreSQL mediante Prisma, autenticación y pruebas automatizadas.
