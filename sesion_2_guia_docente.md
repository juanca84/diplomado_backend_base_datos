# Módulo 2 — Arquitectura del Backend y Bases de Datos

# Guía del docente — Sesión 2

## Express.js, Routing, Middleware y REST

**Duración:** 2 horas 15 minutos
**Producto final:** API REST básica de usuarios utilizando datos en memoria.

---

# 1. Objetivo de la sesión

Al finalizar la clase, el estudiante debe ser capaz de:

1. Explicar qué es Express.js y cuál es su relación con Node.js.
2. Crear un servidor Express.
3. Crear rutas HTTP.
4. Diferenciar `req.params`, `req.query` y `req.body`.
5. Construir respuestas con `res.json()` y `res.status()`.
6. Comprender el funcionamiento de middleware y `next()`.
7. Reconocer los elementos básicos de una API REST.
8. Utilizar códigos HTTP básicos.
9. Implementar un CRUD sencillo.
10. Probar los endpoints utilizando Postman.

---

# 2. Metodología

La clase debe ser principalmente demostrativa y práctica.

La progresión recomendada es:

```text
Concepto
   ↓
Ejemplo pequeño
   ↓
Consola
   ↓
Prueba
   ↓
Nuevo concepto
   ↓
Integración
   ↓
CRUD
   ↓
Postman
   ↓
Práctica del estudiante
```

No conviene explicar todos los conceptos teóricamente antes de tocar código.

El estudiante debe ver rápidamente que cada concepto resuelve una necesidad concreta.

---

# 3. Distribución del tiempo

| Bloque             |      Tiempo |
| ------------------ | ----------: |
| Introducción       |       5 min |
| Express.js         |      15 min |
| Routing y HTTP     |      20 min |
| Request y Response |      20 min |
| Middleware         |      15 min |
| REST               |      10 min |
| CRUD guiado        |      30 min |
| Práctica corta     |      15 min |
| Cierre             |       5 min |
| **Total**          | **135 min** |

---

# 4. Diapositiva 1 — Objetivo

## Tiempo: 5 minutos

Presentar brevemente el objetivo.

Explicar:

> En la sesión anterior trabajamos los fundamentos de Node.js. Hoy vamos a utilizar Node.js para construir un backend que pueda recibir solicitudes HTTP y responderlas.

La idea central de la clase es:

```text
Cliente
   ↓
API
   ↓
Respuesta
```

Al finalizar tendremos una API REST funcional.

### Pregunta inicial

Preguntar:

> Si tenemos una aplicación frontend y queremos obtener una lista de usuarios, ¿cómo puede comunicarse con el backend?

Esperar respuestas como:

* HTTP
* API
* GET
* endpoint

Utilizar las respuestas para introducir Express.

---

# 5. Diapositiva 2 — Recordemos Node.js

## Tiempo: 3 minutos

Recordar brevemente:

> Node.js permite ejecutar JavaScript fuera del navegador.

Pero Node.js por sí solo proporciona herramientas de bajo nivel para trabajar con HTTP.

Podemos crear un servidor utilizando el módulo nativo `http`, pero Express simplifica muchas tareas comunes.

No entrar todavía en código de `http.createServer()`.

La comparación importante es:

```text
Node.js
   ↓
Runtime

Express
   ↓
Framework sobre Node.js
```

---

# 6. Diapositiva 3 — ¿Qué es Express?

## Tiempo: 5 minutos

Explicar:

> Express.js es un framework para Node.js que facilita la creación de aplicaciones web y APIs.

Conceptos principales que aparecerán durante la sesión:

* aplicación
* rutas
* request
* response
* middleware

### Pregunta

> ¿Express reemplaza a Node.js?

Respuesta:

**No.**

Express funciona sobre Node.js.

```text
Node.js
   ↓
Express
   ↓
Nuestra aplicación
```

---

# 7. Diapositiva 4 — Primera aplicación Express

## Tiempo: 7 minutos

### PASAR A LA CONSOLA

Aquí comienza la primera parte práctica.

Crear una carpeta para la sesión.

Por ejemplo:

```bash
mkdir express-api
cd express-api
```

Inicializar proyecto:

```bash
npm init -y
```

Instalar Express:

```bash
npm install express
```

Después crear:

```text
server.js
```

Escribir:

```javascript
const express = require("express");

const app = express();

app.listen(3000, () => {
    console.log("Servidor ejecutándose en http://localhost:3000");
});
```

Ejecutar:

```bash
node server.js
```

Debe aparecer:

```text
Servidor ejecutándose en http://localhost:3000
```

### Explicar

```javascript
const express = require("express");
```

Importa Express.

```javascript
const app = express();
```

Crea nuestra aplicación Express.

```javascript
app.listen(3000);
```

Hace que el servidor escuche en el puerto 3000.

### Importante

En este punto el navegador todavía puede mostrar:

```text
Cannot GET /
```

Esto **no significa que el servidor esté mal**.

Significa que todavía no hemos creado una ruta `/`.

Esta observación es pedagógicamente útil.

---

# 8. Diapositiva 5 — Request y Response

## Tiempo: 5 minutos

Explicar:

Toda comunicación HTTP tiene una solicitud y una respuesta.

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

Contiene información como:

* método HTTP
* URL
* headers
* parámetros
* body

### Response

Puede contener:

* código HTTP
* headers
* body

No es necesario enseñar todos los headers todavía.

---

# 9. Diapositiva 6 — Routing

## Tiempo: 7 minutos

Crear la primera ruta:

```javascript
app.get("/users", (req, res) => {
    res.json([]);
});
```

### PASAR A LA CONSOLA / NAVEGADOR

Con el servidor ejecutándose, visitar:

```text
http://localhost:3000/users
```

Resultado:

```json
[]
```

Explicar:

```javascript
app.get()
```

significa:

> Cuando recibamos una solicitud GET para `/users`, ejecutamos esta función.

### Concepto fundamental

```text
GET /users
   ↓
Route
   ↓
Handler
   ↓
Response
```

---

# 10. Diapositiva 7 — Métodos HTTP

## Tiempo: 5 minutos

Presentar:

```text
GET
POST
PUT
DELETE
```

Relacionarlos con CRUD:

```text
Create → POST
Read   → GET
Update → PUT
Delete → DELETE
```

Aclarar que CRUD es una forma de pensar las operaciones sobre datos, mientras que HTTP proporciona los métodos utilizados para comunicarlas.

No profundizar todavía en `PATCH`.

---

# 11. Diapositiva 8 — Recursos y endpoints

## Tiempo: 5 minutos

Explicar la diferencia.

### Recurso

Representa una entidad del sistema.

Ejemplos:

```text
users
products
orders
```

### Endpoint

Es una combinación de método HTTP y ruta.

Por ejemplo:

```text
GET /users
```

y:

```text
POST /users
```

son endpoints diferentes aunque utilicen la misma ruta.

### Pregunta

> ¿`GET /users` y `POST /users` son el mismo endpoint?

Respuesta:

No. El método HTTP forma parte de la definición de la operación.

---

# 12. Diapositiva 9 — URL, recurso y parámetro

## Tiempo: 3 minutos

Mostrar:

```text
GET /users/10
```

Explicar:

```text
users → recurso
10    → identificador
```

Esto prepara la introducción de `req.params`.

---

# 13. Diapositiva 10 — Parámetros de ruta

## Tiempo: 7 minutos

Crear:

```javascript
app.get("/users/:id", (req, res) => {
    console.log(req.params.id);

    res.json({
        id: req.params.id
    });
});
```

### PASAR A LA CONSOLA

Reiniciar el servidor si no se utiliza un mecanismo de desarrollo automático.

```bash
node server.js
```

Probar:

```text
GET http://localhost:3000/users/10
```

En consola debe aparecer:

```text
10
```

Explicar:

```javascript
req.params
```

contiene los parámetros definidos en la ruta.

### Importante

El valor llega inicialmente como string:

```javascript
"10"
```

Por eso, cuando necesitemos realizar operaciones numéricas, utilizaremos:

```javascript
Number(req.params.id)
```

---

# 14. Diapositiva 11 — Query Parameters

## Tiempo: 7 minutos

Crear temporalmente:

```javascript
app.get("/search", (req, res) => {
    console.log(req.query);

    res.json(req.query);
});
```

### PASAR A NAVEGADOR O POSTMAN

Probar:

```text
GET /search?role=admin
```

Resultado:

```json
{
    "role": "admin"
}
```

Explicar:

```javascript
req.query
```

representa parámetros enviados después de `?`.

Ejemplo:

```text
/users?role=admin
       └────────┘
       query
```

### Diferencia fundamental

```text
/users/10
```

→ `req.params`

```text
/users?role=admin
```

→ `req.query`

---

# 15. Diapositiva 12 — Request Body

## Tiempo: 5 minutos

Explicar que GET normalmente utiliza URL, parámetros y query parameters para consultar información.

Para crear o modificar información podemos utilizar el body.

Ejemplo:

```http
POST /users
```

Body:

```json
{
    "name": "Juan",
    "email": "juan@example.com"
}
```

---

# 16. Diapositiva 13 — JSON y Content-Type

## Tiempo: 5 minutos

Agregar al código:

```javascript
app.use(express.json());
```

Explicar:

> Express necesita saber cómo interpretar el JSON que llega en el body.

La petición normalmente indica:

```http
Content-Type: application/json
```

Y Express procesa ese contenido mediante:

```javascript
express.json()
```

Entonces podemos acceder a:

```javascript
req.body
```

### PASAR A POSTMAN

Crear:

```text
POST /users
```

Body:

```json
{
    "name": "Juan",
    "email": "juan@example.com"
}
```

Configurar:

```text
Body → raw → JSON
```

Crear temporalmente:

```javascript
app.post("/users", (req, res) => {
    console.log(req.body);

    res.json(req.body);
});
```

Enviar la solicitud.

Mostrar en consola el objeto recibido.

---

# 17. Diapositiva 14 — Response

## Tiempo: 5 minutos

Explicar:

```javascript
res.json()
```

envía una respuesta JSON.

```javascript
res.status()
```

establece el código HTTP.

Se pueden combinar:

```javascript
res.status(201).json({
    message: "Usuario creado"
});
```

### Idea importante

No solamente importa **qué información devolvemos**.

También importa **qué código HTTP devolvemos**.

---

# 18. Diapositiva 15 — Códigos HTTP

## Tiempo: 5 minutos

Explicar solamente los cinco seleccionados.

### 200

Operación exitosa.

### 201

Recurso creado.

### 400

La solicitud contiene datos incorrectos o incompletos.

### 404

El recurso solicitado no existe.

### 500

Error interno del servidor.

No es necesario memorizar todos los códigos HTTP.

El objetivo es que sepan interpretar los más habituales.

---

# 19. Diapositiva 16 — Validación básica

## Tiempo: 5 minutos

Mostrar:

```javascript
if (!req.body.name || !req.body.email) {
    return res.status(400).json({
        message: "Name and email are required"
    });
}
```

Explicar:

> Antes de procesar los datos, podemos comprobar que la información mínima requerida esté presente.

### ¿Por qué `return`?

Porque después de enviar la respuesta de error no queremos continuar ejecutando el resto de la función.

```text
400 Response
    ↓
return
    ↓
fin de ejecución
```

---

# 20. Diapositiva 17 — Middleware

## Tiempo: 5 minutos

Introducir:

> Middleware es una función que participa en el procesamiento de una solicitud antes de que esta llegue al handler final, o entre diferentes etapas del procesamiento.

Ejemplo:

```javascript
app.use((req, res, next) => {
    console.log("Request recibida");

    next();
});
```

Explicar que middleware puede:

* observar la solicitud
* modificar información
* validar
* registrar
* controlar acceso
* detener la solicitud
* continuar mediante `next()`

---

# 21. Diapositiva 18 — `next()`

## Tiempo: 5 minutos

Explicar:

```javascript
next();
```

significa:

> Continúa con el siguiente middleware o con la siguiente etapa de procesamiento.

Mostrar:

```text
Request
   ↓
Middleware
   ↓
next()
   ↓
Route
   ↓
Response
```

### Demostración

Crear:

```javascript
app.use((req, res, next) => {
    console.log("Middleware 1");
    next();
});

app.use((req, res, next) => {
    console.log("Middleware 2");
    next();
});
```

Luego:

```javascript
app.get("/users", (req, res) => {
    console.log("Route");
    res.json([]);
});
```

---

# 22. Diapositiva 19 — Orden de ejecución

## Tiempo: 5 minutos

### PASAR A LA CONSOLA

Solicitar:

```text
GET /users
```

Mostrar:

```text
Middleware 1
Middleware 2
Route
```

Explicar:

> Express ejecuta las funciones en el orden en que fueron registradas, siempre que el flujo continúe con `next()`.

Este concepto será muy importante posteriormente para:

* autenticación
* autorización
* logging
* validaciones
* manejo de errores

---

# 23. Diapositiva 20 — Middleware global

## Tiempo: 3 minutos

Ejemplo:

```javascript
app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});
```

Explicar:

> Este middleware se registra sobre la aplicación y puede ejecutarse para múltiples rutas.

Ejemplo:

```text
GET /users
POST /users
GET /products
```

El middleware puede observar todas esas solicitudes.

---

# 24. Diapositiva 21 — Middleware de ruta

## Tiempo: 4 minutos

Ejemplo:

```javascript
const logger = (req, res, next) => {
    console.log("Accediendo a users");
    next();
};

app.get("/users", logger, (req, res) => {
    res.json([]);
});
```

Explicar:

> Este middleware está asociado específicamente con esa ruta.

No profundizar todavía en autenticación.

---

# 25. Diapositiva 22 — REST

## Tiempo: 5 minutos

Explicar que REST es un estilo arquitectónico para diseñar servicios web.

Los conceptos que interesa recordar en este curso son:

```text
Recursos
Endpoints
HTTP Methods
JSON
HTTP Status Codes
Statelessness
```

No presentar REST como si fuera una librería o framework.

### Aclaración importante

REST no es:

```text
npm install rest
```

Es un conjunto de principios para diseñar APIs.

---

# 26. Diapositiva 23 — CRUD y REST

## Tiempo: 5 minutos

Presentar:

```text
GET    /users
GET    /users/10
POST   /users
PUT    /users/10
DELETE /users/10
```

Relacionar:

```text
GET /users
→ listar

GET /users/10
→ consultar uno

POST /users
→ crear

PUT /users/10
→ actualizar

DELETE /users/10
→ eliminar
```

---

# 27. Diapositiva 24 — Stateless

## Tiempo: 3 minutos

Explicar de forma sencilla:

> Cada solicitud debe contener la información necesaria para que el servidor pueda procesarla.

No entrar en autenticación ni sesiones todavía.

Ejemplo conceptual:

```text
Request 1 → información necesaria
Request 2 → información necesaria
Request 3 → información necesaria
```

El servidor no debería depender de recordar el contexto de una request HTTP anterior para entender la siguiente.

---

# 28. Diapositiva 25 — Flujo completo

## Tiempo: 3 minutos

Aquí conviene detenerse y hacer una síntesis.

```text
Cliente
   ↓
Request
   ↓
Middleware
   ↓
Routing
   ↓
Procesamiento
   ↓
Response
   ↓
Cliente
```

Preguntar:

> ¿En qué momento podemos leer `req.params`?

> ¿En qué momento usamos `req.body`?

> ¿Qué hace `next()`?

> ¿Dónde definimos el código HTTP?

Las respuestas permiten verificar comprensión antes de comenzar el CRUD.

---

# 29. Diapositiva 26 — Nuestro CRUD

## Tiempo: 2 minutos

Explicar:

> Ahora vamos a integrar todos los conceptos anteriores en una pequeña API.

Por simplicidad no utilizaremos todavía una base de datos.

Utilizaremos:

```javascript
let users = [];
```

### Importante

Aclarar:

> Los datos desaparecerán cuando reiniciemos el servidor.

Esto prepara conceptualmente la necesidad de una base de datos.

---

# 30. Diapositiva 27 — Datos iniciales

## Tiempo: 3 minutos

Agregar:

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

Explicar que este array representa temporalmente nuestra fuente de datos.

---

# 31. Diapositiva 28 — GET /users

## Tiempo: 4 minutos

Crear:

```javascript
app.get("/users", (req, res) => {
    res.json(users);
});
```

### PASAR A POSTMAN

Enviar:

```text
GET http://localhost:3000/users
```

Resultado esperado:

```json
[
    {
        "id": 1,
        "name": "Juan",
        "email": "juan@example.com",
        "role": "admin"
    },
    {
        "id": 2,
        "name": "Maria",
        "email": "maria@example.com",
        "role": "user"
    }
]
```

---

# 32. Diapositiva 29 — GET /users/:id

## Tiempo: 5 minutos

Crear:

```javascript
app.get("/users/:id", (req, res) => {
    const id = Number(req.params.id);

    const user = users.find(user => user.id === id);

    if (!user) {
        return res.status(404).json({
            message: "Usuario no encontrado"
        });
    }

    res.json(user);
});
```

Explicar paso por paso.

### Paso 1

```javascript
req.params.id
```

Obtiene el parámetro.

### Paso 2

```javascript
Number(...)
```

Lo convierte a número.

### Paso 3

```javascript
users.find(...)
```

Busca el usuario.

### Paso 4

Si no existe:

```text
404
```

### Paso 5

Si existe:

```text
200
```

---

# 33. Diapositiva 30 — Usuario no encontrado

## Tiempo: 3 minutos

### PASAR A POSTMAN

Probar:

```text
GET /users/1
```

Después:

```text
GET /users/999
```

Comparar:

```text
200 OK
```

contra:

```text
404 Not Found
```

Esta comparación es importante para que el estudiante comprenda el uso práctico de los códigos HTTP.

---

# 34. Diapositiva 31 — POST /users

## Tiempo: 4 minutos

Mostrar:

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

Explicar:

```javascript
req.body
```

contiene los datos enviados por el cliente.

---

# 35. Diapositiva 32 — Crear usuario

## Tiempo: 5 minutos

Implementar:

```javascript
app.post("/users", (req, res) => {

    if (!req.body.name || !req.body.email) {
        return res.status(400).json({
            message: "Name and email are required"
        });
    }

    const user = {
        id: users.length + 1,
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    };

    users.push(user);

    res.status(201).json(user);
});
```

### PASAR A POSTMAN

Probar primero una petición correcta.

Después probar:

```json
{
    "email": "test@example.com"
}
```

Mostrar:

```text
400 Bad Request
```

Esto integra:

* `req.body`
* validación
* `return`
* `res.status()`
* `res.json()`
* `201`
* `400`

---

# 36. Diapositiva 33 — PUT /users/:id

## Tiempo: 5 minutos

Implementar:

```javascript
app.put("/users/:id", (req, res) => {

    const id = Number(req.params.id);

    const user = users.find(user => user.id === id);

    if (!user) {
        return res.status(404).json({
            message: "Usuario no encontrado"
        });
    }

    user.name = req.body.name;
    user.email = req.body.email;
    user.role = req.body.role;

    res.json(user);
});
```

### PASAR A POSTMAN

Enviar:

```text
PUT /users/1
```

Body:

```json
{
    "name": "Juan Carlos",
    "email": "juan.carlos@example.com",
    "role": "admin"
}
```

Después:

```text
GET /users/1
```

Mostrar que el usuario cambió.

---

# 37. Diapositiva 34 — DELETE /users/:id

## Tiempo: 5 minutos

Implementar:

```javascript
app.delete("/users/:id", (req, res) => {

    const id = Number(req.params.id);

    const index = users.findIndex(user => user.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Usuario no encontrado"
        });
    }

    users.splice(index, 1);

    res.json({
        message: "Usuario eliminado"
    });
});
```

### PASAR A POSTMAN

Probar:

```text
DELETE /users/2
```

Después:

```text
GET /users
```

Comprobar que el usuario ya no aparece.

---

# 38. Diapositiva 35 — Probando la API

## Tiempo: 3 minutos

Mostrar la colección de pruebas:

```text
GET    /users
GET    /users/1
GET    /users/999

POST   /users
PUT    /users/1
DELETE /users/1
```

Aquí podemos explicar una idea muy importante:

> Una API no está terminada simplemente porque el código compile. Debemos probar su comportamiento.

Esto conecta naturalmente con el perfil QA y testing del curso, sin desviarnos del contenido de Backend.

---

# 39. Diapositiva 36 — Práctica corta

## Tiempo: 15 minutos

### Actividad

Crear:

```text
GET /users?role=admin
```

Debe devolver solamente usuarios cuyo rol coincida.

### Orientación

El estudiante debe utilizar:

```javascript
req.query.role
```

Puede utilizar:

```javascript
const filteredUsers = users.filter(
    user => user.role === req.query.role
);
```

Y devolver:

```javascript
res.json(filteredUsers);
```

### No entregar inmediatamente la solución

Primero pedir que intenten resolverlo.

Dar solamente estas pistas:

1. ¿Dónde está `role` en la URL?
2. ¿Qué objeto de Express utilizamos para query parameters?
3. ¿Qué método de array permite filtrar elementos?

Después de algunos minutos, mostrar la solución.

---

# 40. Diapositiva 37 — Desafío

Utilizar como comprobación final:

```text
/users/10
```

versus:

```text
/users?role=admin
```

Preguntar:

### ¿Qué diferencia existe?

Respuesta:

```text
/users/10
→ req.params

/users?role=admin
→ req.query
```

Esta diferencia debe quedar clara antes de terminar la clase.

---

# 41. Diapositiva 38 — Lo que aprendimos

## Tiempo: 3 minutos

Realizar un repaso oral:

### Express

Framework sobre Node.js.

### Routing

Define qué ocurre para cada método y ruta.

### Request

```javascript
req.params
req.query
req.body
```

### Response

```javascript
res.status()
res.json()
```

### Middleware

Funciones que participan en el procesamiento de requests.

### REST

Uso organizado de recursos, HTTP y representaciones como JSON.

---

# 42. Diapositiva 39 — Próximo paso

## Tiempo: 2 minutos

Cerrar con:

> Nuestra API funciona, pero existe un problema.

Actualmente:

```text
API
 ↓
Array
```

Si apagamos el servidor:

```text
Datos perdidos
```

En las siguientes sesiones resolveremos esto utilizando una base de datos.

```text
API
 ↓
PostgreSQL
 ↓
Datos persistentes
```

Esto crea una conexión natural con la siguiente sesión.

---

# 43. Código final de referencia

Al finalizar la demostración, el archivo `server.js` debería tener una estructura similar a esta:

```javascript
const express = require("express");

const app = express();

const PORT = 3000;

// Middleware para interpretar JSON
app.use(express.json());

// Middleware global
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Datos en memoria
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

// GET /users
app.get("/users", (req, res) => {
    res.json(users);
});

// GET /users/:id
app.get("/users/:id", (req, res) => {

    const id = Number(req.params.id);

    const user = users.find(user => user.id === id);

    if (!user) {
        return res.status(404).json({
            message: "Usuario no encontrado"
        });
    }

    res.json(user);
});

// GET /users?role=admin
app.get("/users", (req, res) => {

    if (req.query.role) {
        const filteredUsers = users.filter(
            user => user.role === req.query.role
        );

        return res.json(filteredUsers);
    }

    res.json(users);
});

// POST /users
app.post("/users", (req, res) => {

    if (!req.body.name || !req.body.email) {
        return res.status(400).json({
            message: "Name and email are required"
        });
    }

    const user = {
        id: users.length + 1,
        name: req.body.name,
        email: req.body.email,
        role: req.body.role || "user"
    };

    users.push(user);

    res.status(201).json(user);
});

// PUT /users/:id
app.put("/users/:id", (req, res) => {

    const id = Number(req.params.id);

    const user = users.find(user => user.id === id);

    if (!user) {
        return res.status(404).json({
            message: "Usuario no encontrado"
        });
    }

    user.name = req.body.name;
    user.email = req.body.email;
    user.role = req.body.role;

    res.json(user);
});

// DELETE /users/:id
app.delete("/users/:id", (req, res) => {

    const id = Number(req.params.id);

    const index = users.findIndex(user => user.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Usuario no encontrado"
        });
    }

    users.splice(index, 1);

    res.json({
        message: "Usuario eliminado"
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
```

### Nota importante para el docente

Hay un detalle que debemos corregir antes de utilizar este código final en clase: **no debemos declarar dos veces `app.get("/users", ...)` de esta manera**, porque la primera ruta responde y no deja llegar a la segunda.

Para la versión que realmente se utilizará en clase, debemos combinar ambas funcionalidades en una única ruta:

```javascript
app.get("/users", (req, res) => {

    if (req.query.role) {
        const filteredUsers = users.filter(
            user => user.role === req.query.role
        );

        return res.json(filteredUsers);
    }

    res.json(users);
});
```

Así queda una única ruta:

```text
GET /users
```

que permite:

```text
GET /users
GET /users?role=admin
```

Esta corrección es importante para que el código utilizado por los estudiantes sea consistente.

---

# 44. Errores frecuentes que el docente debe anticipar

## Error 1 — `Cannot GET /`

El estudiante abre:

```text
http://localhost:3000/
```

y recibe:

```text
Cannot GET /
```

Explicar:

> El servidor funciona, pero no existe una ruta GET para `/`.

Debe probar:

```text
http://localhost:3000/users
```

---

## Error 2 — `req.body` aparece como `undefined`

Revisar:

```javascript
app.use(express.json());
```

y verificar que esté **antes de las rutas**.

---

## Error 3 — `req.params.id` es `"10"` y no `10`

Explicar que los parámetros de URL llegan como texto.

Cuando necesitamos trabajar con números:

```javascript
const id = Number(req.params.id);
```

---

## Error 4 — El middleware no continúa

Si tenemos:

```javascript
app.use((req, res, next) => {
    console.log("Middleware");
});
```

y no existe:

```javascript
next();
```

la solicitud queda detenida.

Explicar:

```text
Middleware
    ↓
   next()
    ↓
siguiente middleware/ruta
```

---

## Error 5 — El POST devuelve 404

Revisar:

* método HTTP
* URL
* ruta definida
* puerto
* servidor ejecutándose

---

## Error 6 — JSON mal enviado desde Postman

Verificar:

```text
Body
 ↓
raw
 ↓
JSON
```

y el contenido:

```json
{
    "name": "Carlos",
    "email": "carlos@example.com"
}
```

---

# 45. Preguntas de comprobación

Durante la sesión utilizar preguntas cortas:

### Después de Routing

> ¿Qué diferencia existe entre una ruta y un método HTTP?

### Después de Params

> ¿Dónde encontramos `/users/10`?

Respuesta:

```javascript
req.params
```

### Después de Query

> ¿Dónde encontramos `?role=admin`?

Respuesta:

```javascript
req.query
```

### Después de Body

> ¿Dónde encontramos los datos enviados en un POST JSON?

Respuesta:

```javascript
req.body
```

### Después de Middleware

> ¿Qué ocurre si no llamamos `next()`?

Respuesta:

> El flujo no continúa.

### Después de REST

> ¿Qué método usaríamos para crear un usuario?

Respuesta:

```text
POST
```

### Después del CRUD

> ¿Dónde están almacenados actualmente nuestros usuarios?

Respuesta:

```text
En memoria, dentro de un array.
```

---

# 46. Conceptos que el estudiante debe llevarse

Al finalizar la clase deberían poder explicar con sus propias palabras:

```text
Node.js
    ↓
Express
    ↓
Application
    ↓
Routes
    ↓
Middleware
    ↓
Request
    ↓
Processing
    ↓
Response
```

Y específicamente:

```javascript
req.params
req.query
req.body

res.status()
res.json()

app.use()
app.get()
app.post()
app.put()
app.delete()

next()
```

No es necesario que memoricen definiciones académicas. Lo importante es que puedan **utilizar los conceptos y explicar para qué sirven**.

---

# 47. Producto de la sesión

Al finalizar, cada estudiante debe tener:

```text
API REST
   │
   └── users
       ├── GET
       ├── GET /:id
       ├── POST
       ├── PUT /:id
       └── DELETE /:id
```

Y haber probado los endpoints mediante Postman.

La API utiliza:

```text
Express.js
JSON
HTTP
Middleware
Datos en memoria
```

Todavía **no utiliza PostgreSQL**.

---

# 48. Cierre pedagógico

La idea final que debe quedar es:

> **Express nos permite recibir solicitudes HTTP, procesarlas mediante rutas y middleware, y devolver respuestas que siguen una estructura clara.**

Y la conexión con la próxima sesión:

```text
Sesión 2

Cliente
   ↓
Express
   ↓
API REST
   ↓
Array
```

Después:

```text
Sesión 3

Cliente
   ↓
Express
   ↓
API REST
   ↓
PostgreSQL
   ↓
Datos persistentes
```

De esta manera, PostgreSQL no aparece como un tema aislado: aparece como la solución al problema que acabamos de descubrir.
