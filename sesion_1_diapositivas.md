# Módulo 2 — Arquitectura del Back-End y Bases de Datos

## Sesión 1 — Node.js y fundamentos del Backend

---

## Diapositiva 1 — Portada

### Node.js y fundamentos del Backend

**Módulo 2 — Arquitectura del Back-End y Bases de Datos**

> Comprender cómo funciona una aplicación web y construir nuestro primer servidor con Node.js.

---

## Diapositiva 2 — Objetivos de la sesión

Al finalizar la sesión podremos:

* Diferenciar Frontend y Backend.
* Comprender el modelo cliente-servidor.
* Entender Request y Response.
* Reconocer los principales elementos de HTTP.
* Comprender qué es una API REST.
* Conocer los fundamentos de Node.js.
* Crear un servidor HTTP básico.

---

## Diapositiva 3 — ¿Cómo funciona una aplicación web?

```text
Usuario
   ↓
Frontend
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
Frontend
   ↓
Usuario
```

### Idea clave

> Una aplicación web está formada por diferentes componentes que trabajan juntos.

---

## Diapositiva 4 — Frontend vs Backend

| Frontend    | Backend           |
| ----------- | ----------------- |
| Interfaz    | Procesamiento     |
| Usuario     | Lógica de negocio |
| Formularios | Validaciones      |
| Pantallas   | APIs              |
| Interacción | Datos             |

### Ejemplo

```text
Frontend
"Quiero ver mis productos"

        ↓

Backend
"Voy a consultar los productos"

        ↓

Base de datos
```

---

## Diapositiva 5 — Cliente y servidor

### Cliente

Inicia una solicitud.

Ejemplos:

* Navegador
* Aplicación móvil
* Postman
* Otro servidor

### Servidor

Recibe y procesa solicitudes.

```text
CLIENTE
   │
   │ Request
   ▼
SERVIDOR
   │
   │ Response
   ▼
CLIENTE
```

---

## Diapositiva 6 — ¿Qué es un servidor?

Un servidor es un programa o sistema que:

* Espera solicitudes.
* Procesa solicitudes.
* Devuelve respuestas.

Durante el desarrollo:

```text
Nuestra computadora
        ↓
      Node.js
        ↓
Servidor HTTP
        ↓
localhost:3000
```

> La misma computadora puede ser cliente y servidor.

---

## Diapositiva 7 — Conceptos básicos de red

```text
http://localhost:3000/users
│       │          │     │
│       │          │     └── Path
│       │          └──────── Puerto
│       └─────────────────── Host
└─────────────────────────── Protocolo
```

### Recordar

* IP
* localhost
* Puerto
* Dominio
* DNS
* URL
* Path

---

## Diapositiva 8 — localhost e IP

```text
localhost
    ↓
127.0.0.1
    ↓
Nuestra computadora
```

### Ejemplo

```text
http://localhost:3000
```

* `localhost` → equipo local
* `3000` → puerto

---

## Diapositiva 9 — ¿Qué es HTTP?

### HTTP

**HyperText Transfer Protocol**

Permite la comunicación entre clientes y servidores.

```text
Cliente
   │
   │ HTTP Request
   ▼
Servidor
   │
   │ HTTP Response
   ▼
Cliente
```

---

## Diapositiva 10 — HTTP Request

Una Request puede contener:

```text
Método
URL
Headers
Body
```

Ejemplo:

```http
GET /users HTTP/1.1
Host: example.com
Accept: application/json
```

---

## Diapositiva 11 — HTTP Response

Una Response puede contener:

```text
Status Code
Headers
Body
```

Ejemplo:

```http
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
[
  {
    "id": 1,
    "name": "Juan"
  }
]
```

---

## Diapositiva 12 — Métodos HTTP

| Método | Uso        |
| ------ | ---------- |
| GET    | Obtener    |
| POST   | Crear      |
| PUT    | Reemplazar |
| PATCH  | Modificar  |
| DELETE | Eliminar   |

Ejemplo:

```text
GET /users
POST /users
DELETE /users/10
```

---

## Diapositiva 13 — Headers y Body

### Headers

Información adicional.

```text
Content-Type: application/json
Accept: application/json
```

### Body

Información enviada.

```json
{
  "name": "Juan",
  "email": "juan@email.com"
}
```

---

## Diapositiva 14 — Content-Type

Indica el tipo de contenido.

```text
text/plain
text/html
application/json
```

### Para APIs

Frecuentemente utilizaremos:

```text
application/json
```

---

## Diapositiva 15 — Status Codes

### 2xx — Éxito

```text
200 OK
201 Created
204 No Content
```

### 3xx — Redirección

### 4xx — Error del cliente

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
```

### 5xx — Error del servidor

```text
500 Internal Server Error
```

---

## Diapositiva 16 — ¿Qué es una API?

### API

**Application Programming Interface**

Permite la comunicación entre aplicaciones o componentes.

```text
Frontend
   │
   │ GET /users
   ▼
API / Backend
   │
   ▼
Base de datos
```

> Una API es una interfaz de comunicación.

---

## Diapositiva 17 — Backend ≠ API

No son exactamente lo mismo.

```text
BACKEND
│
├── Lógica de negocio
├── Validaciones
├── Procesamiento
├── Acceso a datos
└── APIs
```

> La API es una forma de comunicación proporcionada por el sistema.

---

## Diapositiva 18 — ¿Qué es un Endpoint?

Un endpoint es un punto de acceso de una API o servidor.

Ejemplos:

```text
GET /users
GET /users/10
POST /users
DELETE /users/10
```

### Endpoint

```text
Método + Ruta
```

---

## Diapositiva 19 — ¿Qué es REST?

REST es un estilo arquitectónico para diseñar servicios web.

Ejemplo:

```text
GET     /users
GET     /users/10
POST    /users
PUT     /users/10
PATCH   /users/10
DELETE  /users/10
```

### Idea principal

> Recursos + URLs + métodos HTTP

---

## Diapositiva 20 — JSON

### JavaScript Object Notation

Formato utilizado frecuentemente para intercambiar datos.

```json
{
  "id": 1,
  "name": "Juan",
  "email": "juan@email.com"
}
```

Puede representar:

* Objetos
* Arrays
* Propiedades
* Valores

---

## Diapositiva 21 — El papel de la base de datos

La base de datos permite:

* Almacenar información.
* Consultar información.
* Modificar información.
* Mantener información de forma persistente.

```text
Backend
   ↓
Base de datos
   ↓
Datos
```

---

## Diapositiva 22 — Flujo completo

```text
Usuario
   ↓
Frontend
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
Frontend
   ↓
Usuario
```

### Este flujo será la base del módulo.

---

## Diapositiva 23 — ¿Qué es Node.js?

> Node.js es un entorno de ejecución que permite ejecutar JavaScript fuera del navegador.

```text
ANTES

JavaScript
    ↓
Navegador
```

```text
CON NODE.JS

JavaScript
    ↓
Node.js
    ↓
Sistema operativo
```

---

## Diapositiva 24 — Node.js y V8

Node.js utiliza el motor JavaScript **V8**.

```text
JavaScript
     ↓
     V8
     ↓
Ejecución
```

### Node.js agrega

* APIs del sistema.
* Módulos.
* Herramientas.
* Capacidades para crear servidores.

---

## Diapositiva 25 — Event Loop

Node.js utiliza un modelo orientado a eventos.

```text
Solicitud
    ↓
Node.js
    ↓
Operación
    ↓
Resultado
```

### Idea clave

> Permite gestionar operaciones asíncronas sin bloquear innecesariamente la ejecución.

---

## Diapositiva 26 — Operaciones asíncronas

Ejemplos:

* Leer archivos.
* Consultar una base de datos.
* Realizar una petición HTTP.
* Acceder a servicios externos.

```javascript
const users = await getUsers();
```

---

## Diapositiva 27 — Promises y async/await

### Promise

Representa el resultado futuro de una operación.

### async/await

Facilita trabajar con operaciones asíncronas.

```javascript
async function getData() {
  const data = await getUsers();
  return data;
}
```

---

## Diapositiva 28 — npm

### Node Package Manager

npm permite:

* Instalar paquetes.
* Administrar dependencias.
* Ejecutar scripts.
* Gestionar versiones.

```bash
npm install
```

---

## Diapositiva 29 — Crear un proyecto Node.js

```bash
mkdir backend-session-01
cd backend-session-01
npm init -y
```

Obtendremos:

```text
backend-session-01/
└── package.json
```

---

## Diapositiva 30 — package.json

Archivo principal de configuración del proyecto.

```json
{
  "name": "backend-session-01",
  "version": "1.0.0",
  "type": "module"
}
```

Puede contener:

* Información del proyecto.
* Dependencias.
* Scripts.
* Configuración.

---

## Diapositiva 31 — node_modules y package-lock.json

```text
backend-session-01/
│
├── package.json
├── package-lock.json
└── node_modules/
```

### package.json

Dependencias declaradas.

### package-lock.json

Versiones concretas instaladas.

### node_modules

Paquetes instalados.

---

## Diapositiva 32 — Scripts de npm

Podemos definir comandos:

```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

Ejecutar:

```bash
npm start
```

---

## Diapositiva 33 — Módulos

Los módulos permiten organizar y reutilizar código.

### CommonJS

```javascript
const http = require("http");
```

### ES Modules

```javascript
import http from "http";
```

### En este curso

> Utilizaremos ES Modules.

---

## Diapositiva 34 — Nuestro primer servidor

```text
backend-session-01/
│
├── package.json
└── server.js
```

Código:

```javascript
import http from "http";

const server = http.createServer((req, res) => {

  res.writeHead(200, {
    "Content-Type": "text/plain"
  });

  res.end("Hola desde Node.js");
});

server.listen(3000, () => {
  console.log("Servidor ejecutándose en http://localhost:3000");
});
```

---

## Diapositiva 35 — ¿Qué acabamos de construir?

```text
Navegador
    │
    │ GET /
    ▼
Node.js
    │
    │ 200 OK
    ▼
"Hola desde Node.js"
```

### Relación

```text
req → Request
res → Response
200 → Status Code
3000 → Puerto
```

---

## Diapositiva 36 — Práctica

### Crear dos endpoints

#### `GET /`

Responder:

```text
Bienvenido a mi primer Backend con Node.js
```

#### `GET /about`

Responder:

```text
Este servidor fue creado durante la Sesión 1.
```

### Opcional

```text
GET /users
```

Responder un JSON con dos usuarios.

---

## Diapositiva 37 — Flujo de nuestra práctica

```text
Navegador
    ↓
GET /
    ↓
localhost:3000
    ↓
Node.js
    ↓
HTTP Response
    ↓
200 OK
    ↓
Mensaje
```

---

## Diapositiva 38 — ¿Qué aprendimos?

* Frontend y Backend.
* Cliente y servidor.
* HTTP.
* Request y Response.
* Métodos HTTP.
* Status Codes.
* API y REST.
* JSON.
* Node.js.
* npm.
* Módulos.
* Servidor HTTP.

---

## Diapositiva 39 — Conceptos para recordar

```text
Backend
Cliente
Servidor
HTTP
Request
Response
Endpoint
API
REST
JSON
localhost
Puerto
Node.js
npm
Promise
async/await
ES Modules
```

---

## Diapositiva 40 — Próxima sesión

# Sesión 2

## Express.js, Routing y Middleware

Aprenderemos a construir nuestro Backend de una manera más organizada utilizando Express.js.

```text
Node.js
   ↓
Express
   ↓
Routes
   ↓
Middleware
   ↓
API
```
