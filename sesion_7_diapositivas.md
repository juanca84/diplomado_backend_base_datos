---
marp: true
theme: default
paginate: true
---

# TypeScript y NestJS

## Módulo 2: Arquitectura del Back-End y Bases de Datos

**Sesión 7 — Introducción a TypeScript y NestJS**

Proyecto práctico: **TaskFlow API**

---

# 1. Objetivos de la sesión

Al finalizar la sesión podrás:

- Comprender los fundamentos de TypeScript.
- Aplicar tipos, funciones y clases.
- Entender la inyección de dependencias.
- Reconocer la arquitectura de NestJS.
- Crear endpoints REST.
- Probar una API con Postman.

**Objetivo práctico:** construir una API para consultar tareas.

---

# 2. De Express a NestJS

## ¿Por qué utilizar un framework?

Express permite crear APIs de forma flexible, pero la organización del código depende en gran medida del desarrollador.

NestJS propone una estructura organizada mediante:

- **Módulos:** agrupan funcionalidades.
- **Controladores:** gestionan solicitudes HTTP.
- **Servicios:** implementan la lógica de negocio.
- **Inyección de dependencias:** facilita la reutilización y las pruebas.

**Idea clave:** una aplicación bien organizada es más fácil de mantener y ampliar.

---

# 3. Fundamentos de TypeScript

TypeScript amplía JavaScript con un sistema de tipos estáticos.

```typescript
const title: string = "Aprender NestJS";
const id: number = 1;
const completed: boolean = false;
```

## Definir la estructura de una tarea

```typescript
type Task = {
  id: number;
  title: string;
  completed: boolean;
};
```

Los tipos ayudan a detectar errores durante el desarrollo y documentan la estructura de los datos.

---

# 4. Funciones y clases

## Funciones tipadas

```typescript
function sum(a: number, b: number): number {
  return a + b;
}
```

## Clases

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

**Conceptos clave**

- `private`: restringe el acceso directo.
- `this`: hace referencia a la instancia actual.
- `void`: indica que la función no devuelve un valor.

---

# 5. ¿Qué es NestJS?

NestJS es un framework de Node.js orientado al desarrollo de aplicaciones backend estructuradas.

## Características principales

- Utiliza TypeScript de forma predeterminada.
- Organiza el código por módulos.
- Facilita la separación de responsabilidades.
- Incluye inyección de dependencias.
- Permite desarrollar APIs REST escalables.

**Herramientas:** Node.js + NestJS + TypeScript + Postman.

---

# 6. Arquitectura de NestJS

```text
        Cliente / Postman
               |
               v
       TasksController
       Controlador HTTP
               |
               v
         TasksService
        Lógica de negocio
               |
               v
       Datos de las tareas
        (memoria temporal)
```

## Responsabilidades

| Componente | Función |
|---|---|
| Controller | Recibe y responde solicitudes HTTP. |
| Service | Ejecuta la lógica de negocio. |
| Module | Agrupa y registra los componentes. |

Esta separación evita concentrar toda la lógica en un único archivo.

---

# 7. Crear el proyecto

## Instalar Nest CLI

```bash
npm install -g @nestjs/cli
```

## Crear y ejecutar la aplicación

```bash
nest new taskflow-api
cd taskflow-api
npm run start:dev
```

## Generar los componentes

```bash
nest g module tasks
nest g controller tasks
nest g service tasks
```

La aplicación estará disponible, por defecto, en:

`http://localhost:3000`

---

# 8. Construir el servicio

El servicio administra las tareas y permite consultarlas.

```typescript
@Injectable()
export class TasksService {
  private readonly tasks: Task[] = [
    {
      id: 1,
      title: "Aprender TypeScript",
      completed: true,
    },
    {
      id: 2,
      title: "Crear una API",
      completed: false,
    },
  ];

  findAll(): Task[] {
    return this.tasks;
  }
}
```

## ¿Qué aporta el servicio?

- Centraliza la lógica de negocio.
- Mantiene las operaciones separadas del controlador.
- Puede ser reutilizado e inyectado en otros componentes.

En esta práctica los datos se guardan en memoria, no en una base de datos.

---

# 9. Controlador y endpoints REST

El controlador expone las operaciones HTTP.

```typescript
@Controller("tasks")
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
  ) {}

  @Get()
  findAll(): Task[] {
    return this.tasksService.findAll();
  }
}
```

## Endpoints de la práctica

| Método | Endpoint | Resultado |
|---|---|---|
| GET | `/tasks` | Lista las tareas. |
| GET | `/tasks/2` | Consulta una tarea por ID. |
| GET | `/tasks/99` | Devuelve 404 si no existe. |
| GET | `/tasks/abc` | Devuelve 400 si el ID no es válido. |

**Herramienta de prueba:** Postman.

---

# 10. Práctica y conclusiones

## Reto: ampliar TaskFlow

1. Agrega una tarea con ID `3`.
2. Consulta todas las tareas.
3. Busca la tarea por su identificador.
4. Prueba un ID inexistente.
5. Prueba un ID inválido.
6. Explica la diferencia entre controlador y servicio.

## Lo aprendido

- TypeScript aporta tipos al desarrollo.
- NestJS organiza el backend mediante módulos.
- Los controladores gestionan las solicitudes HTTP.
- Los servicios contienen la lógica de negocio.
- Postman permite validar el comportamiento de una API.

### Próximos pasos

DTO, validaciones, PostgreSQL, Prisma, autenticación y pruebas automatizadas.
