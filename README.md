# Módulo 2: Arquitectura del Back-End y Bases de Datos

**Duración:** 12 sesiones
**Duración por sesión:** 2 h 15 min
**Carga horaria total:** 27 horas

---

## 1. Metodología del módulo

Cada sesión tendrá la siguiente estructura:

| Etapa                   |      Tiempo | Descripción                                                        |
| ----------------------- | ----------: | ------------------------------------------------------------------ |
| Introducción            |       5 min | Presentación del tema, objetivos y conexión con la sesión anterior |
| Desarrollo teórico      |      65 min | Explicación de conceptos, terminología, arquitectura y fundamentos |
| Ejemplo guiado          |      45 min | Desarrollo paso a paso de un ejemplo por parte del docente         |
| Práctica del estudiante |      15 min | Ejercicio corto de aplicación                                      |
| Cierre y conclusiones   |       5 min | Recapitulación, dudas y conexión con la siguiente sesión           |
| **Total**               | **135 min** | **2 h 15 min**                                                     |

### Enfoque metodológico

El módulo seguirá una progresión:

**Fundamentos → Express → PostgreSQL → API → Seguridad → Testing → TypeScript → NestJS → ORM → Arquitectura → Documentación → Docker y despliegue**

La práctica de cada sesión será breve. El objetivo principal será que el estudiante **comprenda los conceptos y pueda aplicarlos inmediatamente en ejemplos pequeños**.

El proyecto se construirá progresivamente durante el módulo.

---
## 1.1 Propósito del módulo
Desarrollar en el estudiante las competencias necesarias para diseñar y construir aplicaciones backend, comprendiendo los fundamentos de Node.js, el desarrollo de APIs REST y la organización de aplicaciones mediante arquitecturas estructuradas con Express.js y NestJS.

El estudiante aprenderá a gestionar la comunicación entre aplicaciones y servicios, implementar rutas, middleware, validaciones, manejo de errores y principios básicos de arquitectura backend. Asimismo, trabajará con PostgreSQL y MongoDB para modelar, almacenar y consultar información, comprendiendo las características y diferencias entre bases de datos relacionales y NoSQL.

El módulo integra estos conocimientos mediante el desarrollo progresivo de servicios backend, aplicando buenas prácticas de organización del código, separación de responsabilidades, persistencia de datos, pruebas de APIs y herramientas de desarrollo como Postman y Docker.

# 2. Proyecto transversal

Durante las sesiones se desarrollará progresivamente una API REST.

### Proyecto sugerido: TaskFlow API

Sistema backend para administrar:

* Usuarios
* Tareas
* Categorías
* Autenticación
* Roles
* Estados de tareas

La evolución será:

```text
Node.js
   ↓
Express
   ↓
REST API
   ↓
PostgreSQL
   ↓
Autenticación
   ↓
Testing + Swagger
   ↓
TypeScript
   ↓
NestJS
   ↓
ORM
   ↓
Validación + Seguridad
   ↓
Testing + Swagger
   ↓
Docker + Deployment
```

PostgreSQL será la base de datos principal del proyecto.

MongoDB se utilizará principalmente para comprender y comparar el modelo NoSQL.

---

# 3. Plan de sesiones

## Sesión 1 — Node.js y fundamentos del Backend

### Objetivo

Comprender qué es un backend, cómo funciona una aplicación web y cuáles son los fundamentos de Node.js.

### Contenidos

#### Fundamentos de Backend

* Frontend vs Backend
* Cliente y servidor
* Arquitectura cliente-servidor
* Request y Response
* API
* API REST
* Base de datos
* Flujo general de una aplicación web

```text
Cliente
   ↓
HTTP Request
   ↓
Backend
   ↓
Base de datos
   ↓
Backend
   ↓
HTTP Response
   ↓
Cliente
```

#### HTTP

* URL
* Headers
* Body
* Request
* Response
* Métodos HTTP:

  * GET
  * POST
  * PUT
  * PATCH
  * DELETE
* Códigos de estado:

  * 2xx
  * 3xx
  * 4xx
  * 5xx

#### Node.js

* ¿Qué es Node.js?
* Runtime
* Motor V8
* Event Loop
* Operaciones asíncronas
* Promises
* `async/await`

#### npm

* `package.json`
* Dependencias
* `npm install`
* `node_modules`
* Scripts

#### Módulos

* CommonJS
* ES Modules

### Ejemplo guiado

Crear un servidor HTTP básico con Node.js.

### Práctica corta

Crear un servidor que responda:

```text
GET /
```

con un mensaje simple.

### Producto

Servidor Node.js funcionando.

---

# Sesión 2 — Express.js, Routing, Middleware y REST

### Objetivo

Construir una API REST básica utilizando Express.js.

### Contenidos

#### Express.js

* ¿Qué es Express?
* Aplicación Express
* Servidor
* `app.listen()`

#### Routing

* Rutas
* Métodos HTTP
* Parámetros de ruta
* Query parameters
* Request Body

Ejemplo:

```text
GET /users
GET /users/10
GET /users?role=admin
POST /users
PUT /users/10
DELETE /users/10
```

#### Request y Response

```javascript
req.params
req.query
req.body
```

```javascript
res.json()
res.status()
```

#### Middleware

* Concepto
* Middleware global
* Middleware de ruta
* Orden de ejecución
* `next()`

#### REST

* Recursos
* Endpoints
* Statelessness
* JSON
* Uso correcto de métodos HTTP
* Códigos HTTP

### Ejemplo guiado

Crear un CRUD básico de usuarios utilizando datos en memoria.

### Práctica corta

Crear un endpoint adicional para consultar un recurso utilizando un parámetro.

### Producto

API REST básica con Express.

---

# Sesión 3 — Bases de Datos: PostgreSQL y MongoDB

### Objetivo

Comprender los modelos relacional y NoSQL y aprender los fundamentos de PostgreSQL y MongoDB.

### Contenidos

## PostgreSQL

* Base de datos
* Tabla
* Registro
* Columna
* Primary Key
* Foreign Key
* Relaciones

### Relaciones

* 1:1
* 1:N
* N:M

### SQL

* `SELECT`
* `INSERT`
* `UPDATE`
* `DELETE`
* `WHERE`
* `ORDER BY`
* `GROUP BY`
* Funciones de agregación
* `JOIN`

## MongoDB

* NoSQL
* Database
* Collection
* Document
* Field
* `_id`
* JSON/BSON

### Modelado MongoDB

* Embedding
* References

### Comparación

| PostgreSQL  | MongoDB              |
| ----------- | -------------------- |
| Tabla       | Collection           |
| Registro    | Document             |
| Columna     | Field                |
| Primary Key | `_id`                |
| Relaciones  | Embedding/References |
| SQL         | Document queries     |

### Ejemplo guiado

Diseñar el modelo de datos de TaskFlow en PostgreSQL.

### Práctica corta

Crear una consulta SQL utilizando `SELECT` y `WHERE`.

### Producto

Modelo inicial de datos del proyecto.

---

# Sesión 4 — Express + PostgreSQL + REST API

### Objetivo

Conectar una API Express con PostgreSQL y comprender la separación entre API y acceso a datos.

### Contenidos

* Conexión Backend → PostgreSQL
* Pool de conexiones
* Configuración de conexión
* Consultas SQL desde Node.js
* CRUD persistente
* Manejo básico de errores

### Arquitectura inicial

```text
Request
   ↓
Route
   ↓
Controller
   ↓
Data Access
   ↓
PostgreSQL
```

### Diseño REST

* Recursos
* Endpoints
* Identificadores
* Métodos HTTP
* Status codes

### Consultas

* Búsqueda
* Filtrado
* Ordenamiento
* Paginación

Ejemplos:

```text
GET /products?page=2&limit=10
GET /products?category=books
GET /products?sort=price
```

### Ejemplo guiado

Conectar Express con PostgreSQL y crear un CRUD persistente.

### Práctica corta

Crear un endpoint que consulte PostgreSQL con un filtro.

### Producto

Express API conectada a PostgreSQL.

---

# Sesión 5 — Autenticación, Validación y Seguridad con Express

### Objetivo

Implementar los fundamentos de autenticación, autorización, validación y seguridad en una API.

### Contenidos

## Autenticación

* Identificación
* Autenticación
* Autorización
* Registro
* Login
* Password hashing

## JWT

Flujo:

```text
Login
 ↓
Validar usuario
 ↓
Verificar contraseña
 ↓
Generar JWT
 ↓
Cliente
 ↓
Authorization: Bearer TOKEN
 ↓
Middleware
 ↓
Endpoint protegido
```

## Validación

* Campos obligatorios
* Tipos
* Formatos
* Longitud
* Datos inválidos

## Seguridad

* CORS
* Helmet
* Rate limiting
* SQL Injection
* NoSQL Injection
* Variables de entorno
* Secretos
* No almacenar contraseñas en texto plano

## Errores HTTP

* 400 Bad Request
* 401 Unauthorized
* 403 Forbidden
* 404 Not Found
* 409 Conflict
* 500 Internal Server Error

## Configuración

```text
PORT
DATABASE_URL
JWT_SECRET
```

* `.env`
* `.env.example`
* Separación de configuración y código

### Ejemplo guiado

Implementar:

```text
POST /auth/register
POST /auth/login
GET /profile
```

### Práctica corta

Identificar qué endpoints deben estar protegidos y qué código HTTP corresponde a diferentes errores.

### Producto

API Express con autenticación, validación y seguridad básica.

---

# Sesión 6 — Testing y Documentación de APIs

### Objetivo

Comprender cómo probar una API y cómo documentarla utilizando OpenAPI/Swagger.

### Contenidos

## Testing

* ¿Por qué probar?
* Unit Testing
* Integration Testing
* End-to-End Testing
* Assertions
* Mocks

## Jest

* `describe`
* `test`
* `it`
* `expect`
* Mocks

## API Testing

* Request
* Response
* Status code
* Body
* Headers

## OpenAPI / Swagger

* ¿Qué es OpenAPI?
* ¿Qué es Swagger?
* Endpoints
* Parameters
* Request Body
* Responses
* Status Codes
* Authentication
* Examples

### README

El proyecto debe documentar:

* Descripción
* Instalación
* Requisitos
* Variables de entorno
* Ejecución
* Testing
* Endpoints
* Documentación API

### Ejemplo guiado

Crear una prueba de un endpoint y documentarlo con OpenAPI/Swagger.

### Práctica corta

Crear una prueba sencilla y documentar un endpoint.

### Producto

API Express con pruebas y documentación inicial.

---

# Sesión 7 — TypeScript aplicado al Backend e introducción a NestJS

### Objetivo

Comprender los fundamentos de TypeScript necesarios para trabajar con NestJS.

### Contenidos

## TypeScript

* JavaScript vs TypeScript
* Tipado estático
* `string`
* `number`
* `boolean`
* Arrays
* Objects
* `any`
* `unknown`
* `null`
* `undefined`

## Interfaces

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}
```

## Type aliases

```typescript
type UserRole = 'ADMIN' | 'USER';
```

## Funciones

* Tipos de parámetros
* Tipos de retorno
* Funciones async

## Otros conceptos

* Classes
* Generics
* Decorators
* Promises

Ejemplo:

```typescript
Promise<User>
Array<User>
```

## Introducción a NestJS

* ¿Qué es NestJS?
* Relación NestJS → Node.js → Express
* CLI
* Estructura del proyecto
* Decoradores

### Ejemplo guiado

Crear un proyecto NestJS y explorar su estructura.

### Práctica corta

Crear una interface y un método tipado.

### Producto

Proyecto NestJS inicial.

---

# Sesión 8 — Arquitectura de NestJS

### Objetivo

Comprender la arquitectura modular de NestJS y aplicar separación de responsabilidades.

### Contenidos

## Componentes

* Modules
* Controllers
* Services
* Providers
* Dependency Injection

### Controller

Responsabilidad:

* Recibir requests
* Coordinar la respuesta
* Delegar lógica

### Service

Responsabilidad:

* Lógica de negocio
* Procesamiento
* Reglas de negocio

### Dependency Injection

```text
Controller
    ↓
Service
    ↓
Repository
```

### Modules

* Organización funcional
* Imports
* Providers
* Controllers
* Exports

## DTO

Introducción al concepto de Data Transfer Object.

### Separación de responsabilidades

Evitar:

```text
Controller
   ↓
Toda la lógica
   ↓
Base de datos
```

Preferir:

```text
Controller
   ↓
Service
   ↓
Repository
   ↓
Database
```

### Ejemplo guiado

Crear un módulo de tareas con:

```text
TasksModule
TasksController
TasksService
```

### Práctica corta

Crear un endpoint utilizando Controller + Service.

### Producto

Primera API estructurada con NestJS.

---

# Sesión 9 — NestJS + PostgreSQL + ORM

### Objetivo

Integrar NestJS con PostgreSQL utilizando un ORM y comprender el mapeo entre objetos y tablas.

### Contenidos

## ORM

* ¿Qué es un ORM?
* Ventajas
* Limitaciones
* Entity
* Repository
* Relaciones

### ORM seleccionado

Se utilizará:

**TypeORM o Prisma**

La selección definitiva se realizará antes de iniciar la implementación del proyecto.

### Arquitectura

```text
Controller
     ↓
Service
     ↓
Repository / ORM
     ↓
PostgreSQL
```

## Entidades

* User
* Task
* Category

## Relaciones

* 1:1
* 1:N
* N:M

## Migrations

Concepto:

```text
Entity
   ↓
Migration
   ↓
Database
```

Importancia:

* Evolución de la base de datos
* Trabajo en equipo
* Diferentes ambientes
* Reproducibilidad
* Control de cambios

### Ejemplo guiado

Crear una entidad `Task`, relacionarla con `User` y almacenar datos en PostgreSQL.

### Práctica corta

Crear una entidad sencilla y definir una relación.

### Producto

NestJS conectado a PostgreSQL mediante ORM.

---

# Sesión 10 — DTOs, Validation, Pipes, Exceptions y Configuration

### Objetivo

Implementar validación, transformación, manejo de errores y configuración profesional en NestJS.

### Contenidos

## DTO

* Data Transfer Object
* Create DTO
* Update DTO
* Contrato de entrada de la API

Ejemplo:

```typescript
class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
```

## ValidationPipe

* Validación automática
* Transformación
* Datos inválidos

## Pipes

* Concepto
* Validación
* Transformación

## Exceptions

* BadRequest
* Unauthorized
* Forbidden
* NotFound
* Conflict

### Flujo de errores

```text
Controller
   ↓
Service
   ↓
Exception
   ↓
Exception Filter
   ↓
HTTP Response
```

## Configuration

* `.env`
* `.env.example`
* `ConfigModule`
* Configuración por ambiente
* Development
* Test
* Production
* Secrets

### Ejemplo guiado

Crear un DTO validado y generar respuestas de error apropiadas.

### Práctica corta

Agregar validación a un DTO existente.

### Producto

API NestJS validada y con manejo de errores.

---

# Sesión 11 — JWT, Guards, Roles, Seguridad y Testing en NestJS

### Objetivo

Implementar autenticación y autorización en NestJS y aplicar pruebas a los componentes principales.

### Contenidos

## JWT

* Login
* Password hashing
* Access token
* Bearer token
* JWT Strategy

## Guards

Flujo:

```text
Request
   ↓
Guard
   ↓
Controller
```

Ejemplo:

```typescript
@UseGuards(JwtAuthGuard)
```

## Autorización

* Roles
* RBAC
* ADMIN
* USER

## Seguridad

* CORS
* Helmet
* Rate limiting
* Secrets
* Validación
* Password hashing
* Protección de información sensible

## Testing

* Unit Testing
* Integration Testing
* E2E Testing
* Testing de Services
* Testing de Controllers
* Testing de endpoints
* Mocks

## Logging

* Logger de NestJS
* Información útil para diagnóstico
* Evitar información sensible en logs

### Ejemplo guiado

Proteger un endpoint con JWT y un Guard.

### Práctica corta

Proteger un endpoint y verificar el acceso con y sin token.

### Producto

API autenticada, protegida y con pruebas.

---

# Sesión 12 — Swagger, Health Check, Versioning, Docker y Deployment

### Objetivo

Preparar la API para un entorno de entrega y despliegue.

### Contenidos

## Swagger / OpenAPI en NestJS

* `@nestjs/swagger`
* Tags
* Operations
* Responses
* DTO documentation
* Authentication
* Bearer Token
* Ejemplos

## API Versioning

Ejemplo:

```text
/api/v1/users
/api/v2/users
```

Concepto y utilidad del versionado.

## Health Check

Endpoint:

```text
GET /health
```

Respuesta:

```json
{
  "status": "ok"
}
```

Importancia:

* Disponibilidad
* Diagnóstico
* Monitoreo básico

## Docker

* ¿Qué es un container?
* Image
* Container
* Dockerfile
* Environment variables
* Docker Compose

Arquitectura:

```text
Docker Compose
   ├── API
   └── PostgreSQL
```

## Deployment

* Build
* Variables de entorno
* Base de datos
* Logs
* URL pública
* Configuración de producción

Se puede utilizar una plataforma como:

* Render
* Railway
* Otra plataforma adecuada para el curso

## README final

Debe incluir:

* Descripción
* Tecnologías
* Requisitos
* Instalación
* Variables de entorno
* Ejecución
* Testing
* Swagger
* Endpoints
* Docker
* Deployment

### Ejemplo guiado

Dockerizar la API y ejecutar:

```text
API + PostgreSQL
```

### Práctica corta

Identificar los elementos necesarios para ejecutar la API en producción.

### Producto final

API REST completa:

* Node.js / NestJS
* TypeScript
* PostgreSQL
* ORM
* REST
* JWT
* Roles
* Validación
* Manejo de errores
* Seguridad básica
* Testing
* Swagger/OpenAPI
* Logging
* Health Check
* Versioning
* Docker
* README
* Deployment

---

# 4. Tecnologías del módulo

| Área                    | Tecnología                       |
| ----------------------- | -------------------------------- |
| Runtime                 | Node.js                          |
| Package Manager         | npm                              |
| Backend inicial         | Express.js                       |
| Lenguaje inicial        | JavaScript                       |
| Backend avanzado        | NestJS                           |
| Lenguaje                | TypeScript                       |
| API                     | REST                             |
| Formato                 | JSON                             |
| Base de datos principal | PostgreSQL                       |
| Base de datos NoSQL     | MongoDB                          |
| ORM                     | TypeORM / Prisma                 |
| Autenticación           | JWT                              |
| Passwords               | Hashing                          |
| Validación              | class-validator / ValidationPipe |
| Seguridad               | CORS, Helmet, Rate Limiting      |
| Testing                 | Jest + E2E                       |
| Documentación           | OpenAPI / Swagger                |
| Configuración           | dotenv / ConfigModule            |
| Control de versiones    | Git                              |
| Repositorio             | GitHub                           |
| Contenedores            | Docker                           |
| Deployment              | Cloud Platform                   |
| Monitoreo básico        | Logs + Health Check              |

---

# 5. Conceptos transversales

Durante todo el módulo se reforzarán:

* Git y GitHub
* Commits descriptivos
* `.gitignore`
* `.env` y `.env.example`
* README
* Separación de responsabilidades
* Arquitectura limpia y organizada
* Reutilización de código
* Nombres descriptivos
* Funciones pequeñas
* Manejo de errores
* Validación de entradas
* Seguridad
* Testing
* Documentación
* Logs
* Health checks
* Paginación
* Filtrado
* Ordenamiento
* Versionado de APIs

---

# 6. Temas fuera del alcance principal

Para mantener una profundidad adecuada y evitar una introducción superficial a demasiadas tecnologías, quedan fuera del contenido principal:

* Redis
* Caching avanzado
* WebSockets
* GraphQL
* Microservicios
* Kafka
* RabbitMQ
* Kubernetes
* OAuth / Social Login
* Arquitecturas distribuidas avanzadas
* CI/CD avanzado

Estos temas pueden mencionarse como **extensiones o contenidos futuros**, pero no forman parte del desarrollo principal del módulo.

---

# 7. Resultado esperado

Al finalizar el módulo, el estudiante deberá comprender cómo construir una API backend moderna desde sus fundamentos hasta una arquitectura estructurada y preparada para despliegue.

La progresión conceptual será:

```text
                BACKEND
                   │
                   ▼
               Node.js
                   │
                   ▼
                Express
                   │
          ┌────────┴────────┐
          ▼                 ▼
      REST API          PostgreSQL
          │                 │
          └────────┬────────┘
                   ▼
              Seguridad
                   │
                   ▼
              Testing
                   │
                   ▼
             OpenAPI/Swagger
                   │
                   ▼
              TypeScript
                   │
                   ▼
                NestJS
                   │
          ┌────────┴────────┐
          ▼                 ▼
     Controllers         Services
          │                 │
          └────────┬────────┘
                   ▼
                 ORM
                   │
                   ▼
              PostgreSQL
                   │
          ┌────────┴────────┐
          ▼                 ▼
       Testing          Security
          │                 │
          └────────┬────────┘
                   ▼
              Swagger
                   │
                   ▼
                Docker
                   │
                   ▼
               Deployment
```

El estudiante no solamente conocerá las tecnologías, sino que podrá explicar **cómo se relacionan entre sí y qué responsabilidad cumple cada componente dentro de una aplicación backend**.
