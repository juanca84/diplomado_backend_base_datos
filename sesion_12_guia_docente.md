# Guía del Docente — Sesión 12
## Documentación, Health Check, Versioning, Docker y Deployment

**Módulo:** Arquitectura del Back-End y Bases de Datos  
**Proyecto:** Taskflow API  
**Stack tecnológico:** NestJS, TypeScript, Prisma 7, PostgreSQL y Docker  
**Duración:** 2 horas y 15 minutos (135 minutos)

---

## 1. Objetivos de aprendizaje

Al finalizar la sesión, el estudiante será capaz de:

- Documentar los endpoints de una API REST mediante Swagger / OpenAPI.
- Implementar un Health Check que compruebe la conectividad con PostgreSQL.
- Configurar el versionado URI de NestJS.
- Contenerizar la API y PostgreSQL mediante Docker Compose.
- Preparar la aplicación para ejecutarse en un entorno de producción.
- Verificar que la aplicación funciona correctamente después del despliegue.

## 2. Preparación del entorno

**Tiempo estimado:** 10 minutos.

El proyecto existente se encuentra en:

```powershell
C:\Users\Juan Carlos\dev\taskflow-api
```

Abrir PowerShell y ejecutar:

```powershell
cd C:\Users\Juan Carlos\dev\taskflow-api

npm install

npm run
```

El último comando permite revisar los scripts disponibles en `package.json`.

Iniciar la aplicación utilizando el script de desarrollo existente, habitualmente:

```powershell
npm run start:dev
```

### Verificaciones iniciales

- La aplicación inicia correctamente.
- PostgreSQL está disponible.
- Las variables de entorno están configuradas.
- Las rutas de Tasks, Users y Projects funcionan.
- Prisma 7 utiliza la configuración y el adaptador PostgreSQL existentes.

No reemplazar `prisma7.config.ts` ni la configuración del adaptador por ejemplos de versiones anteriores de Prisma.

---

## 3. Swagger / OpenAPI

**Tiempo estimado:** 20 minutos.

### 3.1. Objetivo

Explicar cómo documentar los endpoints, DTOs, parámetros, respuestas y mecanismos de autenticación de una API REST.

Swagger facilita la exploración y prueba de la API; OpenAPI es la especificación que describe sus operaciones y esquemas.

### 3.2. Instalar la dependencia

```powershell
npm install @nestjs/swagger
```

### 3.3. Configurar `src/main.ts`

Integrar el siguiente código en el archivo existente. Conservar la configuración de `ValidationPipe`, CORS y cualquier otro middleware ya implementado.

```typescript
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerModule,
} from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefijo global de la API.
  app.setGlobalPrefix('api');

  // La configuración de versionado se añadirá
  // en la sección correspondiente de esta guía.

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

  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
```

Con esta configuración, Swagger estará disponible en:

```text
http://localhost:3000/api/docs
```

Si el proyecto ya tiene un prefijo global, evitar duplicarlo.

### 3.4. Documentar el controlador de Tasks

En `src/tasks/tasks.controller.ts`, conservar el controlador existente y añadir los decoradores necesarios.

```typescript
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

// Conservar los demás imports del proyecto.

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller({
  path: 'tasks',
  version: '1',
})
export class TasksController {
  // Conservar el constructor y los métodos existentes.
}
```

En el método que lista las tareas, añadir:

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

Estos decoradores deben colocarse inmediatamente antes del método correspondiente.

Repetir el procedimiento para los controladores de Users y Projects.

**Importante:** `@ApiBearerAuth()` documenta la autenticación Bearer en Swagger, pero no protege las rutas. La protección continúa dependiendo de los Guards y de la estrategia JWT existentes.

### 3.5. Documentar los DTOs

Ejemplo ilustrativo de un DTO para crear tareas:

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

Este ejemplo debe adaptarse a los campos reales del proyecto.

No eliminar los validadores existentes, como `@IsString()`, `@IsNotEmpty()` o `@MaxLength()`.

### 3.6. Comprobación

Abrir Swagger en el navegador y verificar:

- Los grupos Tasks, Users y Projects.
- Los métodos HTTP y sus rutas.
- Los campos de los DTOs.
- Los códigos de respuesta documentados.
- El mecanismo Bearer para los endpoints protegidos.

**Pregunta para los estudiantes:** ¿Cuál es la diferencia entre documentar una ruta con Swagger y protegerla con JWT?

**Respuesta esperada:** Swagger describe la operación; JWT y los Guards implementan la autenticación y la protección de acceso.

---

## 4. Health Check

**Tiempo estimado:** 15 minutos.

### 4.1. Objetivo

Crear un endpoint que compruebe que la aplicación está disponible y que puede ejecutar una consulta sencilla en PostgreSQL.

La ruta prevista será:

```http
GET /api/v1/health
```

### 4.2. Crear el módulo

Desde la raíz del proyecto:

```powershell
nest g module health

nest g controller health --no-spec
```

### 4.3. Implementar `src/health/health.controller.ts`

El ejemplo presupone que `PrismaService` se encuentra en `src/prisma/prisma.service.ts` y que su módulo permite la inyección desde HealthModule.

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

Si `PrismaService` está ubicado en otra carpeta, ajustar el import.

Si el módulo de Prisma no es global, importarlo en `HealthModule` para permitir la inyección del servicio.

### 4.4. Configurar `src/health/health.module.ts`

```typescript
import { Module } from '@nestjs/common';

import { HealthController } from './health.controller';

@Module({
  controllers: [HealthController],
})
export class HealthModule {}
```

### 4.5. Registrar HealthModule

En `src/app.module.ts`, agregar el módulo sin eliminar los existentes:

```typescript
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    // Conservar los demás módulos.
    HealthModule,
  ],
})
export class AppModule {}
```

### 4.6. Probar el endpoint

Realizar una petición:

```http
GET http://localhost:3000/api/v1/health
```

Respuesta esperada cuando PostgreSQL está disponible:

```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-10-22T14:00:00.000Z"
}
```

El timestamp será generado durante la ejecución.

Si la consulta falla, el endpoint devuelve HTTP 503.

### 4.7. Explicación docente

Es importante distinguir:

- **Liveness:** comprueba si el proceso de la aplicación está activo.
- **Readiness:** comprueba si la aplicación está preparada para atender solicitudes, teniendo en cuenta sus dependencias.

Para este ejercicio se implementa una comprobación de disponibilidad que incluye PostgreSQL.

**Pregunta:** ¿Por qué no es suficiente devolver siempre `{"status":"ok"}`?

**Respuesta esperada:** porque la aplicación podría estar ejecutándose sin poder acceder a la base de datos.

---

## 5. Versioning de la API

**Tiempo estimado:** 15 minutos.

### 5.1. Objetivo

Comprender cómo mantener una API compatible con sus consumidores cuando se realizan cambios.

### 5.2. Configurar el versionado URI

En `src/main.ts`, importar:

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

No duplicar la configuración si ya se ha aplicado.

### 5.3. Versionar los controladores

En `src/tasks/tasks.controller.ts`:

```typescript
@Controller({
  path: 'tasks',
  version: '1',
})
export class TasksController {
  // Conservar los métodos existentes.
}
```

Aplicar la misma estrategia a Users, Projects y Health.

### 5.4. Verificar las rutas

| Operación | Ruta |
|---|---|
| Listar tareas | `GET /api/v1/tasks` |
| Crear tarea | `POST /api/v1/tasks` |
| Listar proyectos | `GET /api/v1/projects` |
| Listar usuarios | `GET /api/v1/users` |
| Comprobar disponibilidad | `GET /api/v1/health` |

### 5.5. Explicación docente

La versión URI permite distinguir diferentes versiones de una API.

Por ejemplo, `v1` puede mantener la estructura actual de una respuesta mientras que `v2` introduce cambios incompatibles.

No es necesario crear una nueva versión para cada corrección interna.

**Pregunta:** ¿Qué podría suceder si modificamos una respuesta y rompemos el contrato que espera una aplicación cliente?

**Respuesta esperada:** el cliente podría dejar de funcionar; el versionado permite gestionar cambios incompatibles de manera controlada.

---

## 6. Docker: contenerizar Taskflow API

**Tiempo estimado:** 20 minutos.

### 6.1. Objetivo

Ejecutar la API y PostgreSQL como servicios independientes, coordinados mediante Docker Compose.

### 6.2. Crear `Dockerfile`

En la raíz del proyecto:

```dockerfile
FROM node:24-bookworm-slim

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]
```

Este Dockerfile es una base didáctica. Antes de utilizarlo, verificar que:

- Existe `package-lock.json`.
- `prisma generate` utiliza correctamente la configuración de Prisma 7.
- El cliente generado está disponible en el contenedor.
- `npm run build` funciona.
- El archivo de entrada compilado es realmente `dist/main.js`.

Para producción, se recomienda una imagen multietapa, dependencias reducidas y un usuario sin privilegios.

### 6.3. Crear `.dockerignore`

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

Este archivo evita copiar dependencias locales, artefactos de compilación, archivos Git y secretos en el contexto de construcción.

### 6.4. Crear `compose.yaml`

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

La imagen PostgreSQL 16 es un ejemplo; utilizar la versión apropiada para el proyecto.

### 6.5. Configurar variables de entorno

Crear un archivo `.env` local:

```dotenv
POSTGRES_PASSWORD=cambiar_por_una_clave_segura
DATABASE_URL=postgresql://taskflow:cambiar_por_una_clave_segura@postgres:5432/taskflow
```

Las contraseñas deben coincidir.

**Precauciones:**

- No subir `.env` al repositorio.
- No utilizar contraseñas de ejemplo en producción.
- Utilizar el nombre `postgres` como host dentro de Compose.
- Configurar correctamente `DATABASE_URL` para Prisma 7.
- Codificar los caracteres especiales de la contraseña si se incluyen en la URL.

El archivo `.env` de Compose no garantiza por sí solo que las variables estén disponibles para todos los procesos. El ejemplo las pasa explícitamente al servicio `api` mediante `environment`.

### 6.6. Construir y ejecutar

Desde la raíz del proyecto:

```powershell
docker compose config

docker compose up --build -d

docker compose ps

docker compose logs -f api
```

Verificar los endpoints:

```text
http://localhost:3000/api/v1/health
http://localhost:3000/api/docs
```

### 6.7. Comprobar la persistencia

Crear una tarea utilizando la API y reiniciar el servicio:

```powershell
docker compose restart api
```

Consultar nuevamente la tarea.

El registro debe seguir disponible porque PostgreSQL utiliza el volumen persistente `postgres_data`.

**Importante:** no utilizar `docker compose down -v` si se necesita conservar el volumen de datos.

La configuración `depends_on` con `service_healthy` ordena el inicio de los servicios, pero no sustituye los mecanismos de recuperación ante desconexiones posteriores.

---

## 7. Deployment: preparación para producción

**Tiempo estimado:** 15 minutos.

### 7.1. Objetivo

Explicar el proceso necesario para preparar, iniciar y verificar una aplicación en un entorno de producción.

### 7.2. Compilar la aplicación

En el entorno de desarrollo:

```powershell
npm run build
```

Si existen errores de compilación, deben resolverse antes del despliegue.

### 7.3. Aplicar migraciones con Prisma 7

El comando habitual para aplicar las migraciones existentes en producción es:

```powershell
npx prisma migrate deploy
```

Este comando aplica las migraciones pendientes; no crea una migración nueva.

En el proyecto Taskflow API:

- Verificar `prisma7.config.ts`.
- Comprobar que la URL apunta a la base de datos correcta.
- Confirmar que las migraciones están versionadas.
- Ejecutar el comando contra la base de datos de destino.
- Evitar ejecutar migraciones de desarrollo como procedimiento habitual de producción.

Las migraciones deben ejecutarse después de que PostgreSQL esté disponible y antes de considerar lista la nueva versión de la API.

### 7.4. Ejecutar la aplicación compilada

En PowerShell:

```powershell
$env:NODE_ENV = "production"

node dist/main.js
```

Para ejecutar la versión contenerizada, utilizar el comando de inicio definido en el Dockerfile.

### 7.5. Verificar el despliegue

Comprobar:

1. La aplicación inicia correctamente.
2. PostgreSQL acepta conexiones.
3. Las migraciones se aplicaron.
4. Health Check responde con HTTP 200.
5. Swagger muestra las rutas esperadas.
6. El CRUD funciona.
7. Las rutas protegidas mantienen la autenticación y autorización.
8. Los logs no presentan errores persistentes.

### 7.6. Explicación docente

El ejercicio realiza un despliegue local con contenedores. Para publicar la aplicación en Internet, el entorno elegido también debe proporcionar los elementos necesarios, como dominio, HTTPS, red, firewall, gestión de secretos y copias de seguridad.

Docker facilita la ejecución reproducible, pero no reemplaza toda la configuración operativa de producción.

---

## 8. Actividad integradora

**Tiempo estimado:** 10 minutos.

Cada estudiante debe verificar los siguientes puntos en su Taskflow API:

- [ ] Swagger documenta las rutas existentes.
- [ ] Health Check verifica la conectividad con PostgreSQL.
- [ ] Los controladores utilizan la versión configurada.
- [ ] Docker Compose ejecuta la API y PostgreSQL.
- [ ] Los datos persisten después de reiniciar la API.
- [ ] La aplicación compila y puede ejecutarse en modo de producción.
- [ ] Las migraciones y las variables de entorno están configuradas.
- [ ] Los endpoints funcionan después del inicio.

### Preguntas de cierre

1. ¿Cuál es la diferencia entre Swagger y OpenAPI?
2. ¿Por qué Health Check debe verificar las dependencias?
3. ¿Qué beneficio aporta el versionado URI?
4. ¿Cuál es la diferencia entre una imagen Docker y un contenedor?
5. ¿Por qué PostgreSQL necesita un volumen persistente?
6. ¿Qué diferencia existe entre una migración de desarrollo y una migración de producción?
7. ¿Cómo comprobamos que un despliegue funciona correctamente?

---

## 9. Errores frecuentes y diagnóstico

| Problema | Qué revisar |
|---|---|
| Swagger no aparece | Ruta configurada, prefijo global y puerto. |
| Error 404 en una ruta | Prefijo `api`, versión URI y metadatos del controlador. |
| Health Check devuelve 503 | Conexión PostgreSQL, variables de entorno y disponibilidad del servicio. |
| `npm ci` falla | Existencia y consistencia de `package-lock.json`. |
| Docker no encuentra PostgreSQL | Host de `DATABASE_URL`; dentro de Compose debe ser `postgres`. |
| Prisma no encuentra la configuración | Ubicación de `prisma7.config.ts` y configuración de generación. |
| La API no inicia | Logs, ruta del archivo compilado, puerto y dirección de escucha. |
| Los datos parecen perderse | Volumen persistente y configuración de PostgreSQL. |
| La API no conecta al arrancar | Disponibilidad de PostgreSQL, reintentos y variables de entorno. |

---

## 10. Distribución del tiempo

| Actividad | Duración |
|---|---:|
| Preparación del entorno | 10 minutos |
| Swagger / OpenAPI | 20 minutos |
| Health Check | 15 minutos |
| Versioning | 15 minutos |
| Docker | 20 minutos |
| Deployment | 15 minutos |
| Actividad integradora | 10 minutos |
| Margen para implementación, diagnóstico y cierre | 30 minutos |
| **Total** | **135 minutos** |

## 11. Recomendaciones finales para el docente

Antes de impartir la sesión, probar los ejemplos en una copia del proyecto existente.

Prestar especial atención a:

- La estructura real de los módulos de NestJS.
- La ubicación del servicio de Prisma.
- La configuración de Prisma 7 y su adaptador PostgreSQL.
- Los scripts definidos en `package.json`.
- La ruta real del archivo de entrada compilado.
- La disponibilidad de las variables de entorno dentro de los contenedores.
- La aplicación de migraciones antes de poner la API en servicio.

No es necesario completar un despliegue en la nube durante esta sesión. El objetivo es que los estudiantes comprendan e implementen los fundamentos de documentación, monitoreo, versionado, contenerización y preparación para producción.

**Resultado esperado:** una Taskflow API documentada, versionada, verificable y ejecutable mediante Docker Compose con PostgreSQL persistente.