# Guía del Estudiante — Sesión 12
## Documentación, Health Check, Versioning, Docker y Deployment

**Módulo:** Arquitectura del Back-End y Bases de Datos  
**Proyecto:** Taskflow API  
**Tecnologías:** NestJS, TypeScript, Prisma 7, PostgreSQL y Docker  
**Duración de referencia:** 2 horas y 15 minutos

---

# 1. Objetivo de la práctica

En esta sesión prepararás la Taskflow API para que pueda documentarse, verificar su disponibilidad, evolucionar mediante versiones y ejecutarse dentro de contenedores.

Al finalizar, deberás poder:

- Documentar la API con Swagger / OpenAPI.
- Implementar un endpoint de Health Check.
- Configurar el versionado URI.
- Crear un Dockerfile para NestJS.
- Ejecutar la API y PostgreSQL mediante Docker Compose.
- Preparar la aplicación para ejecutarse en producción.
- Verificar que los endpoints funcionan después del despliegue.

## Arquitectura que utilizaremos

La API continuará utilizando la arquitectura por capas desarrollada en las sesiones anteriores:

```text
Cliente HTTP / Swagger
          |
          v
     Controllers
          |
          v
       Services
          |
          v
     Repositories
          |
          v
      Prisma 7
          |
          v
      PostgreSQL
```

Docker permitirá ejecutar los servicios de la aplicación y de la base de datos de manera independiente.

**Importante:** no crearemos un proyecto nuevo. Todos los cambios se realizarán sobre la Taskflow API existente.

---

# 2. Preparar el proyecto

## Paso 1. Abrir la terminal

Abre PowerShell y accede a la carpeta del proyecto:

```powershell
cd C:\Users\Juan Carlos\dev\taskflow-api
```

Instala las dependencias:

```powershell
npm install
```

Revisa los scripts disponibles:

```powershell
npm run
```

Inicia la aplicación con el script de desarrollo que tenga configurado el proyecto. Habitualmente:

```powershell
npm run start:dev
```

## Paso 2. Comprobar el estado inicial

Antes de continuar, verifica que:

- La aplicación inicia correctamente.
- PostgreSQL está disponible.
- Las variables de entorno están configuradas.
- Los endpoints de Tasks, Users y Projects funcionan.
- Las operaciones CRUD continúan utilizando Services y Repositories.
- Prisma 7 mantiene su configuración actual.

Si encuentras un error, resuélvelo antes de avanzar.

No reemplaces `prisma7.config.ts`, el adaptador PostgreSQL ni la implementación existente de PrismaService por configuraciones de versiones anteriores.

---

# 3. Implementar Swagger / OpenAPI

## Paso 1. Instalar Swagger

Ejecuta:

```powershell
npm install @nestjs/swagger
```

Swagger permite explorar y probar la API desde una interfaz web. OpenAPI es la especificación que describe las operaciones, los parámetros, los DTOs y las respuestas.

## Paso 2. Configurar `src/main.ts`

Abre `src/main.ts`.

Integra la configuración de Swagger con el código existente. El siguiente ejemplo muestra una configuración básica para la aplicación, incluyendo el prefijo global `api` y el versionado que utilizaremos más adelante.

```typescript
import { NestFactory } from '@nestjs/core';
import {
  VersioningType,
} from '@nestjs/common';

import {
  DocumentBuilder,
  SwaggerModule,
} from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Taskflow API')
    .setDescription(
      'API REST para gestionar usuarios, proyectos y tareas.',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(
    app,
    swaggerConfig,
  );

  SwaggerModule.setup(
    'docs',
    app,
    document,
    {
      useGlobalPrefix: true,
    },
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
```

Si tu `main.ts` ya tiene configuraciones de CORS, `ValidationPipe` u otros elementos, consérvalos. No dupliques el prefijo global ni el versionado si ya existen.

La opción `useGlobalPrefix: true` permite que Swagger utilice el prefijo global configurado.

## Paso 3. Documentar el controlador de Tasks

Abre:

```text
src/tasks/tasks.controller.ts
```

Conserva los métodos existentes y agrega los decoradores de Swagger.

Ejemplo de los imports:

```typescript
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
```

En la declaración del controlador:

```typescript
@ApiTags('Tasks')
@ApiBearerAuth()
@Controller({
  path: 'tasks',
  version: '1',
})
export class TasksController {
  // Mantener el constructor y los métodos existentes.
}
```

En el método que lista las tareas, agrega los decoradores correspondientes:

```typescript
@ApiOperation({
  summary: 'Listar tareas',
})
@ApiResponse({
  status: 200,
  description: 'Lista de tareas obtenida correctamente.',
})
@ApiResponse({
  status: 401,
  description: 'No autenticado.',
})
```

Los decoradores deben colocarse inmediatamente antes del método correspondiente.

Repite el procedimiento en los controladores de Users y Projects.

**Importante:** si los controladores ya tienen un decorador `@Controller()`, modifica su configuración actual en lugar de añadir un segundo decorador.

## Paso 4. Documentar los DTOs

Los DTOs describen los datos que recibe la API. Swagger puede mostrar sus campos mediante `@ApiProperty()` y `@ApiPropertyOptional()`.

Ejemplo ilustrativo:

```typescript
import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Preparar informe',
    description: 'Título de la tarea.',
  })
  title: string;

  @ApiPropertyOptional({
    example: 'Completar el informe del proyecto',
    description: 'Descripción de la tarea.',
  })
  description?: string;
}
```

Adapta el ejemplo a los campos reales de tu DTO.

No elimines los validadores existentes, como:

```typescript
@IsString()
@IsNotEmpty()
@MaxLength(100)
```

Los decoradores de Swagger documentan los campos; los validadores controlan los datos recibidos.

## Paso 5. Verificar Swagger

Inicia la aplicación y abre:

```text
http://localhost:3000/api/docs
```

Si utilizas otro puerto, adapta la URL.

Comprueba que:

- Aparecen los grupos Tasks, Users y Projects.
- Los endpoints muestran los métodos HTTP correctos.
- Se visualizan los campos de los DTOs.
- Las operaciones tienen descripciones.
- Se puede configurar el token Bearer para probar rutas protegidas.

### Resultado esperado

Swagger debe presentar una documentación navegable de los endpoints de Taskflow API.

---

# 4. Implementar Health Check

## Paso 1. Crear el módulo

Desde la raíz del proyecto, ejecuta:

```powershell
nest g module health

nest g controller health --no-spec
```

Si ya existe alguno de estos archivos, no lo generes de nuevo.

## Paso 2. Crear el controlador

Crea o modifica:

```text
src/health/health.controller.ts
```

Utiliza el siguiente ejemplo, ajustando el import de PrismaService a la ubicación real de tu proyecto.

```typescript
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Controller({
  path: 'health',
  version: '1',
})
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  async check() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;

      return {
        status: 'ok',
        database: 'connected',
        timestamp: new Date().toISOString(),
      };
    } catch {
      throw new HttpException(
        {
          status: 'error',
          database: 'disconnected',
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
```

### ¿Qué hace este código?

1. Recibe una petición GET.
2. Ejecuta una consulta sencilla a PostgreSQL.
3. Devuelve HTTP 200 cuando la consulta funciona.
4. Devuelve HTTP 503 cuando la consulta falla.

El endpoint no realiza operaciones de escritura en la base de datos.

## Paso 3. Configurar `health.module.ts`

En `src/health/health.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';

@Module({
  controllers: [HealthController],
})
export class HealthModule {}
```

Este ejemplo supone que PrismaService puede inyectarse desde este módulo, por ejemplo porque PrismaModule es global.

Si no es global, importa PrismaModule en HealthModule y asegúrate de que exporta PrismaService.

## Paso 4. Registrar el módulo

Abre `src/app.module.ts` y agrega HealthModule al arreglo `imports`.

```typescript
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    // Conservar los módulos existentes.
    HealthModule,
  ],
})
export class AppModule {}
```

No elimines los módulos de autenticación, Prisma, Users, Projects o Tasks.

## Paso 5. Probar Health Check

Realiza esta petición desde Postman:

```http
GET http://localhost:3000/api/v1/health
```

Respuesta esperada:

```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-10-22T14:00:00.000Z"
}
```

El timestamp será generado durante la ejecución.

Si PostgreSQL no está disponible, el endpoint debería responder con HTTP 503.

### Actividad

Explica la diferencia entre estas dos respuestas:

- La aplicación está ejecutándose.
- La aplicación está ejecutándose y puede conectarse a PostgreSQL.

La segunda proporciona información adicional sobre la disponibilidad de la dependencia de persistencia.

---

# 5. Configurar el versionado de la API

## Paso 1. Habilitar el versionado URI

En `src/main.ts`, asegúrate de tener:

```typescript
import { VersioningType } from '@nestjs/common';
```

Después de crear la aplicación:

```typescript
app.setGlobalPrefix('api');

app.enableVersioning({
  type: VersioningType.URI,
});
```

Si ya lo configuraste al integrar Swagger, no vuelvas a añadirlo.

## Paso 2. Asignar la versión a los controladores

Por ejemplo, en `tasks.controller.ts`:

```typescript
@Controller({
  path: 'tasks',
  version: '1',
})
export class TasksController {
  // Conservar los métodos existentes.
}
```

Aplica el mismo criterio a Users, Projects y Health.

## Paso 3. Verificar las rutas

| Operación | Método | Ruta |
|---|---|---|
| Listar tareas | GET | `/api/v1/tasks` |
| Crear tarea | POST | `/api/v1/tasks` |
| Listar proyectos | GET | `/api/v1/projects` |
| Listar usuarios | GET | `/api/v1/users` |
| Health Check | GET | `/api/v1/health` |

Las rutas reales dependen de los controladores registrados y de su configuración.

### Actividad

Comprueba las rutas desde Postman y Swagger.

Responde:

1. ¿Qué función cumple el prefijo `api`?
2. ¿Qué función cumple `v1`?
3. ¿Por qué una versión nueva podría ser necesaria si cambia de forma incompatible una respuesta?

**Resultado esperado:** las rutas de los controladores están organizadas bajo la versión URI configurada.

---

# 6. Contenerizar Taskflow API con Docker

## Paso 1. Crear el Dockerfile

En la raíz del proyecto, crea un archivo llamado `Dockerfile`.

```dockerfile
FROM node:24-bookworm-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# Valor de ejemplo usado durante la generación del cliente.
# La aplicación recibirá la URL real en tiempo de ejecución.
ENV DATABASE_URL="postgresql://taskflow:build_placeholder@localhost:5432/taskflow"

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]
```

Este ejemplo conserva las dependencias necesarias para generar el cliente de Prisma y compilar NestJS.

**Antes de continuar, comprueba:**

- Que existe `package-lock.json`.
- Que Prisma 7 reconoce `prisma7.config.ts`.
- Que `npx prisma generate` funciona con la configuración actual.
- Que el comando `npm run build` termina correctamente.
- Que la compilación genera `dist/main.js`.

El valor de `DATABASE_URL` del Dockerfile es solamente un valor de ejemplo para la fase de construcción. La conexión real se configura en Docker Compose. No debe contener credenciales reales.

Si tu configuración de Prisma no permite generar el cliente con ese valor de ejemplo, ajusta el procedimiento de construcción para satisfacer los requisitos del proyecto.

## Paso 2. Crear `.dockerignore`

En la raíz del proyecto, crea `.dockerignore`:

```text
node_modules
dist
.git
.env
.env.*
!.env.example
coverage
npm-debug.log
```

Este archivo evita copiar dependencias locales, artefactos compilados, archivos Git y secretos al contexto de construcción.

## Paso 3. Crear `compose.yaml`

En la raíz del proyecto, crea `compose.yaml`:

```yaml
services:
  postgres:
    image: postgres:16
    restart: unless-stopped
    environment:
      POSTGRES_DB: taskflow
      POSTGRES_USER: taskflow
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test:
        - CMD-SHELL
        - pg_isready -U taskflow -d taskflow
      interval: 5s
      timeout: 3s
      retries: 10

  api:
    build: .
    restart: unless-stopped
    environment:
      NODE_ENV: production
      PORT: 3000
      DATABASE_URL: ${DATABASE_URL}
    ports:
      - "3000:3000"
    depends_on:
      postgres:
        condition: service_healthy

volumes:
  postgres_data:
```

Este ejemplo utiliza PostgreSQL 16. Si el proyecto utiliza otra versión, selecciona una imagen compatible con la versión que hayas validado.

### ¿Qué hace Docker Compose?

- `postgres`: ejecuta PostgreSQL.
- `api`: construye y ejecuta NestJS.
- `ports`: permite acceder a la API desde el equipo anfitrión.
- `volumes`: conserva los datos de PostgreSQL.
- `healthcheck`: comprueba que PostgreSQL está listo.
- `depends_on`: espera a que PostgreSQL supere la comprobación antes de iniciar la API.

## Paso 4. Configurar las variables de entorno

Crea un archivo `.env` junto a `compose.yaml`.

```dotenv
POSTGRES_PASSWORD=cambiar_por_una_clave_segura
DATABASE_URL=postgresql://taskflow:cambiar_por_una_clave_segura@postgres:5432/taskflow
```

Sustituye la contraseña de ejemplo por una apropiada para tu entorno.

Ambas contraseñas deben coincidir.

**Importante:**

- No subas `.env` al repositorio.
- No utilices credenciales de ejemplo en producción.
- El host de la base de datos es `postgres`, que corresponde al nombre del servicio en Compose.
- No utilices `localhost` para conectar la API con PostgreSQL desde el contenedor de la API.
- Si la contraseña contiene caracteres especiales, codifícalos correctamente dentro de la URL.

El archivo `prisma7.config.ts` y el servicio Prisma deben utilizar la variable `DATABASE_URL` que se proporciona al contenedor.

## Paso 5. Construir los servicios

Abre PowerShell en la raíz del proyecto.

Primero, valida la configuración:

```powershell
docker compose config
```

Construye y ejecuta:

```powershell
docker compose up --build -d
```

Verifica los servicios:

```powershell
docker compose ps
```

Consulta los logs:

```powershell
docker compose logs -f api
```

Para detener la visualización de los logs, utiliza `Ctrl + C`. Esto no detiene los contenedores.

## Paso 6. Aplicar las migraciones

Una vez que PostgreSQL esté disponible, aplica las migraciones pendientes con Prisma 7.

Para ejecutar el comando dentro de un contenedor temporal de la API:

```powershell
docker compose run --rm api npx prisma migrate deploy
```

Este procedimiento presupone que el cliente de Prisma, la configuración, el esquema y los archivos de migración están incluidos en la imagen.

Si el comando falla, revisa los logs, las variables de entorno y `prisma7.config.ts`.

**Importante:** las migraciones deben ejecutarse contra la base de datos correcta. No ejecutes este procedimiento accidentalmente contra una base de datos que contenga información que no deba modificarse.

## Paso 7. Verificar la aplicación

Abre:

```text
http://localhost:3000/api/v1/health
```

Y:

```text
http://localhost:3000/api/docs
```

Comprueba que ambos endpoints responden correctamente.

Si la aplicación no está disponible, consulta:

```powershell
docker compose ps

docker compose logs api

docker compose logs postgres
```

## Paso 8. Comprobar la persistencia

1. Crea una tarea mediante la API.
2. Comprueba que la tarea se almacena en PostgreSQL.
3. Reinicia la API:

```powershell
docker compose restart api
```

4. Consulta nuevamente la tarea.

La tarea debe continuar disponible porque los datos están almacenados en PostgreSQL, que utiliza el volumen persistente `postgres_data`.

Para detener los servicios sin eliminar los volúmenes:

```powershell
docker compose down
```

No utilices `docker compose down -v` si necesitas conservar los datos del volumen.

---

# 7. Preparar la ejecución en producción

## Paso 1. Compilar la aplicación

En el entorno de desarrollo:

```powershell
npm run build
```

La compilación debe completarse sin errores.

## Paso 2. Comprender las migraciones de producción

Prisma proporciona el comando:

```powershell
npx prisma migrate deploy
```

Este comando aplica las migraciones pendientes existentes. No crea una migración nueva.

Antes de ejecutarlo, comprueba que:

- Las migraciones están versionadas.
- `prisma7.config.ts` contiene la configuración adecuada.
- `DATABASE_URL` apunta a la base de datos de destino.
- La base de datos está disponible.
- La operación se ejecuta en el entorno correcto.

En el despliegue con Docker de esta práctica, las migraciones se ejecutan mediante el comando del apartado anterior.

## Paso 3. Ejecutar la compilación local

Para probar la aplicación compilada:

```powershell
$env:NODE_ENV = "production"

node dist/main.js
```

Este comando utiliza la compilación existente. Si la aplicación requiere otras variables de entorno, asegúrate de configurarlas antes de iniciar el proceso.

## Paso 4. Verificar el despliegue

Comprueba:

1. Que la API inicia.
2. Que PostgreSQL acepta conexiones.
3. Que las migraciones se aplicaron correctamente.
4. Que Health Check devuelve HTTP 200.
5. Que Swagger muestra las rutas esperadas.
6. Que las operaciones CRUD funcionan.
7. Que las rutas protegidas mantienen su autenticación y autorización.
8. Que los logs no muestran errores persistentes.

### Desarrollo frente a producción

| Desarrollo | Producción |
|---|---|
| Recarga automática | Aplicación compilada |
| Variables locales | Variables seguras del entorno |
| Depuración interactiva | Logs y monitoreo |
| Cambios frecuentes en el esquema | Migraciones controladas |
| Entorno de desarrollo | Entorno preparado para los usuarios |

El ejercicio de esta sesión es un despliegue local mediante contenedores. Para publicar la API en Internet, el entorno elegido también debe disponer de los elementos necesarios, como dominio, HTTPS, red, firewall, gestión de secretos y copias de seguridad.

---

# 8. Actividad integradora

Cuando hayas terminado las implementaciones, comprueba cada punto.

## Lista de verificación

- [ ] Swagger documenta Tasks, Users y Projects.
- [ ] Los DTOs muestran los campos esperados.
- [ ] Health Check comprueba la conexión con PostgreSQL.
- [ ] El versionado URI está configurado.
- [ ] Los endpoints funcionan bajo `/api/v1`.
- [ ] Docker construye la imagen de la API.
- [ ] Docker Compose ejecuta la API y PostgreSQL.
- [ ] Las migraciones se aplican correctamente.
- [ ] Los datos persisten después de reiniciar la API.
- [ ] La aplicación puede compilarse para producción.
- [ ] Las rutas protegidas mantienen la autenticación y autorización.

## Preguntas de autoevaluación

1. ¿Cuál es la diferencia entre Swagger y OpenAPI?
2. ¿Por qué un Health Check debe comprobar las dependencias?
3. ¿Qué beneficio aporta versionar una API?
4. ¿Cuál es la diferencia entre una imagen Docker y un contenedor?
5. ¿Por qué PostgreSQL necesita un volumen persistente?
6. ¿Qué diferencia existe entre una migración de desarrollo y una migración de producción?
7. ¿Cómo se comprueba que el despliegue funciona correctamente?

---

# 9. Problemas frecuentes

| Problema | Qué revisar |
|---|---|
| Swagger no aparece | Ruta de Swagger, prefijo global y puerto. |
| Error 404 | Prefijo `api`, versión URI y configuración del controlador. |
| Health Check devuelve 503 | Conexión PostgreSQL y variables de entorno. |
| `npm ci` falla | `package-lock.json` y dependencias. |
| Docker no encuentra PostgreSQL | Host de `DATABASE_URL`; dentro de Compose debe ser `postgres`. |
| Prisma no encuentra la configuración | `prisma7.config.ts`, esquema y generación del cliente. |
| La API no inicia | Logs, ruta de `dist/main.js`, puerto y configuración. |
| Los datos no aparecen | Volumen persistente, base de datos seleccionada y migraciones. |
| La API inicia antes de poder conectarse | Estado de PostgreSQL, reintentos y manejo de errores. |

---

# 10. Entregable de la sesión

Al finalizar la práctica, debes tener en tu proyecto:

- La documentación Swagger integrada.
- El endpoint Health Check.
- El versionado URI configurado.
- El archivo `Dockerfile`.
- El archivo `.dockerignore`.
- El archivo `compose.yaml`.
- Las variables de entorno locales configuradas sin exponer secretos.
- La aplicación ejecutándose con PostgreSQL mediante Docker Compose.
- Las migraciones aplicadas.
- Evidencias de las verificaciones realizadas.

**Resultado esperado:** una Taskflow API documentada, versionada, verificable y ejecutable mediante Docker Compose con PostgreSQL persistente.

La implementación debe conservar la arquitectura por capas, el uso de Repository y la configuración de Prisma 7 desarrollados durante las sesiones anteriores.