# Guía del docente — Sesión 7
## TypeScript y primeros pasos con NestJS

**Módulo:** Arquitectura del Back-End y Bases de Datos  
**Duración:** 2 horas (120 minutos)  
**Proyecto práctico:** TaskFlow API  
**Modalidad:** Explicación guiada y práctica en Visual Studio Code  
**Herramientas:** Node.js, npm, NestJS CLI, TypeScript, Visual Studio Code y Postman.

---

# 1. Propósito de la sesión

Esta sesión introduce a los estudiantes en el desarrollo backend estructurado mediante TypeScript y NestJS. Se busca que comprendan cómo pasar de una aplicación backend sencilla a una organización modular que facilite el mantenimiento, la reutilización y las pruebas.

La sesión no pretende cubrir todas las funcionalidades de NestJS. Su objetivo es que los estudiantes comprendan la arquitectura básica y puedan construir una API REST con dos endpoints de consulta.

## Resultados de aprendizaje

Al finalizar la clase, el estudiante debería poder:

1. Explicar la diferencia entre JavaScript y TypeScript.
2. Definir tipos para objetos, parámetros y valores de retorno.
3. Comprender clases, modificadores de acceso y decoradores.
4. Explicar qué es la inyección de dependencias.
5. Diferenciar módulos, controladores y servicios en NestJS.
6. Crear un proyecto NestJS y ejecutar su servidor.
7. Implementar `GET /tasks` y `GET /tasks/:id`.
8. Validar las respuestas de una API utilizando Postman.
9. Identificar errores HTTP 400 y 404 en escenarios sencillos.

## Alcance de la práctica

Durante esta sesión se trabajará con un arreglo de tareas almacenado en memoria.

No se implementarán todavía:

- Conexión a PostgreSQL o MongoDB.
- Prisma ni otro ORM.
- Autenticación con JWT.
- Operaciones POST, PUT, PATCH o DELETE.
- DTO y validación de cuerpos de solicitud.
- Pruebas automatizadas.

Estos temas se incorporarán posteriormente. Conviene explicar que los datos en memoria son únicamente una solución didáctica y que se pierden cuando se reinicia la aplicación.

---

# 2. Plan de la clase

| Etapa | Tiempo | Actividad |
|---|---:|---|
| Diapositiva 1 | 5 min | Presentación y objetivos |
| Diapositiva 2 | 5 min | Express y NestJS |
| Diapositiva 3 | 15 min | Tipos de TypeScript |
| Diapositiva 4 | 10 min | Funciones, clases y modificadores |
| Diapositiva 5 | 5 min | Conceptos fundamentales de NestJS |
| Diapositiva 6 | 10 min | Arquitectura e inyección de dependencias |
| Diapositiva 7 | 10 min | Creación del proyecto y componentes |
| Diapositiva 8 | 15 min | Implementación del servicio |
| Diapositiva 9 | 15 min | Implementación del controlador y pruebas |
| Diapositiva 10 | 10 min | Reto, evaluación y conclusiones |
| **Total** | **100 min** | |
| **Práctica integrada y resolución de dudas** | **20 min** | Tiempo flexible distribuido durante la clase |
| **Duración total** | **120 min** | |

**Recomendación docente:** la programación anterior es orientativa. Durante la práctica integrada, reserva tiempo para verificar que los estudiantes hayan registrado el módulo, ejecutado el servidor y probado los endpoints. Si el grupo ya domina los tipos de TypeScript, puedes acelerar los ejemplos iniciales.

---

# 3. Preparación previa del docente

Antes de impartir la sesión, comprueba lo siguiente:

- Node.js está instalado.
- npm funciona desde la terminal.
- Visual Studio Code está disponible.
- Postman está instalado o accesible.
- La conexión a internet permite instalar dependencias.
- El puerto 3000 está libre.
- El proyecto de demostración puede crearse y ejecutarse correctamente.

Ejecuta estos comandos:

```bash
node --version
npm --version
```

Si deseas comprobar la instalación global de NestJS CLI:

```bash
nest --version
```

Si `nest` no está instalado, podrás instalarlo durante la clase.

## Recomendación para la demostración

Es conveniente que el docente tenga preparado un proyecto funcional de respaldo. La instalación de dependencias puede consumir tiempo o fallar por problemas de red, permisos o configuración del equipo.

No es necesario que los estudiantes instalen manualmente TypeScript de forma global. NestJS administra las dependencias necesarias para compilar el proyecto.

---

# 4. Guía detallada por diapositiva

# Diapositiva 1. TypeScript y NestJS

**Tiempo sugerido:** 5 minutos.

## Objetivo

Presentar el propósito de la sesión y conectar los conocimientos previos de los estudiantes con el desarrollo backend estructurado.

## Conceptos que debes explicar

Un backend recibe solicitudes de clientes, ejecuta operaciones y devuelve respuestas. Puede atender solicitudes de una página web, una aplicación móvil u otro sistema.

Por ejemplo, una aplicación de tareas podría necesitar:

- Consultar las tareas registradas.
- Consultar una tarea por identificador.
- Crear nuevas tareas.
- Actualizar su estado.
- Eliminar tareas.

En esta sesión se implementarán solamente las dos primeras operaciones.

Explica que TypeScript y NestJS cumplen funciones diferentes:

- **TypeScript** permite definir tipos y detectar determinados errores durante el desarrollo.
- **NestJS** es un framework para organizar y desarrollar aplicaciones backend sobre Node.js.
- **Postman** permite enviar solicitudes HTTP y examinar las respuestas.

TypeScript no reemplaza a Node.js ni a NestJS. Cada tecnología tiene una responsabilidad diferente.

## Guion sugerido

Puedes introducir la clase con esta explicación:

> Hasta ahora podemos haber construido aplicaciones utilizando JavaScript y Express. Hoy vamos a conocer una forma más estructurada de desarrollar un backend. Primero aprenderemos cómo TypeScript nos ayuda a definir los datos y después veremos cómo NestJS organiza las rutas, los servicios y los módulos de una API.

## Pregunta para los estudiantes

¿Qué problemas podrían aparecer si toda la lógica de una aplicación se encuentra dentro de un solo archivo?

Respuestas esperadas:

- Es difícil localizar errores.
- Se mezclan responsabilidades.
- Resulta más complicado reutilizar código.
- Las pruebas son más difíciles de mantener.
- Los cambios en una funcionalidad pueden afectar otras.

## Mensaje clave

La organización del código es importante incluso antes de que una aplicación crezca.

---

# Diapositiva 2. De Express a NestJS

**Tiempo sugerido:** 5 minutos.

## Objetivo

Explicar por qué un equipo puede elegir NestJS en lugar de organizar manualmente una aplicación Express.

## Concepto 1: Express

Express es un framework minimalista de Node.js que facilita la definición de rutas, el uso de middleware y el manejo de solicitudes HTTP.

Ejemplo de una ruta con Express:

```javascript
app.get('/tasks', (req, res) => {
  res.json([
    { id: 1, title: 'Aprender backend' },
  ]);
});
```

Esta ruta recibe una solicitud GET y devuelve una respuesta JSON.

Express ofrece flexibilidad, pero no obliga a utilizar una arquitectura específica. El desarrollador o el equipo debe decidir cómo organizar controladores, servicios, validaciones y acceso a datos.

## Concepto 2: NestJS

NestJS ofrece una estructura más definida basada en módulos, controladores y proveedores.

| Aspecto | Express | NestJS |
|---|---|---|
| Organización | Flexible | Estructura modular |
| Tipado | Se puede utilizar con TypeScript | TypeScript es la opción predeterminada |
| Inyección de dependencias | Debe implementarse o integrarse | Incluida en el framework |
| Controladores y módulos | Se organizan manualmente o con convenciones propias | Componentes definidos por el framework |
| Uso habitual | APIs pequeñas o grandes aplicaciones personalizadas | APIs y aplicaciones backend estructuradas |

No presentes esta comparación como si Express fuera inferior. Ambos permiten desarrollar aplicaciones profesionales. La elección depende de las necesidades del proyecto, la arquitectura y las preferencias del equipo.

## Concepto 3: responsabilidades separadas

Explica la diferencia entre recibir una solicitud y resolver una operación de negocio.

Por ejemplo, al consultar tareas:

1. El controlador recibe la solicitud.
2. El servicio obtiene las tareas.
3. El controlador devuelve la respuesta HTTP.

Esta separación facilita comprender y mantener el código.

## Pregunta para los estudiantes

¿Podríamos desarrollar una API completa usando únicamente Express?

**Respuesta esperada:** sí. NestJS aporta convenciones y herramientas para estructurar el proyecto, pero no es la única forma de desarrollar un backend.

---

# Diapositiva 3. Fundamentos de TypeScript

**Tiempo sugerido:** 15 minutos.

## Objetivo

Enseñar los tipos básicos, las anotaciones de tipos, los tipos de objetos y la diferencia entre validación estática y validación en tiempo de ejecución.

## 3.1. ¿Qué es TypeScript?

TypeScript es un lenguaje construido sobre JavaScript que incorpora un sistema de tipos estáticos.

Permite expresar qué tipos de valores se esperan en variables, parámetros, propiedades y resultados de funciones.

Por ejemplo:

```typescript
const title: string = 'Aprender NestJS';
const id: number = 1;
const completed: boolean = false;
```

Explica cada elemento:

- `const`: declara una variable que no puede reasignarse.
- `title`, `id`, `completed`: nombres de las variables.
- `: string`, `: number`, `: boolean`: anotaciones de tipo.
- Los valores a la derecha del signo `=` son los valores iniciales.

TypeScript también puede inferir tipos. Por ejemplo, `const id = 1` permite inferir que el valor es numérico sin necesidad de escribir `: number`.

## 3.2. Tipos básicos

| Tipo | Uso | Ejemplo |
|---|---|---|
| `string` | Texto | `'Hola'` |
| `number` | Números | `25` |
| `boolean` | Valores lógicos | `true` |
| `string[]` | Arreglo de textos | `['A', 'B']` |
| `number[]` | Arreglo de números | `[1, 2, 3]` |

Ejemplo:

```typescript
const studentName: string = 'Carlos';
const grade: number = 85;
const approved: boolean = true;
const subjects: string[] = ['Backend', 'Testing'];
```

## 3.3. Tipos de objetos con `type`

Para TaskFlow, una tarea tiene tres propiedades:

```typescript
type Task = {
  id: number;
  title: string;
  completed: boolean;
};
```

Explica la sintaxis:

- `type`: crea un alias de tipo.
- `Task`: nombre elegido para el tipo.
- `{ ... }`: define las propiedades del objeto.
- `id: number`: la propiedad `id` debe contener un número.
- `title: string`: el título debe ser texto.
- `completed: boolean`: el estado debe ser verdadero o falso.
- El punto y coma separa las declaraciones de propiedades.

Podemos crear una tarea con este tipo:

```typescript
const task: Task = {
  id: 1,
  title: 'Aprender TypeScript',
  completed: false,
};
```

Si el estudiante escribe un valor incompatible, TypeScript puede detectar el error.

Por ejemplo:

```typescript
const task: Task = {
  id: 'uno',
  title: 'Aprender TypeScript',
  completed: false,
};
```

El campo `id` contiene un texto, pero el tipo `Task` exige un número.

Aclara que los errores de tipo suelen detectarse mediante el compilador o las herramientas de desarrollo, no necesariamente cuando se guarda el archivo.

## 3.4. `type` frente a `interface`

En TypeScript también existe `interface`.

Ejemplo equivalente:

```typescript
interface Task {
  id: number;
  title: string;
  completed: boolean;
}
```

Para esta clase utilizaremos `type` porque es sencillo para introducir alias de tipos. Ambos mecanismos permiten describir la estructura de objetos, aunque tienen diferencias en extensibilidad y composición.

No es necesario profundizar en esas diferencias durante esta sesión.

## 3.5. Funciones tipadas

```typescript
function sum(a: number, b: number): number {
  return a + b;
}
```

Explícalo de izquierda a derecha:

1. `function` declara una función.
2. `sum` es el nombre.
3. `a: number` y `b: number` declaran los tipos de los parámetros.
4. `: number` indica el tipo de retorno.
5. `return` devuelve el resultado.

Un ejemplo de función que no devuelve un resultado:

```typescript
function printMessage(message: string): void {
  console.log(message);
}
```

`void` expresa que la función no proporciona un valor de retorno útil para quien la llama.

## 3.6. TypeScript no valida automáticamente los datos externos

Este punto es especialmente importante para backend.

Los tipos de TypeScript ayudan durante el desarrollo, pero no garantizan que un cliente envíe datos correctos en una solicitud HTTP.

Por ejemplo, un usuario podría enviar:

```json
{
  "id": "texto",
  "title": 123,
  "completed": "quizas"
}
```

La aplicación necesita validación en tiempo de ejecución para rechazar datos incorrectos. En futuras sesiones se puede enseñar DTO junto con `class-validator` o validación mediante Zod.

## Preguntas para comprobar comprensión

1. ¿Qué tipo utilizarías para un identificador numérico?
2. ¿Qué tipo utilizarías para una lista de nombres?
3. ¿Qué diferencia hay entre `: number` en un parámetro y `: number` como tipo de retorno?
4. ¿Los tipos de TypeScript sustituyen la validación de una solicitud HTTP?

**Respuestas esperadas:** `number`; `string[]`; el primero describe un parámetro y el segundo el resultado de la función; no, se necesita validación en tiempo de ejecución.

## Actividad breve

Solicita que definan un tipo `User` con:

- `id: number`
- `name: string`
- `active: boolean`

Después deben crear un objeto válido y una función que reciba un `User` e imprima su nombre.

---

# Diapositiva 4. Funciones y clases

**Tiempo sugerido:** 10 minutos.

## Objetivo

Explicar cómo se organizan datos y comportamientos mediante clases, y preparar al estudiante para comprender los servicios de NestJS.

## 4.1. ¿Qué es una clase?

Una clase describe una estructura de objetos y las operaciones que pueden realizar.

Ejemplo:

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
```

La clase contiene un atributo y dos métodos.

### Explicación de los elementos

**`class TaskManager`**

Declara una clase llamada `TaskManager`.

**`private tasks: string[] = []`**

Declara un atributo privado que almacena un arreglo de textos.

**`addTask(title: string): void`**

Agrega un texto al arreglo. No devuelve un resultado.

**`getTasks(): string[]`**

Devuelve el arreglo de tareas.

**`this`**

Hace referencia a la instancia actual de la clase.

Para utilizarla:

```typescript
const manager = new TaskManager();

manager.addTask('Estudiar NestJS');

console.log(manager.getTasks());
```

Al ejecutar el código, se crea una instancia de `TaskManager`, se agrega una tarea y se muestra el arreglo.

## 4.2. Modificadores de acceso

| Modificador | Explicación |
|---|---|
| `public` | Permite el acceso desde fuera de la clase. Es el valor predeterminado. |
| `private` | Restringe el acceso directo al atributo o método desde fuera de la clase. |
| `protected` | Permite el acceso dentro de la clase y de sus subclases. |

Estos modificadores sirven para controlar cómo se utiliza una clase.

En el ejemplo, el arreglo `tasks` es privado. El código externo debe utilizar los métodos públicos para trabajar con él.

## 4.3. Diferencia entre clase e instancia

Una clase es la definición; una instancia es un objeto creado a partir de esa definición.

```typescript
const manager = new TaskManager();
```

`TaskManager` es la clase y `manager` es la instancia.

## 4.4. Conexión con NestJS

En NestJS, los servicios suelen implementarse como clases. Los controladores también son clases.

La diferencia principal no está en la sintaxis de la clase, sino en la responsabilidad que tiene dentro de la aplicación y en cómo NestJS la administra.

El servicio `TasksService` de nuestra API contendrá las operaciones para consultar las tareas.

## Pregunta para los estudiantes

¿Por qué sería conveniente tener un método `getTasks()` en lugar de permitir que cualquier parte del sistema modifique directamente el arreglo?

**Respuesta esperada:** permite controlar el acceso a los datos y definir operaciones claras para trabajar con ellos.

---

# Diapositiva 5. ¿Qué es NestJS?

**Tiempo sugerido:** 5 minutos.

## Objetivo

Presentar NestJS y explicar los conceptos necesarios antes de crear el proyecto.

## 5.1. Definición

NestJS es un framework de Node.js que permite construir aplicaciones backend con una arquitectura modular. Utiliza TypeScript por defecto y ofrece mecanismos como inyección de dependencias, decoradores y controladores.

NestJS se apoya en conceptos de programación orientada a objetos y en un sistema de módulos.

## 5.2. ¿Qué es un decorador?

Un decorador es una construcción de TypeScript utilizada por NestJS para añadir metadatos a clases, métodos o parámetros.

Ejemplos:

```typescript
@Controller('tasks')
export class TasksController {}
```

```typescript
@Injectable()
export class TasksService {}
```

```typescript
@Module({
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
```

Explica que los decoradores permiten al framework identificar el propósito de cada componente.

- `@Controller('tasks')`: identifica un controlador y su ruta base.
- `@Injectable()`: declara una clase que puede participar en el sistema de inyección de dependencias.
- `@Module(...)`: configura un módulo.

No es necesario que los estudiantes aprendan a implementar decoradores propios.

## 5.3. Componentes de NestJS

| Componente | Responsabilidad |
|---|---|
| Module | Organiza los componentes de una funcionalidad. |
| Controller | Atiende solicitudes HTTP. |
| Provider / Service | Contiene lógica o funcionalidades que se pueden inyectar. |
| Pipe | Transforma o valida datos de entrada. |

En la práctica utilizaremos un controlador, un servicio y un módulo.

## Mensaje clave

NestJS no elimina JavaScript ni TypeScript. Es una capa de organización y herramientas construida sobre el entorno Node.js.

---

# Diapositiva 6. Arquitectura de NestJS

**Tiempo sugerido:** 10 minutos.

## Objetivo

Explicar el flujo de una solicitud y el papel de la inyección de dependencias.

## 6.1. Flujo de una solicitud

Para la solicitud:

```http
GET /tasks
```

El flujo simplificado será:

```text
Postman
   |
   | GET /tasks
   v
TasksController
   |
   | findAll()
   v
TasksService
   |
   | consulta el arreglo
   v
Lista de tareas
   |
   v
Respuesta HTTP 200
```

Explica cada etapa:

1. Postman envía una solicitud HTTP.
2. NestJS identifica la ruta correspondiente.
3. El controlador ejecuta el método asociado.
4. El controlador llama al servicio.
5. El servicio devuelve las tareas.
6. NestJS serializa el resultado como JSON y envía la respuesta.

En este ejemplo el servicio consulta un arreglo en memoria. Más adelante podría consultar un repositorio que acceda a PostgreSQL.

## 6.2. ¿Qué es un controlador?

Un controlador se encarga de atender las solicitudes y definir las rutas HTTP.

Ejemplos de rutas:

- `GET /tasks`
- `GET /tasks/2`

El controlador no debería concentrar toda la lógica de negocio. Su responsabilidad principal es conectar la solicitud con la operación correspondiente.

## 6.3. ¿Qué es un servicio?

Un servicio implementa operaciones que necesita la aplicación.

En TaskFlow:

- `findAll()` devuelve todas las tareas.
- `findOne(id)` busca una tarea por su identificador.

En aplicaciones más completas, un servicio podría verificar reglas de negocio, coordinar otros servicios o solicitar información a una base de datos.

## 6.4. ¿Qué es la inyección de dependencias?

Una dependencia es un objeto que una clase necesita para cumplir su función.

El controlador necesita `TasksService`. NestJS puede proporcionarle una instancia de ese servicio mediante su contenedor de dependencias.

Ejemplo:

```typescript
constructor(
  private readonly tasksService: TasksService,
) {}
```

En este contexto:

- `constructor` es el constructor de la clase.
- `tasksService` es el atributo que almacenará la referencia al servicio.
- `TasksService` es el tipo de dependencia.
- NestJS resuelve la dependencia porque el servicio está registrado como proveedor en el módulo.

No estamos creando el servicio manualmente con `new TasksService()`.

## 6.5. ¿Por qué es útil?

La inyección de dependencias ayuda a:

- Separar responsabilidades.
- Compartir servicios entre componentes.
- Sustituir dependencias durante las pruebas.
- Reducir el acoplamiento entre clases.
- Mantener una arquitectura organizada.

## Pregunta para los estudiantes

¿Qué ocurriría si `TasksController` intentara consultar directamente el arreglo privado que pertenece a `TasksService`?

**Respuesta esperada:** no podría acceder directamente al atributo privado y, además, estaría mezclando responsabilidades. Lo adecuado es invocar un método público del servicio.

---

# Diapositiva 7. Crear el proyecto

**Tiempo sugerido:** 10 minutos.

## Objetivo

Crear una aplicación NestJS y generar los componentes necesarios.

## 7.1. Instalar Nest CLI

En una terminal:

```bash
npm install -g @nestjs/cli
```

Comprueba la instalación:

```bash
nest --version
```

La CLI permite generar proyectos y componentes utilizando convenciones del framework.

## 7.2. Crear la aplicación

```bash
nest new taskflow-api
```

Durante la creación, selecciona npm si es el gestor que se utilizará en clase.

Ingresa al proyecto:

```bash
cd taskflow-api
```

Inicia el servidor:

```bash
npm run start:dev
```

El comando `start:dev` inicia la aplicación en modo desarrollo y normalmente vuelve a compilarla cuando detecta cambios en los archivos.

Abre:

```text
http://localhost:3000
```

En un proyecto recién creado, NestJS incluye una ruta inicial que permite comprobar que el servidor funciona.

## 7.3. Generar el módulo, el controlador y el servicio

Detén el servidor con `Ctrl + C` si necesitas trabajar con mayor claridad en la terminal. También puedes dejarlo activo y abrir otra terminal.

Ejecuta desde la raíz del proyecto:

```bash
nest g module tasks
nest g controller tasks
nest g service tasks
```

Los comandos `nest g` generan componentes mediante la CLI.

Los archivos esperados son:

```text
taskflow-api/
├── src/
│   ├── tasks/
│   │   ├── tasks.controller.ts
│   │   ├── tasks.module.ts
│   │   └── tasks.service.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── test/
├── package.json
└── tsconfig.json
```

## 7.4. Explicar los archivos principales

### `main.ts`

Es el punto de entrada de la aplicación. Habitualmente contiene la creación de la instancia NestJS y el inicio del servidor.

### `app.module.ts`

Es el módulo raíz. Registra los módulos principales de la aplicación.

### `tasks.module.ts`

Organiza los componentes relacionados con las tareas.

### `tasks.controller.ts`

Contiene las rutas HTTP para consultar las tareas.

### `tasks.service.ts`

Contiene la lógica para consultar los datos.

## Nota docente importante

La CLI puede modificar o registrar automáticamente componentes según el comando y la versión. Al editar los archivos, verifica el contenido generado en lugar de asumir que están vacíos.

No es necesario borrar `AppController` ni `AppService`. Se pueden conservar mientras se agrega `TasksModule` al módulo raíz.

---

# Diapositiva 8. Construir el servicio

**Tiempo sugerido:** 15 minutos.

## Objetivo

Implementar la lógica para listar tareas y buscar una tarea por identificador.

## 8.1. Archivo `src/tasks/tasks.service.ts`

Reemplaza el contenido del archivo por el siguiente:

```typescript
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

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
    const task = this.tasks.find(
      (item) => item.id === id,
    );

    if (!task) {
      throw new NotFoundException(
        `No existe una tarea con ID ${id}`,
      );
    }

    return task;
  }
}
```

## 8.2. Explicación detallada

### Importaciones

```typescript
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
```

`@nestjs/common` contiene componentes habituales del framework, entre ellos decoradores y excepciones HTTP.

`Injectable` permite que el servicio participe en el sistema de inyección de dependencias.

`NotFoundException` representa una respuesta HTTP 404 Not Found.

### Definición de `Task`

```typescript
export type Task = {
  id: number;
  title: string;
  completed: boolean;
};
```

La palabra `export` permite que otros archivos importen este tipo.

Cada tarea debe tener un identificador numérico, un título y un estado booleano.

### Declaración del servicio

```typescript
@Injectable()
export class TasksService {
```

El decorador indica a NestJS que esta clase puede administrarse como un proveedor inyectable.

### Arreglo privado

```typescript
private readonly tasks: Task[] = [];
```

- `private`: limita el acceso directo al atributo desde fuera de la clase.
- `readonly`: impide reasignar el atributo a otro arreglo después de inicializarlo.
- `Task[]`: indica que es un arreglo de tareas.

**Aclaración:** `readonly` no vuelve inmutables todos los objetos del arreglo. En este ejemplo significa que no podemos reasignar el atributo `tasks` a un arreglo diferente.

### Método `findAll()`

```typescript
findAll(): Task[] {
  return this.tasks;
}
```

El método devuelve el arreglo de tareas. Su tipo de retorno `Task[]` indica que entrega una lista de tareas.

### Método `findOne(id: number)`

```typescript
const task = this.tasks.find(
  (item) => item.id === id,
);
```

El método `find()` recorre el arreglo y devuelve el primer elemento que cumple la condición.

En este caso, busca una tarea cuyo `id` sea igual al parámetro recibido.

El operador `===` compara valor y tipo sin realizar coerción de tipos.

Si no existe la tarea, `find()` devuelve `undefined`.

Por eso verificamos:

```typescript
if (!task) {
  throw new NotFoundException(
    `No existe una tarea con ID ${id}`,
  );
}
```

`throw` interrumpe la ejecución normal del método y lanza la excepción. NestJS transforma la excepción reconocida en una respuesta HTTP 404.

Finalmente:

```typescript
return task;
```

Si la tarea existe, se devuelve el objeto encontrado.

## 8.3. Concepto de lógica de negocio

Aunque esta aplicación es sencilla, el servicio representa una separación importante.

El controlador no necesita conocer cómo se almacenan o buscan las tareas. Solamente invoca `findAll()` o `findOne()`.

Posteriormente podremos cambiar el arreglo por consultas a PostgreSQL sin tener que trasladar toda la lógica de búsqueda al controlador.

## Preguntas para comprobar comprensión

1. ¿Qué tipo de dato devuelve `findAll()`?
2. ¿Qué devuelve `find()` si no encuentra coincidencias?
3. ¿Por qué utilizamos `NotFoundException`?
4. ¿Qué diferencia hay entre el arreglo en memoria y una tabla de base de datos?

**Respuestas esperadas:** `Task[]`; `undefined`; para generar una respuesta HTTP 404; los datos en memoria no son persistentes y desaparecen al reiniciar la aplicación.

---

# Diapositiva 9. Controlador y endpoints REST

**Tiempo sugerido:** 15 minutos.

## Objetivo

Crear las rutas HTTP, conectar el controlador con el servicio y probar las respuestas de la API.

## 9.1. Archivo `src/tasks/tasks.controller.ts`

Reemplaza el contenido por:

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

## 9.2. Explicación del controlador

### Importaciones

```typescript
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
```

- `Controller`: declara un controlador.
- `Get`: vincula un método con una solicitud HTTP GET.
- `Param`: permite leer parámetros de la URL.
- `ParseIntPipe`: convierte el parámetro a entero o rechaza la solicitud si no es válido.

El tipo `Task` se importa mediante `import type` porque solo se utiliza como tipo de TypeScript. `TasksService`, en cambio, es una clase utilizada como dependencia en tiempo de ejecución.

### Ruta base

```typescript
@Controller('tasks')
```

Este decorador establece la ruta base `/tasks`.

### Inyección de dependencias

```typescript
constructor(
  private readonly tasksService: TasksService,
) {}
```

NestJS proporciona el servicio registrado en el módulo. El controlador utiliza la instancia recibida para ejecutar sus métodos.

### Endpoint para listar tareas

```typescript
@Get()
findAll(): Task[] {
  return this.tasksService.findAll();
}
```

Este método responde a:

```http
GET /tasks
```

El controlador delega la consulta al servicio y devuelve el resultado.

### Endpoint para buscar por ID

```typescript
@Get(':id')
findOne(
  @Param('id', ParseIntPipe) id: number,
): Task {
  return this.tasksService.findOne(id);
}
```

La ruta `:id` representa un segmento variable de la URL.

Por ejemplo, en `/tasks/2`, el valor de `id` es `2`.

`ParseIntPipe` transforma el parámetro de texto en un entero. Si el cliente envía `abc`, la tubería rechaza la solicitud con un error HTTP 400.

## 9.3. Archivo `src/tasks/tasks.module.ts`

Verifica que contenga:

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

Explica que el módulo registra los componentes de la funcionalidad.

- `controllers`: indica qué controladores pertenecen al módulo.
- `providers`: registra los servicios y otros proveedores que NestJS puede administrar.

Si un servicio se utiliza en otro módulo, puede ser necesario exportarlo desde el módulo que lo declara e importar ese módulo donde corresponda. No necesitamos hacerlo en esta práctica.

## 9.4. Archivo `src/app.module.ts`

Agrega la importación:

```typescript
import { TasksModule } from './tasks/tasks.module';
```

Después registra el módulo en `imports`.

Por ejemplo, si el archivo conserva los componentes predeterminados de NestJS, su estructura puede ser:

```typescript
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [TasksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

Conserva cualquier otro módulo o componente que ya exista en el proyecto. Lo importante es que `TasksModule` forme parte de `imports`.

## 9.5. Probar con Postman

Ejecuta la aplicación:

```bash
npm run start:dev
```

Si todo está configurado correctamente, el servidor estará disponible en:

```text
http://localhost:3000
```

### Prueba A: obtener todas las tareas

Método: `GET`

URL:

```text
http://localhost:3000/tasks
```

Resultado esperado: `200 OK`.

Respuesta de ejemplo:

```json
[
  {
    "id": 1,
    "title": "Aprender TypeScript",
    "completed": true
  },
  {
    "id": 2,
    "title": "Crear mi primera API con NestJS",
    "completed": false
  },
  {
    "id": 3,
    "title": "Probar endpoints con Postman",
    "completed": false
  }
]
```

### Prueba B: consultar una tarea existente

Método: `GET`

```text
http://localhost:3000/tasks/2
```

Resultado esperado: `200 OK`.

Respuesta:

```json
{
  "id": 2,
  "title": "Crear mi primera API con NestJS",
  "completed": false
}
```

### Prueba C: consultar una tarea inexistente

Método: `GET`

```text
http://localhost:3000/tasks/99
```

Resultado esperado: `404 Not Found`.

La excepción proviene del servicio cuando no encuentra la tarea.

### Prueba D: enviar un identificador inválido

Método: `GET`

```text
http://localhost:3000/tasks/abc
```

Resultado esperado: `400 Bad Request`.

En este caso, `ParseIntPipe` rechaza el parámetro antes de ejecutar normalmente el método del controlador.

## 9.6. Diferencia entre los errores 400 y 404

| Código | Significado | Ejemplo |
|---|---|---|
| 200 | Solicitud procesada correctamente | La tarea existe. |
| 400 | Solicitud inválida | El ID no es un entero válido. |
| 404 | Recurso no encontrado | El ID es válido, pero no existe la tarea. |

Aclara que un ID numérico inexistente no es lo mismo que un ID que no puede convertirse a número.

---

# Diapositiva 10. Práctica y conclusiones

**Tiempo sugerido:** 10 minutos.

## Objetivo

Verificar que el estudiante comprende la estructura de la API y puede realizar una modificación sencilla.

## Actividad individual

Solicita a los estudiantes que agreguen la siguiente tarea al arreglo de `TasksService`:

```typescript
{
  id: 4,
  title: 'Practicar arquitectura backend',
  completed: false,
}
```

Deben realizar estas comprobaciones:

1. Consultar `GET /tasks`.
2. Consultar `GET /tasks/4`.
3. Consultar `GET /tasks/99`.
4. Consultar `GET /tasks/abc`.
5. Explicar qué componente procesa cada operación.

## Preguntas de cierre

1. ¿Cuál es la diferencia entre TypeScript y NestJS?
2. ¿Qué responsabilidad tiene `TasksController`?
3. ¿Qué responsabilidad tiene `TasksService`?
4. ¿Qué función cumple `TasksModule`?
5. ¿Qué hace `ParseIntPipe`?
6. ¿Por qué las tareas se pierden al reiniciar la aplicación?

## Respuestas esperadas

1. TypeScript proporciona tipos; NestJS organiza y facilita la construcción del backend.
2. Recibir las solicitudes HTTP y devolver respuestas.
3. Implementar las operaciones y la lógica de consulta.
4. Registrar y agrupar los componentes de la funcionalidad.
5. Convertir el parámetro a entero o rechazarlo si no es válido.
6. Porque están almacenadas en memoria y no en un almacenamiento persistente.

## Criterios de evaluación formativa

| Criterio | Evidencia |
|---|---|
| Comprensión de TypeScript | Define correctamente tipos y funciones. |
| Comprensión de NestJS | Identifica módulos, controladores y servicios. |
| Implementación | La API inicia sin errores de compilación. |
| Funcionamiento | Los dos endpoints responden correctamente. |
| Manejo de errores | Distingue las respuestas 400 y 404. |
| Comprensión arquitectónica | Explica por qué el controlador utiliza el servicio. |

---

# 5. Resumen de los archivos creados

Al terminar la práctica, el proyecto tendrá una estructura similar a la siguiente:

```text
taskflow-api/
├── src/
│   ├── tasks/
│   │   ├── tasks.controller.ts
│   │   ├── tasks.module.ts
│   │   └── tasks.service.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── test/
├── package.json
├── package-lock.json
└── tsconfig.json
```

Los archivos originales de NestJS se conservan; los archivos dentro de `tasks/` implementan la funcionalidad nueva.

## Resumen de responsabilidades

| Archivo | Función |
|---|---|
| `main.ts` | Inicia el servidor. |
| `app.module.ts` | Registra el módulo principal y `TasksModule`. |
| `tasks.module.ts` | Registra el controlador y el servicio de tareas. |
| `tasks.controller.ts` | Expone los endpoints GET. |
| `tasks.service.ts` | Almacena y consulta las tareas. |

---

# 6. Comandos de referencia

## Verificar el entorno

```bash
node --version
npm --version
nest --version
```

## Instalar NestJS CLI

```bash
npm install -g @nestjs/cli
```

## Crear y ejecutar el proyecto

```bash
nest new taskflow-api
cd taskflow-api
npm run start:dev
```

## Generar componentes

```bash
nest g module tasks
nest g controller tasks
nest g service tasks
```

## Ejecutar las pruebas de Postman

| Método | URL |
|---|---|
| GET | `http://localhost:3000/tasks` |
| GET | `http://localhost:3000/tasks/2` |
| GET | `http://localhost:3000/tasks/99` |
| GET | `http://localhost:3000/tasks/abc` |

---

# 7. Resolución de problemas frecuentes

## Problema 1: `nest` no se reconoce como comando

**Posibles causas:** Nest CLI no está instalado globalmente o la ruta de los ejecutables de npm no está disponible en el `PATH`.

**Qué hacer:**

```bash
npm install -g @nestjs/cli
nest --version
```

Si el problema continúa, revisar la instalación de npm y la configuración de las variables de entorno.

## Problema 2: el puerto 3000 está ocupado

El servidor podría no iniciar si otra aplicación utiliza el puerto.

Revisa el mensaje de error. Puedes detener la otra aplicación o configurar otro puerto en la aplicación NestJS.

## Problema 3: `GET /tasks` devuelve 404

Verifica:

- Que la ruta esté escrita correctamente.
- Que `TasksController` tenga `@Controller('tasks')`.
- Que `TasksModule` registre el controlador.
- Que `TasksModule` esté incluido en `imports` de `AppModule`.
- Que el servidor se haya iniciado correctamente.

## Problema 4: error de dependencia de `TasksService`

Comprueba que `TasksService` figure en `providers` de `TasksModule`.

```typescript
@Module({
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
```

También revisa que los nombres y las rutas de importación sean correctos.

## Problema 5: errores de TypeScript

Verifica:

- Los nombres de los archivos.
- Los nombres de clases y métodos.
- Los paréntesis, llaves y puntos y coma.
- Las importaciones.
- Que el tipo de retorno coincida con el valor devuelto.

Si el compilador informa de un problema en una línea específica, utiliza ese mensaje como punto de partida.

## Problema 6: los cambios no aparecen

Guarda los archivos y comprueba que `npm run start:dev` haya recompilado la aplicación. Revisa la terminal antes de volver a probar con Postman.

## Problema 7: las tareas desaparecen

Es el comportamiento esperado. El arreglo se inicializa cada vez que arranca la aplicación. Para conservar los datos se necesitará una base de datos, tema que se desarrollará posteriormente.

---

# 8. Ampliación conceptual para el docente

Esta sección permite responder preguntas de estudiantes que quieran comprender mejor la arquitectura, sin convertir la clase en una explicación demasiado extensa.

## 8.1. ¿NestJS es lo mismo que Node.js?

No.

- Node.js es el entorno de ejecución que permite ejecutar JavaScript fuera del navegador.
- TypeScript aporta un sistema de tipos y se transforma en JavaScript para su ejecución.
- NestJS utiliza Node.js y ofrece una estructura para construir aplicaciones backend.

## 8.2. ¿Qué ocurre cuando se compila TypeScript?

El compilador comprueba tipos y transforma el código TypeScript en JavaScript según la configuración del proyecto.

La comprobación estática ayuda a encontrar determinados errores, pero no garantiza que todos los datos recibidos desde clientes sean válidos ni que no existan errores de lógica.

## 8.3. ¿Qué es un proveedor en NestJS?

Un proveedor es una clase u otro recurso que NestJS puede registrar y administrar dentro de su sistema de dependencias.

Los servicios son un tipo habitual de proveedor, pero no todos los proveedores tienen que ser servicios de negocio.

## 8.4. ¿Por qué se registra el servicio en `providers`?

El registro informa a NestJS de que el módulo dispone de ese proveedor. Así, cuando un controlador declara que necesita una instancia de `TasksService`, NestJS puede resolver la dependencia.

Si el proveedor no está registrado en el contexto correspondiente, la aplicación puede producir un error al intentar resolverlo.

## 8.5. ¿Por qué el controlador no consulta directamente la base de datos?

Porque queremos separar las responsabilidades.

En una arquitectura más completa, el flujo podría ser:

```text
Cliente HTTP
    |
    v
Controller
    |
    v
Service
    |
    v
Repository
    |
    v
Base de datos
```

- El controlador gestiona la comunicación HTTP.
- El servicio aplica las reglas de negocio.
- El repositorio encapsula las operaciones de persistencia.
- La base de datos almacena los datos.

En esta sesión omitimos el repositorio porque el arreglo en memoria es suficiente para comprender los conceptos básicos. En futuras sesiones se podrá introducir la persistencia con PostgreSQL y Prisma.

## 8.6. ¿Por qué utilizar `ParseIntPipe`?

Los parámetros de una URL llegan inicialmente como texto. La tubería `ParseIntPipe` transforma el valor a un entero y rechaza valores que no sean válidos.

Es una primera demostración de cómo NestJS permite procesar entradas antes de ejecutar la lógica del controlador.

No reemplaza la validación completa de todos los datos de una solicitud.

## 8.7. ¿Por qué no utilizamos DTO todavía?

Un DTO (*Data Transfer Object*) describe la estructura de los datos que una aplicación recibe o transmite.

Será especialmente útil cuando implementemos endpoints que reciben cuerpos JSON, por ejemplo, `POST /tasks`.

En ese momento podremos explicar validaciones de campos obligatorios, tipos, longitudes y otras restricciones.

---

# 9. Cierre de la sesión

La idea principal que los estudiantes deben recordar es que una API backend no consiste únicamente en definir rutas HTTP.

También es necesario organizar las responsabilidades para que el código pueda crecer y mantenerse.

En esta sesión se construyó una API sencilla, pero ya se introdujeron conceptos que se utilizarán en aplicaciones más completas:

- Tipado estático mediante TypeScript.
- Programación orientada a objetos.
- Decoradores.
- Módulos.
- Controladores.
- Servicios.
- Inyección de dependencias.
- Manejo básico de errores HTTP.
- Pruebas manuales de endpoints.

**Transición hacia las siguientes sesiones:** una vez comprendida esta arquitectura, podremos añadir validación de datos, DTO, persistencia con PostgreSQL y Prisma, autenticación y pruebas automatizadas, manteniendo la separación de responsabilidades que hemos trabajado hoy.
