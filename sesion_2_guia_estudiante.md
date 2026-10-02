# Módulo 2 — Arquitectura del Backend y Bases de Datos

# Guía del estudiante — Sesión 2

## Express.js, Routing, Middleware y REST

---

# 1. Objetivo

En esta sesión aprenderemos a construir una API REST básica utilizando Express.js.

Al finalizar podremos:

* Crear un proyecto Express.
* Crear un servidor HTTP.
* Definir rutas.
* Utilizar métodos HTTP.
* Recibir parámetros de ruta.
* Recibir query parameters.
* Recibir datos mediante `req.body`.
* Crear respuestas JSON.
* Utilizar códigos HTTP.
* Comprender middleware.
* Construir un CRUD básico.
* Probar nuestra API utilizando Postman.

---

# 2. Requisitos previos

Antes de comenzar debemos tener instalado:

* Node.js
* npm
* Visual Studio Code
* Postman

---

# 3. Verificar Node.js

Abrir una terminal.

Podemos utilizar:

* PowerShell
* CMD
* Terminal de VS Code

Ejecutar:

```bash
node --version
```

También:

```bash
npm --version
```

Deberíamos obtener versiones similares a:

```text
v22.x.x
10.x.x
```

> La versión puede ser diferente. Lo importante es que ambos comandos funcionen.

Si `node` o `npm` no son reconocidos, debemos instalar Node.js antes de continuar.

---

# 4. Instalar Node.js

Ir al sitio oficial de Node.js:

https://nodejs.org/

Descargar una versión **LTS**.

Durante la instalación podemos utilizar las opciones predeterminadas.

Después de instalar Node.js:

1. Cerrar la terminal.
2. Abrir una nueva terminal.
3. Ejecutar:

```bash
node --version
```

y:

```bash
npm --version
```

Si ambos comandos muestran una versión, Node.js está correctamente instalado.

---

# 5. Crear el proyecto

Crear una carpeta para nuestros ejercicios.

Por ejemplo:

```bash
mkdir modulo2-sesion2
```

Entrar a la carpeta:

```bash
cd modulo2-sesion2
```

Inicializar el proyecto:

```bash
npm init -y
```

Se generará:

```text
package.json
```

La estructura inicial será:

```text
modulo2-sesion2/
└── package.json
```

### Configurar ES Modules

Por defecto, Node.js utiliza CommonJS. Para trabajar con la sintaxis moderna de ES Modules, agregamos:

```bash
"type": "module"
```

Podemos hacerlo automáticamente desde la terminal:

```bash
npm pkg set type=module
```

El archivo package.json quedará similar a:

```bash
{
  "name": "backend",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "type": "module",
  "scripts": {},
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```
---

# 6. Instalar Express

Dentro de la carpeta del proyecto ejecutar:

```bash
npm install express
```

Después aparecerán:

```text
node_modules/
package-lock.json
package.json
```

La estructura será:

```text
modulo2-sesion2/
├── node_modules/
├── package-lock.json
└── package.json
```

---

# 7. Crear nuestro servidor

Crear un archivo:

```text
server.js
```

La estructura queda:

```text
modulo2-sesion2/
├── node_modules/
├── package-lock.json
├── package.json
└── server.js
```

Escribir:

```javascript
import express from 'express';

const app = express();

app.listen(3000, () => {
    console.log("Servidor ejecutándose en http://localhost:3000");
});
```

---

# 8. Ejecutar el servidor

Desde la terminal:

```bash
node server.js
```

Deberíamos observar:

```text
Servidor ejecutándose en http://localhost:3000
```

Nuestro servidor está escuchando en:

```text
http://localhost:3000
```

Para detenerlo:

```text
Ctrl + C
```

---

# 9. Crear nuestra primera ruta

Modificar `server.js`:

```javascript
import express from 'express';

const app = express();

app.get("/users", (req, res) => {
    res.json([]);
});

app.listen(3000, () => {
    console.log("Servidor ejecutándose en http://localhost:3000");
});
```

Ejecutar:

```bash
node server.js
```

Abrir en el navegador:

```text
http://localhost:3000/users
```

Resultado esperado:

```json
[]
```

---

# 10. ¿Qué acabamos de hacer?

Esta instrucción:

```javascript
app.get("/users", (req, res) => {
    res.json([]);
});
```

significa:

> Cuando llegue una solicitud GET a `/users`, devolveremos un JSON.

La estructura general es:

```javascript
app.METHOD(PATH, HANDLER)
```

Por ejemplo:

```javascript
app.get("/users", handler);
```

---

# 11. Métodos HTTP

Durante la sesión utilizaremos:

| Método | Uso        |
| ------ | ---------- |
| GET    | Consultar  |
| POST   | Crear      |
| PUT    | Actualizar |
| DELETE | Eliminar   |

Ejemplo:

```text
GET    /users
GET    /users/10
POST   /users
PUT    /users/10
DELETE /users/10
```

---

# 12. Parámetros de ruta

Crear una ruta:

```javascript
app.get("/users/:id", (req, res) => {

    res.json({
        id: req.params.id
    });

});
```

Ejecutar el servidor y probar:

```text
http://localhost:3000/users/10
```

Resultado:

```json
{
    "id": "10"
}
```

Podemos cambiar `10` por otro valor:

```text
/users/20
```

o:

```text
/users/50
```

El valor estará disponible mediante:

```javascript
req.params.id
```

---

# 13. Parámetros de ruta y números

Los parámetros de ruta llegan como texto.

Por ejemplo:

```javascript
req.params.id
```

puede contener:

```text
"10"
```

Si necesitamos trabajar con un número:

```javascript
const id = Number(req.params.id);
```

Ahora:

```text
"10"
```

se convierte en:

```text
10
```

---

# 14. Query Parameters

Los query parameters aparecen después de `?`.

Ejemplo:

```text
/users?role=admin
```

Crear:

```javascript
app.get("/search", (req, res) => {

    res.json(req.query);

});
```

Probar:

```text
http://localhost:3000/search?role=admin
```

Resultado:

```json
{
    "role": "admin"
}
```

Accedemos al valor mediante:

```javascript
req.query.role
```

---

# 15. Diferencia entre `params` y `query`

### Parámetro de ruta

```text
/users/10
```

Utilizamos:

```javascript
req.params
```

### Query parameter

```text
/users?role=admin
```

Utilizamos:

```javascript
req.query
```

Recordatorio:

```text
/users/10
     ↑
   params
```

```text
/users?role=admin
       ↑
      query
```

---

# 16. Preparar Express para recibir JSON

Agregar antes de las rutas:

```javascript
app.use(express.json());
```

Nuestro código empieza a quedar:

```javascript
import express from 'express';

const app = express();

app.use(express.json());
```

Esta configuración permite que Express interprete solicitudes cuyo body contiene JSON.

---

# 17. Request Body

Crear:

```javascript
app.post("/users", (req, res) => {

    console.log(req.body);

    res.json(req.body);

});
```

Ahora podemos enviar:

```json
{
    "name": "Juan",
    "email": "juan@example.com"
}
```

El contenido estará disponible en:

```javascript
req.body
```

---

# 18. Content-Type

Cuando enviamos JSON debemos utilizar:

```http
Content-Type: application/json
```

En Postman, cuando seleccionamos:

```text
Body
→ raw
→ JSON
```

Postman configura este tipo de contenido para la solicitud.

---

# 19. Respuestas

Podemos enviar JSON:

```javascript
res.json({
    message: "Hola"
});
```

También podemos establecer un código HTTP:

```javascript
res.status(201).json({
    message: "Usuario creado"
});
```

Ejemplo de error:

```javascript
res.status(404).json({
    message: "Usuario no encontrado"
});
```

---

# 20. Códigos HTTP utilizados

| Código | Significado           |
| -----: | --------------------- |
|    200 | OK                    |
|    201 | Created               |
|    400 | Bad Request           |
|    404 | Not Found             |
|    500 | Internal Server Error |

Los códigos permiten comunicar al cliente qué ocurrió con la solicitud.

---

# 21. Validación básica

Podemos comprobar que el cliente envió los datos necesarios.

```javascript
if (!req.body.name || !req.body.email) {
    return res.status(400).json({
        message: "Name and email are required"
    });
}
```

El `return` evita que la función continúe después de enviar la respuesta de error.

---

# 22. Middleware

Un middleware es una función que participa en el procesamiento de una solicitud.

Ejemplo:

```javascript
app.use((req, res, next) => {

    console.log("Request recibida");

    next();

});
```

El flujo es:

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

---

# 23. `next()`

`next()` permite continuar con el siguiente middleware o con la siguiente etapa del procesamiento.

Ejemplo:

```javascript
app.use((req, res, next) => {

    console.log(req.method);
    next();

});
```

Si no llamamos a `next()` y tampoco enviamos una respuesta, la solicitud puede quedar esperando.

---

# 24. Middleware global

Ejemplo:

```javascript
app.use((req, res, next) => {

    console.log(`${req.method} ${req.url}`);

    next();

});
```

Podemos observar en la consola:

```text
GET /users
GET /users/10
POST /users
```

---

# 25. Middleware de ruta

También podemos utilizar middleware solamente para una ruta.

```javascript
const logger = (req, res, next) => {

    console.log("Accediendo a users");

    next();

};

app.get("/users", logger, (req, res) => {

    res.json([]);

});
```

---

# 26. REST

REST es un estilo para diseñar servicios web.

En esta sesión utilizaremos:

```text
Recursos
Endpoints
HTTP
JSON
Status Codes
Statelessness
```

Nuestro recurso será:

```text
users
```

---

# 27. CRUD

CRUD representa cuatro operaciones:

```text
Create
Read
Update
Delete
```

En nuestra API:

```text
Create → POST
Read   → GET
Update → PUT
Delete → DELETE
```

---

# 28. Crear los datos en memoria

Ahora construiremos nuestra API.

En `server.js` agregar:

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

Estos datos estarán almacenados temporalmente en memoria.

---

# 29. GET /users

Crear:

```javascript
app.get("/users", (req, res) => {

    res.json(users);

});
```

Probar:

```text
GET http://localhost:3000/users
```

Resultado:

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

# 30. GET /users/:id

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

Probar:

```text
GET /users/1
```

Debe devolver:

```json
{
    "id": 1,
    "name": "Juan",
    "email": "juan@example.com",
    "role": "admin"
}
```

---

# 31. Probar un usuario inexistente

Probar:

```text
GET /users/999
```

Resultado:

```json
{
    "message": "Usuario no encontrado"
}
```

Código HTTP:

```text
404 Not Found
```

---

# 32. POST /users

Crear:

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
        role: req.body.role || "user"
    };

    users.push(user);

    res.status(201).json(user);

});
```

---

# 33. Probar POST con Postman

Crear:

```text
POST
http://localhost:3000/users
```

Seleccionar:

```text
Body
→ raw
→ JSON
```

Enviar:

```json
{
    "name": "Carlos",
    "email": "carlos@example.com",
    "role": "user"
}
```

Respuesta esperada:

```json
{
    "id": 3,
    "name": "Carlos",
    "email": "carlos@example.com",
    "role": "user"
}
```

Código:

```text
201 Created
```

---

# 34. Probar validación

Enviar:

```json
{
    "email": "test@example.com"
}
```

Falta:

```text
name
```

La API debe responder:

```json
{
    "message": "Name and email are required"
}
```

Código:

```text
400 Bad Request
```

---

# 35. PUT /users/:id

Crear:

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

---

# 36. Probar PUT

En Postman:

```text
PUT
http://localhost:3000/users/1
```

Body:

```json
{
    "name": "Juan Carlos",
    "email": "juan.carlos@example.com",
    "role": "admin"
}
```

Después realizar:

```text
GET /users/1
```

para comprobar el cambio.

---

# 37. DELETE /users/:id

Crear:

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

---

# 38. Probar DELETE

En Postman:

```text
DELETE
http://localhost:3000/users/2
```

Respuesta:

```json
{
    "message": "Usuario eliminado"
}
```

Después:

```text
GET /users
```

para comprobar que el usuario fue eliminado.

---

# 39. Endpoint con Query Parameter

Ahora construiremos nuestro ejercicio.

Necesitamos:

```text
GET /users?role=admin
```

La información está en:

```javascript
req.query.role
```

Podemos utilizar:

```javascript
const filteredUsers = users.filter(
    user => user.role === req.query.role
);
```

Y devolver:

```javascript
res.json(filteredUsers);
```

---

# 40. Solución de la práctica

La ruta completa puede quedar:

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

Probar:

```text
GET /users
```

y:

```text
GET /users?role=admin
```

---

# 41. Diferencias importantes

### `req.params`

Información incluida en la ruta.

```text
/users/10
```

```javascript
req.params.id
```

---

### `req.query`

Información después de `?`.

```text
/users?role=admin
```

```javascript
req.query.role
```

---

### `req.body`

Información enviada dentro del cuerpo.

```json
{
    "name": "Juan"
}
```

```javascript
req.body.name
```

---

# 42. Instalar Postman

Postman es una herramienta que permite probar APIs.

Sitio oficial:

https://www.postman.com/downloads/

Descargar la versión correspondiente al sistema operativo.

Instalar utilizando las opciones predeterminadas.

---

# 43. Abrir Postman

Después de instalarlo:

1. Abrir Postman.
2. Crear o iniciar sesión en una cuenta si Postman lo solicita.
3. Abrir la aplicación.
4. Crear una nueva solicitud HTTP.

La interfaz permitirá seleccionar:

```text
GET
POST
PUT
DELETE
```

y especificar una URL.

---

# 44. Primera prueba en Postman

Con nuestro servidor ejecutándose:

```bash
node server.js
```

En Postman:

```text
Method:
GET
```

URL:

```text
http://localhost:3000/users
```

Presionar:

```text
Send
```

Deberíamos recibir la lista de usuarios.

---

# 45. Crear una colección

En Postman podemos organizar nuestras solicitudes mediante una Collection.

Crear:

```text
Módulo 2 - Sesión 2
```

Dentro podemos guardar:

```text
GET Users
GET User by ID
POST User
PUT User
DELETE User
GET Users by Role
```

Esto nos permitirá reutilizar nuestras pruebas.

---

# 46. Configurar POST en Postman

Seleccionar:

```text
POST
```

URL:

```text
http://localhost:3000/users
```

Ir a:

```text
Body
→ raw
→ JSON
```

Enviar:

```json
{
    "name": "Pedro",
    "email": "pedro@example.com",
    "role": "user"
}
```

Presionar:

```text
Send
```

---

# 47. Probar todos los endpoints

Debemos probar:

| Método | Endpoint            | Resultado esperado  |
| ------ | ------------------- | ------------------- |
| GET    | `/users`            | Lista               |
| GET    | `/users/1`          | Usuario             |
| GET    | `/users/999`        | 404                 |
| POST   | `/users`            | 201                 |
| PUT    | `/users/1`          | Usuario actualizado |
| DELETE | `/users/2`          | Usuario eliminado   |
| GET    | `/users?role=admin` | Usuarios filtrados  |

---

# 48. Práctica individual

## Objetivo

Crear:

```text
GET /users?role=admin
```

La respuesta debe contener únicamente los usuarios cuyo rol sea `admin`.

### Pistas

Utilizar:

```javascript
req.query.role
```

y:

```javascript
users.filter(...)
```

### Ejemplo

Si tenemos:

```json
[
    {
        "id": 1,
        "name": "Juan",
        "role": "admin"
    },
    {
        "id": 2,
        "name": "Maria",
        "role": "user"
    }
]
```

Al realizar:

```text
GET /users?role=admin
```

deberíamos obtener:

```json
[
    {
        "id": 1,
        "name": "Juan",
        "role": "admin"
    }
]
```

---

# 49. Comprobación final

Antes de terminar, debemos poder responder:

### ¿Qué es Express?

Framework para construir aplicaciones web y APIs sobre Node.js.

### ¿Qué es una ruta?

Una definición que indica cómo responder a una solicitud HTTP determinada.

### ¿Para qué sirve `req.params`?

Para obtener parámetros definidos en la ruta.

### ¿Para qué sirve `req.query`?

Para obtener query parameters.

### ¿Para qué sirve `req.body`?

Para acceder a los datos enviados en el cuerpo de la solicitud.

### ¿Para qué sirve `res.json()`?

Para enviar una respuesta JSON.

### ¿Para qué sirve `res.status()`?

Para establecer el código de estado HTTP.

### ¿Qué hace `next()`?

Permite continuar el procesamiento hacia el siguiente middleware o etapa.

---

# 50. Estructura final del proyecto

Al terminar tendremos:

```text
modulo2-sesion2/
│
├── node_modules/
│
├── package-lock.json
│
├── package.json
│
└── server.js
```

---

# 51. Comandos importantes de la sesión

### Crear proyecto

```bash
mkdir modulo2-sesion2
cd modulo2-sesion2
npm init -y
```

### Instalar Express

```bash
npm install express
```

### Ejecutar servidor

```bash
node server.js
```

### Detener servidor

```text
Ctrl + C
```

### Ver versión de Node.js

```bash
node --version
```

### Ver versión de npm

```bash
npm --version
```

---

# 52. Conceptos para recordar

```text
Node.js
    ↓
Express
    ↓
HTTP
    ↓
Routing
    ↓
Middleware
    ↓
Request
    ↓
Processing
    ↓
Response
```

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

### Métodos

```text
GET
POST
PUT
DELETE
```

### Middleware

```javascript
app.use()
next()
```

---

# 53. Importante: datos en memoria

Nuestra API utiliza:

```javascript
let users = [];
```

Esto significa que los datos existen únicamente mientras el servidor está ejecutándose.

Si hacemos:

```text
Ctrl + C
```

y volvemos a iniciar:

```bash
node server.js
```

los cambios realizados desaparecerán.

Esto es intencional.

En las siguientes sesiones aprenderemos a utilizar:

```text
PostgreSQL
```

para almacenar los datos de forma persistente.

---

# 54. Resultado de la sesión

Al terminar deberíamos tener una API capaz de:

```text
Consultar usuarios
        ↓
Crear usuarios
        ↓
Actualizar usuarios
        ↓
Eliminar usuarios
        ↓
Filtrar usuarios
```

utilizando:

```text
Express.js
HTTP
REST
JSON
Middleware
Postman
```

El siguiente paso será conectar nuestra API con una base de datos.
