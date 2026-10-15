# Sesión 8: Arquitectura de NestJS
## Modules, Controllers, Services y Dependency Injection

**Módulo 2: Arquitectura del Back-End y Bases de Datos**

**Duración:** 2 horas

---

## Diapositiva 1. Objetivos de la sesión

Al finalizar la sesión, serás capaz de:

- Comprender cómo se organiza una aplicación NestJS.
- Diferenciar módulos, controladores y servicios.
- Explicar cómo funciona la inyección de dependencias.
- Ampliar la API TaskFlow utilizando buenas prácticas de arquitectura.

**Continuidad:** retomaremos el proyecto desarrollado en la sesión 7.

---

## Diapositiva 2. ¿Cómo funciona NestJS?

NestJS es un framework de Node.js que permite construir aplicaciones backend utilizando TypeScript.

Sus principales características son:

- Arquitectura modular.
- Uso de clases y decoradores.
- Separación de responsabilidades.
- Inyección de dependencias.
- Integración con bases de datos, validaciones y pruebas.

**Idea clave:** organizar el código facilita su mantenimiento, reutilización y crecimiento.

---

## Diapositiva 3. Los componentes principales

### Module, Controller y Service

**Module**
- Agrupa componentes relacionados.
- Declara controladores y proveedores.

**Controller**
- Define los endpoints HTTP.
- Recibe solicitudes y devuelve respuestas.
- Delega la lógica de negocio al servicio.

**Service**
- Contiene la lógica de negocio.
- Procesa datos y ejecuta operaciones.
- Puede ser reutilizado por otros componentes.

**Ejemplo:** `TasksModule`, `TasksController` y `TasksService`.

---

## Diapositiva 4. Organización del proyecto

```text
src/
├── app.module.ts
├── main.ts
└── tasks/
    ├── tasks.module.ts
    ├── tasks.controller.ts
    └── tasks.service.ts
```

- `main.ts`: inicia la aplicación.
- `app.module.ts`: módulo raíz.
- `tasks.module.ts`: organiza la funcionalidad de tareas.
- `tasks.controller.ts`: expone los endpoints.
- `tasks.service.ts`: implementa la lógica de negocio.

**Pregunta:** ¿por qué separar el controlador del servicio?

---

## Diapositiva 5. Flujo de una solicitud HTTP

```text
Cliente HTTP
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

Ejemplo de endpoints:

- `GET /tasks`: listar tareas.
- `GET /tasks/1`: consultar una tarea.
- `POST /tasks`: crear una tarea.

**Regla:** el controlador gestiona la comunicación HTTP; el servicio gestiona la lógica de negocio.

---

## Diapositiva 6. ¿Qué es la inyección de dependencias?

La inyección de dependencias (Dependency Injection) permite que NestJS proporcione a una clase los componentes que necesita.

Ejemplo:

```typescript
@Injectable()
export class TasksService {
  findAll() {
    return [];
  }
}
```

```typescript
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

NestJS administra la instancia de `TasksService` y la proporciona al controlador.

**Beneficio:** menor acoplamiento y código más fácil de probar y mantener.

---

## Diapositiva 7. Configuración del módulo

```typescript
@Module({
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
```

- `@Module()` declara un módulo.
- `controllers` registra los controladores.
- `providers` registra los servicios y otros proveedores.

Para que el módulo esté disponible, debe incorporarse a la aplicación, por ejemplo, importándolo desde `AppModule`.

**Importante:** NestJS utiliza esta configuración para conocer y conectar los componentes de la aplicación.

---

## Diapositiva 8. Práctica: ampliar TaskFlow

### Objetivo

Ampliar la API existente sin cambiar su arquitectura.

**Actividades:**

1. Revisar `TasksModule`, `TasksController` y `TasksService`.
2. Verificar los endpoints `GET /tasks` y `GET /tasks/:id`.
3. Implementar `POST /tasks` para crear una tarea.
4. Mantener los datos y la lógica de negocio en el servicio.
5. Probar los endpoints con Postman.

### Preguntas de cierre

- ¿Qué responsabilidad tiene un controlador?
- ¿Qué responsabilidad tiene un servicio?
- ¿Para qué sirve `@Injectable()`?
- ¿Qué función cumple `TasksModule`?

**Resultado esperado:** una API organizada, funcional y preparada para incorporar validaciones y persistencia en futuras sesiones.