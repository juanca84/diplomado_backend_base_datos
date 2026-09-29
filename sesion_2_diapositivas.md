# Módulo 2 — Arquitectura del Backend y Bases de Datos

## Sesión 2

# Express.js, Routing, Middleware y REST

### Construcción de una API REST

---

## Diapositiva 1 — Objetivo

### Al finalizar la sesión podremos:

* Crear un servidor con Express.js
* Definir rutas HTTP
* Recibir parámetros y datos
* Crear respuestas JSON
* Utilizar middleware
* Aplicar conceptos básicos de REST
* Construir un CRUD de usuarios

---

## Diapositiva 2 — Recordemos Node.js

### Node.js

Permite ejecutar JavaScript fuera del navegador.

```text
JavaScript
     ↓
   Node.js
     ↓
Servidor
     ↓
     HTTP
```

### Hoy agregamos:

```text
Node.js
   +
Express.js
   ↓
API REST
```

---

## Diapositiva 3 — ¿Qué es Express.js?

### Express.js

Framework para construir aplicaciones web y APIs sobre Node.js.

Nos facilita:

* Crear servidores
* Definir rutas
* Procesar requests
* Generar responses
* Utilizar middleware

```text
Node.js
   ↓
Express
   ↓
Aplicación Backend
```

---

## Diapositiva 4 — Nuestra primera aplicación Express

```javascript
const express = require("express");

const app = express();

app.listen(3000, () => {
    console.log("Servidor ejecutándose");
});
```

### Conceptos

* `express()`
* `app`
* `app.listen()`
* Puerto

---

## Diapositiva 5 — Request y Response

Cada comunicación HTTP tiene:

```text
Cliente
   │
   │ Request
   ▼
Servidor
   │
   │ Response
   ▼
Cliente
```

### Request

Lo que el cliente solicita.

### Response

Lo que el servidor devuelve.

---

## Diapositiva 6 — Routing

Una ruta determina qué hacer cuando llega una solicitud.

```javascript
app.get("/users", (req, res) => {
    res.json([]);
});
```

```text
GET /users
   ↓
Ruta
   ↓
Respuesta
```

---

## Diapositiva 7 — Métodos HTTP

| Método | Propósito  |
| ------ | ---------- |
| GET    | Consultar  |
| POST   | Crear      |
| PUT    | Actualizar |
| DELETE | Eliminar   |

Ejemplo:

```text
GET    /users
POST   /users
PUT    /users/10
DELETE /users/10
```

---

## Diapositiva 8 — Recursos y Endpoints

### Recurso

```text
users
products
orders
```

### Endpoint

```text
GET /users
GET /users/10
POST /users
```

Un endpoint combina:

```text
Método HTTP + Ruta
```

---

## Diapositiva 9 — URL, recurso y parámetro

```text
GET /users/10
    └────┬────┘
       recurso
          │
          └── id = 10
```

```text
/users/:id
```

El valor `10` es un parámetro de ruta.

---

## Diapositiva 10 — Parámetros de ruta

```javascript
app.get("/users/:id", (req, res) => {

    console.log(req.params.id);

});
```

Request:

```http
GET /users/10
```

Resultado:

```text
req.params.id → "10"
```

---

## Diapositiva 11 — Query Parameters

Los query parameters permiten enviar criterios adicionales.

```http
GET /users?role=admin
```

```javascript
req.query.role
```

Resultado:

```text
admin
```

### Diferencia

```text
/users/10
   ↑
 params

/users?role=admin
        ↑
      query
```

---

## Diapositiva 12 — Request Body

Los datos también pueden enviarse dentro del cuerpo de la solicitud.

```http
POST /users
```

```json
{
    "name": "Juan",
    "email": "juan@example.com"
}
```

En Express:

```javascript
req.body
```

---

## Diapositiva 13 — JSON y Content-Type

Cuando enviamos JSON:

```http
Content-Type: application/json
```

Express necesita interpretar ese contenido:

```javascript
app.use(express.json());
```

Entonces:

```text
JSON
 ↓
express.json()
 ↓
req.body
```

---

## Diapositiva 14 — Response

Express permite construir respuestas:

```javascript
res.json(data);
```

y definir el código HTTP:

```javascript
res.status(201).json(data);
```

Ejemplo:

```javascript
res.status(404).json({
    message: "Usuario no encontrado"
});
```

---

## Diapositiva 15 — Códigos HTTP básicos

| Código | Significado           |
| -----: | --------------------- |
|    200 | OK                    |
|    201 | Created               |
|    400 | Bad Request           |
|    404 | Not Found             |
|    500 | Internal Server Error |

El código HTTP comunica el resultado de la operación.

---

## Diapositiva 16 — Validación básica

Antes de procesar una solicitud podemos validar los datos.

```javascript
if (!req.body.name) {
    return res.status(400).json({
        message: "Name is required"
    });
}
```

```text
Request
   ↓
Validación
   ↓
Procesamiento
   ↓
Response
```

---

## Diapositiva 17 — ¿Qué es Middleware?

Middleware es una función que se ejecuta durante el procesamiento de una solicitud.

```text
Request
   ↓
Middleware
   ↓
Route
   ↓
Response
```

Puede:

* Registrar información
* Validar
* Modificar `req` o `res`
* Controlar acceso
* Continuar la ejecución

---

## Diapositiva 18 — `next()`

```javascript
app.use((req, res, next) => {

    console.log("Request recibida");

    next();
});
```

### `next()`

Indica:

> Continúa con el siguiente middleware o ruta.

```text
Middleware
    ↓
  next()
    ↓
Siguiente paso
```

---

## Diapositiva 19 — Orden de ejecución

El orden importa.

```javascript
app.use(middleware1);
app.use(middleware2);

app.get("/users", handler);
```

Flujo:

```text
Request
   ↓
middleware1
   ↓
middleware2
   ↓
handler
   ↓
Response
```

---

## Diapositiva 20 — Middleware global

```javascript
app.use((req, res, next) => {

    console.log(req.method, req.url);

    next();

});
```

Se ejecuta antes de las rutas que pasan por él.

---

## Diapositiva 21 — Middleware de ruta

```javascript
const logger = (req, res, next) => {
    console.log("Accediendo a users");
    next();
};

app.get("/users", logger, (req, res) => {
    res.json([]);
});
```

### Middleware global

```text
app.use(...)
```

### Middleware de ruta

```text
app.get(..., middleware, handler)
```

---

## Diapositiva 22 — ¿Qué es REST?

REST es un estilo para diseñar servicios web.

Conceptos principales:

* Recursos
* URLs
* Métodos HTTP
* Representaciones JSON
* Códigos HTTP
* Statelessness

---

## Diapositiva 23 — CRUD y REST

| Operación  | HTTP   | Endpoint     |
| ---------- | ------ | ------------ |
| Listar     | GET    | `/users`     |
| Consultar  | GET    | `/users/:id` |
| Crear      | POST   | `/users`     |
| Actualizar | PUT    | `/users/:id` |
| Eliminar   | DELETE | `/users/:id` |

---

## Diapositiva 24 — Stateless

Cada request debe contener la información necesaria para ser procesada.

```text
Request 1
   ↓
Servidor

Request 2
   ↓
Servidor

Request 3
   ↓
Servidor
```

El servidor no depende de una conversación HTTP anterior para interpretar cada solicitud.

---

## Diapositiva 25 — Flujo completo

```text
Cliente
   │
   │ HTTP Request
   ▼
Express
   │
   ▼
Middleware
   │
   ▼
Routing
   │
   ▼
Procesamiento
   │
   ▼
Response
   │
   ▼
Cliente
```

---

## Diapositiva 26 — Nuestro CRUD

Vamos a construir:

```text
GET    /users
GET    /users/:id
POST   /users
PUT    /users/:id
DELETE /users/:id
```

Utilizando:

```text
Array en memoria
```

Por ahora:

```text
NO Base de Datos
```

---

## Diapositiva 27 — Datos iniciales

```javascript
let users = [
    {
        id: 1,
        name: "Juan",
        email: "juan@example.com",
        role: "admin"
    },
    {
        id: 2,
        name: "Maria",
        email: "maria@example.com",
        role: "user"
    }
];
```

---

## Diapositiva 28 — GET /users

```javascript
app.get("/users", (req, res) => {
    res.json(users);
});
```

### Objetivo

Obtener todos los usuarios.

```text
GET /users
       ↓
    users[]
       ↓
   JSON Response
```

---

## Diapositiva 29 — GET /users/:id

```javascript
app.get("/users/:id", (req, res) => {

    const id = Number(req.params.id);

    const user = users.find(
        user => user.id === id
    );

});
```

Utilizamos:

```text
req.params
Array.find()
```

---

## Diapositiva 30 — Usuario no encontrado

```javascript
if (!user) {
    return res.status(404).json({
        message: "Usuario no encontrado"
    });
}
```

### Request

```http
GET /users/999
```

### Response

```http
404 Not Found
```

---

## Diapositiva 31 — POST /users

```http
POST /users
```

Body:

```json
{
    "name": "Carlos",
    "email": "carlos@example.com",
    "role": "user"
}
```

Accedemos mediante:

```javascript
req.body
```

---

## Diapositiva 32 — Crear un usuario

```javascript
const user = {
    id: users.length + 1,
    name: req.body.name,
    email: req.body.email,
    role: req.body.role
};

users.push(user);

res.status(201).json(user);
```

```text
POST
 ↓
req.body
 ↓
Crear objeto
 ↓
users.push()
 ↓
201 Created
```

---

## Diapositiva 33 — PUT /users/:id

```http
PUT /users/1
```

Body:

```json
{
    "name": "Juan Carlos",
    "email": "juan@example.com",
    "role": "admin"
}
```

```text
req.params.id
       +
req.body
       ↓
Actualizar usuario
```

---

## Diapositiva 34 — DELETE /users/:id

```http
DELETE /users/1
```

Proceso:

```text
Buscar usuario
      ↓
¿Existe?
  ↙       ↘
NO         SÍ
↓           ↓
404       Eliminar
            ↓
          200
```

---

## Diapositiva 35 — Probando nuestra API

### Postman

Probaremos:

```text
GET    /users
GET    /users/1
GET    /users/999

POST   /users
PUT    /users/1
DELETE /users/1
```

---

## Diapositiva 36 — Práctica corta

### Crear un endpoint para filtrar usuarios

```http
GET /users?role=admin
```

Utilizar:

```javascript
req.query
```

Debe devolver solamente los usuarios cuyo `role` coincida.

---

## Diapositiva 37 — Desafío

¿Qué diferencia existe entre?

```text
/users/10
```

y

```text
/users?role=admin
```

### Pista

```text
req.params
req.query
```

---

## Diapositiva 38 — Lo que aprendimos

```text
Express
   ↓
Routing
   ↓
Request
   ↓
Middleware
   ↓
Procesamiento
   ↓
Response
   ↓
REST
```

Ahora podemos construir una API básica.

---

## Diapositiva 39 — Próximo paso

Hasta ahora:

```text
API
 ↓
Array en memoria
```

En la siguiente etapa:

```text
API
 ↓
PostgreSQL
 ↓
Persistencia de datos
```

### Próxima sesión

**PostgreSQL, modelo relacional y SQL**
