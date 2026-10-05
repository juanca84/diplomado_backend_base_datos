# Sesión 5 — Autenticación, Validación y Seguridad con Express

## Módulo 2 — Arquitectura del Back-End y Bases de Datos

---

# Diapositiva 1 — Título

# Autenticación, Validación y Seguridad con Express

### Módulo 2 — Arquitectura del Back-End y Bases de Datos

**Sesión 5**

> Protegiendo nuestra API y controlando los datos que recibe.

---

# Diapositiva 2 — Objetivos

## Objetivos de la sesión

Al finalizar la sesión podremos:

* Comprender autenticación y autorización.
* Implementar autenticación mediante JWT.
* Validar datos utilizando **Zod**.
* Utilizar middlewares para validar y proteger endpoints.
* Manejar correctamente códigos HTTP.
* Aplicar medidas básicas de seguridad.
* Separar configuración y secretos del código.
* Comprender el flujo de una API protegida.

---

# Diapositiva 3 — ¿Por qué necesitamos seguridad?

## Una API no debe confiar en el cliente

El cliente puede enviar:

* Datos incompletos.
* Datos con tipos incorrectos.
* Información maliciosa.
* Credenciales incorrectas.
* Peticiones repetidas.
* Información que no debería tener permiso para enviar.

Por eso:

> **Toda información recibida desde el cliente debe considerarse no confiable.**

---

# Diapositiva 4 — Identificación, autenticación y autorización

## Tres conceptos diferentes

### Identificación

El usuario indica quién es.

```text
"Soy juan@example.com"
```

### Autenticación

El sistema verifica que realmente sea esa persona.

```text
Email + Password
        ↓
¿Credenciales válidas?
```

### Autorización

El sistema determina qué puede hacer.

```text
Usuario autenticado
        ↓
¿Tiene permiso?
```

---

# Diapositiva 5 — Ejemplo

## Autenticación vs autorización

Supongamos:

```text
Juan inicia sesión
```

El sistema verifica su contraseña.

```text
✓ Autenticación
```

Después Juan intenta:

```http
DELETE /users/25
```

El sistema verifica si Juan tiene permisos de administrador.

```text
✓ Autorización
```

> Estar autenticado **no significa** tener permiso para hacer todo.

---

# Diapositiva 6 — Registro

## Registro de usuario

Endpoint:

```http
POST /auth/register
```

El cliente envía:

```json
{
  "name": "Juan",
  "email": "juan@example.com",
  "password": "MyPassword123"
}
```

El backend debe:

1. Validar los datos.
2. Verificar si el usuario ya existe.
3. Proteger la contraseña.
4. Guardar el usuario.
5. Responder correctamente.

---

# Diapositiva 7 — Nunca guardar contraseñas directamente

## Password Hashing

❌ Incorrecto:

```text
password = "MyPassword123"
```

Guardar directamente la contraseña es un riesgo grave.

### En su lugar

```text
Password
   ↓
Hashing
   ↓
Hash
   ↓
Database
```

La base de datos almacena el **hash**, no la contraseña original.

---

# Diapositiva 8 — Hashing

## ¿Qué es un hash?

Un hash es el resultado de aplicar una función que transforma un dato en otro valor.

Conceptualmente:

```text
"MiPassword123"
       ↓
     Hash
       ↓
"$2b$10$..."
```

Cuando el usuario inicia sesión:

```text
Password ingresada
       ↓
Comparación
       ↓
Hash almacenado
```

> El objetivo es que una contraseña almacenada no pueda recuperarse simplemente leyendo la base de datos.

---

# Diapositiva 9 — Login

## Inicio de sesión

Endpoint:

```http
POST /auth/login
```

El cliente envía:

```json
{
  "email": "juan@example.com",
  "password": "MyPassword123"
}
```

El backend:

```text
Buscar usuario
      ↓
Verificar contraseña
      ↓
¿Credenciales correctas?
      ↓
Generar token
```

---

# Diapositiva 10 — ¿Qué es JWT?

## JSON Web Token — JWT

JWT permite representar información que puede ser utilizada para identificar al usuario entre diferentes peticiones.

Después del login:

```text
Usuario
   ↓
Login correcto
   ↓
JWT
   ↓
Cliente
```

El cliente utiliza posteriormente el token para acceder a endpoints protegidos.

---

# Diapositiva 11 — Flujo de autenticación con JWT

## Flujo JWT

```text
Login
  ↓
Validar usuario
  ↓
Verificar contraseña
  ↓
Generar JWT
  ↓
Cliente recibe token
  ↓
Authorization: Bearer TOKEN
  ↓
Middleware
  ↓
Endpoint protegido
```

---

# Diapositiva 12 — Authorization Header

## Enviar el JWT

El cliente envía el token mediante el header:

```http
Authorization: Bearer <TOKEN>
```

Ejemplo:

```http
GET /profile
Authorization: Bearer eyJhbGciOiJIUzI1Ni...
```

El backend puede utilizar el token para verificar la autenticación.

---

# Diapositiva 13 — Middleware de autenticación

## Authentication Middleware

El middleware se ejecuta antes del endpoint protegido.

```text
Request
   ↓
Authentication Middleware
   ↓
¿Token válido?
   ↓
Controller
```

Si el token es inválido:

```text
Request
   ↓
Middleware
   ↓
401 Unauthorized
```

---

# Diapositiva 14 — Endpoint protegido

## Protegiendo `/profile`

```http
GET /profile
```

Flujo:

```text
GET /profile
      ↓
Authentication Middleware
      ↓
Verificar JWT
      ↓
Token válido
      ↓
Profile Controller
```

Sin token válido:

```text
401 Unauthorized
```

---

# Diapositiva 15 — Middleware

## ¿Qué es un middleware?

Un middleware es una función que participa en el procesamiento de una petición.

Conceptualmente:

```text
Request
   ↓
Middleware
   ↓
Middleware
   ↓
Controller
   ↓
Response
```

Puede:

* Validar datos.
* Autenticar usuarios.
* Verificar permisos.
* Registrar información.
* Interrumpir una petición.

---

# Diapositiva 16 — Middleware de validación

## Validar antes del Controller

Queremos evitar que el Controller tenga toda la lógica de validación.

```text
Request
   ↓
Validation Middleware
   ↓
Controller
   ↓
Service
   ↓
Database
```

Esto permite mantener responsabilidades separadas.

---

# Diapositiva 17 — ¿Por qué Zod?

## Validación con Zod

**Zod** es una librería para definir y validar estructuras de datos en JavaScript/TypeScript.

Podemos definir qué esperamos recibir:

```js
const registerSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8)
});
```

El schema describe las reglas que deben cumplir los datos.

---

# Diapositiva 18 — ¿Qué podemos validar?

## Reglas de validación

Con Zod podemos validar:

* Campos obligatorios.
* Tipos de datos.
* Emails.
* Longitudes.
* Valores mínimos y máximos.
* Valores permitidos.
* Estructuras de objetos.

Ejemplo:

```js
email: z.string().email()
password: z.string().min(8)
```

---

# Diapositiva 19 — Request inválido

## ¿Qué ocurre si los datos no son válidos?

Request:

```json
{
  "name": "J",
  "email": "correo-invalido",
  "password": "123"
}
```

El middleware valida:

```text
Request
   ↓
Zod
   ↓
❌ Validation Error
   ↓
400 Bad Request
```

El Controller **no debería ejecutarse**.

---

# Diapositiva 20 — Middleware + Zod

## Zod dentro de un Middleware

Podemos crear un middleware reutilizable:

```text
validate(schema)
```

Y utilizarlo en diferentes rutas.

```text
POST /auth/register
        ↓
validate(registerSchema)
        ↓
Controller
```

Otra ruta:

```text
POST /auth/login
        ↓
validate(loginSchema)
        ↓
Controller
```

---

# Diapositiva 21 — Separación de responsabilidades

## ¿Dónde debe estar cada responsabilidad?

```text
Route
  ↓
Middleware
  ↓
Controller
  ↓
Service
  ↓
Database
```

### Route

Define el endpoint.

### Middleware

Procesa condiciones antes del Controller.

### Controller

Coordina la petición y respuesta.

### Service

Contiene la lógica de negocio.

### Database

Almacena y consulta información.

---

# Diapositiva 22 — Ejemplo de arquitectura

## Estructura del proyecto

```text
src/
├── config/
├── controllers/
├── services/
├── routes/
├── middlewares/
├── validators/
└── app.js
```

Cada carpeta tiene una responsabilidad específica.

> Una buena arquitectura facilita mantener y proteger la aplicación.

---

# Diapositiva 23 — Flujo de registro

## `POST /auth/register`

```text
Client
  ↓
POST /auth/register
  ↓
Validation Middleware
  ↓
Auth Controller
  ↓
Auth Service
  ↓
Hash Password
  ↓
Database
  ↓
Response
```

Cada etapa tiene una responsabilidad diferente.

---

# Diapositiva 24 — Flujo de Login

## `POST /auth/login`

```text
Client
  ↓
POST /auth/login
  ↓
Validation Middleware
  ↓
Auth Controller
  ↓
Auth Service
  ↓
Buscar usuario
  ↓
Verificar password
  ↓
Generar JWT
  ↓
Response
```

---

# Diapositiva 25 — Flujo de endpoint protegido

## `GET /profile`

```text
Client
  ↓
GET /profile
  ↓
Authentication Middleware
  ↓
Verificar JWT
  ↓
Profile Controller
  ↓
Profile Service
  ↓
Database
  ↓
Response
```

---

# Diapositiva 26 — Autenticación vs autorización

## ¿Dónde entra la autorización?

Podemos tener:

```text
Authentication
      ↓
¿Quién eres?
      ↓
JWT
      ↓
Authorization
      ↓
¿Qué puedes hacer?
```

Ejemplo:

```text
GET /profile
→ Usuario autenticado

DELETE /users/:id
→ Requiere permisos de administrador
```

---

# Diapositiva 27 — Códigos HTTP

## Códigos HTTP relacionados con errores

| Código | Significado           |
| ------ | --------------------- |
| `400`  | Bad Request           |
| `401`  | Unauthorized          |
| `403`  | Forbidden             |
| `404`  | Not Found             |
| `409`  | Conflict              |
| `500`  | Internal Server Error |

---

# Diapositiva 28 — 400 vs 401 vs 403

## Tres errores importantes

### `400 Bad Request`

La petición contiene datos inválidos.

```text
Email inválido
Password demasiado corta
```

### `401 Unauthorized`

El usuario no está autenticado.

```text
Token inexistente
Token inválido
```

### `403 Forbidden`

El usuario está autenticado pero no tiene permiso.

```text
Usuario → intenta acceder a función ADMIN
```

---

# Diapositiva 29 — 409 Conflict

## `409 Conflict`

Se utiliza cuando la petición entra en conflicto con el estado actual del recurso.

Ejemplo:

```http
POST /auth/register
```

El email ya existe:

```text
juan@example.com
       ↓
Ya registrado
       ↓
409 Conflict
```

---

# Diapositiva 30 — Variables de entorno

## Configuración y secretos

No debemos colocar información sensible directamente en el código.

Ejemplo:

```env
PORT=3000
DATABASE_URL=...
JWT_SECRET=...
```

Estas variables pueden contener:

* Configuración.
* Credenciales.
* Secretos.
* URLs de servicios.

---

# Diapositiva 31 — `.env` y `.env.example`

## Separar secretos del código

### `.env`

Contiene valores reales.

```env
JWT_SECRET=my-secret-value
```

No debería subirse al repositorio.

### `.env.example`

Documenta las variables necesarias.

```env
PORT=
DATABASE_URL=
JWT_SECRET=
```

Puede incluirse en el repositorio.

---

# Diapositiva 32 — Seguridad básica en Express

## Protecciones básicas

| Riesgo              | Protección    |
| ------------------- | ------------- |
| Headers inseguros   | Helmet        |
| CORS incorrecto     | CORS          |
| Muchas peticiones   | Rate limiting |
| Passwords expuestos | Hashing       |
| Secretos en código  | `.env`        |
| Datos maliciosos    | Validación    |

---

# Diapositiva 33 — Helmet

## Helmet

Helmet ayuda a configurar diferentes HTTP headers relacionados con seguridad.

Instalación:

```bash
npm install helmet
```

Uso:

```js
app.use(helmet());
```

> No hace que una aplicación sea completamente segura, pero agrega una capa de protección.

---

# Diapositiva 34 — CORS

## CORS

**Cross-Origin Resource Sharing**

Controla qué orígenes pueden realizar determinadas solicitudes hacia nuestra API.

Ejemplo:

```text
Frontend
http://localhost:5173
       ↓
       API
http://localhost:3000
```

El backend puede configurar qué orígenes están permitidos.

---

# Diapositiva 35 — Rate Limiting

## Rate Limiting

Limita la cantidad de solicitudes que un cliente puede realizar durante un período determinado.

```text
Cliente
  ↓
Request 1
Request 2
Request 3
...
Request 1000
  ↓
Rate Limiter
  ↓
Límite alcanzado
```

Ayuda a reducir abusos y ataques de fuerza bruta.

---

# Diapositiva 36 — SQL Injection

## SQL Injection

Un atacante puede intentar manipular una consulta mediante datos enviados por el cliente.

Por eso debemos:

* Validar entradas.
* Utilizar queries parametrizadas.
* Utilizar correctamente un ORM o driver.
* No construir consultas SQL concatenando directamente datos del usuario.

```text
Usuario
   ↓
Input
   ↓
Validación
   ↓
Query segura
   ↓
Database
```

---

# Diapositiva 37 — NoSQL Injection

## NoSQL Injection

Las aplicaciones que utilizan bases de datos NoSQL también deben protegerse.

Debemos:

* Validar entradas.
* Controlar los tipos de datos.
* Evitar aceptar estructuras inesperadas.
* Utilizar correctamente las herramientas de acceso a datos.

> NoSQL no significa automáticamente "sin riesgos de inyección".

---

# Diapositiva 38 — Principio fundamental

## Nunca confiar en el cliente

```text
                    CLIENTE
                       │
                       ▼
                  ¿Es confiable?
                       │
                      NO
                       │
                       ▼
                  VALIDACIÓN
                       │
                       ▼
                  AUTENTICACIÓN
                       │
                       ▼
                 AUTORIZACIÓN
                       │
                       ▼
                   BACKEND
```

La seguridad debe comenzar desde la recepción de la petición.

---

# Diapositiva 39 — Flujo completo

## API segura

```text
Request
   ↓
CORS
   ↓
Rate Limiting
   ↓
Validation — Zod
   ↓
Authentication — JWT
   ↓
Authorization
   ↓
Controller
   ↓
Service
   ↓
Database
```

Cada capa tiene una responsabilidad.

---

# Diapositiva 40 — Ejemplo guiado

## Implementación guiada

Construiremos:

```http
POST /auth/register
POST /auth/login
GET /profile
```

Utilizando:

* Express
* Zod
* Middleware
* JWT
* Password hashing
* Variables de entorno

---

# Diapositiva 41 — Registro

## Paso 1 — Register

```http
POST /auth/register
```

Flujo:

```text
Request
 ↓
Zod Validation
 ↓
¿Usuario existe?
 ↓
Hash Password
 ↓
Guardar usuario
 ↓
Response
```

---

# Diapositiva 42 — Login

## Paso 2 — Login

```http
POST /auth/login
```

Flujo:

```text
Request
 ↓
Zod Validation
 ↓
Buscar usuario
 ↓
Verificar Password
 ↓
Generar JWT
 ↓
Response
```

---

# Diapositiva 43 — Profile

## Paso 3 — Endpoint protegido

```http
GET /profile
```

Request:

```http
Authorization: Bearer TOKEN
```

Flujo:

```text
Request
 ↓
Authentication Middleware
 ↓
Verify JWT
 ↓
Controller
 ↓
Response
```

---

# Diapositiva 44 — Arquitectura final

## Nuestra API

```text
                    EXPRESS
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
   Validation     Authentication   Security
      Zod              JWT          Helmet
        │               │            CORS
        │               │         Rate Limit
        └───────────────┼──────────────┘
                        ▼
                    Controller
                        ↓
                     Service
                        ↓
                    Database
```

---

# Diapositiva 45 — Práctica corta

## Actividad

Analiza los siguientes endpoints:

```http
GET /products
POST /products
GET /products/:id
DELETE /products/:id
GET /profile
DELETE /users/:id
```

Para cada uno determina:

1. ¿Debe estar protegido?
2. ¿Necesita validación?
3. ¿Necesita autorización?
4. ¿Qué código HTTP corresponde ante diferentes errores?

---

# Diapositiva 46 — Caso de análisis

## ¿Qué respuesta corresponde?

### Caso 1

```http
POST /auth/register
```

El email ya está registrado.

**¿Qué código HTTP utilizarías?**

---

### Caso 2

```http
GET /profile
```

No se envió el token.

**¿Qué código HTTP utilizarías?**

---

### Caso 3

Un usuario normal intenta:

```http
DELETE /users/25
```

El endpoint requiere administrador.

**¿Qué código HTTP utilizarías?**

---

# Diapositiva 47 — Resumen

## ¿Qué aprendimos?

Hoy aprendimos:

* Autenticación.
* Autorización.
* JWT.
* Password hashing.
* Middlewares.
* Validación con Zod.
* Códigos HTTP.
* Variables de entorno.
* Helmet.
* CORS.
* Rate limiting.
* SQL Injection.
* NoSQL Injection.

---

# Diapositiva 48 — Idea clave

## Una API segura no depende de una sola herramienta

```text
Zod
 +
Middlewares
 +
JWT
 +
Password Hashing
 +
HTTP Security
 +
Database Security
 +
Environment Variables
```

> **La seguridad es una responsabilidad de toda la arquitectura.**

---

# Diapositiva 49 — Próximo paso

## Próxima sesión

# Persistencia y acceso a datos desde el Backend

Conectaremos nuestra API con la base de datos y veremos cómo:

* Configurar la conexión.
* Modelar datos.
* Consultar información.
* Crear registros.
* Actualizar registros.
* Eliminar registros.
* Integrar Backend + Database.
