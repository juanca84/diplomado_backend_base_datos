# Guía del estudiante — Sesión 5

## Autenticación, Validación y Seguridad con Express

**Módulo:** Arquitectura del Back-End y Bases de Datos
**Sesión:** 5
**Tecnologías:** Node.js + Express + Zod + JWT

---

# 1. Objetivos

Al finalizar esta sesión podrás:

* Diferenciar identificación, autenticación y autorización.
* Comprender el funcionamiento básico de JWT.
* Proteger contraseñas mediante hashing.
* Crear middlewares en Express.
* Validar datos utilizando Zod.
* Proteger endpoints mediante autenticación.
* Comprender los principales códigos HTTP relacionados con errores.
* Utilizar variables de entorno para configuración y secretos.
* Conocer medidas básicas de seguridad para una API.

---

# 2. ¿Por qué debemos proteger una API?

Una API recibe información desde diferentes clientes:

* Navegadores.
* Aplicaciones móviles.
* Postman.
* Otros servicios.
* Scripts.

No podemos asumir que los datos recibidos son correctos o seguros.

Por ejemplo, nuestro endpoint puede esperar:

```json
{
  "name": "Juan",
  "email": "juan@example.com",
  "password": "Password123"
}
```

Pero un cliente podría enviar:

```json
{
  "name": 123,
  "email": "correo",
  "password": true
}
```

Por esta razón:

> **El backend debe validar siempre la información recibida.**

---

# 3. Identificación, autenticación y autorización

Estos conceptos están relacionados, pero no significan lo mismo.

## Identificación

El usuario indica quién es.

Ejemplo:

```text
email: juan@example.com
```

Es equivalente a decir:

> "Soy este usuario."

---

## Autenticación

El sistema comprueba que realmente sea ese usuario.

Por ejemplo:

```text
Email + Password
       ↓
Verificar credenciales
       ↓
Usuario autenticado
```

La autenticación responde:

> **¿Quién eres?**

---

## Autorización

Determina qué acciones puede realizar un usuario autenticado.

Por ejemplo:

```text
Usuario normal
    ↓
GET /profile       ✓
GET /products      ✓
DELETE /users/10   ✗
```

La autorización responde:

> **¿Qué puedes hacer?**

---

# 4. Registro de usuarios

Para registrar un usuario podemos utilizar:

```http
POST /auth/register
```

Request:

```json
{
  "name": "Juan",
  "email": "juan@example.com",
  "password": "Password123"
}
```

El backend debe:

1. Validar los datos.
2. Comprobar si el usuario ya existe.
3. Proteger la contraseña.
4. Guardar el usuario.
5. Devolver una respuesta adecuada.

Flujo:

```text
Request
   ↓
Validation
   ↓
¿Usuario existe?
   ↓
Hash Password
   ↓
Database
   ↓
Response
```

---

# 5. Password Hashing

Nunca debemos guardar una contraseña directamente en la base de datos.

### ❌ Incorrecto

```text
password = "Password123"
```

### ✅ Correcto

```text
Password
   ↓
Hashing
   ↓
Hash
   ↓
Database
```

Por ejemplo, en la base de datos podríamos encontrar algo similar a:

```text
$2b$10$...
```

en lugar de:

```text
Password123
```

---

# 6. Hashing vs Encryption

No debemos confundir ambos conceptos.

## Hashing

Está diseñado para producir una representación que no se utiliza para recuperar directamente el valor original.

Se utiliza habitualmente para:

* Contraseñas.
* Verificación de integridad.

## Encryption

Está diseñada para proteger información que posteriormente puede recuperarse utilizando una clave.

Para almacenar contraseñas utilizamos:

> **Password hashing**

---

# 7. Login

Para iniciar sesión utilizaremos:

```http
POST /auth/login
```

Request:

```json
{
  "email": "juan@example.com",
  "password": "Password123"
}
```

El backend debe:

```text
Buscar usuario
      ↓
Verificar contraseña
      ↓
¿Credenciales correctas?
      ↓
Generar JWT
```

---

# 8. JWT

## JSON Web Token

JWT es un formato utilizado para representar información que puede utilizarse para autenticar peticiones.

Flujo:

```text
Usuario
   ↓
Login
   ↓
Credenciales válidas
   ↓
JWT
   ↓
Cliente
```

Posteriormente el cliente enviará ese token en las peticiones que requieran autenticación.

---

# 9. Authorization Header

El token normalmente se envía utilizando el header:

```http
Authorization: Bearer <TOKEN>
```

Ejemplo:

```http
GET /profile
Authorization: Bearer eyJhbGciOiJIUzI1Ni...
```

### Componentes

```text
Authorization
      ↓
    Bearer
      ↓
    TOKEN
```

`Bearer` indica que estamos enviando un token de acceso.

---

# 10. Flujo de autenticación con JWT

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

# 11. Middleware

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

Un middleware puede:

* Validar información.
* Autenticar usuarios.
* Verificar permisos.
* Registrar información.
* Interrumpir una petición.
* Modificar `req` o `res`.

---

# 12. `next()`

Los middlewares utilizan `next()` para indicar que la petición puede continuar.

Ejemplo:

```js
export const middleware = (req, res, next) => {
  // Procesamiento

  next();
};
```

Flujo:

```text
Request
   ↓
Middleware
   ↓
next()
   ↓
Controller
```

Si el middleware detecta un problema, puede terminar la petición:

```js
return res.status(401).json({
  message: "Unauthorized"
});
```

En ese caso no se ejecuta el siguiente middleware ni el Controller.

---

# 13. Middleware de autenticación

Podemos crear un middleware para proteger endpoints.

```text
GET /profile
      ↓
Authentication Middleware
      ↓
¿JWT válido?
      ↓
Controller
```

Si el token es inválido:

```text
Request
   ↓
Authentication Middleware
   ↓
401 Unauthorized
```

---

# 14. Validación con Zod

## ¿Qué es Zod?

Zod es una librería que permite definir schemas y validar datos.

Instalación:

```bash
npm install zod
```

Podemos definir un schema:

```js
import { z } from "zod";

const registerSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8)
});
```

Este schema define qué esperamos recibir.

---

# 15. Reglas de validación

Zod permite definir diferentes reglas.

### String

```js
name: z.string()
```

### Email

```js
email: z.string().email()
```

### Longitud mínima

```js
password: z.string().min(8)
```

### Longitud máxima

```js
name: z.string().max(100)
```

### Número

```js
age: z.number()
```

### Valores permitidos

```js
role: z.enum(["USER", "ADMIN"])
```

---

# 16. Schema para Register

Podemos crear:

```js
import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});
```

Esto significa:

```text
name
→ string
→ mínimo 2 caracteres

email
→ string
→ formato de email válido

password
→ string
→ mínimo 8 caracteres
```

---

# 17. Schema para Login

Podemos crear otro schema:

```js
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});
```

No necesariamente todos los endpoints utilizan las mismas reglas.

Por eso podemos tener diferentes schemas.

---

# 18. Validar con `safeParse`

Zod proporciona `safeParse()` para validar datos.

```js
const result = registerSchema.safeParse(req.body);
```

Podemos comprobar:

```js
if (!result.success) {
  // Datos inválidos
}
```

Si los datos son correctos:

```js
if (result.success) {
  // Datos válidos
}
```

---

# 19. Middleware de validación

Para evitar repetir código podemos crear un middleware reutilizable.

Archivo:

```text
src/middlewares/validate.middleware.js
```

Código:

```js
export const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: result.error.issues
      });
    }

    req.body = result.data;

    next();
  };
};
```

---

# 20. ¿Cómo funciona `validate()`?

El middleware recibe un schema:

```js
validate(registerSchema)
```

Después:

```text
Request
   ↓
req.body
   ↓
Zod Schema
   ↓
¿Datos válidos?
```

Si no son válidos:

```text
400 Bad Request
```

Si son válidos:

```text
next()
   ↓
Controller
```

---

# 21. Utilizar el middleware

En nuestras rutas podemos hacer:

```js
router.post(
  "/register",
  validate(registerSchema),
  authController.register
);
```

El flujo será:

```text
POST /register
       ↓
validate(registerSchema)
       ↓
authController.register
```

Si la validación falla:

```text
POST /register
       ↓
validate()
       ↓
400
```

El Controller no se ejecuta.

---

# 22. Separación de responsabilidades

Nuestra arquitectura puede seguir el siguiente flujo:

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

Cada componente tiene una responsabilidad diferente.

---

# 23. Route

La ruta define el endpoint.

Ejemplo:

```js
router.post(
  "/register",
  validate(registerSchema),
  authController.register
);
```

La ruta indica:

```text
¿Qué endpoint?
¿Qué middleware?
¿Qué controller?
```

---

# 24. Middleware

El middleware realiza tareas que deben ejecutarse antes del Controller.

Ejemplos:

```text
Validation
Authentication
Authorization
```

Podemos reutilizar los middlewares en diferentes rutas.

---

# 25. Controller

El Controller coordina la petición y la respuesta.

Por ejemplo:

```text
Request
   ↓
Controller
   ↓
Service
   ↓
Response
```

No debería contener toda la lógica de negocio.

---

# 26. Service

El Service contiene la lógica de negocio.

Ejemplo para registro:

```text
¿Usuario existe?
      ↓
Hash password
      ↓
Crear usuario
      ↓
Guardar en Database
```

---

# 27. Flujo de Register

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

---

# 28. Flujo de Login

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

# 29. Flujo de Profile

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

# 30. Autenticación y autorización

Recordemos:

```text
Authentication
      ↓
¿Quién eres?
```

Mientras:

```text
Authorization
      ↓
¿Qué puedes hacer?
```

Ejemplo:

```text
GET /profile
→ Requiere autenticación

DELETE /users/:id
→ Requiere autenticación
→ Puede requerir rol ADMIN
```

---

# 31. Códigos HTTP

Los principales códigos que utilizaremos son:

| Código | Significado           |
| ------ | --------------------- |
| `400`  | Bad Request           |
| `401`  | Unauthorized          |
| `403`  | Forbidden             |
| `404`  | Not Found             |
| `409`  | Conflict              |
| `500`  | Internal Server Error |

---

# 32. `400 Bad Request`

Se utiliza cuando la petición enviada por el cliente no cumple las reglas esperadas.

Ejemplo:

```json
{
  "name": "J",
  "email": "correo-invalido",
  "password": "123"
}
```

Respuesta:

```http
400 Bad Request
```

---

# 33. `401 Unauthorized`

Indica que el cliente no está autenticado correctamente.

Ejemplos:

* No se envió el token.
* El token es inválido.
* El token expiró.
* Las credenciales son incorrectas.

Ejemplo:

```text
GET /profile
       ↓
Sin token
       ↓
401 Unauthorized
```

---

# 34. `403 Forbidden`

El usuario está autenticado, pero no tiene permisos suficientes.

Ejemplo:

```text
Usuario normal
      ↓
DELETE /users/25
      ↓
403 Forbidden
```

---

# 35. `404 Not Found`

El recurso solicitado no existe.

Ejemplo:

```http
GET /users/9999
```

Si el usuario no existe:

```http
404 Not Found
```

---

# 36. `409 Conflict`

Indica un conflicto con el estado actual del recurso.

Ejemplo:

```text
POST /auth/register
       ↓
Email ya registrado
       ↓
409 Conflict
```

---

# 37. `500 Internal Server Error`

Representa un error inesperado en el servidor.

No debemos utilizar `500` para errores normales de validación.

Por ejemplo:

```text
Datos inválidos
→ 400
```

y no:

```text
Datos inválidos
→ 500
```

---

# 38. Variables de entorno

No debemos colocar secretos directamente en el código.

Podemos utilizar:

```env
PORT=3000
DATABASE_URL=...
JWT_SECRET=...
```

En Node.js podemos acceder a ellos mediante:

```js
process.env.PORT
process.env.DATABASE_URL
process.env.JWT_SECRET
```

---

# 39. `.env`

El archivo `.env` contiene los valores utilizados por nuestro entorno.

Ejemplo:

```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/app
JWT_SECRET=development-secret
```

El archivo `.env` normalmente no debe subirse al repositorio.

---

# 40. `.env.example`

El archivo `.env.example` documenta las variables que necesita el proyecto.

```env
PORT=
DATABASE_URL=
JWT_SECRET=
```

Diferencia:

```text
.env
→ valores reales

.env.example
→ documentación de configuración
```

---

# 41. Seguridad básica en Express

Algunas medidas que podemos aplicar:

| Riesgo              | Protección    |
| ------------------- | ------------- |
| Headers inseguros   | Helmet        |
| CORS incorrecto     | CORS          |
| Muchas peticiones   | Rate limiting |
| Passwords expuestos | Hashing       |
| Secretos en código  | `.env`        |
| Datos inválidos     | Zod           |

Estas herramientas forman parte de diferentes capas de seguridad.

---

# 42. Helmet

Helmet ayuda a configurar determinados headers HTTP relacionados con seguridad.

Instalación:

```bash
npm install helmet
```

Uso:

```js
import helmet from "helmet";

app.use(helmet());
```

Helmet agrega una capa de protección, pero no reemplaza otras medidas de seguridad.

---

# 43. CORS

CORS significa:

**Cross-Origin Resource Sharing**

Puede ser necesario cuando nuestro frontend y backend utilizan diferentes orígenes.

Ejemplo:

```text
Frontend
http://localhost:5173

       ↓

Backend
http://localhost:3000
```

Podemos utilizar:

```bash
npm install cors
```

Y:

```js
import cors from "cors";

app.use(cors());
```

En producción debemos configurar cuidadosamente los orígenes permitidos.

---

# 44. Rate Limiting

Rate limiting limita la cantidad de solicitudes que un cliente puede realizar durante un período determinado.

Ejemplo:

```text
Cliente
  ↓
Request
Request
Request
Request
...
  ↓
Rate Limiter
  ↓
Límite alcanzado
```

Puede ayudar a reducir:

* Abuso de la API.
* Ataques de fuerza bruta.
* Demasiadas solicitudes.

---

# 45. SQL Injection

SQL Injection ocurre cuando datos controlados por el usuario pueden alterar una consulta SQL.

Debemos evitar construir consultas concatenando directamente información del usuario.

Buenas prácticas:

* Validar datos.
* Utilizar queries parametrizadas.
* Utilizar correctamente un ORM o driver.
* No concatenar directamente valores del usuario en SQL.

Flujo seguro:

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

# 46. NoSQL Injection

Las bases de datos NoSQL también pueden presentar riesgos de inyección.

Debemos:

* Validar datos.
* Controlar tipos.
* Controlar estructuras.
* Evitar objetos inesperados.
* Utilizar correctamente el driver u ODM.

> Utilizar NoSQL no significa que una aplicación sea automáticamente segura.

---

# 47. Principio fundamental

# Nunca confiar en el cliente

El cliente puede ser:

* Un navegador.
* Una aplicación móvil.
* Postman.
* Otro servidor.
* Un script.
* Un atacante.

Por eso:

```text
Cliente
   ↓
Request
   ↓
Validación
   ↓
Autenticación
   ↓
Autorización
   ↓
Backend
```

---

# 48. Flujo de una API protegida

Un flujo conceptual puede ser:

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

No todos los middlewares tienen que aplicarse a todas las rutas.

Por ejemplo:

```text
CORS
→ Global

Rate Limiting
→ Global o específico

Validation
→ Según la ruta

Authentication
→ Rutas protegidas

Authorization
→ Operaciones con permisos especiales
```

---

# 49. Estructura del proyecto

Una posible estructura:

```text
src/
├── config/
│
├── controllers/
│
├── services/
│
├── routes/
│
├── middlewares/
│
├── validators/
│
└── app.js
```

---

# 50. Ejemplo de estructura de autenticación

```text
src/
├── config/
│
├── controllers/
│   └── auth.controller.js
│
├── services/
│   └── auth.service.js
│
├── middlewares/
│   ├── validate.middleware.js
│   └── auth.middleware.js
│
├── validators/
│   └── auth.schema.js
│
├── routes/
│   └── auth.routes.js
│
└── app.js
```

---

# 51. Ejemplo guiado

Durante la práctica construiremos:

```http
POST /auth/register
POST /auth/login
GET /profile
```

Utilizando:

* Express.
* Zod.
* Middlewares.
* JWT.
* Password hashing.
* Variables de entorno.

---

# 52. Schema de Register

Archivo:

```text
src/validators/auth.schema.js
```

```js
import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});
```

---

# 53. Schema de Login

```js
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});
```

---

# 54. Middleware de validación

Archivo:

```text
src/middlewares/validate.middleware.js
```

```js
export const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: result.error.issues
      });
    }

    req.body = result.data;

    next();
  };
};
```

---

# 55. Utilizar el middleware

```js
router.post(
  "/register",
  validate(registerSchema),
  authController.register
);

router.post(
  "/login",
  validate(loginSchema),
  authController.login
);
```

Flujo:

```text
POST /register
      ↓
validate(registerSchema)
      ↓
authController.register
```

---

# 56. Authentication Middleware

Un middleware de autenticación puede:

1. Leer `Authorization`.
2. Obtener el token.
3. Verificar el JWT.
4. Guardar información del usuario en `req`.
5. Ejecutar `next()`.

Conceptualmente:

```text
Request
   ↓
Authorization Header
   ↓
Extract Token
   ↓
Verify JWT
   ↓
¿Válido?
   ↓
next()
```

---

# 57. Proteger `/profile`

```js
router.get(
  "/profile",
  authenticate,
  profileController.getProfile
);
```

Request:

```http
GET /profile
Authorization: Bearer TOKEN
```

Flujo:

```text
GET /profile
      ↓
authenticate
      ↓
Verify JWT
      ↓
Controller
```

---

# 58. Práctica

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

Para cada endpoint responde:

1. ¿Debe estar protegido?
2. ¿Necesita validación?
3. ¿Necesita autorización?
4. ¿Qué errores podrían ocurrir?
5. ¿Qué código HTTP utilizarías?

---

# 59. Tabla de análisis

Completa:

| Endpoint               | ¿Autenticación? | ¿Validación? | ¿Autorización? |
| ---------------------- | --------------- | ------------ | -------------- |
| `GET /products`        |                 |              |                |
| `POST /products`       |                 |              |                |
| `GET /products/:id`    |                 |              |                |
| `DELETE /products/:id` |                 |              |                |
| `GET /profile`         |                 |              |                |
| `DELETE /users/:id`    |                 |              |                |

---

# 60. Casos de análisis

## Caso 1

```http
POST /auth/register
```

El email ya está registrado.

¿Qué código HTTP corresponde?

```text
Respuesta: __________
```

---

## Caso 2

```http
GET /profile
```

El cliente no envió el token.

¿Qué código HTTP corresponde?

```text
Respuesta: __________
```

---

## Caso 3

Un usuario normal intenta:

```http
DELETE /users/25
```

El endpoint requiere permisos de administrador.

¿Qué código HTTP corresponde?

```text
Respuesta: __________
```

---

# 61. Preguntas de repaso

### 1. ¿Cuál es la diferencia entre autenticación y autorización?

```text
Respuesta:
________________________________________
________________________________________
```

### 2. ¿Qué problema resuelve JWT?

```text
Respuesta:
________________________________________
________________________________________
```

### 3. ¿Qué significa `Bearer`?

```text
Respuesta:
________________________________________
________________________________________
```

### 4. ¿Qué función cumple un middleware?

```text
Respuesta:
________________________________________
________________________________________
```

### 5. ¿Para qué utilizamos Zod?

```text
Respuesta:
________________________________________
________________________________________
```

---

# 62. Más preguntas de repaso

### 6. ¿Por qué no debemos guardar passwords en texto plano?

```text
Respuesta:
________________________________________
________________________________________
```

### 7. ¿Cuál es la diferencia entre `401` y `403`?

```text
Respuesta:
________________________________________
________________________________________
```

### 8. ¿Para qué utilizamos `.env`?

```text
Respuesta:
________________________________________
________________________________________
```

### 9. ¿Qué función cumple `next()`?

```text
Respuesta:
________________________________________
________________________________________
```

### 10. ¿Por qué debemos validar también en el backend?

```text
Respuesta:
________________________________________
________________________________________
```

---

# 63. Checklist

Antes de finalizar la sesión, verifica que puedas explicar:

* [ ] Identificación.
* [ ] Autenticación.
* [ ] Autorización.
* [ ] Registro.
* [ ] Login.
* [ ] Password hashing.
* [ ] JWT.
* [ ] `Authorization: Bearer`.
* [ ] Middleware.
* [ ] `next()`.
* [ ] Validación.
* [ ] Zod.
* [ ] Schema.
* [ ] `safeParse()`.
* [ ] `400 Bad Request`.
* [ ] `401 Unauthorized`.
* [ ] `403 Forbidden`.
* [ ] `404 Not Found`.
* [ ] `409 Conflict`.
* [ ] `500 Internal Server Error`.
* [ ] `.env`.
* [ ] `.env.example`.
* [ ] Helmet.
* [ ] CORS.
* [ ] Rate limiting.
* [ ] SQL Injection.
* [ ] NoSQL Injection.
* [ ] Route → Middleware → Controller → Service → Database.

---

# 64. Idea clave

Una API segura no depende de una sola herramienta.

```text
Zod
 +
Middlewares
 +
JWT
 +
Password Hashing
 +
Security Headers
 +
Rate Limiting
 +
Secure Database Access
 +
Environment Variables
```

> **La seguridad es responsabilidad de toda la arquitectura del backend.**

---

# 65. Resultado esperado

Al terminar esta sesión debes poder comprender el siguiente flujo:

```text
                    CLIENT
                       │
                       ▼
                    REQUEST
                       │
                       ▼
               ┌──────────────┐
               │  Middleware  │
               └──────────────┘
                       │
              ┌────────┴────────┐
              ▼                 ▼
          Validation       Authentication
             Zod                 JWT
              │                 │
              └────────┬────────┘
                       ▼
                 Authorization
                       │
                       ▼
                  Controller
                       │
                       ▼
                    Service
                       │
                       ▼
                   Database
                       │
                       ▼
                   RESPONSE
```

La idea fundamental:

> **Los middlewares nos permiten incorporar validación, autenticación y autorización antes de llegar a la lógica principal de nuestra API.**

---

# 66. Próxima sesión

## Persistencia y acceso a datos desde el Backend

En la siguiente sesión integraremos nuestra API con la base de datos.

Trabajaremos con:

* Conexión Backend → Database.
* Configuración.
* Modelos.
* Consultas.
* Creación de registros.
* Lectura.
* Actualización.
* Eliminación.
* Integración entre Express y la base de datos.

El objetivo será pasar de:

```text
API
```

a:

```text
API
 ↓
Service
 ↓
Database
```

para comenzar a trabajar con datos persistentes.
