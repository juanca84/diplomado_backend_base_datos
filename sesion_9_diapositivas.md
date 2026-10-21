# Sesión 9: Arquitectura NestJS, Prisma, migraciones y seeds

## Diapositiva 1. Objetivos de la sesión

Al finalizar la sesión podremos:

- Comprender la arquitectura por capas en NestJS.
- Diferenciar Controller, Service, Repository y PrismaService.
- Aplicar inyección de dependencias.
- Conectar NestJS con PostgreSQL mediante Prisma.
- Crear y ejecutar migraciones.
- Insertar datos iniciales mediante seeds.
- Consultar datos persistidos desde nuestra API REST.

**Proyecto práctico:** TaskFlow API.

---

## Diapositiva 2. ¿Cómo organizamos nuestro backend?

Cada componente debe tener una responsabilidad específica.

- **Controller:** recibe solicitudes HTTP y devuelve respuestas.
- **Service:** coordina las operaciones y aplica reglas de negocio.
- **Repository:** encapsula las operaciones de acceso a datos.
- **PrismaService:** proporciona el cliente de Prisma.
- **PostgreSQL:** almacena los datos de forma persistente.

### Flujo de una solicitud

`Cliente HTTP → Controller → Service → Repository → PrismaService → PostgreSQL`

Esta separación facilita el mantenimiento, las pruebas y la evolución de nuestra aplicación.

---

## Diapositiva 3. ¿Por qué utilizar la capa Repository?

La capa Repository separa las consultas a la base de datos de la lógica de negocio.

### Sin Repository

`Controller → Service → Prisma → PostgreSQL`

El servicio puede terminar mezclando reglas de negocio y consultas.

### Con Repository

`Controller → Service → Repository → Prisma → PostgreSQL`

El servicio utiliza operaciones como `findAll()` o `create()` sin conocer los detalles de las consultas.

### Ventajas

- Centraliza las operaciones de persistencia.
- Facilita las pruebas unitarias del servicio.
- Reduce el acoplamiento con el acceso a datos.
- Permite organizar mejor las consultas complejas.

**Nota:** NestJS no exige utilizar Repository. En TaskFlow lo incorporaremos con fines de aprendizaje y separación de responsabilidades.

---

## Diapositiva 4. Estructura del proyecto TaskFlow

```text
src/
├── prisma/
│   ├── prisma.module.ts
│   └── prisma.service.ts
│
├── tasks/
│   ├── dto/
│   │   ├── create-task.dto.ts
│   │   └── update-task.dto.ts
│   ├── tasks.controller.ts
│   ├── tasks.service.ts
│   ├── tasks.repository.ts
│   └── tasks.module.ts
│
└── app.module.ts
```

### Responsabilidades

- `tasks.controller.ts`: endpoints HTTP.
- `tasks.service.ts`: lógica de negocio.
- `tasks.repository.ts`: operaciones de persistencia.
- `prisma.service.ts`: acceso al cliente de Prisma.
- `dto/`: estructura y validación de los datos de entrada.

---

## Diapositiva 5. Inyección de dependencias

La inyección de dependencias permite que una clase reciba los objetos que necesita, en lugar de crearlos directamente.

Ejemplo:

```typescript
@Injectable()
export class TasksService {
  constructor(
    private readonly tasksRepository: TasksRepository,
  ) {}
}
```

### ¿Qué sucede aquí?

- `@Injectable()` permite que NestJS gestione la clase como proveedor.
- El constructor declara la dependencia.
- NestJS resuelve e inyecta `TasksRepository`.
- `private readonly` crea una propiedad accesible dentro de la clase y evita reasignarla.

**Importante:** el repository debe registrarse como proveedor en el módulo correspondiente para que NestJS pueda resolver la dependencia.

---

## Diapositiva 6. Creando TasksRepository

El repository encapsula las consultas de persistencia.

```typescript
@Injectable()
export class TasksRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  findAll() {
    return this.prisma.task.findMany();
  }

  findById(id: number) {
    return this.prisma.task.findUnique({
      where: { id },
    });
  }

  create(data: CreateTaskDto) {
    return this.prisma.task.create({
      data,
    });
  }
}
```

### ¿Qué aprendemos?

- El repository utiliza `PrismaService`.
- `findMany()` consulta varias tareas.
- `findUnique()` busca una tarea por su identificador.
- `create()` inserta una nueva tarea.

Los tipos y campos deben coincidir con el modelo real de Prisma.

---

## Diapositiva 7. Conectando TasksService

El servicio coordina las operaciones de la aplicación.

```typescript
@Injectable()
export class TasksService {
  constructor(
    private readonly tasksRepository: TasksRepository,
  ) {}

  findAll() {
    return this.tasksRepository.findAll();
  }

  findById(id: number) {
    return this.tasksRepository.findById(id);
  }

  create(data: CreateTaskDto) {
    return this.tasksRepository.create(data);
  }
}
```

### Responsabilidad del servicio

El servicio puede incorporar reglas de negocio, por ejemplo:

- Comprobar si una tarea existe.
- Rechazar una operación no permitida.
- Coordinar varias operaciones.
- Decidir qué hacer cuando no se encuentra una tarea.

**Regla:** las consultas se encapsulan en el repository; las decisiones de negocio pertenecen al servicio.

---

## Diapositiva 8. Configuración del módulo

NestJS necesita conocer los proveedores que participan en cada módulo.

```typescript
@Module({
  controllers: [TasksController],
  providers: [
    TasksService,
    TasksRepository,
  ],
})
export class TasksModule {}
```

Si `PrismaService` se exporta desde `PrismaModule`, debemos importar ese módulo:

```typescript
@Module({
  imports: [PrismaModule],
  controllers: [TasksController],
  providers: [
    TasksService,
    TasksRepository,
  ],
})
export class TasksModule {}
```

### ¿Por qué?

- `providers` registra las dependencias que el módulo ofrece.
- `imports` incorpora proveedores exportados por otros módulos.
- `exports` permite compartir proveedores con otros módulos.

`PrismaModule` debe declarar `PrismaService` como proveedor y exportarlo para que otros módulos puedan utilizarlo.

---

## Diapositiva 9. ¿Qué es Prisma ORM?

Prisma es un ORM que permite consultar una base de datos relacional desde TypeScript.

Ejemplo SQL:

```sql
SELECT * FROM "Task";
```

Operación equivalente con Prisma:

```typescript
const tasks = await prisma.task.findMany();
```

### Ventajas

- Facilita las consultas desde TypeScript.
- Ofrece tipos generados a partir del esquema.
- Simplifica las operaciones CRUD.
- Se integra con PostgreSQL.

**Importante:** PrismaService proporciona el cliente; Repository organiza las operaciones específicas de TaskFlow.

---

## Diapositiva 10. Definición del modelo Task

El modelo describe la estructura de una tarea.

Ejemplo conceptual en `prisma/schema.prisma`:

```prisma
model Task {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  completed   Boolean  @default(false)
  createdAt   DateTime @default(now())
}
```

### Campos

- `id`: identificador único.
- `title`: título obligatorio.
- `description`: descripción opcional.
- `completed`: estado de la tarea.
- `createdAt`: fecha de creación.

La sintaxis final debe ajustarse a la versión de Prisma y al esquema que ya tenga el proyecto.

---

## Diapositiva 11. ¿Qué es una migración?

Una migración representa un cambio versionado en la estructura de la base de datos.

Ejemplos:

- Crear la tabla `Task`.
- Añadir el campo `priority`.
- Crear índices.
- Modificar una estructura existente.

### ¿Por qué usar migraciones?

- Mantener un historial de cambios.
- Compartir cambios con el equipo.
- Reproducir la estructura de la base de datos.
- Gestionar la evolución del esquema de manera controlada.

**Migración = cambio en la estructura de la base de datos.**

---

## Diapositiva 12. Crear una migración

Después de definir el modelo, debemos generar y aplicar la migración.

En configuraciones compatibles con el flujo clásico de Prisma:

```bash
npx prisma migrate dev --name create_tasks
```

### ¿Qué sucede?

1. Se detectan cambios en el esquema.
2. Se genera el archivo de migración.
3. Se aplica el cambio a la base de datos de desarrollo.
4. Se actualiza el historial de migraciones.

Estructura habitual:

```text
prisma/
└── migrations/
    └── <fecha>_create_tasks/
        └── migration.sql
```

Debemos revisar y versionar los archivos de migración en Git.

**Nota:** los comandos y la configuración deben adaptarse a la versión de Prisma instalada, especialmente en Prisma 7.

---

## Diapositiva 13. ¿Qué es un seed?

Un seed es un script que inserta datos iniciales en la base de datos.

En TaskFlow podemos cargar:

- Tareas de ejemplo.
- Categorías.
- Estados de referencia.
- Datos para pruebas.

Ejemplo de datos:

| Título | Completada |
|---|---|
| Preparar documentación | No |
| Implementar autenticación | No |
| Escribir pruebas unitarias | Sí |

### Beneficios

- Facilita las pruebas.
- Reduce la preparación manual del entorno.
- Permite que el equipo trabaje con datos similares.
- Ayuda a demostrar el funcionamiento de la API.

---

## Diapositiva 14. Ejecutar el seed

Cuando el script está configurado correctamente:

```bash
npx prisma db seed
```

Este comando ejecuta el seed configurado para el proyecto.

### Buenas prácticas

- Utilizar datos ficticios en desarrollo.
- Evitar duplicados cuando se repite la ejecución.
- No incluir secretos ni credenciales reales.
- Evitar ejecutar datos de prueba indiscriminadamente en producción.

Podemos utilizar operaciones como `upsert` cuando necesitamos crear un registro o actualizarlo si ya existe.

---

## Diapositiva 15. Migraciones vs. Seeds

| Característica | Migraciones | Seeds |
|---|---|---|
| Propósito | Modificar estructura | Cargar datos |
| Ejemplo | Crear tabla `Task` | Insertar tareas |
| Resultado | Tablas, columnas e índices | Registros |
| Uso | Evolución del esquema | Preparación del entorno |

**Para recordar:**

- Migración: ¿cómo cambia la estructura?
- Seed: ¿con qué datos iniciales trabajaremos?

---

## Diapositiva 16. Persistencia en PostgreSQL

Antes podíamos utilizar un arreglo en memoria:

```typescript
const tasks = [
  { id: 1, title: 'Estudiar NestJS' },
];
```

Este almacenamiento es temporal: los cambios se pierden al reiniciar el proceso.

Con Prisma:

```typescript
const tasks = await prisma.task.findMany();
```

Los datos quedan almacenados en PostgreSQL y sobreviven al reinicio del servidor.

### Flujo completo

`Controller → Service → Repository → PrismaService → PostgreSQL`

---

## Diapositiva 17. Práctica guiada: TaskFlow API

### Actividades

1. Revisar la estructura del proyecto.
2. Configurar Prisma y PostgreSQL.
3. Definir el modelo `Task`.
4. Crear y ejecutar una migración.
5. Configurar y ejecutar el seed.
6. Implementar `TasksRepository`.
7. Inyectar el repository en `TasksService`.
8. Verificar `GET /tasks` y `POST /tasks`.

### Comprobaciones

- La tabla existe en PostgreSQL.
- La migración se aplicó correctamente.
- El seed insertó los registros esperados.
- El servicio utiliza el repository.
- La API devuelve datos persistidos.
- Los registros continúan después de reiniciar el servidor.

---

## Diapositiva 18. Errores frecuentes

- **Error de conexión:** revisar PostgreSQL y las credenciales.
- **Dependencia no resuelta:** comprobar `providers`, `imports` y `exports`.
- **Migración fallida:** revisar el esquema y el estado de la base de datos.
- **Seed duplicado:** implementar una estrategia de inserción segura.
- **API sin resultados:** comprobar la base de datos utilizada.
- **Datos que desaparecen:** verificar si todavía se usa almacenamiento en memoria.

No debemos eliminar la base de datos ni reiniciar el historial de migraciones como primera solución.

---

## Diapositiva 19. Preguntas de repaso

1. ¿Cuál es la responsabilidad de un Controller?
2. ¿Qué diferencia hay entre Service y Repository?
3. ¿Qué función cumple PrismaService?
4. ¿Qué es la inyección de dependencias?
5. ¿Cuál es la diferencia entre una migración y un seed?
6. ¿Por qué PostgreSQL conserva los datos después de reiniciar la API?
7. ¿Por qué conviene separar las consultas de las reglas de negocio?

### Resultado esperado

Una TaskFlow API organizada por capas, conectada a PostgreSQL y preparada para trabajar con migraciones, seeds y operaciones CRUD.