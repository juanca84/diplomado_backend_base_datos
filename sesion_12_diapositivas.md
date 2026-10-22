# Sesión 12: Documentación, monitoreo y despliegue de una API REST

**Módulo 2:** Arquitectura del Back-End y Bases de Datos  
**Proyecto:** Taskflow API  
**Stack:** NestJS · TypeScript · Prisma 7 · PostgreSQL · Docker

## Diapositiva 1. Objetivos de la sesión

Al finalizar la sesión, el estudiante podrá:

- Documentar una API REST con Swagger / OpenAPI.
- Implementar un endpoint de Health Check.
- Configurar el versionado de una API.
- Contenerizar la aplicación con Docker y Docker Compose.
- Preparar la API para ejecutarse en un entorno de producción.

**Pregunta inicial:** ¿Qué necesitamos además de un CRUD para considerar que una API está preparada para ser utilizada por otros sistemas?

## Diapositiva 2. Swagger / OpenAPI

**¿Qué es Swagger?**

Es un conjunto de herramientas para documentar, visualizar y probar una API REST. OpenAPI es la especificación utilizada para describir sus endpoints, parámetros, esquemas y respuestas.

**Instalación:**

```bash
npm install @nestjs/swagger
```

**Configuración en `src/main.ts`:**

```typescript
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('Taskflow API')
  .setDescription('API para gestionar tareas y proyectos')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);

SwaggerModule.setup('docs', app, document);
```

La configuración debe integrarse con la creación existente de `app`, antes de `app.listen()`.

**Resultado:** la documentación estará disponible en `/docs`, siempre que no se configure un prefijo global o una ruta adicional que modifique esa dirección.

**Buenas prácticas:**
- Documentar controladores, operaciones y respuestas.
- Describir los DTOs y sus campos.
- Documentar autenticación y códigos HTTP.

## Diapositiva 3. Health Check

**¿Por qué necesitamos verificar la salud de una aplicación?**

Una API puede estar ejecutándose y, aun así, no poder atender solicitudes porque PostgreSQL está desconectado.

Un Health Check permite comprobar la disponibilidad de la aplicación y, si se configura, de sus dependencias.

**Endpoint propuesto:**

```http
GET /api/v1/health
```

Ejemplo de respuesta satisfactoria:

```json
{
  "status": "ok",
  "database": "connected"
}
```

**Aspectos importantes:**

- Comprobar la conexión real con PostgreSQL.
- Responder con un estado HTTP apropiado si la base de datos no está disponible.
- Evitar exponer credenciales o detalles internos.
- Diferenciar disponibilidad (*liveness*) y capacidad de atender solicitudes (*readiness*).

**Actividad:** ¿Qué debería devolver el endpoint si la aplicación está activa, pero PostgreSQL no responde?

## Diapositiva 4. Versionado de API

**¿Por qué versionar una API?**

Los sistemas clientes necesitan estabilidad. Un cambio incompatible puede romper aplicaciones que consumen los endpoints existentes.

NestJS permite configurar el versionado por URI.

**Configuración en `main.ts`:**

```typescript
import { VersioningType } from '@nestjs/common';

app.enableVersioning({
  type: VersioningType.URI,
});
```

**Ejemplo de rutas:**

```http
GET    /v1/tasks
POST   /v1/tasks
GET    /v1/projects
GET    /v1/users
```

Si la aplicación utiliza un prefijo global `api`, las rutas pueden quedar como `/api/v1/tasks`.

**Conceptos clave:**

- `v1`: versión inicial de la API.
- `v2`: posible versión con cambios incompatibles.
- No es necesario crear una versión nueva para cada corrección interna.

**Pregunta:** ¿Qué problemas podría causar cambiar la estructura de una respuesta sin mantener compatibilidad?

## Diapositiva 5. Docker y contenedores

**¿Qué problema resuelve Docker?**

Permite empaquetar la aplicación y sus dependencias de ejecución para conseguir un entorno más reproducible.

**Conceptos fundamentales:**

- **Imagen:** plantilla para crear contenedores.
- **Contenedor:** instancia ejecutable de una imagen.
- **Dockerfile:** instrucciones para construir la imagen.
- **Docker Compose:** herramienta para definir y ejecutar varios servicios.
- **Volumen:** mecanismo para persistir datos.

**Arquitectura de Taskflow API:**

```text
Docker Compose
├── taskflow-api
│   └── NestJS + Prisma 7
└── postgres
    └── Base de datos
```

**Importante:** dentro de Docker Compose, la API debe conectarse a PostgreSQL usando el nombre del servicio como host, no `localhost`.

## Diapositiva 6. Docker Compose para Taskflow API

Ejemplo conceptual de `compose.yaml`:

```yaml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: taskflow
      POSTGRES_USER: taskflow
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  api:
    build: .
    environment:
      DATABASE_URL: ${DATABASE_URL}
      PORT: 3000
    ports:
      - "3000:3000"
    depends_on:
      - postgres

volumes:
  postgres_data:
```

**Consideraciones para la implementación real:**

- Definir las variables en un archivo `.env` local que no se suba al repositorio.
- Configurar `DATABASE_URL` con el host `postgres` y el puerto `5432`.
- Adaptar la conexión al esquema de Prisma 7 existente.
- Asegurar que la API escuche en `0.0.0.0` dentro del contenedor.
- Configurar una estrategia de espera y reintentos para PostgreSQL.
- Utilizar una imagen de aplicación construida a partir de un Dockerfile adecuado.

**Comandos principales:**

```bash
docker compose up --build -d
docker compose ps
docker compose logs -f api
docker compose down
```

`docker compose down` no elimina el volumen persistente por defecto; evita utilizar `-v` si necesitas conservar los datos.

## Diapositiva 7. Preparación para producción

**¿Qué cambia entre desarrollo y producción?**

| Desarrollo | Producción |
|---|---|
| Recarga automática | Aplicación compilada |
| Variables locales | Variables seguras del entorno |
| Herramientas de desarrollo | Dependencias de ejecución necesarias |
| Cambios frecuentes en la base de datos | Migraciones controladas |
| Depuración detallada | Registros y monitoreo adecuados |

**Comandos habituales de NestJS:**

```bash
npm run build
node dist/main.js
```

Los comandos exactos dependen de los scripts definidos en `package.json`.

**Con Prisma 7:**

- Mantener la configuración existente de Prisma y el adaptador PostgreSQL.
- Aplicar las migraciones pendientes con el flujo de producción previsto, normalmente `prisma migrate deploy`.
- Verificar la disponibilidad de las variables requeridas.
- No ejecutar migraciones de desarrollo como procedimiento habitual de producción.
- No incluir credenciales en la imagen ni en el repositorio.

**Objetivo:** conseguir una ejecución reproducible, segura y verificable.

## Diapositiva 8. Deployment: del desarrollo al entorno de ejecución

**Deployment** es el proceso de publicar y ejecutar una aplicación en un entorno donde pueda ser utilizada.

Flujo general:

```text
Código fuente
     ↓
Instalar dependencias
     ↓
Compilar la aplicación
     ↓
Construir la imagen Docker
     ↓
Configurar variables y base de datos
     ↓
Aplicar migraciones
     ↓
Iniciar la aplicación
     ↓
Verificar Health Check y endpoints
```

**Antes de dar por finalizado el despliegue:**

- La aplicación inicia correctamente.
- PostgreSQL está disponible.
- Las migraciones se aplicaron.
- Las variables de entorno están configuradas.
- Los endpoints responden según lo esperado.
- Los registros permiten diagnosticar errores.

**Nota:** el despliegue puede realizarse en un servidor propio o una plataforma compatible con contenedores. Docker prepara el artefacto, pero no sustituye toda la configuración del entorno de producción.

## Diapositiva 9. Taller integrador: Taskflow API

**Objetivo:** preparar la API existente para una ejecución documentada, verificable y contenerizada.

**Actividades:**

1. Configurar Swagger y documentar un endpoint de Tasks.
2. Implementar y probar `GET /api/v1/health`, incluida la comprobación de PostgreSQL.
3. Habilitar el versionado URI y verificar las rutas.
4. Construir la imagen Docker y ejecutar la API con PostgreSQL mediante Compose.
5. Aplicar las migraciones pendientes y comprobar que los datos persisten.
6. Consultar los registros y probar los endpoints después del inicio.

**Evidencias:**

- Captura o acceso a Swagger.
- Respuesta del Health Check.
- Ejemplo de ruta versionada.
- Contenedores en ejecución.
- Resultado de una operación CRUD satisfactoria.

**Restricción:** reutilizar el proyecto existente; no crear una API nueva desde cero.

## Diapositiva 10. Cierre y comprobación de aprendizaje

Antes de cerrar la sesión, el estudiante debe poder responder:

1. ¿Qué diferencia existe entre Swagger y OpenAPI?
2. ¿Por qué un Health Check debería comprobar las dependencias?
3. ¿Qué beneficio aporta versionar una API?
4. ¿Cuál es la diferencia entre una imagen y un contenedor?
5. ¿Por qué PostgreSQL necesita persistencia en Docker?
6. ¿Qué diferencia existe entre una migración de desarrollo y una de producción?
7. ¿Cómo verificamos que el despliegue funciona correctamente?

**Idea final:**

Una API backend no termina cuando sus endpoints funcionan. También debe poder documentarse, monitorearse, evolucionar y ejecutarse de forma reproducible en un entorno de despliegue.

**Resultado esperado:** Taskflow API preparada para documentar sus endpoints, verificar su estado, exponer una versión definida y ejecutarse mediante contenedores con PostgreSQL.
