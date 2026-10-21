# Sesión 10: DTOs, Validation, Pipes, Exceptions y Configuration en NestJS

## Diapositiva 1. Objetivos de la sesión

Al finalizar la sesión, el estudiante podrá:

- Definir DTOs para recibir datos en una API.
- Validar solicitudes mediante `class-validator` y `ValidationPipe`.
- Manejar errores utilizando excepciones HTTP de NestJS.
- Administrar variables de entorno con `@nestjs/config`.
- Aplicar estos mecanismos al proyecto TaskFlow.

---

## Diapositiva 2. ¿Por qué necesitamos validar una API?

Una API no puede confiar en los datos que recibe del cliente.

Ejemplo de solicitud:

```json
{
  "title": "",
  "description": 123
}
```

Problemas:

- El título está vacío.
- La descripción tiene un tipo incorrecto.
- Los datos podrían provocar errores en el negocio o en la base de datos.

**Objetivo:** rechazar los datos inválidos antes de procesarlos.

---

## Diapositiva 3. ¿Qué es un DTO?

DTO significa *Data Transfer Object*.

Es un objeto que define la estructura de los datos que entran o salen de una operación.

En NestJS se utiliza frecuentemente para definir qué información acepta un endpoint.

Ejemplo:

```typescript
export class CreateTaskDto {
  title: string;
  description?: string;
}
```

**Ventajas:**

- Define los datos esperados.
- Facilita la validación.
- Evita aceptar propiedades innecesarias.
- Mejora la organización y el mantenimiento del código.

---

## Diapositiva 4. DTO para crear y actualizar tareas

Archivo: `dto/create-task.dto.ts`

```typescript
import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}
```

Archivo: `dto/update-task.dto.ts`

```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
```

`PartialType` convierte las propiedades heredadas en opcionales para una actualización parcial.

---

## Diapositiva 5. ¿Qué es la validación?

La validación comprueba si los datos cumplen las reglas definidas por el sistema.

Decoradores frecuentes de `class-validator`:

| Decorador | Función |
|---|---|
| `@IsString()` | Exige una cadena de texto |
| `@IsNotEmpty()` | Rechaza valores vacíos |
| `@IsOptional()` | Permite omitir una propiedad |
| `@IsEmail()` | Comprueba el formato de correo |
| `@IsInt()` | Exige un número entero |
| `@Min(1)` | Exige un valor mínimo de 1 |
| `@MaxLength(100)` | Limita la longitud del texto |

Los decoradores se ejecutan cuando la aplicación utiliza un mecanismo de validación, como `ValidationPipe`.

---

## Diapositiva 6. Instalación de las dependencias

Ejecutar en el proyecto NestJS:

```bash
npm install class-validator class-transformer
```

Para utilizar `PartialType`:

```bash
npm install @nestjs/mapped-types
```

Estas dependencias permiten definir reglas de validación y reutilizar DTOs.

---

## Diapositiva 7. ¿Qué es un Pipe?

Un Pipe es un componente que procesa los datos recibidos por un endpoint antes de que lleguen al método del controlador.

Se utiliza principalmente para:

- Validar datos.
- Transformar valores.
- Rechazar solicitudes incorrectas.

Ejemplo:

```typescript
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  return this.tasksService.findOne(id);
}
```

`ParseIntPipe` convierte el parámetro en un entero y rechaza valores que no pueden convertirse correctamente.

---

## Diapositiva 8. Configurar ValidationPipe globalmente

Archivo: `main.ts`

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

Opciones importantes:

- `whitelist`: elimina propiedades que no tienen decoradores de validación.
- `forbidNonWhitelisted`: rechaza solicitudes con propiedades no permitidas.
- `transform`: permite transformar los datos de entrada a los tipos esperados cuando corresponde.

**Importante:** para validar DTOs con `class-validator`, los DTOs deben ser clases con decoradores; las interfaces de TypeScript no son suficientes en tiempo de ejecución.

---

## Diapositiva 9. ¿Cómo funciona ValidationPipe?

Flujo de una solicitud:

1. El cliente envía un JSON.
2. NestJS recibe la solicitud.
3. `ValidationPipe` procesa el DTO.
4. Si los datos son inválidos, devuelve un error HTTP 400.
5. Si son válidos, el controlador continúa con el servicio.

Ejemplo de datos inválidos:

```json
{
  "title": "",
  "description": 123
}
```

Respuesta habitual:

```json
{
  "statusCode": 400,
  "message": [
    "title should not be empty",
    "description must be a string"
  ],
  "error": "Bad Request"
}
```

El texto exacto depende de las reglas y de la configuración de validación.

---

## Diapositiva 10. ¿Qué son las Exceptions?

Las excepciones permiten comunicar errores de manera controlada mediante códigos HTTP.

| Excepción | Código | Uso |
|---|---:|---|
| `BadRequestException` | 400 | Solicitud incorrecta |
| `UnauthorizedException` | 401 | Falta autenticación válida |
| `ForbiddenException` | 403 | No tiene permiso |
| `NotFoundException` | 404 | Recurso inexistente |
| `ConflictException` | 409 | Conflicto con el estado o los datos |
| `InternalServerErrorException` | 500 | Error interno del servidor |

NestJS dispone de un manejador de excepciones integrado que genera respuestas HTTP.

---

## Diapositiva 11. Excepciones en el servicio

Ejemplo en `tasks.service.ts`:

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class TasksService {
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

El ejemplo presupone que `PrismaService` ya está disponible en el servicio.

**Idea clave:** el servicio verifica si el recurso existe y lanza una excepción cuando no lo encuentra.

---

## Diapositiva 12. Buenas prácticas para manejar errores

- Utilizar excepciones HTTP apropiadas.
- No devolver siempre el código 500.
- No exponer contraseñas, tokens ni detalles internos.
- Diferenciar errores esperados de errores inesperados.
- Registrar los errores internos cuando sea necesario.

**Ejemplo:** si una tarea no existe, corresponde un 404, no un 500.

No es necesario crear un filtro global personalizado para los errores habituales, porque NestJS ya proporciona un manejador predeterminado.

---

## Diapositiva 13. ¿Qué es Configuration en NestJS?

La configuración permite administrar valores que cambian según el entorno.

Ejemplos:

- Puerto del servidor.
- URL de conexión a PostgreSQL.
- Claves y secretos.
- Parámetros de servicios externos.

No debemos escribir credenciales directamente en el código fuente.

Ejemplo de archivo `.env`:

```env
PORT=3000
DATABASE_URL="postgresql://usuario:clave@localhost:5432/taskflow"
```

Los valores son ilustrativos y deben coincidir con la configuración real del proyecto.

---

## Diapositiva 14. Configurar @nestjs/config

Instalación:

```bash
npm install @nestjs/config
```

Archivo: `app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
```

`isGlobal: true` permite utilizar `ConfigService` en otros módulos sin importar `ConfigModule` repetidamente.

---

## Diapositiva 15. Leer la configuración

Ejemplo de servicio:

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  getPort(): number {
    return this.configService.get<number>('PORT', 3000);
  }
}
```

La llamada `get<number>()` indica el tipo esperado para TypeScript, pero no valida por sí sola el contenido de la variable de entorno.

Para configuraciones críticas, conviene validar los valores al iniciar la aplicación.

**Seguridad:** no subir el archivo `.env` con secretos al repositorio. Mantenerlo fuera del control de versiones y compartir un `.env.example` sin credenciales reales.

---

## Diapositiva 16. Integración en TaskFlow

Al crear una tarea:

1. El cliente envía un JSON.
2. `ValidationPipe` valida `CreateTaskDto`.
3. `TasksController` recibe los datos válidos.
4. `TasksService` aplica las reglas de negocio.
5. Prisma guarda la tarea en PostgreSQL.
6. NestJS devuelve la respuesta.

Si los datos son inválidos, el flujo se detiene antes de ejecutar el servicio.

Si la tarea solicitada no existe, el servicio puede lanzar `NotFoundException`.

---

## Diapositiva 17. Práctica guiada

En el proyecto TaskFlow:

1. Crear `CreateTaskDto`.
2. Crear `UpdateTaskDto`.
3. Configurar `ValidationPipe` globalmente.
4. Probar la creación de una tarea con datos válidos.
5. Enviar un título vacío y comprobar el error 400.
6. Intentar consultar una tarea inexistente y comprobar el error 404.
7. Configurar `PORT` mediante `.env`.

Realizar las pruebas con Postman.

---

## Diapositiva 18. Ideas clave

- Los DTOs definen la estructura de los datos transferidos.
- Los decoradores especifican reglas de validación.
- Los Pipes validan o transforman datos antes de procesarlos.
- Las Exceptions permiten comunicar errores mediante códigos HTTP.
- `ConfigService` facilita el acceso centralizado a variables de entorno.
- La validación de entradas y el manejo de errores mejoran la confiabilidad de una API.

**Resultado esperado:** una API TaskFlow más segura, predecible y fácil de mantener.