# Guía del docente — Sesión 5

## Autenticación, Validación y Seguridad con Express

**Módulo:** Arquitectura del Back-End y Bases de Datos
**Sesión:** 5
**Duración:** 2 horas 15 minutos
**Tecnología principal:** Node.js + Express + TypeScript/JavaScript + Zod
**Tema central:** Autenticación, validación, middlewares y seguridad básica

---

# 1. Objetivo de la sesión

Al finalizar la sesión, el estudiante debe comprender cómo una API Express puede:

* Identificar y autenticar usuarios.
* Diferenciar autenticación de autorización.
* Proteger contraseñas mediante hashing.
* Utilizar JWT para autenticación basada en tokens.
* Crear middlewares reutilizables.
* Validar información utilizando Zod.
* Proteger endpoints mediante middleware.
* Utilizar correctamente códigos HTTP relacionados con autenticación y validación.
* Separar configuración y secretos mediante variables de entorno.
* Comprender mecanismos básicos de seguridad para una API Express.

El objetivo **no es convertir al estudiante en especialista en seguridad**, sino que comprenda los mecanismos fundamentales y sea capaz de integrarlos correctamente dentro de una API.

---

# 2. Distribución del tiempo

| Actividad                                    |      Tiempo |
| -------------------------------------------- | ----------: |
| Introducción y objetivos                     |       5 min |
| Identificación, autenticación y autorización |      15 min |
| Registro, passwords y hashing                |      15 min |
| JWT y autenticación mediante tokens          |      20 min |
| Middlewares y validación con Zod             |      25 min |
| Arquitectura y flujo de la API               |      10 min |
| Seguridad básica                             |      15 min |
| Códigos HTTP                                 |      10 min |
| Ejemplo guiado                               |      15 min |
| Práctica corta                               |       5 min |
| Cierre y conclusiones                        |       5 min |
| **Total**                                    | **135 min** |

> La implementación completa puede extenderse si el ritmo del grupo lo permite. La prioridad es que entiendan el flujo y la separación de responsabilidades, no escribir una gran cantidad de código.

---

# 3. Preparación previa del docente

Antes de comenzar la clase, verificar que el proyecto de Express funcione.

Se recomienda tener preparado:

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

También tener instalados o preparados los siguientes paquetes:

```bash
npm install zod
npm install jsonwebtoken
npm install bcrypt
npm install helmet
npm install cors
```

Si se utiliza TypeScript:

```bash
npm install -D @types/jsonwebtoken @types/bcrypt
```

Para el ejemplo guiado también se debe tener disponible:

```env
PORT=3000
JWT_SECRET=development-secret
```

> No utilizar un secreto real durante la clase.

---

# 4. Introducción — Diapositivas 1 y 2

## Tiempo: 5 minutos

### Objetivo

Presentar el problema que resolveremos durante la sesión.

Explicar a los estudiantes:

Hasta ahora hemos aprendido a crear endpoints y recibir información mediante:

* `req.params`
* `req.query`
* `req.body`

Pero existe una pregunta fundamental:

> ¿Podemos confiar en todo lo que envía el cliente?

La respuesta es:

**No.**

Una API debe controlar:

* Qué datos recibe.
* Quién está realizando la petición.
* Qué puede hacer ese usuario.
* Qué información puede consultar o modificar.

Por eso hoy agregaremos una nueva capa a nuestra API:

```text
Request
   ↓
Validation
   ↓
Authentication
   ↓
Authorization
   ↓
Controller
   ↓
Service
   ↓
Database
```

### Pregunta inicial

Preguntar:

> Si tenemos un endpoint `DELETE /users/10`, ¿deberíamos permitir que cualquier persona pueda llamarlo?

Esperar respuestas como:

* No.
* Debe estar protegido.
* Necesitamos saber quién está realizando la petición.
* Necesitamos comprobar si tiene permisos.

Utilizar estas respuestas para introducir autenticación y autorización.

---

# 5. Identificación, autenticación y autorización

## Diapositivas 3, 4 y 5

### Tiempo: 15 minutos

---

## 5.1 Identificación

Explicar:

La identificación consiste en que una persona o sistema indica quién es.

Ejemplo:

```text
Email: juan@example.com
```

El usuario está diciendo:

> "Soy este usuario."

Pero todavía no sabemos si realmente lo es.

---

## 5.2 Autenticación

La autenticación consiste en verificar la identidad.

Por ejemplo:

```text
Email
+
Password
```

El servidor busca el usuario y comprueba la contraseña.

```text
Usuario
   ↓
¿Existe?
   ↓
¿Password correcta?
   ↓
Autenticado
```

### Frase importante

> **Autenticación responde a: "¿Quién eres?"**

---

## 5.3 Autorización

Una vez autenticado, necesitamos determinar qué puede hacer.

Por ejemplo:

```text
Usuario normal
```

puede:

```text
GET /profile
GET /products
```

Pero quizás no pueda:

```text
DELETE /users/:id
```

porque esa operación requiere permisos de administrador.

### Frase importante

> **Autorización responde a: "¿Qué puedes hacer?"**

---

## Pregunta para los estudiantes

Preguntar:

> Un usuario inicia sesión correctamente, ¿significa que puede acceder a cualquier endpoint?

Respuesta:

**No.**

Está autenticado, pero sus permisos pueden ser limitados.

---

# 6. Registro de usuarios

## Diapositiva 6

### Tiempo: 5 minutos

Presentar:

```http
POST /auth/register
```

El cliente puede enviar:

```json
{
  "name": "Juan",
  "email": "juan@example.com",
  "password": "MyPassword123"
}
```

Explicar que el backend **no debería simplemente guardar este objeto directamente**.

Antes debe:

1. Validar los datos.
2. Verificar que el email no exista.
3. Proteger la contraseña.
4. Guardar el usuario.
5. Devolver una respuesta apropiada.

Representar:

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
```

---

# 7. Password Hashing

## Diapositivas 7 y 8

### Tiempo: 10 minutos

Explicar primero el problema.

Nunca debemos almacenar:

```text
password = "MyPassword123"
```

directamente en la base de datos.

Si alguien obtiene acceso a la base de datos, podría obtener todas las contraseñas.

---

## 7.1 Hash

Un hash transforma una entrada en otra representación.

Conceptualmente:

```text
"MyPassword123"
       ↓
     Hash
       ↓
"$2b$10$..."
```

La aplicación almacena el hash.

---

## 7.2 ¿Cómo funciona el login?

Cuando el usuario vuelve a iniciar sesión:

```text
Password ingresada
       ↓
Comparar con hash almacenado
       ↓
¿Coincide?
```

No debemos explicar el hashing como simplemente:

> "Encriptamos la contraseña."

Esto puede generar una idea incorrecta.

### Diferencia importante

**Hashing:**

* No está diseñado para recuperar el valor original.
* Se utiliza para almacenar contraseñas de forma segura.

**Encryption:**

* Está diseñada para poder recuperar el valor original utilizando una clave.

Para contraseñas utilizamos hashing.

---

## Pregunta

> Si tenemos el hash de una contraseña, ¿deberíamos poder convertirlo nuevamente en la contraseña original?

Respuesta:

**No.**

---

# 8. Login

## Diapositiva 9

### Tiempo: 5 minutos

Mostrar:

```http
POST /auth/login
```

Request:

```json
{
  "email": "juan@example.com",
  "password": "MyPassword123"
}
```

Explicar el flujo:

```text
Buscar usuario
      ↓
¿Existe?
      ↓
Verificar password
      ↓
¿Correcta?
      ↓
Generar JWT
```

Aquí introducir la idea de que el login exitoso necesita producir algo que permita al cliente demostrar posteriormente que ya se autenticó.

Ese mecanismo será JWT.

---

# 9. JWT

## Diapositivas 10, 11 y 12

### Tiempo: 15 minutos

---

## 9.1 ¿Qué problema resuelve JWT?

Supongamos:

```http
POST /auth/login
```

El usuario se autentica correctamente.

La siguiente petición podría ser:

```http
GET /profile
```

¿Cómo sabe el backend que esa petición pertenece al usuario autenticado?

El cliente envía un token.

```text
Login
 ↓
JWT
 ↓
Cliente
 ↓
Request posteriores
```

---

## 9.2 Authorization Header

Mostrar:

```http
Authorization: Bearer <TOKEN>
```

Explicar que existen dos partes importantes:

### `Authorization`

Es el header HTTP.

### `Bearer`

Indica que estamos enviando un token de acceso.

Después tenemos el token:

```text
Bearer eyJhbGciOiJIUzI1Ni...
```

---

## 9.3 Flujo completo

Explicar lentamente:

```text
1. Usuario hace login
2. Backend valida credenciales
3. Backend genera JWT
4. Cliente recibe JWT
5. Cliente almacena el token
6. Cliente lo envía en futuras peticiones
7. Middleware verifica el token
8. Si es válido, permite continuar
```

---

# 10. JWT: concepto del token

### Explicación complementaria del docente

Si los estudiantes preguntan qué contiene un JWT, explicar que conceptualmente contiene información como:

```json
{
  "sub": "123",
  "role": "USER",
  "iat": 1760000000,
  "exp": 1760003600
}
```

No es necesario enseñar todavía todos los detalles de JWT.

Lo importante es comprender que el token puede transportar información relacionada con la identidad y expiración.

### Advertencia importante

No decir:

> "JWT cifra la información."

Explicar:

> JWT está firmado, pero su contenido no debe considerarse secreto. Por eso nunca debemos colocar contraseñas u otros secretos dentro del payload.

---

# 11. Middleware de autenticación

## Diapositivas 13 y 14

### Tiempo: 10 minutos

Introducir:

```text
GET /profile
      ↓
Authentication Middleware
      ↓
Controller
```

El middleware debe:

1. Buscar el header `Authorization`.
2. Comprobar que exista.
3. Extraer el token.
4. Verificar el JWT.
5. Si es válido, permitir continuar.
6. Si no es válido, devolver `401`.

---

## Concepto de `next()`

Recordar lo aprendido en sesiones anteriores.

Un middleware puede hacer:

```js
next();
```

para permitir que la petición continúe.

Si no llama a `next()` y tampoco responde, la petición quedará esperando.

Por ejemplo:

```text
Token válido
   ↓
next()
   ↓
Controller
```

Mientras:

```text
Token inválido
   ↓
res.status(401)
   ↓
Fin de la petición
```

---

# 12. ¿Qué es un middleware?

## Diapositiva 15

### Tiempo: 5 minutos

Recordar la definición:

> Un middleware es una función que participa en el procesamiento de una petición antes de llegar al siguiente middleware o al endpoint final.

Puede:

* Ejecutar lógica.
* Modificar `req`.
* Validar información.
* Terminar la respuesta.
* Llamar a `next()`.

Ejemplo conceptual:

```text
Request
   ↓
Middleware A
   ↓
Middleware B
   ↓
Controller
   ↓
Response
```

---

# 13. Validación con Zod

## Diapositivas 16, 17, 18 y 19

### Tiempo: 15 minutos

Aquí realizar una de las demostraciones principales de la sesión.

---

## 13.1 El problema

Supongamos que nuestro endpoint espera:

```json
{
  "name": "Juan",
  "email": "juan@example.com",
  "password": "Password123"
}
```

Pero el cliente envía:

```json
{
  "name": 123,
  "email": "abc",
  "password": true
}
```

No queremos que esos datos lleguen al Controller.

---

## 13.2 Schema

Mostrar:

```js
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
});
```

Explicar cada regla:

```text
name
→ debe ser string
→ mínimo 2 caracteres

email
→ debe ser string
→ debe tener formato email

password
→ debe ser string
→ mínimo 8 caracteres
```

---

# 14. `safeParse`

Mostrar que Zod puede validar sin lanzar directamente una excepción:

```js
const result = registerSchema.safeParse(req.body);
```

El resultado indica si los datos son válidos.

Conceptualmente:

```text
safeParse()
     ↓
┌───────────────┐
│ success=true  │
└───────────────┘

o

┌───────────────┐
│ success=false │
└───────────────┘
```

Si es inválido:

```js
return res.status(400).json({
  message: "Validation error",
  errors: result.error.issues
});
```

---

# 15. Middleware de validación

## Diapositiva 20

### Tiempo: 10 minutos

Explicar que no queremos repetir esta lógica en cada Controller.

En lugar de:

```text
register controller
→ validar

login controller
→ validar

product controller
→ validar
```

creamos un middleware reutilizable.

Conceptualmente:

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

## Explicar línea por línea

### `validate(schema)`

Recibe un schema de Zod.

```text
validate(registerSchema)
```

### `safeParse(req.body)`

Valida los datos enviados por el cliente.

### `if (!result.success)`

Si los datos son inválidos:

```text
400 Bad Request
```

### `req.body = result.data`

Guardamos los datos validados.

### `next()`

Permitimos que continúe la petición.

---

# 16. Uso del middleware

Mostrar:

```js
router.post(
  "/register",
  validate(registerSchema),
  authController.register
);
```

Explicar el orden:

```text
POST /register
      ↓
validate(registerSchema)
      ↓
authController.register
```

Si la validación falla:

```text
validate()
      ↓
400
```

El Controller no se ejecuta.

---

# 17. Separación de responsabilidades

## Diapositivas 21 y 22

### Tiempo: 10 minutos

Esta parte es importante porque conecta la sesión con la arquitectura del módulo.

Explicar:

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

---

## Route

Define:

```http
POST /auth/register
```

No debería contener toda la lógica del negocio.

---

## Middleware

Realiza tareas que deben ocurrir antes del Controller.

Ejemplos:

```text
Validation
Authentication
Authorization
```

---

## Controller

Recibe la petición y coordina la respuesta.

Por ejemplo:

```text
req.body
   ↓
Service
   ↓
res.json()
```

---

## Service

Contiene la lógica de negocio.

Ejemplo:

```text
¿Usuario existe?
Hash password
Crear usuario
```

---

## Database

Responsable de persistir y recuperar información.

---

# 18. Flujo de registro

## Diapositiva 23

### Tiempo: 5 minutos

Explicar visualmente:

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

Enfatizar:

> La validación ocurre antes de la lógica de negocio.

Y:

> El Controller no debería ser responsable de hacer todo.

---

# 19. Flujo de login

## Diapositiva 24

Explicar:

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

Pregunta:

> ¿En qué momento generamos el JWT?

Respuesta:

**Después de verificar correctamente las credenciales.**

---

# 20. Flujo de endpoint protegido

## Diapositiva 25

Mostrar:

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

Enfatizar:

> El Controller no debería encargarse de verificar manualmente el token en cada endpoint.

Para eso tenemos un middleware reutilizable.

---

# 21. Autenticación y autorización

## Diapositiva 26

### Tiempo: 5 minutos

Volver a reforzar:

```text
Authentication
      ↓
¿Quién eres?
```

y:

```text
Authorization
      ↓
¿Qué puedes hacer?
```

Ejemplo:

```text
GET /profile
```

requiere autenticación.

Pero:

```text
DELETE /users/:id
```

puede requerir:

```text
Authentication
+
Authorization
+
Role ADMIN
```

---

# 22. Códigos HTTP

## Diapositivas 27, 28 y 29

### Tiempo: 10 minutos

No enseñar los códigos como una lista para memorizar.

Relacionarlos con situaciones.

---

## 22.1 `400 Bad Request`

Utilizar cuando la petición enviada por el cliente no cumple las reglas esperadas.

Ejemplo:

```json
{
  "email": "correo-invalido"
}
```

Respuesta:

```http
400 Bad Request
```

---

## 22.2 `401 Unauthorized`

Utilizar cuando el cliente no está autenticado correctamente.

Ejemplos:

* No envió token.
* Token inválido.
* Token expirado.
* Credenciales incorrectas.

---

## 22.3 `403 Forbidden`

El usuario está autenticado, pero no tiene permisos.

Ejemplo:

```text
Usuario normal
       ↓
DELETE /users/25
       ↓
403 Forbidden
```

---

## 22.4 `404 Not Found`

El recurso solicitado no existe.

Ejemplo:

```http
GET /users/9999
```

si ese usuario no existe.

---

## 22.5 `409 Conflict`

Existe un conflicto con el estado actual.

Ejemplo:

```text
POST /auth/register

email:
juan@example.com

↓
Ya existe

409 Conflict
```

---

## 22.6 `500 Internal Server Error`

Representa un error inesperado del servidor.

No debemos utilizar `500` para errores normales de validación.

---

# 23. Variables de entorno

## Diapositivas 30 y 31

### Tiempo: 5 minutos

Explicar:

No debemos escribir secretos directamente:

```js
const jwtSecret = "my-secret";
```

Mejor:

```env
JWT_SECRET=my-secret
```

Y acceder mediante:

```js
process.env.JWT_SECRET
```

---

## `.env`

Contiene los valores utilizados localmente.

Ejemplo:

```env
PORT=3000
DATABASE_URL=postgresql://...
JWT_SECRET=development-secret
```

---

## `.env.example`

Solo documenta las variables necesarias:

```env
PORT=
DATABASE_URL=
JWT_SECRET=
```

Explicar:

```text
.env
→ valores reales

.env.example
→ documentación
```

Y recordar:

```text
.env
↓
.gitignore
```

---

# 24. Seguridad básica

## Diapositiva 32

### Tiempo: 5 minutos

Presentar la seguridad como diferentes capas.

| Riesgo              | Protección    |
| ------------------- | ------------- |
| Headers inseguros   | Helmet        |
| CORS incorrecto     | CORS          |
| Muchas peticiones   | Rate limiting |
| Passwords expuestos | Hashing       |
| Secretos en código  | `.env`        |
| Datos inválidos     | Zod           |

Aclarar:

> Ninguna de estas herramientas por sí sola hace que una API sea segura.

---

# 25. Helmet

## Diapositiva 33

### Tiempo: 2 minutos

Explicar:

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

Concepto importante:

> Helmet agrega protecciones, pero no reemplaza otras prácticas de seguridad.

---

# 26. CORS

## Diapositiva 34

### Tiempo: 3 minutos

Explicar el escenario:

```text
Frontend
http://localhost:5173
       ↓
Backend
http://localhost:3000
```

Son diferentes orígenes.

CORS permite controlar qué orígenes pueden realizar determinadas solicitudes.

Ejemplo:

```js
import cors from "cors";

app.use(cors());
```

En producción no siempre debemos permitir cualquier origen.

Evitar enseñar:

```js
cors({ origin: "*" })
```

como configuración recomendada para producción.

---

# 27. Rate Limiting

## Diapositiva 35

### Tiempo: 3 minutos

Explicar:

Un cliente podría intentar:

```text
Login
Login
Login
Login
Login
...
```

Miles de veces.

El rate limiting limita la cantidad de peticiones.

Objetivos:

* Reducir abuso.
* Reducir ataques de fuerza bruta.
* Proteger recursos.

No es necesario implementar el paquete completo durante esta sesión.

---

# 28. SQL Injection

## Diapositiva 36

### Tiempo: 3 minutos

Explicar el concepto sin realizar una explotación.

Problema:

```text
Datos del usuario
       ↓
SQL construido directamente
       ↓
Database
```

Esto puede ser peligroso.

Buenas prácticas:

* Queries parametrizadas.
* ORM correctamente utilizado.
* Validación.
* No concatenar directamente datos del usuario dentro de consultas.

Conectar con sesiones anteriores:

> La seguridad también depende de cómo accedemos a la base de datos.

---

# 29. NoSQL Injection

## Diapositiva 37

### Tiempo: 2 minutos

Aclarar:

NoSQL no significa que no existan problemas de inyección.

También debemos:

* Validar tipos.
* Controlar estructuras.
* No aceptar objetos inesperados.
* Utilizar correctamente el driver/ODM.

---

# 30. Principio fundamental

## Diapositiva 38

### Tiempo: 3 minutos

Presentar la idea:

> **Nunca confiar en el cliente.**

El cliente puede ser:

* Un navegador.
* Una aplicación móvil.
* Postman.
* Otro servidor.
* Un atacante.

Por eso el backend debe validar y controlar la información independientemente de lo que haga el frontend.

---

# 31. Flujo completo

## Diapositiva 39

### Tiempo: 5 minutos

Mostrar el flujo:

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

Aclarar que **este orden es conceptual**.

En una aplicación real, algunos middlewares pueden ser globales y otros específicos de determinadas rutas.

Por ejemplo:

```text
CORS
→ global

Rate Limit
→ global o específico

Validation
→ específico de cada ruta

Authentication
→ específico de rutas protegidas

Authorization
→ específico de operaciones que requieren permisos
```

Esta aclaración evita que los estudiantes interpreten el diagrama como una regla absoluta.

---

# 32. Ejemplo guiado

## Diapositiva 40

### Tiempo: 15 minutos

Ahora realizar una demostración.

El objetivo es implementar conceptualmente:

```http
POST /auth/register
POST /auth/login
GET /profile
```

No es necesario construir una aplicación completa desde cero.

La demostración debe concentrarse en el flujo.

---

# 33. Preparar Zod

Crear:

```text
src/validators/auth.schema.js
```

Ejemplo:

```js
import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

Explicar que tenemos un schema diferente para cada operación porque cada endpoint puede tener reglas diferentes.

---

# 34. Crear middleware de validación

Crear:

```text
src/middlewares/validate.middleware.js
```

Ejemplo:

```js
export const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation error",
        errors: result.error.issues,
      });
    }

    req.body = result.data;

    next();
  };
};
```

### Explicar

El middleware:

1. Recibe un schema.
2. Lee `req.body`.
3. Ejecuta `safeParse`.
4. Si falla, devuelve `400`.
5. Si funciona, permite continuar.

---

# 35. Aplicar el middleware

En las rutas:

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

Mostrar el flujo:

```text
POST /register
      ↓
validate(registerSchema)
      ↓
register controller
```

---

# 36. Middleware de autenticación

Crear conceptualmente:

```text
src/middlewares/auth.middleware.js
```

Ejemplo simplificado:

```js
import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({
      message: "Invalid authorization header",
    });
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = payload;

    next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
```

> Si el proyecto utiliza TypeScript, adaptar el ejemplo para tipar correctamente `req.user`.

---

# 37. Proteger `/profile`

Ruta:

```js
router.get(
  "/profile",
  authenticate,
  profileController.getProfile
);
```

Explicar:

```text
GET /profile
      ↓
authenticate
      ↓
¿JWT válido?
   ↓       ↓
  NO      SÍ
   ↓       ↓
  401    next()
           ↓
       Controller
```

---

# 38. JWT_SECRET

Para la demostración:

```env
JWT_SECRET=development-secret
```

Explicar:

> El secreto utilizado para firmar el token debe ser conocido por el backend, pero no debe estar expuesto al cliente.

Nunca colocar:

```js
jwt.sign(payload, "123456")
```

directamente en el código.

---

# 39. Prueba en Postman

Utilizar Postman para probar.

## Register

```http
POST http://localhost:3000/auth/register
```

Body:

```json
{
  "name": "Juan",
  "email": "juan@example.com",
  "password": "Password123"
}
```

Después probar datos inválidos:

```json
{
  "name": "J",
  "email": "correo",
  "password": "123"
}
```

Observar:

```text
400 Bad Request
```

---

# 40. Probar Login

```http
POST http://localhost:3000/auth/login
```

Enviar:

```json
{
  "email": "juan@example.com",
  "password": "Password123"
}
```

El backend debería devolver un JWT.

Por ejemplo:

```json
{
  "token": "eyJhbGciOiJIUzI1Ni..."
}
```

---

# 41. Probar `/profile`

Primero sin token:

```http
GET /profile
```

Esperamos:

```http
401 Unauthorized
```

Después:

```http
Authorization: Bearer <TOKEN>
```

Esperamos que la petición pueda continuar.

---

# 42. Práctica corta

## Diapositiva 45

### Tiempo: 5 minutos

Presentar:

```http
GET /products
POST /products
GET /products/:id
DELETE /products/:id
GET /profile
DELETE /users/:id
```

Los estudiantes deben identificar:

| Endpoint               | ¿Protegido? | ¿Validación? | ¿Autorización? |
| ---------------------- | ----------- | ------------ | -------------- |
| `GET /products`        | ?           | ?            | ?              |
| `POST /products`       | ?           | ?            | ?              |
| `GET /products/:id`    | ?           | ?            | ?              |
| `DELETE /products/:id` | ?           | ?            | ?              |
| `GET /profile`         | ?           | ?            | ?              |
| `DELETE /users/:id`    | ?           | ?            | ?              |

---

# 43. Respuestas esperadas para el docente

Una posible solución:

| Endpoint               | Autenticación | Validación        | Autorización          |
| ---------------------- | ------------- | ----------------- | --------------------- |
| `GET /products`        | Depende       | No necesariamente | No                    |
| `POST /products`       | Sí            | Sí                | Posiblemente          |
| `GET /products/:id`    | Depende       | Sí para `id`      | No necesariamente     |
| `DELETE /products/:id` | Sí            | Sí                | Sí/según reglas       |
| `GET /profile`         | Sí            | No necesariamente | No                    |
| `DELETE /users/:id`    | Sí            | Sí                | Sí, normalmente ADMIN |

Aclarar:

> No existe una única respuesta para todos los sistemas. Las reglas dependen de los requisitos de negocio.

---

# 44. Caso de análisis

## Diapositiva 46

### Tiempo: 5 minutos

Preguntar primero y permitir que los estudiantes respondan.

### Caso 1

```http
POST /auth/register
```

El email ya existe.

Respuesta esperada:

```http
409 Conflict
```

---

### Caso 2

```http
GET /profile
```

No se envió token.

Respuesta:

```http
401 Unauthorized
```

---

### Caso 3

Usuario normal intenta:

```http
DELETE /users/25
```

El endpoint requiere administrador.

Respuesta:

```http
403 Forbidden
```

---

# 45. Errores comunes a corregir durante la clase

## Confundir 401 y 403

Recordar:

```text
401
→ No estás autenticado.

403
→ Estás autenticado, pero no tienes permiso.
```

---

## Guardar passwords directamente

Incorrecto:

```text
password = "123456"
```

Correcto:

```text
password
   ↓
hash
   ↓
database
```

---

## Validar únicamente en el frontend

Explicar:

> La validación del frontend mejora la experiencia del usuario, pero no es una medida de seguridad suficiente.

El backend debe validar nuevamente.

---

## Poner JWT_SECRET en el código

Incorrecto:

```js
const secret = "my-secret";
```

Preferible:

```js
process.env.JWT_SECRET
```

---

## Colocar toda la lógica en el Controller

Evitar:

```text
Controller
 ├── validar
 ├── consultar DB
 ├── hash
 ├── generar JWT
 ├── reglas de negocio
 └── responder
```

Promover:

```text
Middleware
   ↓
Controller
   ↓
Service
   ↓
Database
```

---

# 46. Conceptos que el estudiante debe dominar

Al finalizar la clase debería poder explicar:

### Identificación

> Indicar quién soy.

### Autenticación

> Verificar quién soy.

### Autorización

> Determinar qué puedo hacer.

### Hashing

> Proteger contraseñas antes de almacenarlas.

### JWT

> Token utilizado para representar una autenticación entre peticiones.

### Middleware

> Función que participa en el procesamiento de una petición.

### Zod

> Librería utilizada para definir schemas y validar datos.

### `401`

> El cliente no está autenticado correctamente.

### `403`

> El cliente está autenticado, pero no tiene permisos.

### `.env`

> Archivo utilizado para configurar valores que no deberían estar directamente en el código.

---

# 47. Cierre

## Diapositivas 47 y 48

### Tiempo: 5 minutos

Preguntar:

> ¿Qué ocurre entre que llega una petición y llega al Controller?

Esperar algo similar a:

```text
Request
   ↓
Middleware
   ↓
Validation
   ↓
Authentication
   ↓
Authorization
   ↓
Controller
```

Después preguntar:

> ¿Por qué no hacemos toda esta lógica dentro del Controller?

Respuesta esperada:

> Para separar responsabilidades y poder reutilizar los middlewares.

---

# 48. Mensaje final para los estudiantes

Una API segura no consiste simplemente en agregar JWT.

Necesitamos varias capas:

```text
Validation
+
Authentication
+
Authorization
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

La idea fundamental:

> **El backend debe validar y proteger la información independientemente de lo que haga el cliente.**

---

# 49. Próxima sesión

## Persistencia y acceso a datos desde el Backend

En la siguiente sesión conectaremos nuestra API con las bases de datos y trabajaremos con:

* Conexión Backend → Database.
* Configuración de la conexión.
* Modelos.
* Consultas.
* Creación de registros.
* Lectura.
* Actualización.
* Eliminación.
* Integración entre Express y la base de datos.

La idea será pasar de:

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

y comenzar a trabajar con datos persistentes.

---

# 50. Checklist del docente

Antes de finalizar la sesión, verificar que los estudiantes hayan visto:

* [ ] Identificación.
* [ ] Autenticación.
* [ ] Autorización.
* [ ] Registro.
* [ ] Login.
* [ ] Password hashing.
* [ ] JWT.
* [ ] `Authorization: Bearer`.
* [ ] Middleware.
* [ ] Middleware de autenticación.
* [ ] Middleware de validación.
* [ ] Zod.
* [ ] Schemas.
* [ ] `safeParse`.
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
* [ ] Separación Route → Middleware → Controller → Service → Database.

---

# 51. Resultado esperado de la sesión

El estudiante no necesita memorizar cada función de JWT, Zod o Helmet.

Debe ser capaz de entender y explicar el siguiente flujo:

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

El concepto central de la sesión es:

> **Los middlewares permiten colocar responsabilidades transversales —como validación, autenticación y autorización— antes de llegar a la lógica principal de nuestra API.**
