# GUÍA DEL DOCENTE
# Módulo 2: Arquitectura del Back-End y Bases de Datos

## Sesión 10: DTOs, Validation, Pipes, Exceptions y Configuration en NestJS

**Duración:** 2 horas y 15 minutos (135 minutos)  
**Proyecto de referencia:** TaskFlow API  
**Tecnologías:** NestJS, TypeScript, PostgreSQL, Prisma 7, class-validator, class-transformer, @nestjs/config y Postman.

---

# 1. Objetivos de aprendizaje

Al finalizar la sesión, el estudiante será capaz de:

1. Explicar la función de los DTOs en una API REST.
2. Crear DTOs para registrar y actualizar tareas.
3. Validar datos de entrada mediante decoradores de `class-validator`.
4. Configurar `ValidationPipe` globalmente.
5. Utilizar Pipes para validar y transformar parámetros.
6. Manejar errores HTTP mediante excepciones de NestJS.
7. Gestionar variables de entorno mediante `ConfigModule` y `ConfigService`.
8. Probar las respuestas de la API ante solicitudes válidas e inválidas.

## Conocimientos previos

Los estudiantes deberían conocer:

- La arquitectura de NestJS: módulos, controladores y servicios.
- El funcionamiento de los métodos HTTP GET, POST, PATCH y DELETE.
- La inyección de dependencias.
- Los DTOs básicos de TypeScript.
- El acceso a PostgreSQL mediante Prisma.
- Las pruebas de endpoints con Postman.

## 2. Preparación del docente

Antes de iniciar la clase, comprobar que:

- El proyecto TaskFlow se ejecuta correctamente.
- PostgreSQL está disponible.
- Las migraciones ya se han ejecutado.
- Prisma 7 está configurado con el adaptador de PostgreSQL que utiliza el proyecto.
- Los endpoints de tareas existentes responden correctamente.
- Postman está preparado para enviar solicitudes.

**Importante sobre Prisma 7:** no es necesario modificar la configuración de Prisma para enseñar `ValidationPipe`. La configuración de NestJS y la conexión con la base de datos son responsabilidades relacionadas, pero diferentes.

## 3. Distribución del tiempo

| Bloque | Contenido | Duración |
|---|---|---:|
| 1 | Introducción y DTOs | 20 min |
| 2 | Validación y Pipes | 35 min |
| 3 | Exceptions y manejo de errores | 25 min |
| 4 | Configuration y variables de entorno | 20 min |
| 5 | Integración práctica y pruebas | 25 min |
| 6 | Evaluación y cierre | 10 min |
| **Total** | | **135 min** |

---

# BLOQUE 1. INTRODUCCIÓN Y DTOs

## Diapositiva 1. Objetivos de la sesión

**Tiempo: 3 minutos**

### Explicación para el docente

Explicar que hasta este punto los estudiantes han aprendido a construir endpoints y conectar la aplicación con una base de datos. Sin embargo, una API funcional no necesariamente es una API robusta.

Una API también debe:

- Definir qué datos acepta.
- Rechazar información incorrecta.
- Comunicar los errores de manera consistente.
- Gestionar su configuración sin depender de valores escritos directamente en el código.

Presentar la sesión como una mejora del proyecto existente, no como la construcción de una API nueva.

### Pregunta inicial

¿Qué podría suceder si un usuario envía un número en el campo `title`, aunque el sistema espera una cadena de texto?

**Respuesta esperada:** podrían producirse errores de validación, de negocio o de persistencia. La API debe detectar la entrada incorrecta antes de intentar procesarla.

---

## Diapositiva 2. ¿Por qué necesitamos validar una API?

**Tiempo: 5 minutos**

Mostrar el siguiente JSON en el editor:

```json
{
  "title": "",
  "description": 123
}
```

Explicar que JSON permite representar cadenas, números, booleanos, objetos, arreglos y valores nulos. Que un documento sea JSON válido no significa que cumpla las reglas de nuestra aplicación.

En este ejemplo:

- `title` está vacío.
- `description` es un número.
- El sistema espera que ambos campos sean cadenas de texto y que el título no esté vacío.

Diferenciar tres conceptos:

| Concepto | Ejemplo |
|---|---|
| Sintaxis | El cuerpo es un JSON válido. |
| Validación | El título no está vacío y la descripción es una cadena. |
| Regla de negocio | Una tarea no puede asignarse a un proyecto inexistente. |

### Demostración en Postman

1. Abrir el endpoint `POST /tasks`.
2. Seleccionar `Body` → `raw` → `JSON`.
3. Enviar un cuerpo con título vacío.
4. Observar el resultado actual.
5. Explicar que posteriormente configuraremos la validación para rechazarlo.

No es necesario que el error se produzca correctamente todavía; la finalidad es mostrar el problema que resolveremos.

---

## Diapositiva 3. ¿Qué es un DTO?

**Tiempo: 5 minutos**

### Concepto

DTO significa *Data Transfer Object*. Es un objeto que define la estructura de los datos transferidos entre partes de una aplicación, especialmente entre el cliente y la API.

En NestJS, los DTOs se implementan frecuentemente mediante clases.

Ejemplo:

Archivo `src/tasks/dto/create-task.dto.ts`:

```typescript
export class CreateTaskDto {
  title: string;
  description?: string;
}
```

Explicar cada parte:

- `CreateTaskDto`: nombre de la clase.
- `title: string`: propiedad de texto obligatoria en el diseño del DTO.
- `description?: string`: propiedad opcional según el tipo de TypeScript.

**Aclaración importante:** TypeScript comprueba los tipos durante la compilación, pero los tipos desaparecen en tiempo de ejecución. Esta clase, por sí sola, no valida automáticamente el JSON recibido por HTTP.

Para validar datos en tiempo de ejecución, agregaremos decoradores y configuraremos un Pipe.

### Pregunta para los estudiantes

¿Un DTO es lo mismo que el modelo `Task` de Prisma?

**Respuesta esperada:** no. El DTO define los datos que acepta una operación; el modelo de Prisma describe la estructura y las relaciones de los datos persistidos en la base de datos.

---

## Diapositiva 4. DTO para crear y actualizar tareas

**Tiempo: 7 minutos**

### Paso 1. Crear la carpeta

Dentro de `src/tasks`, crear:

```text
src/
└── tasks/
    ├── dto/
    │   ├── create-task.dto.ts
    │   └── update-task.dto.ts
    ├── tasks.controller.ts
    ├── tasks.service.ts
    └── tasks.module.ts
```

Si los archivos ya existen, se deben adaptar en lugar de duplicarlos.

### Paso 2. Crear el DTO de creación

Archivo `src/tasks/dto/create-task.dto.ts`:

```typescript
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateTaskDto {
  @IsString({ message: 'El título debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El título es obligatorio.' })
  @MaxLength(100, {
    message: 'El título no puede superar los 100 caracteres.',
  })
  title: string;

  @IsOptional()
  @IsString({
    message: 'La descripción debe ser una cadena de texto.',
  })
  description?: string;
}
```

### Explicación de los decoradores

- `@IsString()`: comprueba que el valor sea una cadena.
- `@IsNotEmpty()`: rechaza una cadena vacía, entre otros valores vacíos.
- `@MaxLength(100)`: establece un límite de longitud.
- `@IsOptional()`: permite omitir la propiedad o enviar `null`; en esos casos, las demás reglas de esa propiedad no se ejecutan.

La validación de espacios en blanco merece atención: `@IsNotEmpty()` no rechaza por sí solo una cadena compuesta únicamente por espacios. Si el negocio necesita rechazarla, hay que agregar una regla específica, por ejemplo `@Matches(/\S/)`.

### Paso 3. Crear el DTO de actualización

Archivo `src/tasks/dto/update-task.dto.ts`:

```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
```

Si no está instalada la dependencia:

```bash
npm install @nestjs/mapped-types
```

Explicar que `PartialType` crea un tipo derivado en el que las propiedades heredadas son opcionales.

Esto resulta útil para una actualización parcial con PATCH.

**Advertencia:** `PartialType` permite omitir campos, pero no garantiza que el DTO contenga al menos uno. Si el negocio prohíbe actualizaciones vacías, esa regla debe implementarse por separado.

### Práctica breve

Solicitar a los estudiantes que identifiquen:

1. ¿Qué campo es obligatorio?
2. ¿Qué campo es opcional?
3. ¿Qué sucede si el título tiene 120 caracteres?
4. ¿Por qué no copiamos todas las propiedades del modelo de Prisma al DTO?

---

# BLOQUE 2. VALIDATION Y PIPES

## Diapositiva 5. ¿Qué es la validación?

**Tiempo: 5 minutos**

Explicar que la validación es el proceso de comprobar que los datos recibidos cumplen las reglas definidas.

Los decoradores no trabajan de forma aislada: necesitan que algún mecanismo ejecute la validación, como `ValidationPipe`.

Otros decoradores útiles:

| Decorador | Uso |
|---|---|
| `@IsBoolean()` | Validar un valor booleano |
| `@IsInt()` | Validar un entero |
| `@Min(1)` | Establecer un mínimo numérico |
| `@IsEmail()` | Validar el formato de correo |
| `@IsEnum()` | Comprobar que el valor pertenece a un conjunto |
| `@IsArray()` | Validar que el valor sea un arreglo |
| `@ArrayMinSize(1)` | Exigir al menos un elemento en un arreglo |

No es necesario enseñar todos los decoradores en profundidad. Priorizar `@IsString()`, `@IsNotEmpty()`, `@IsOptional()` y `@MaxLength()` para el ejercicio.

### Demostración conceptual

Mostrar dos cuerpos:

```json
{
  "title": "Preparar informe",
  "description": "Revisar los resultados"
}
```

```json
{
  "title": 123,
  "description": false
}
```

Preguntar cuál debería aceptar la API y por qué.

---

## Diapositiva 6. Instalación de dependencias

**Tiempo: 3 minutos**

En la terminal de VS Code, dentro del directorio del proyecto:

```bash
npm install class-validator class-transformer
npm install @nestjs/mapped-types
```

Explicar la función de cada dependencia:

- `class-validator`: proporciona los decoradores y las reglas de validación.
- `class-transformer`: facilita la transformación de objetos y valores.
- `@nestjs/mapped-types`: proporciona utilidades como `PartialType`.

Comprobar que la instalación terminó correctamente antes de continuar.

Si el proyecto ya tiene estas dependencias, no es necesario instalarlas otra vez.

---

## Diapositiva 7. ¿Qué es un Pipe?

**Tiempo: 7 minutos**

### Explicación conceptual

Un Pipe es un componente de NestJS que se ejecuta antes del método del controlador para transformar o validar un dato.

Por ejemplo, una ruta puede recibir el identificador de una tarea:

```typescript
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  return this.tasksService.findOne(id);
}
```

La URL:

```text
GET /tasks/15
```

permite que el Pipe convierta el parámetro en un entero.

En cambio:

```text
GET /tasks/abc
```

no proporciona un entero válido, por lo que `ParseIntPipe` genera un error HTTP 400 y el método no continúa.

### Diferencia entre Pipes

- `ParseIntPipe`: transforma y valida un parámetro numérico.
- `ValidationPipe`: valida los datos de entrada según las reglas definidas en los DTOs y puede transformar los valores.

### Nota para el docente

El ejemplo supone que el proyecto utiliza un parámetro `id` numérico. Si el modelo de Prisma utiliza identificadores de tipo `String` o UUID, no se debe aplicar `ParseIntPipe`; debe utilizarse la validación apropiada para ese identificador.

---

## Diapositiva 8. Configurar ValidationPipe globalmente

**Tiempo: 10 minutos**

Este es uno de los pasos centrales de la clase.

### Archivo que se debe modificar

`src/main.ts`

La estructura habitual de NestJS puede adaptarse de esta manera:

```typescript
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
```

Si el archivo ya contiene configuración adicional, conservarla. No reemplazar indiscriminadamente todo el contenido de `main.ts`.

### Explicar las opciones

**`whitelist: true`**

Elimina las propiedades que no tienen decoradores de validación en el DTO.

**`forbidNonWhitelisted: true`**

En lugar de eliminar silenciosamente una propiedad desconocida, rechaza la solicitud con un error 400.

**`transform: true`**

Permite transformar objetos recibidos a instancias de DTO y realizar determinadas conversiones de tipos cuando corresponda.

No significa que todos los valores se conviertan automáticamente de manera segura. Las conversiones deben comprobarse y probarse.

### Demostración

Enviar esta solicitud:

```json
{
  "title": "Preparar informe",
  "description": "Actividad semanal",
  "admin": true
}
```

Con las opciones anteriores, la propiedad `admin` no está permitida por el DTO y la solicitud debe ser rechazada.

Explicar que el cliente no puede incorporar propiedades arbitrarias para intentar modificar información que el endpoint no acepta.

**Aclaración de seguridad:** `whitelist` no sustituye la autorización. Para proteger campos sensibles también se deben diseñar adecuadamente los DTOs y comprobar los permisos.

---

## Diapositiva 9. ¿Cómo funciona ValidationPipe?

**Tiempo: 7 minutos**

Dibujar el siguiente flujo en la pizarra:

```text
Cliente (Postman)
       |
       v
   HTTP Request
       |
       v
 ValidationPipe
       |
       +---- Datos inválidos ----> HTTP 400
       |
       v
 TasksController
       |
       v
 TasksService
       |
       v
 Prisma / PostgreSQL
```

Explicar que la validación de entrada sucede antes de ejecutar el método del controlador.

### Prueba 1: solicitud válida

```json
{
  "title": "Revisar documentación",
  "description": "Completar revisión técnica"
}
```

Resultado esperado: la solicitud continúa hacia el controlador y el servicio. Si el resto del flujo está correctamente implementado, la tarea se guarda y la API responde con éxito.

### Prueba 2: título vacío

```json
{
  "title": "",
  "description": "Actividad de prueba"
}
```

Resultado esperado: HTTP 400.

### Prueba 3: tipo incorrecto

```json
{
  "title": 123,
  "description": false
}
```

Resultado esperado: HTTP 400.

### Prueba 4: propiedad desconocida

```json
{
  "title": "Nueva tarea",
  "admin": true
}
```

Resultado esperado: HTTP 400 porque está habilitado `forbidNonWhitelisted`.

### Respuesta esperada

El formato habitual de NestJS es similar al siguiente:

```json
{
  "statusCode": 400,
  "message": [
    "El título es obligatorio."
  ],
  "error": "Bad Request"
}
```

El contenido exacto depende de las reglas que fallen y de la configuración de la aplicación.

Si los mensajes aparecen en inglés, revisar los argumentos `message` de los decoradores.

### Error frecuente

Si la API acepta datos inválidos, comprobar:

1. Que `ValidationPipe` esté registrado.
2. Que el endpoint reciba un DTO como clase.
3. Que el DTO contenga los decoradores.
4. Que el controlador no esté utilizando simplemente `any` o un objeto sin validación.
5. Que el cuerpo de Postman sea JSON y tenga `Content-Type: application/json`.

---

# BLOQUE 3. EXCEPTIONS Y MANEJO DE ERRORES

## Diapositiva 10. ¿Qué son las Exceptions?

**Tiempo: 7 minutos**

Explicar que una excepción HTTP permite detener el flujo normal y comunicar un error mediante un código de estado apropiado.

NestJS incluye excepciones listas para utilizar:

| Excepción | Código | Ejemplo |
|---|---:|---|
| `BadRequestException` | 400 | Parámetro o solicitud incorrecta |
| `UnauthorizedException` | 401 | No hay autenticación válida |
| `ForbiddenException` | 403 | El usuario no tiene permiso |
| `NotFoundException` | 404 | No existe la tarea solicitada |
| `ConflictException` | 409 | El recurso entra en conflicto con el estado actual |
| `InternalServerErrorException` | 500 | Error interno inesperado |

Distinguir entre 401 y 403: el primero se refiere a la autenticación; el segundo, a la falta de autorización.

### Pregunta para los estudiantes

Si se solicita una tarea con ID 9999 y no existe, ¿qué código debería devolver la API?

**Respuesta esperada:** 404 Not Found.

---

## Diapositiva 11. Excepciones en el servicio

**Tiempo: 10 minutos**

El servicio debe comprobar si la tarea existe antes de devolverla o modificarla.

### Ejemplo de consulta

El siguiente ejemplo ilustra el patrón y presupone que el proyecto ya tiene un `PrismaService` funcional.

Archivo `src/tasks/tasks.service.ts`:

```typescript
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findOne(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException(
        `No se encontró la tarea con ID ${id}`,
      );
    }

    return task;
  }
}
```

**Adaptación al proyecto:** ajustar la ruta de importación de `PrismaService`, el nombre del modelo y el tipo de `id` a la estructura real de TaskFlow. En proyectos ESM con `NodeNext`, los imports relativos pueden necesitar la extensión `.js` aunque el archivo fuente sea TypeScript.

No copiar esta clase completa sobre el servicio existente si ya tiene otros métodos, como `create`, `update` y `remove`. Incorporar solamente el patrón de consulta y excepción.

### Explicación paso a paso

1. Prisma consulta la base de datos.
2. Si no encuentra una tarea, devuelve `null`.
3. El servicio detecta que no existe.
4. Se lanza `NotFoundException`.
5. NestJS convierte la excepción en una respuesta HTTP 404.

### Ejercicio oral

Preguntar qué sucedería si se eliminara la condición `if (!task)`.

Respuesta esperada: la aplicación podría devolver `null` o continuar con una lógica que no comunica correctamente la ausencia del recurso, dependiendo de la operación y del controlador.

---

## Diapositiva 12. Buenas prácticas para manejar errores

**Tiempo: 8 minutos**

Explicar que no todos los errores son iguales.

### Error de entrada

Ejemplo: el cliente envía un dato inválido.

Respuesta habitual: 400 Bad Request.

### Recurso inexistente

Ejemplo: el usuario solicita una tarea que no existe.

Respuesta habitual: 404 Not Found.

### Error inesperado

Ejemplo: una excepción no controlada o un fallo inesperado en una dependencia.

Respuesta habitual: 500 Internal Server Error.

### Reglas para el desarrollo

- No utilizar el código 500 para todos los errores.
- No devolver contraseñas, tokens ni información interna.
- Evitar capturar una excepción para después ignorarla.
- Registrar los errores internos cuando sea necesario.
- No revelar consultas SQL, secretos o trazas internas al cliente.
- Evitar capturar excepciones de Prisma indiscriminadamente y convertirlas todas en 404.

NestJS tiene un filtro de excepciones integrado. No es necesario crear un filtro global personalizado para enseñar el manejo habitual de errores.

### Mini ejercicio

Solicitar a los estudiantes que relacionen:

- Título vacío → 400.
- Tarea inexistente → 404.
- Usuario sin permiso → 403.
- Fallo inesperado del servidor → 500.

---

# BLOQUE 4. CONFIGURATION EN NESTJS

## Diapositiva 13. ¿Qué es Configuration?

**Tiempo: 5 minutos**

Explicar que las aplicaciones tienen valores que cambian según el entorno de ejecución.

Ejemplos:

- Puerto HTTP.
- URL de PostgreSQL.
- Claves de servicios externos.
- Parámetros de integración.
- Configuraciones de desarrollo y producción.

No conviene escribir estos valores directamente en el código fuente.

### Archivo `.env`

Ejemplo ilustrativo:

```env
PORT=3000
DATABASE_URL="postgresql://usuario:clave@localhost:5432/taskflow"
```

Explicar que los valores deben coincidir con el entorno real. No se deben copiar las credenciales ilustrativas como si fueran las del proyecto.

En Prisma 7, la forma de cargar `DATABASE_URL` depende de la configuración de Prisma ya existente. No se debe asumir que registrar `ConfigModule` en NestJS reemplaza automáticamente la configuración del cliente Prisma.

---

## Diapositiva 14. Configurar @nestjs/config

**Tiempo: 7 minutos**

### Paso 1. Instalar la dependencia

```bash
npm install @nestjs/config
```

### Paso 2. Registrar ConfigModule

Modificar `src/app.module.ts` conservando los módulos que ya existen.

Ejemplo:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TasksModule } from './tasks/tasks.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TasksModule,
  ],
})
export class AppModule {}
```

**Importante:** si `AppModule` ya importa `PrismaModule`, `TasksModule` u otros módulos, mantenerlos. El fragmento muestra la configuración que se debe integrar, no necesariamente todo el archivo real.

### Explicar `isGlobal`

Cuando se configura `isGlobal: true`, los demás módulos pueden utilizar `ConfigService` sin tener que importar `ConfigModule` en cada uno.

Esto simplifica la configuración de la aplicación.

### Pregunta

¿Por qué es preferible leer el puerto desde la configuración en lugar de escribir `3000` en múltiples archivos?

Respuesta esperada: centraliza el valor y permite cambiarlo según el entorno sin modificar el código fuente.

---

## Diapositiva 15. Leer la configuración

**Tiempo: 8 minutos**

### Ejemplo con ConfigService

Crear el archivo `src/config/app-config.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(
    private readonly configService: ConfigService,
  ) {}

  getPort(): number {
    return this.configService.get<number>('PORT', 3000);
  }
}
```

Este servicio es ilustrativo; no es obligatorio crearlo para usar `ConfigService`.

Explicar:

- `ConfigService` proporciona acceso centralizado a la configuración.
- `get<number>('PORT', 3000)` indica que se espera un número y utiliza 3000 como valor predeterminado.
- El tipo genérico no convierte ni valida por sí solo el valor de la variable de entorno.

Las variables de entorno suelen recibirse como cadenas. Para configuraciones críticas, conviene validar explícitamente el tipo, el rango y la presencia del valor antes de iniciar la aplicación.

### Uso en main.ts

Una forma sencilla de leer el puerto es inyectar `ConfigService` desde la aplicación NestJS:

```typescript
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);

  await app.listen(port);
}

bootstrap();
```

Si el proyecto utiliza otro sistema de módulos o rutas, adaptar los imports al `tsconfig.json` existente.

### Seguridad de las variables de entorno

Crear o revisar `.gitignore`:

```gitignore
.env
.env.*
!.env.example
```

Crear `.env.example` sin secretos reales:

```env
PORT=3000
DATABASE_URL=
```

Aclarar que la regla de `.gitignore` evita nuevas incorporaciones normales, pero no elimina un `.env` que ya se encuentre bajo seguimiento de Git.

**Nota para Prisma 7:** mantener el mecanismo de configuración de la URL de PostgreSQL que ya utiliza el proyecto. Si Prisma obtiene la URL desde `prisma7.config.ts`, esa configuración debe seguir funcionando; no basta con registrar `ConfigModule` para conectar automáticamente ambos sistemas.

---

# BLOQUE 5. INTEGRACIÓN PRÁCTICA EN TASKFLOW

## Diapositiva 16. Integración en TaskFlow

**Tiempo: 5 minutos**

Presentar el flujo completo:

```text
Postman
   |
   v
HTTP Request
   |
   v
ValidationPipe
   |
   +---- Entrada inválida ----> HTTP 400
   |
   v
TasksController
   |
   v
TasksService
   |
   +---- Tarea inexistente --> HTTP 404
   |
   v
Prisma
   |
   v
PostgreSQL
```

Explicar que cada componente tiene una responsabilidad distinta:

- DTO: define los datos esperados.
- ValidationPipe: valida los datos de entrada.
- Controller: recibe la solicitud y coordina la operación.
- Service: ejecuta la lógica de negocio.
- Prisma: permite consultar y modificar la base de datos.
- PostgreSQL: almacena la información.

### Ejemplo del controlador

Si el endpoint de creación ya existe, comprobar que recibe el DTO:

```typescript
@Post()
create(@Body() dto: CreateTaskDto) {
  return this.tasksService.create(dto);
}
```

El servicio debe conservar la lógica existente que utiliza Prisma para persistir la tarea.

No es necesario reescribir el CRUD completo para demostrar la validación.

---

## Diapositiva 17. Práctica guiada

**Tiempo: 20 minutos**

Los estudiantes deben trabajar sobre sus proyectos existentes.

### Actividad 1. Crear los DTOs (4 minutos)

- Crear `CreateTaskDto`.
- Definir las reglas del título.
- Permitir una descripción opcional.
- Crear `UpdateTaskDto` con `PartialType`.

### Actividad 2. Activar la validación (4 minutos)

- Instalar las dependencias que falten.
- Configurar `ValidationPipe` en `main.ts`.
- Ejecutar el proyecto.
- Corregir errores de compilación si aparecen.

### Actividad 3. Probar la validación (5 minutos)

Enviar desde Postman:

**Caso A: válido**

```json
{
  "title": "Revisar requerimientos",
  "description": "Preparar los casos de prueba"
}
```

**Caso B: título vacío**

```json
{
  "title": "",
  "description": "Preparar los casos de prueba"
}
```

**Caso C: tipo incorrecto**

```json
{
  "title": 123,
  "description": false
}
```

**Caso D: propiedad no permitida**

```json
{
  "title": "Nueva tarea",
  "admin": true
}
```

Registrar el código HTTP y el resultado de cada prueba.

### Actividad 4. Comprobar las excepciones (3 minutos)

Consultar una tarea con un ID inexistente.

Resultado esperado: 404, siempre que el servicio implemente correctamente la comprobación de existencia.

### Actividad 5. Configurar el puerto (4 minutos)

- Instalar `@nestjs/config`.
- Registrar `ConfigModule`.
- Leer `PORT` con `ConfigService`.
- Probar el servidor con el puerto configurado.

---

# BLOQUE 6. EVALUACIÓN Y CIERRE

## Diapositiva 18. Ideas clave

**Tiempo: 10 minutos**

### Preguntas de evaluación oral

**1. ¿Cuál es la función de un DTO?**

Respuesta esperada: definir la estructura de los datos transferidos a una operación.

**2. ¿Los DTOs validan automáticamente los datos?**

Respuesta esperada: no. Se necesitan decoradores de validación y un mecanismo como `ValidationPipe`.

**3. ¿Qué hace `whitelist: true`?**

Respuesta esperada: elimina las propiedades que no tienen decoradores de validación en el DTO.

**4. ¿Qué diferencia existe entre `ParseIntPipe` y `ValidationPipe`?**

Respuesta esperada: `ParseIntPipe` procesa un parámetro numérico específico; `ValidationPipe` valida los datos según las reglas del DTO y puede transformarlos.

**5. ¿Qué excepción corresponde cuando una tarea no existe?**

Respuesta esperada: `NotFoundException`, que genera HTTP 404.

**6. ¿Qué diferencia existe entre 401 y 403?**

Respuesta esperada: 401 indica que no hay autenticación válida; 403 indica que no se dispone del permiso necesario.

**7. ¿Para qué sirve `ConfigService`?**

Respuesta esperada: permite consultar la configuración de la aplicación, incluidas las variables de entorno.

**8. ¿Por qué no debemos subir credenciales reales a Git?**

Respuesta esperada: para evitar exponer secretos y comprometer la seguridad de la aplicación.

### Cierre del docente

Concluir que una API no solo debe responder correctamente cuando recibe datos válidos. También debe rechazar entradas incorrectas, comunicar los errores apropiadamente y mantener su configuración separada del código.

En la siguiente sesión se podrá continuar con los mecanismos de autenticación, autorización y seguridad de la API.

---

# 4. Lista de comprobación del docente

Antes de terminar la sesión, verificar:

- [ ] El proyecto compila y se ejecuta.
- [ ] `CreateTaskDto` tiene reglas de validación.
- [ ] `UpdateTaskDto` utiliza `PartialType`.
- [ ] `ValidationPipe` está configurado globalmente.
- [ ] Una solicitud válida continúa el flujo normal.
- [ ] Una solicitud inválida devuelve HTTP 400.
- [ ] Una tarea inexistente devuelve HTTP 404.
- [ ] `ConfigModule` está registrado.
- [ ] `ConfigService` puede leer la variable `PORT`.
- [ ] El archivo `.env` no contiene credenciales expuestas en el repositorio.

# 5. Problemas frecuentes y soluciones

| Problema | Qué revisar |
|---|---|
| Los decoradores no validan | Comprobar que `ValidationPipe` esté registrado y que el controlador reciba una clase DTO. |
| Error de compilación con `PartialType` | Instalar `@nestjs/mapped-types` y revisar el import. |
| Error al importar archivos | Revisar las rutas y la configuración ESM/NodeNext del proyecto. |
| Prisma no encuentra la base de datos | Comprobar el entorno y la configuración de Prisma 7 que ya utiliza TaskFlow. |
| La variable `PORT` no se lee | Revisar el archivo `.env`, el registro de `ConfigModule` y el acceso mediante `ConfigService`. |
| Se acepta una propiedad adicional | Verificar `whitelist` y `forbidNonWhitelisted`, además de los decoradores del DTO. |
| Aparece HTTP 500 en lugar de 404 | Revisar cómo se comprueba la existencia de la tarea y cómo se propaga la excepción. |

---

# 6. Resultado esperado de la sesión

Al terminar la clase, TaskFlow debe conservar sus funcionalidades existentes y añadir una capa de validación de datos, un manejo de errores HTTP más claro y una configuración centralizada.

El propósito no es desarrollar una aplicación completamente nueva, sino mejorar la calidad de la API mediante buenas prácticas de NestJS.