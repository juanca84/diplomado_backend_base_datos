# Guía del docente — Sesión 8
# Arquitectura de NestJS: Modules, Controllers, Services y Dependency Injection

**Módulo:** Arquitectura del Back-End y Bases de Datos  
**Duración:** 2 horas (120 minutos)  
**Proyecto práctico:** TaskFlow API  
**Tecnologías:** Node.js, NestJS, TypeScript y Postman  
**Continuidad:** proyecto iniciado en la sesión 7.

---

# 1. Planificación de la sesión

## 1.1. Objetivo general

Comprender e implementar la arquitectura modular de NestJS mediante módulos, controladores, servicios e inyección de dependencias, ampliando una API existente sin mezclar las responsabilidades de sus componentes.

## 1.2. Resultados de aprendizaje

Al finalizar la sesión, el estudiante podrá:

- Explicar la función de un módulo, un controlador y un servicio.
- Comprender cómo NestJS administra las instancias de las clases.
- Explicar la inyección de dependencias utilizando constructores de TypeScript.
- Registrar controladores y proveedores en un módulo.
- Implementar un endpoint `POST /tasks`.
- Probar una API organizada utilizando Postman.

## 1.3. Distribución del tiempo

| Actividad | Duración |
|---|---:|
| Diapositiva 1. Objetivos y continuidad | 5 min |
| Diapositiva 2. Introducción a NestJS | 10 min |
| Diapositiva 3. Módulos, controladores y servicios | 15 min |
| Diapositiva 4. Estructura del proyecto | 10 min |
| Diapositiva 5. Flujo HTTP | 10 min |
| Diapositiva 6. Inyección de dependencias | 20 min |
| Diapositiva 7. Configuración del módulo | 10 min |
| Diapositiva 8. Práctica guiada | 35 min |
| Verificación y cierre | 5 min |
| **Total** | **120 min** |

La explicación conceptual debe acompañarse de pequeños ejemplos de código. La práctica final debe realizarse sobre el proyecto que los estudiantes ya tienen, evitando crear otra aplicación innecesariamente.

---

# 2. Diapositiva 1. Objetivos de la sesión

## Explicación para el docente

Comenzar recordando que en las sesiones anteriores los estudiantes trabajaron con Node.js, Express, APIs REST, bases de datos y una organización del código por responsabilidades.

Ahora utilizaremos NestJS para entender cómo un framework puede proporcionar una estructura más definida para organizar una aplicación backend.

Es importante aclarar que no estamos abandonando los conceptos de HTTP, rutas, controladores y servicios que aprendieron con Express. Estamos aprendiendo a implementar conceptos similares mediante las herramientas y convenciones de NestJS.

### Preguntas iniciales

1. ¿Qué sucede cuando un cliente realiza una petición `GET /tasks`?
2. ¿Dónde debería estar la lógica que obtiene las tareas?
3. ¿Sería conveniente escribir toda la aplicación dentro de `main.ts`?
4. ¿Qué ventajas tiene dividir una aplicación en archivos y clases?

### Respuestas que se esperan

- El servidor recibe una petición HTTP y devuelve una respuesta.
- La lógica de negocio debería estar en un servicio.
- `main.ts` debe iniciar la aplicación, no contener toda la lógica.
- Separar responsabilidades facilita el mantenimiento, la reutilización y las pruebas.

**Idea que debe quedar clara:** una API no se organiza únicamente para que funcione; también debe estar diseñada para poder modificarse y crecer.

---

# 3. Diapositiva 2. ¿Qué es NestJS?

## 3.1. Concepto

NestJS es un framework para construir aplicaciones del lado del servidor con Node.js. Utiliza TypeScript de forma habitual y proporciona herramientas para estructurar aplicaciones mediante módulos, controladores, proveedores y otros componentes.

A diferencia de construir una aplicación Express completamente a partir de decisiones propias, NestJS establece convenciones para organizar el código.

Esto no significa que Express sea incorrecto o que NestJS sea automáticamente mejor en todos los casos. La diferencia principal es el nivel de estructura que ofrece el framework.

## 3.2. Conceptos fundamentales

**Framework:** conjunto de herramientas, convenciones y mecanismos que facilitan el desarrollo de una aplicación.

**TypeScript:** lenguaje que amplía JavaScript con un sistema de tipos estático y otras capacidades para desarrollar aplicaciones mantenibles.

**Decorador:** una característica de TypeScript que permite añadir metadatos o modificar el comportamiento de clases y miembros de clase.

Ejemplos que utilizaremos:

- `@Module()`
- `@Controller()`
- `@Injectable()`
- `@Get()`
- `@Post()`

En NestJS, estos decoradores permiten declarar cómo deben interpretarse y conectarse los componentes.

## 3.3. Ejemplo sencillo

```typescript
@Controller('tasks')
export class TasksController {
  @Get()
  findAll() {
    return [];
  }
}
```

Explicar línea por línea:

- `@Controller('tasks')`: declara un controlador cuya ruta base es `/tasks`.
- `export class TasksController`: define y exporta una clase TypeScript.
- `@Get()`: indica que el método responde a solicitudes HTTP GET en la ruta correspondiente.
- `findAll()`: es un método que devuelve un arreglo vacío.

Si este controlador está correctamente registrado en un módulo, la petición `GET /tasks` puede devolver:

```json
[]
```

Todavía no hay acceso a una base de datos ni un servicio involucrado en este ejemplo.

**Pregunta al grupo:** ¿qué pasaría si el método devolviera una lista de tareas en lugar de un arreglo vacío?

Respuesta esperada: el cliente recibiría los datos devueltos por el método como respuesta HTTP.

---

# 4. Diapositiva 3. Modules, Controllers y Services

Este es el primer bloque conceptual importante de la clase.

## 4.1. Modules: módulos

Un módulo representa una unidad organizativa de la aplicación.

En NestJS, un módulo declara qué controladores pertenecen a esa funcionalidad, qué proveedores ofrece y qué otros módulos necesita importar.

Por ejemplo, una aplicación puede tener:

- `UsersModule`: administración de usuarios.
- `TasksModule`: administración de tareas.
- `AuthModule`: autenticación.
- `ReportsModule`: generación de informes.

La ventaja es que el código queda organizado según las funcionalidades del sistema.

### Ejemplo

```typescript
@Module({
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
```

El módulo indica que:

- `TasksController` es un controlador de esta funcionalidad.
- `TasksService` es un proveedor que NestJS debe administrar dentro del contexto del módulo.

El módulo no contiene necesariamente la lógica para crear tareas. Su responsabilidad principal es declarar y organizar los componentes.

## 4.2. Controllers: controladores

El controlador es el punto de entrada de las solicitudes HTTP para una determinada funcionalidad.

Sus responsabilidades habituales son:

- Definir las rutas.
- Recibir parámetros de la URL.
- Recibir datos enviados por el cliente.
- Invocar el servicio correspondiente.
- Devolver el resultado de la operación.

Un controlador no debería convertirse en el lugar donde se implementan todas las reglas de negocio.

### Ejemplo conceptual

Cuando un cliente envía:

```http
GET /tasks
```

NestJS identifica el controlador correspondiente y ejecuta el método asociado a esa ruta.

El controlador puede delegar la operación:

```typescript
return this.tasksService.findAll();
```

La lógica de consulta queda en el servicio.

## 4.3. Services: servicios

Un servicio es una clase que implementa lógica de negocio u operaciones reutilizables.

En TaskFlow, el servicio de tareas puede encargarse de:

- Listar las tareas.
- Buscar una tarea por identificador.
- Crear una nueva tarea.
- Comprobar si una tarea existe.
- Aplicar reglas relacionadas con las tareas.

En una aplicación real, el servicio también puede coordinarse con un repositorio para leer y escribir en una base de datos.

En esta sesión utilizaremos un arreglo en memoria para concentrarnos en la arquitectura.

### Comparación para explicar en clase

| Componente | Pregunta que responde |
|---|---|
| Module | ¿Cómo se agrupan y registran los componentes? |
| Controller | ¿Cómo recibe y atiende las solicitudes HTTP? |
| Service | ¿Qué operación o regla de negocio debe ejecutarse? |

### Error frecuente

Un estudiante podría escribir toda la lógica dentro del controlador:

```typescript
@Get()
findAll() {
  const tasks = [
    { id: 1, title: 'Estudiar NestJS' },
  ];

  return tasks;
}
```

Esto funciona, pero si se incorporan varias operaciones, el controlador empieza a acumular responsabilidades.

Una organización mejor consiste en que el controlador delegue en el servicio:

```typescript
@Get()
findAll() {
  return this.tasksService.findAll();
}
```

El arreglo y las operaciones sobre las tareas se trasladan a `TasksService`.

---

# 5. Diapositiva 4. Organización del proyecto

## 5.1. Estructura inicial

Revisar con los estudiantes el proyecto creado en la sesión 7.

Una estructura posible es:

```text
src/
├── main.ts
├── app.module.ts
└── tasks/
    ├── tasks.module.ts
    ├── tasks.controller.ts
    └── tasks.service.ts
```

Si el proyecto tiene archivos adicionales, como `app.controller.ts`, `app.service.ts`, archivos de pruebas o archivos de configuración, no es necesario eliminarlos. La estructura anterior muestra solamente los componentes relevantes para esta clase.

## 5.2. Responsabilidad de cada archivo

### `main.ts`

Es el punto de entrada de la aplicación.

Habitualmente contiene la creación de la aplicación NestJS y el inicio del servidor HTTP.

### `app.module.ts`

Es el módulo raíz. Desde él se organiza la composición inicial de la aplicación, incluyendo la importación de otros módulos.

### `tasks.module.ts`

Declara los componentes relacionados con la funcionalidad de tareas.

### `tasks.controller.ts`

Define los endpoints de la API de tareas.

### `tasks.service.ts`

Contiene las operaciones y la lógica de negocio relacionadas con las tareas.

## 5.3. Comandos de revisión

Desde la terminal, ubicarse en la carpeta del proyecto:

```powershell
npm run start:dev
```

Este comando inicia la aplicación en modo de desarrollo si el proyecto conserva la configuración habitual del CLI de NestJS.

En otra terminal, revisar los archivos y carpetas:

```powershell
Get-ChildItem .\src -Recurse
```

Si se necesita generar un módulo o un componente que todavía no existe, el CLI puede ayudar:

```powershell
nest g module tasks
nest g controller tasks
nest g service tasks
```

**Importante:** ejecutar estos comandos solamente si los componentes no existen. Si el proyecto de la sesión 7 ya contiene `TasksModule`, `TasksController` y `TasksService`, se deben reutilizar.

### Pregunta para los estudiantes

¿Por qué no deberíamos crear un segundo `TasksModule` para continuar la clase?

Respuesta esperada: porque ya existe una unidad que representa la funcionalidad de tareas. Debemos ampliarla en lugar de duplicar la misma responsabilidad.

---

# 6. Diapositiva 5. Flujo de una solicitud HTTP

## 6.1. Explicación conceptual

Para comprender la arquitectura, es necesario seguir una solicitud desde el cliente hasta el servidor y de regreso.

Supongamos que Postman envía:

```http
GET /tasks
```

El flujo es el siguiente:

1. El cliente envía una solicitud HTTP.
2. NestJS identifica el controlador y el método asociados con la ruta.
3. El controlador invoca el servicio.
4. El servicio ejecuta la operación solicitada.
5. El resultado regresa al controlador.
6. NestJS transforma el resultado en una respuesta HTTP.

Representación:

```text
Postman
   |
   v
TasksController
   |
   v
TasksService
   |
   v
Resultado
   |
   v
Respuesta HTTP
```

## 6.2. Explicación de `GET /tasks`

En el controlador:

```typescript
@Get()
findAll() {
  return this.tasksService.findAll();
}
```

El método no necesita conocer dónde están almacenadas las tareas. Simplemente delega la operación.

En el servicio:

```typescript
findAll() {
  return this.tasks;
}
```

El servicio conoce la estructura que contiene los datos y devuelve el resultado.

En nuestra práctica, `this.tasks` será un arreglo almacenado en memoria.

## 6.3. ¿Qué sucede con `POST /tasks`?

Cuando el cliente envía una nueva tarea:

```http
POST /tasks
Content-Type: application/json
```

Con el cuerpo:

```json
{
  "title": "Aprender NestJS",
  "description": "Practicar inyección de dependencias"
}
```

El controlador recibe el cuerpo HTTP y llama al servicio para crear la tarea.

El servicio genera un identificador, guarda el nuevo objeto y devuelve la tarea creada.

Este será el objetivo principal de la práctica guiada.

## 6.4. Aclaración importante

En esta sesión, el servicio almacenará los datos en memoria. Esto significa que los datos pueden perderse al reiniciar el servidor.

En una aplicación con persistencia, el servicio podría delegar la operación en un repositorio que utilice PostgreSQL y Prisma.

No necesitamos implementar ese repositorio todavía para comprender la arquitectura de NestJS.

---

# 7. Diapositiva 6. Inyección de dependencias

**Este es el concepto central de la sesión.** Se recomienda dedicarle tiempo suficiente y explicar primero el problema que resuelve antes de mostrar el código.

## 7.1. ¿Qué es una dependencia?

Una dependencia es un componente que una clase necesita para realizar su trabajo.

Por ejemplo, `TasksController` necesita acceder a las operaciones definidas en `TasksService`.

Por tanto, `TasksService` es una dependencia del controlador.

De forma similar, en una aplicación más grande, `TasksService` podría depender de un repositorio que accede a PostgreSQL.

La relación puede representarse así:

```text
TasksController
       |
       | necesita
       v
TasksService
```

El controlador no necesita conocer todos los detalles internos del servicio. Solo necesita utilizar sus métodos.

## 7.2. Primera forma: crear la dependencia manualmente

Para explicar el problema, mostrar este ejemplo simplificado:

```typescript
class TasksService {
  findAll() {
    return [];
  }
}

class TasksController {
  private readonly tasksService: TasksService;

  constructor() {
    this.tasksService = new TasksService();
  }

  findAll() {
    return this.tasksService.findAll();
  }
}
```

Este código es TypeScript válido como ejemplo de clases independientes, aunque todavía no representa el patrón recomendado para integrar los componentes de NestJS.

Explicar:

- `TasksService` es una clase.
- `TasksController` necesita una instancia de `TasksService`.
- El controlador utiliza `new TasksService()` para crearla.
- El propio controlador decide cómo crear esa dependencia.

Este enfoque puede funcionar en aplicaciones pequeñas, pero tiene desventajas cuando las dependencias se vuelven más complejas.

Por ejemplo, si el servicio necesita un repositorio, configuración o un cliente externo, el controlador podría tener que conocer también cómo se construyen esos objetos.

Esto aumenta el acoplamiento entre las clases.

Además, el controlador queda a cargo de una tarea que no es su responsabilidad principal: construir y administrar las dependencias que necesita.

## 7.3. Segunda forma: inyección de dependencias

NestJS proporciona un contenedor de inyección de dependencias.

Este contenedor conoce los proveedores registrados en los módulos y administra la creación de sus instancias.

En lugar de construir directamente el servicio dentro del controlador, declaramos que el controlador necesita una instancia de `TasksService`.

### Servicio

Archivo: `src/tasks/tasks.service.ts`

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksService {
  findAll() {
    return [];
  }
}
```

### Controlador

Archivo: `src/tasks/tasks.controller.ts`

```typescript
import { Controller, Get } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
  ) {}

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }
}
```

### Explicación línea por línea

**`@Injectable()`**

Este decorador marca la clase como un proveedor que puede participar en el sistema de inyección de dependencias de NestJS.

No crea por sí solo una instancia ni registra automáticamente el servicio en cualquier módulo. También debemos declararlo como proveedor en el módulo correspondiente.

**`export class TasksService`**

Define y exporta la clase para que otros archivos puedan importarla.

**`constructor(...)`**

El constructor es un método especial que se ejecuta cuando se crea una instancia de una clase.

En NestJS, los parámetros del constructor pueden declarar las dependencias que necesita el componente.

**`private readonly tasksService: TasksService`**

Esta declaración utiliza características de TypeScript:

- `private`: limita el acceso directo a la propiedad desde fuera de la clase.
- `readonly`: impide reasignar la propiedad después de su inicialización.
- `tasksService`: nombre de la propiedad.
- `TasksService`: tipo de la dependencia.

TypeScript crea la propiedad a partir del parámetro del constructor, gracias a la sintaxis de parámetro de propiedad.

**¿Qué significa `TasksService` en el constructor?**

En este caso, el tipo de la clase le permite a NestJS identificar la dependencia que debe resolver.

Cuando NestJS crea el controlador, busca un proveedor compatible registrado en el contexto del módulo y entrega la instancia al constructor.

**`this.tasksService.findAll()`**

El controlador utiliza el servicio que recibió. No necesita construirlo ni administrar su ciclo de vida.

## 7.4. ¿Cómo sabe NestJS qué debe inyectar?

Esta es la parte que se debe explicar con especial atención.

NestJS combina tres elementos:

1. **Proveedor:** `TasksService` está declarado como un proveedor.
2. **Módulo:** `TasksModule` registra ese proveedor.
3. **Dependencia:** el constructor de `TasksController` declara que necesita `TasksService`.

El contenedor de NestJS resuelve esa relación cuando construye la aplicación.

No es el controlador quien busca el servicio. Tampoco es necesario escribir `new TasksService()` en su constructor.

Es NestJS quien administra la creación y entrega de la dependencia.

## 7.5. ¿Dónde se registra el servicio?

Archivo: `src/tasks/tasks.module.ts`

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

La propiedad `providers` informa a NestJS de que `TasksService` debe estar disponible como proveedor en ese módulo.

La propiedad `controllers` registra el controlador.

Si el servicio no está registrado en el contexto adecuado, NestJS no podrá resolver normalmente la dependencia y mostrará un error de resolución al iniciar la aplicación.

## 7.6. ¿Qué beneficios tiene la inyección de dependencias?

**Menor acoplamiento:** el controlador no necesita conocer los detalles de construcción del servicio.

**Reutilización:** otros componentes pueden utilizar el mismo proveedor cuando corresponda.

**Mantenimiento:** es posible cambiar la implementación de una dependencia sin reescribir toda la clase que la utiliza, siempre que se conserve el contrato esperado.

**Pruebas:** resulta más sencillo proporcionar una implementación simulada del servicio cuando se realizan pruebas unitarias del controlador.

**Administración centralizada:** NestJS puede construir y resolver las dependencias registradas en los módulos.

## 7.7. Aclaración sobre las instancias

Por defecto, los proveedores de NestJS utilizan el ámbito de ciclo de vida `DEFAULT`, que administra una instancia compartida dentro del contexto correspondiente.

Esto significa que no se crea una nueva instancia del servicio para cada llamada a `findAll()`.

Las solicitudes HTTP invocan los métodos de la instancia que NestJS ha proporcionado, salvo que se configure un ámbito diferente.

## 7.8. Ejercicio oral

Preguntar a los estudiantes:

**Si `TasksController` necesita `TasksService`, ¿quién crea y proporciona la instancia en nuestra arquitectura?**

Respuesta esperada: NestJS, mediante su contenedor de inyección de dependencias, siempre que el proveedor esté registrado correctamente.

**Pregunta adicional:** ¿qué ocurriría si eliminamos `TasksService` de `providers`?

Respuesta esperada: NestJS normalmente no podrá resolver la dependencia y mostrará un error indicando que no puede resolver las dependencias del controlador.

---

# 8. Diapositiva 7. Configuración del módulo

## 8.1. Código que revisaremos

Archivo: `src/tasks/tasks.module.ts`

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

## 8.2. Explicación de `@Module()`

`@Module()` permite declarar metadatos de configuración que NestJS utiliza para organizar y construir la aplicación.

### `controllers`

```typescript
controllers: [TasksController]
```

Indica qué controladores administra el módulo.

Los controladores son los componentes que atienden las rutas HTTP declaradas mediante decoradores como `@Get()` y `@Post()`.

### `providers`

```typescript
providers: [TasksService]
```

Declara los proveedores disponibles en el módulo.

Los proveedores pueden ser servicios y otros componentes que NestJS necesita crear o resolver mediante su contenedor.

### `imports`

Aunque no lo necesitamos para esta práctica, la propiedad `imports` permite importar otros módulos para acceder a los proveedores que estos exportan.

### `exports`

Permite que un módulo haga disponibles determinados proveedores para otros módulos que lo importen.

No es necesario exportar `TasksService` si únicamente lo utiliza el controlador dentro de `TasksModule`.

## 8.3. Relación con el módulo raíz

Archivo: `src/app.module.ts`

Si el proyecto no tiene todavía `TasksModule` importado, debemos incorporarlo:

```typescript
import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [TasksModule],
})
export class AppModule {}
```

Si `AppModule` ya contiene otros módulos o componentes, debemos conservarlos y añadir `TasksModule` a la lista existente, sin sustituir innecesariamente toda la configuración.

### Concepto importante

El módulo raíz permite componer la aplicación, mientras que `TasksModule` agrupa los componentes de la funcionalidad de tareas.

El registro de módulos y proveedores permite que NestJS resuelva las dependencias de los controladores.

---

# 9. Diapositiva 8. Práctica guiada: ampliar TaskFlow

## 9.1. Objetivo de la práctica

Ampliar la API creada en la sesión 7 incorporando `POST /tasks`.

El estudiante debe comprobar que:

- El controlador recibe la solicitud HTTP.
- El servicio crea la tarea.
- NestJS inyecta el servicio en el controlador.
- El módulo registra los componentes correctamente.
- Los endpoints funcionan al probarlos con Postman.

## 9.2. Revisar el estado inicial

Antes de modificar código:

1. Abrir el proyecto TaskFlow de la sesión 7.
2. Ejecutar `npm run start:dev`.
3. Comprobar que `GET /tasks` funciona.
4. Comprobar que `GET /tasks/:id` funciona.
5. Revisar los archivos `tasks.module.ts`, `tasks.controller.ts` y `tasks.service.ts`.

Si estos endpoints ya existen, no debemos reemplazar la estructura anterior sin revisar su implementación.

## 9.3. Archivos que utilizaremos

Para esta práctica necesitaremos los siguientes archivos:

```text
src/
├── app.module.ts
└── tasks/
    ├── tasks.module.ts
    ├── tasks.controller.ts
    └── tasks.service.ts
```

No crearemos un segundo módulo ni un segundo controlador para las tareas.

Para mantener el enfoque de la sesión, utilizaremos un objeto sencillo para representar una tarea y un DTO básico para los datos recibidos por HTTP.

## 9.4. Paso 1: definir los datos de entrada

Crear la carpeta `dto` dentro de `src/tasks`, si todavía no existe.

Crear el archivo:

`src/tasks/dto/create-task.dto.ts`

```typescript
export class CreateTaskDto {
  title: string;
  description: string;
}
```

### Explicación

DTO significa *Data Transfer Object*.

Es un objeto que define la estructura de los datos que una operación espera recibir o transferir.

En este ejemplo, la creación de una tarea requiere un título y una descripción.

Todavía no estamos validando si el título está vacío o si la descripción cumple una longitud determinada. Eso se trabajará posteriormente mediante las herramientas de validación de NestJS.

## 9.5. Paso 2: implementar el servicio

Abrir `src/tasks/tasks.service.ts`.

Para este ejemplo, utilizaremos el siguiente código:

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

### Explicación del código

**`interface Task`**

Define la estructura de una tarea en TypeScript.

Cada tarea debe contener:

- `id`: identificador numérico.
- `title`: título de la tarea.
- `description`: descripción de la tarea.

Una interfaz ayuda a comprobar que los objetos respetan una estructura esperada durante el desarrollo.

**`private tasks: Task[]`**

Declara un arreglo privado de tareas.

El arreglo se inicializa con dos ejemplos para que los estudiantes puedan probar los endpoints sin enviar primero una solicitud de creación.

**`findAll()`**

Devuelve todas las tareas almacenadas.

**`findOne(id: number)`**

Busca una tarea mediante su identificador.

El método `find()` recorre el arreglo hasta encontrar el elemento que cumple la condición.

Si no encuentra una tarea, lanza `NotFoundException`, una excepción de NestJS que representa un error HTTP 404.

**`create(createTaskDto: CreateTaskDto)`**

Recibe los datos necesarios para crear una tarea.

Calcula un identificador a partir del mayor ID existente, construye el objeto, lo añade al arreglo y devuelve la nueva tarea.

En una aplicación real, la generación del identificador y el almacenamiento corresponderían normalmente a la base de datos.

**Limitación que debemos explicar:** el arreglo es temporal. Los datos creados desaparecerán cuando se reinicie la aplicación.

## 9.6. Paso 3: implementar el controlador

Abrir `src/tasks/tasks.controller.ts`.

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

### Explicación para el docente

**`@Controller('tasks')`**

Declara la ruta base del controlador.

**`@Get()`**

Define el endpoint `GET /tasks`.

**`@Get(':id')`**

Define una ruta que contiene un parámetro variable, como `GET /tasks/1`.

**`@Param('id', ParseIntPipe)`**

Obtiene el parámetro `id` de la URL y utiliza `ParseIntPipe` para convertirlo a entero. Si el valor no es válido, NestJS genera un error de validación de la solicitud.

**`@Post()`**

Define el endpoint `POST /tasks`.

**`@Body()`**

Obtiene el cuerpo de la solicitud HTTP y lo entrega al método.

**`this.tasksService.create(createTaskDto)`**

Es la parte central del ejercicio: el controlador delega la operación de creación al servicio que recibió por inyección de dependencias.

El controlador no construye el arreglo, no calcula el identificador y no añade directamente la tarea. Esas operaciones permanecen en `TasksService`.

## 9.7. Paso 4: revisar el módulo

Archivo: `src/tasks/tasks.module.ts`

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

No hace falta añadir el DTO a `providers`. El DTO de esta práctica es una clase utilizada como tipo de los datos de entrada, no un servicio que necesitemos inyectar.

Comprobar también que `TasksModule` está importado en `AppModule`.

## 9.8. Paso 5: ejecutar y probar

Ejecutar:

```powershell
npm run start:dev
```

Si el servidor ya está ejecutándose en modo de desarrollo, comprobar los mensajes de compilación y los errores antes de probar los endpoints.

### Prueba A: listar tareas

En Postman:

```http
GET http://localhost:3000/tasks
```

Respuesta esperada: un arreglo con las dos tareas iniciales.

### Prueba B: buscar una tarea

```http
GET http://localhost:3000/tasks/1
```

Respuesta esperada:

```json
{
  "id": 1,
  "title": "Estudiar NestJS",
  "description": "Comprender su arquitectura"
}
```

### Prueba C: buscar una tarea inexistente

```http
GET http://localhost:3000/tasks/999
```

Respuesta esperada: HTTP 404, porque el servicio lanza `NotFoundException`.

### Prueba D: crear una tarea

En Postman, seleccionar el método POST:

```http
POST http://localhost:3000/tasks
```

En la pestaña **Body**, seleccionar **raw** y el formato **JSON**.

Enviar:

```json
{
  "title": "Aprender inyección de dependencias",
  "description": "Comprender cómo NestJS conecta los componentes"
}
```

Respuesta esperada:

```json
{
  "id": 3,
  "title": "Aprender inyección de dependencias",
  "description": "Comprender cómo NestJS conecta los componentes"
}
```

### Prueba E: comprobar el resultado

Ejecutar nuevamente:

```http
GET http://localhost:3000/tasks
```

La lista debe contener ahora tres tareas.

Si se reinicia el servidor, volverán a aparecer únicamente las dos tareas iniciales, porque no estamos utilizando una base de datos.

---

# 10. Errores frecuentes y cómo explicarlos

## Error 1. No registrar el servicio

Si `TasksService` no aparece en `providers`, NestJS puede mostrar un error de resolución de dependencias al iniciar la aplicación.

**Cómo resolverlo:** comprobar que `TasksModule` registra `TasksService` y que el módulo está importado en la aplicación.

## Error 2. Crear el servicio manualmente en el controlador

Evitar esta práctica:

```typescript
const service = new TasksService();
```

El controlador debe recibir el servicio mediante su constructor para que NestJS pueda administrar la dependencia.

## Error 3. Colocar toda la lógica en el controlador

Evitar implementar directamente el cálculo del identificador, la búsqueda y la modificación del arreglo dentro de `TasksController`.

**Cómo resolverlo:** trasladar esas operaciones a `TasksService`.

## Error 4. Confundir DTO con validación

Definir una clase DTO no garantiza por sí solo que los datos recibidos sean válidos.

En esta sesión usamos el DTO para organizar la estructura de entrada. La validación automática con `ValidationPipe`, `class-validator` y `class-transformer` se abordará posteriormente.

## Error 5. Olvidar importar el módulo

Aunque `TasksModule` esté correctamente definido, debe formar parte de la aplicación mediante la configuración de módulos.

**Cómo resolverlo:** revisar `AppModule` y su propiedad `imports`.

---

# 11. Verificación del aprendizaje

Reservar los últimos minutos para realizar preguntas orales.

**Pregunta 1.** ¿Cuál es la diferencia entre un controlador y un servicio?

Respuesta esperada: el controlador gestiona la comunicación HTTP; el servicio contiene la lógica de negocio.

**Pregunta 2.** ¿Qué es una dependencia?

Respuesta esperada: un componente que otra clase necesita para cumplir su responsabilidad.

**Pregunta 3.** ¿Qué hace `@Injectable()`?

Respuesta esperada: marca una clase para que pueda participar en el sistema de inyección de dependencias de NestJS.

**Pregunta 4.** ¿Quién proporciona `TasksService` a `TasksController`?

Respuesta esperada: el contenedor de inyección de dependencias de NestJS, cuando el proveedor está registrado correctamente.

**Pregunta 5.** ¿Por qué el controlador no debería crear directamente el servicio con `new`?

Respuesta esperada: porque NestJS debe administrar la resolución de las dependencias, lo que reduce el acoplamiento y facilita el mantenimiento y las pruebas.

**Pregunta 6.** ¿Dónde se registra `TasksService`?

Respuesta esperada: en la propiedad `providers` de `TasksModule`.

**Pregunta 7.** ¿Dónde se almacenan las tareas en esta práctica?

Respuesta esperada: en un arreglo dentro de `TasksService`. Los datos no son persistentes.

---

# 12. Cierre de la sesión

Finalizar reforzando tres ideas:

1. **La arquitectura organiza las responsabilidades:** módulos, controladores y servicios cumplen funciones diferentes.
2. **La inyección de dependencias evita que los componentes tengan que construir manualmente sus dependencias:** NestJS administra la creación y resolución de los proveedores registrados.
3. **La separación de responsabilidades facilita la evolución del sistema:** la misma API podrá incorporar validaciones, persistencia en PostgreSQL y pruebas automatizadas en sesiones posteriores.

## Preparación para la siguiente sesión

En la siguiente clase se podrá profundizar en la recepción y validación de datos utilizando DTO, `ValidationPipe` y las herramientas de validación de NestJS.

Así, el proyecto continuará creciendo sobre la misma arquitectura en lugar de empezar nuevamente desde cero.

---

# 13. Referencias para el docente

- Documentación oficial de NestJS: https://docs.nestjs.com/
- Módulos: https://docs.nestjs.com/modules
- Controladores: https://docs.nestjs.com/controllers
- Proveedores e inyección de dependencias: https://docs.nestjs.com/providers
- Validación: https://docs.nestjs.com/techniques/validation

**Nota final:** antes de la clase, verificar el estado real del proyecto de la sesión 7. Los ejemplos de esta guía deben integrarse con los archivos existentes, conservando cualquier configuración previa necesaria para que TaskFlow siga funcionando.