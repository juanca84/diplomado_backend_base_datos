# Guía práctica del estudiante

## Módulo 2 — Arquitectura del Back-End y Bases de Datos

## Sesión 1 — Node.js y fundamentos del Backend

---

# 1. Objetivo de la práctica

Al finalizar esta práctica podrás:

* Instalar Node.js.
* Verificar la instalación de Node.js y npm.
* Crear un proyecto Node.js.
* Comprender la estructura básica de un proyecto.
* Crear un servidor HTTP.
* Ejecutar un servidor local.
* Crear endpoints sencillos.
* Probar un endpoint desde el navegador.
* Identificar el método HTTP y la ruta recibida.

---

# 2. Herramientas necesarias

Para esta sesión necesitarás:

* Node.js
* npm
* Visual Studio Code
* Terminal
* Navegador web

Opcionalmente:

* Git
* Postman

---

# 3. Instalar Node.js

## 3.1. ¿Qué necesitamos instalar?

Node.js incluye:

```text
Node.js
   +
npm
```

Node.js permite ejecutar JavaScript fuera del navegador.

npm permite administrar paquetes y dependencias de proyectos Node.js.

---

# 4. Descargar Node.js

Descarga Node.js desde su sitio oficial:

[Node.js — sitio oficial](https://nodejs.org/?utm_source=chatgpt.com)

Para este curso se recomienda utilizar una versión **LTS (Long Term Support)**.

En la página de descarga normalmente encontrarás una opción similar a:

```text
LTS
```

Selecciona la versión correspondiente a tu sistema operativo.

---

# 5. Instalación en Windows

Si utilizas Windows:

1. Descarga el instalador `.msi`.
2. Ejecuta el instalador.
3. Acepta los términos de licencia.
4. Mantén las opciones predeterminadas.
5. Asegúrate de que Node.js se agregue al `PATH`.
6. Finaliza la instalación.

Después de instalar Node.js, **cierra y vuelve a abrir la terminal**.

---

# 6. Verificar Node.js

Abre:

* PowerShell
* CMD
* Terminal de VS Code

Ejecuta:

```bash
node --version
```

También puedes utilizar:

```bash
node -v
```

Deberías obtener algo similar a:

```text
v22.x.x
```

La versión exacta puede ser diferente.

---

# 7. Verificar npm

Ejecuta:

```bash
npm --version
```

Deberías obtener un número de versión, por ejemplo:

```text
10.x.x
```

La versión exacta puede variar.

---

# 8. Comprobar que Node.js funciona

Podemos ejecutar directamente JavaScript desde la terminal.

Ejecuta:

```bash
node
```

Aparecerá algo similar a:

```text
>
```

Escribe:

```javascript
console.log("Hola Node.js");
```

Deberías obtener:

```text
Hola Node.js
```

Para salir:

```text
.exit
```

También puedes presionar:

```text
Ctrl + C
```

dos veces.

---

# 9. Crear la carpeta del proyecto

Vamos a crear nuestro primer proyecto.

Abre una terminal y ejecuta:

```bash
mkdir backend-session-01
```

Después:

```bash
cd backend-session-01
```

Ahora estás dentro de la carpeta:

```text
backend-session-01
```

---

# 10. Inicializar el proyecto

Ejecuta:

```bash
npm init -y
```

Este comando crea:

```text
package.json
```

La estructura será:

```text
backend-session-01/
└── package.json
```

---

# 11. Abrir el proyecto en Visual Studio Code

Si tienes VS Code instalado, puedes ejecutar:

```bash
code .
```

Esto abrirá la carpeta actual en Visual Studio Code.

Si el comando `code` no está disponible, puedes abrir VS Code normalmente y seleccionar:

```text
File → Open Folder
```

y elegir:

```text
backend-session-01
```

---

# 12. Revisar package.json

Abre:

```text
package.json
```

Inicialmente tendrá una estructura similar a:

```json
{
  "name": "backend-session-01",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

No necesitas memorizar todas estas propiedades.

Para esta práctica nos interesa principalmente:

* `name`
* `version`
* `scripts`

---

# 13. Configurar ES Modules

En este curso utilizaremos **ES Modules**.

Agrega:

```json
"type": "module"
```

El archivo puede quedar así:

```json
{
  "name": "backend-session-01",
  "version": "1.0.0",
  "description": "",
  "type": "module",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

Ahora podremos utilizar:

```javascript
import ...
```

en nuestros archivos JavaScript.

---

# 14. Crear nuestro servidor

Dentro de la carpeta del proyecto crea un archivo:

```text
server.js
```

La estructura será:

```text
backend-session-01/
│
├── package.json
└── server.js
```

---

# 15. Crear el primer servidor HTTP

En `server.js` escribe:

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

# 16. Ejecutar el servidor

Guarda el archivo.

En la terminal ejecuta:

```bash
node server.js
```

Deberías ver:

```text
Servidor ejecutándose en http://localhost:3000
```

Esto significa que nuestro servidor está funcionando.

---

# 17. Probar el servidor

Abre un navegador.

Escribe:

```text
http://localhost:3000
```

Deberías ver:

```text
Hola desde Node.js
```

---

# 18. ¿Qué acabamos de hacer?

El navegador actuó como:

```text
Cliente
```

El programa Node.js actuó como:

```text
Servidor
```

El navegador realizó:

```text
GET /
```

Node.js respondió:

```text
200 OK
```

con:

```text
Hola desde Node.js
```

El flujo fue:

```text
Navegador
    ↓
GET /
    ↓
localhost:3000
    ↓
Node.js
    ↓
200 OK
    ↓
Hola desde Node.js
```

---

# 19. Crear nuestro primer endpoint

Ahora modificaremos el servidor.

Queremos que:

```text
GET /
```

responda:

```text
Bienvenido a mi primer Backend con Node.js
```

Podemos modificar:

```javascript
res.end("Bienvenido a mi primer Backend con Node.js");
```

Guarda el archivo.

Detén el servidor con:

```text
Ctrl + C
```

Y vuelve a ejecutarlo:

```bash
node server.js
```

Después abre nuevamente:

```text
http://localhost:3000
```

---

# 20. Crear el endpoint `/about`

Ahora queremos:

```text
GET /about
```

Para esto podemos comprobar la ruta recibida mediante:

```javascript
if (req.url === "/") {
  res.writeHead(200, {
    "Content-Type": "text/plain"
  });

  res.end("Bienvenido a mi primer Backend con Node.js");
}

if (req.url === "/about") {
  res.writeHead(200, {
    "Content-Type": "text/plain"
  });

  res.end("Este servidor fue creado durante la Sesión 1.");
}
```

El servidor completo puede quedar:

```javascript
import http from "http";

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.writeHead(200, {
      "Content-Type": "text/plain"
    });

    res.end("Bienvenido a mi primer Backend con Node.js");
  }

  if (req.url === "/about") {
    res.writeHead(200, {
      "Content-Type": "text/plain"
    });

    res.end("Este servidor fue creado durante la Sesión 1.");
  }
});

server.listen(3000, () => {
  console.log("Servidor ejecutándose en http://localhost:3000");
});
```

---

# 21. Probar los dos endpoints

### Endpoint principal

Abre:

```text
http://localhost:3000/
```

Resultado:

```text
Bienvenido a mi primer Backend con Node.js
```

### Endpoint About

Abre:

```text
http://localhost:3000/about
```

Resultado:

```text
Este servidor fue creado durante la Sesión 1.
```

---

# 22. Observar la Request

Ahora vamos a comprobar qué está enviando el navegador.

Agrega temporalmente:

```javascript
console.log("Method:", req.method);
console.log("URL:", req.url);
```

Por ejemplo:

```javascript
const server = http.createServer((req, res) => {

  console.log("Method:", req.method);
  console.log("URL:", req.url);

  // ...
});
```

Ejecuta:

```bash
node server.js
```

Abre:

```text
http://localhost:3000/
```

En la terminal deberías ver:

```text
Method: GET
URL: /
```

Ahora abre:

```text
http://localhost:3000/about
```

En la terminal aparecerá:

```text
Method: GET
URL: /about
```

---

# 23. ¿Qué significa `req`?

En:

```javascript
(req, res)
```

`req` representa:

```text
Request
```

Podemos obtener información de la solicitud:

```javascript
req.method
req.url
```

Por ejemplo:

```text
req.method → GET
req.url    → /about
```

---

# 24. ¿Qué significa `res`?

`res` representa:

```text
Response
```

Utilizamos `res` para enviar una respuesta al cliente.

Por ejemplo:

```javascript
res.writeHead(200);
```

indica:

```text
200 OK
```

Y:

```javascript
res.end("Hola");
```

envía el contenido de la respuesta.

---

# 25. Probar desde otra herramienta

El navegador no es el único cliente.

Podemos utilizar `curl`.

Mantén el servidor funcionando y abre otra terminal.

Ejecuta:

```bash
curl http://localhost:3000
```

Deberías recibir:

```text
Bienvenido a mi primer Backend con Node.js
```

También puedes probar:

```bash
curl http://localhost:3000/about
```

Resultado:

```text
Este servidor fue creado durante la Sesión 1.
```

Esto demuestra que diferentes clientes pueden comunicarse con nuestro Backend.

---

# 26. Práctica principal

## Objetivo

Crear un servidor con los siguientes endpoints:

### 1. `GET /`

Debe responder:

```text
Bienvenido a mi primer Backend con Node.js
```

### 2. `GET /about`

Debe responder:

```text
Este servidor fue creado durante la Sesión 1.
```

### 3. `GET /contact`

Crea un tercer endpoint que responda:

```text
Página de contacto
```

---

# 27. Reto opcional

Si terminaste la actividad anterior, crea:

```text
GET /users
```

y devuelve:

```json
[
  {
    "id": 1,
    "name": "Ana"
  },
  {
    "id": 2,
    "name": "Juan"
  }
]
```

En este caso debes utilizar:

```text
Content-Type: application/json
```

y no:

```text
text/plain
```

---

# 28. Verificar el resultado

Tu proyecto debería tener:

```text
backend-session-01/
│
├── package.json
└── server.js
```

Y el servidor debería ejecutarse mediante:

```bash
node server.js
```

Debes poder probar:

```text
GET /
GET /about
GET /contact
```

Y opcionalmente:

```text
GET /users
```

---

# 29. Comandos utilizados durante la práctica

## Verificar Node.js

```bash
node --version
```

## Verificar npm

```bash
npm --version
```

## Crear carpeta

```bash
mkdir backend-session-01
```

## Entrar a la carpeta

```bash
cd backend-session-01
```

## Inicializar proyecto

```bash
npm init -y
```

## Ejecutar servidor

```bash
node server.js
```

## Detener servidor

```text
Ctrl + C
```

## Ejecutar mediante npm

Si configuraste:

```json
"scripts": {
  "start": "node server.js"
}
```

puedes ejecutar:

```bash
npm start
```

## Probar con curl

```bash
curl http://localhost:3000
```

---

# 30. Conceptos que debes recordar

| Concepto  | Significado                              |
| --------- | ---------------------------------------- |
| Node.js   | Entorno para ejecutar JavaScript         |
| npm       | Gestor de paquetes                       |
| Backend   | Parte que procesa la lógica del servidor |
| Cliente   | Quien realiza una solicitud              |
| Servidor  | Quien recibe y procesa solicitudes       |
| HTTP      | Protocolo de comunicación                |
| Request   | Solicitud del cliente                    |
| Response  | Respuesta del servidor                   |
| Endpoint  | Punto de acceso                          |
| GET       | Obtener información                      |
| localhost | Nuestra computadora                      |
| Puerto    | Punto de acceso a un servicio            |
| JSON      | Formato de intercambio de datos          |

---

# 31. Preguntas de autoevaluación

Antes de terminar, intenta responder sin consultar tus apuntes.

### 1. ¿Qué es Node.js?

### 2. ¿Qué diferencia existe entre frontend y backend?

### 3. ¿Qué es un cliente?

### 4. ¿Qué es un servidor?

### 5. ¿Qué es una Request?

### 6. ¿Qué es una Response?

### 7. ¿Qué significa `GET`?

### 8. ¿Qué significa `200`?

### 9. ¿Qué significa `404`?

### 10. ¿Qué es un endpoint?

### 11. ¿Qué significa `localhost:3000`?

### 12. ¿Qué representa `req` en Node.js?

### 13. ¿Qué representa `res`?

### 14. ¿Para qué sirve npm?

### 15. ¿Para qué sirve `package.json`?

---

# 32. Resultado esperado

Al finalizar la práctica deberías ser capaz de explicar y demostrar:

```text
Cliente
   ↓
HTTP Request
   ↓
Node.js
   ↓
Servidor HTTP
   ↓
HTTP Response
   ↓
Cliente
```

Y ejecutar correctamente tu primer Backend:

```text
http://localhost:3000
```

¡Has creado tu primer servidor con Node.js!
