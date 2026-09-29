# Guía del docente

## Módulo 2 — Arquitectura del Back-End y Bases de Datos

## Sesión 1 — Node.js y fundamentos del Backend

**Duración:** 2 horas 15 minutos
**Producto:** Servidor HTTP básico funcionando con Node.js.

---

# 1. Propósito de la sesión

Esta primera sesión debe construir el modelo mental que utilizarán los estudiantes durante todo el módulo.

El objetivo no es convertir esta clase en una clase avanzada de Node.js.

El objetivo es que el estudiante comprenda:

```text
Cliente
   ↓
HTTP
   ↓
Backend
   ↓
Base de datos
   ↓
Backend
   ↓
HTTP
   ↓
Cliente
```

Y posteriormente pueda relacionar ese modelo con Node.js:

```text
JavaScript
     ↓
Node.js
     ↓
Servidor
```

---

# 2. Metodología

La sesión debe alternar:

```text
Explicación
    ↓
Ejemplo
    ↓
Pregunta al estudiante
    ↓
Demostración
    ↓
Explicación
    ↓
Práctica
```

Evitar una exposición exclusivamente teórica durante toda la primera hora.

---

# 3. Distribución del tiempo

| Etapa                         |      Tiempo |
| ----------------------------- | ----------: |
| Introducción                  |       5 min |
| Fundamentos de aplicación web |      20 min |
| HTTP                          |      25 min |
| API, REST, JSON y BD          |      15 min |
| Node.js y asincronía          |      20 min |
| npm y módulos                 |      15 min |
| Ejemplo guiado                |      20 min |
| Práctica                      |      10 min |
| Cierre                        |       5 min |
| **Total**                     | **135 min** |

---

# 4. Diapositiva 1 — Portada

## Explicación

Presentar el módulo y explicar que esta es la primera sesión dedicada al Backend.

Puedes introducir la pregunta:

> "Cuando ustedes escriben una dirección en el navegador y presionan Enter, ¿qué creen que sucede detrás de esa pantalla?"

Escuchar algunas respuestas.

No corregir inmediatamente todas las respuestas. Utilizar las respuestas para introducir el modelo cliente-servidor.

---

# 5. Diapositiva 2 — Objetivos

Explicar que al finalizar no se espera que sean expertos en Node.js.

Se espera que puedan:

1. Entender cómo funciona una aplicación web.
2. Entender cómo se comunican cliente y servidor.
3. Entender HTTP.
4. Entender qué papel tiene una API.
5. Crear un servidor sencillo.

### Pregunta

> "¿Qué creen que necesita un Backend para comunicarse con un frontend?"

Esperar respuestas como:

* Internet.
* HTTP.
* API.
* JSON.

---

# 6. Diapositiva 3 — ¿Cómo funciona una aplicación web?

Presentar el flujo:

```text
Usuario
↓
Frontend
↓
Request
↓
Backend
↓
Base de datos
↓
Backend
↓
Response
↓
Frontend
↓
Usuario
```

## Explicación

Usar un ejemplo conocido, por ejemplo una tienda online.

El usuario hace clic en:

> "Ver productos"

El frontend necesita obtener esos productos.

El frontend realiza una solicitud al backend.

El backend consulta la base de datos y devuelve los productos.

### Pregunta

> "¿El navegador normalmente consulta directamente la base de datos?"

Respuesta esperada:

> No. Normalmente se comunica con el backend, y el backend accede a la base de datos.

---

# 7. Diapositiva 4 — Frontend vs Backend

Explicar:

### Frontend

Se ocupa principalmente de la interfaz y la interacción.

### Backend

Se ocupa principalmente de:

* procesamiento;
* lógica;
* validación;
* datos;
* APIs.

### Importante

No presentar frontend y backend como dos mundos completamente aislados.

Explicar:

> "Ambos forman parte de la misma aplicación y se comunican entre sí."

---

# 8. Diapositiva 5 — Cliente y servidor

Explicar que el cliente normalmente inicia la comunicación.

```text
Cliente → Request → Servidor
Cliente ← Response ← Servidor
```

### Preguntar

> "¿El navegador es un cliente?"

Sí.

> "¿Postman puede ser un cliente?"

Sí.

> "¿Una aplicación móvil puede ser un cliente?"

Sí.

Esto prepara al estudiante para las futuras clases de API Testing.

---

# 9. Diapositiva 6 — ¿Qué es un servidor?

Aclarar una confusión frecuente:

> Un servidor no tiene que ser necesariamente una computadora especial.

Un servidor puede ser un programa que está esperando solicitudes.

En nuestra práctica:

```text
Computadora
   ↓
Node.js
   ↓
Servidor HTTP
```

La misma computadora puede actuar como:

```text
Cliente + Servidor
```

durante el desarrollo local.

---

# 10. Diapositiva 7 — Conceptos básicos de red

Explicar únicamente lo necesario.

### Protocolo

`http`

### Host

`localhost`

### Puerto

`3000`

### Path

`/users`

Ejemplo:

```text
http://localhost:3000/users
```

Preguntar:

> "¿Cuál es el puerto?"

3000.

> "¿Cuál es el path?"

`/users`.

---

# 11. Diapositiva 8 — localhost e IP

Explicar:

```text
localhost
```

representa nuestra propia computadora.

Habitualmente se relaciona con:

```text
127.0.0.1
```

### DEMOSTRACIÓN EN CONSOLA

**Aquí sí conviene mostrar la consola.**

En Windows:

```bash
ipconfig
```

No es necesario profundizar en todas las interfaces.

La intención es mostrar que un equipo tiene direcciones IP y que durante el desarrollo utilizaremos `localhost`.

También se puede mostrar:

```bash
ping localhost
```

Explicar que no necesitamos memorizar comandos de red para esta clase.

---

# 12. Diapositiva 9 — HTTP

Presentar HTTP como el lenguaje/protocolo de comunicación utilizado entre cliente y servidor.

```text
Request
   ↓
Servidor
   ↓
Response
```

No profundizar en TCP/IP ni en detalles de implementación.

### Pregunta

> "¿HTTP es el servidor?"

No.

> "¿HTTP es el protocolo que permite la comunicación?"

Sí.

---

# 13. Diapositiva 10 — HTTP Request

Explicar los cuatro elementos:

```text
Método
URL
Headers
Body
```

Utilizar:

```http
POST /users
Content-Type: application/json
```

```json
{
  "name": "Juan"
}
```

Explicar que no todas las requests necesitan Body.

Por ejemplo:

```text
GET /users
```

normalmente no necesita Body.

---

# 14. Diapositiva 11 — HTTP Response

Explicar:

```text
Status Code
Headers
Body
```

Ejemplo:

```http
200 OK
Content-Type: application/json
```

```json
{
  "message": "Usuarios encontrados"
}
```

### Concepto clave

La Request va del cliente al servidor.

La Response vuelve del servidor al cliente.

---

# 15. Diapositiva 12 — Métodos HTTP

No memorizar todavía todos los detalles de REST.

Utilizar una tabla sencilla:

```text
GET     → obtener
POST    → crear
PUT     → reemplazar
PATCH   → modificar
DELETE  → eliminar
```

### Pregunta rápida

> "Si quiero obtener usuarios, ¿qué método utilizaría?"

GET.

> "Si quiero crear un usuario?"

POST.

> "Si quiero eliminar al usuario 10?"

DELETE.

---

# 16. Diapositiva 13 — Headers y Body

Explicar que los headers son información adicional.

Ejemplo:

```text
Content-Type: application/json
```

El Body contiene los datos.

Ejemplo:

```json
{
  "name": "Ana"
}
```

### Aclaración

No todas las requests tienen Body.

Por ejemplo:

```text
GET /users
```

puede no tenerlo.

---

# 17. Diapositiva 14 — Content-Type

Explicar:

> Content-Type indica al receptor qué tipo de contenido está enviando.

Ejemplos:

```text
text/plain
text/html
application/json
```

Esto será especialmente importante cuando construyamos APIs.

---

# 18. Diapositiva 15 — Status Codes

Explicar primero las categorías:

```text
2xx → éxito
3xx → redirección
4xx → problema con la solicitud
5xx → problema en el servidor
```

Después los más importantes:

```text
200
201
400
401
403
404
500
```

### Pregunta

> "Si solicito un recurso que no existe, ¿qué código podríamos recibir?"

404.

> "Si el servidor tiene un error interno?"

500.

---

# 19. Diapositiva 16 — API

Explicar API con una analogía sencilla:

> Una API funciona como una interfaz que define cómo otros sistemas pueden comunicarse con nuestro sistema.

Ejemplo:

```text
Frontend
   ↓
GET /users
   ↓
API
   ↓
Backend
```

No decir que API significa simplemente "Backend".

---

# 20. Diapositiva 17 — Backend ≠ API

Este punto merece énfasis.

Explicar:

> "El Backend es el sistema que procesa las solicitudes. Una API es una interfaz que permite comunicarse con ese sistema."

Un Backend puede tener:

* lógica;
* validaciones;
* acceso a datos;
* servicios;
* APIs.

---

# 21. Diapositiva 18 — Endpoint

Definir:

> Un endpoint es un punto de acceso disponible para realizar una operación.

Ejemplos:

```text
GET /users
GET /users/10
POST /users
```

Enfatizar:

```text
Método + Ruta
```

forman parte de la identificación de una operación de API.

---

# 22. Diapositiva 19 — REST

Explicar que REST es un estilo arquitectónico.

No entrar todavía en:

* HATEOAS;
* Richardson Maturity Model;
* idempotencia profunda;
* restricciones avanzadas.

Solo queremos que el estudiante entienda:

```text
Recursos
+
URLs
+
Métodos HTTP
```

Ejemplo:

```text
GET /users
POST /users
GET /users/10
DELETE /users/10
```

---

# 23. Diapositiva 20 — JSON

Presentar JSON como formato de intercambio.

Ejemplo:

```json
{
  "id": 1,
  "name": "Juan"
}
```

Explicar:

* `{}` representa un objeto.
* `"id"` es una propiedad.
* `1` es un valor.
* `[]` representa un array.

### DEMOSTRACIÓN OPCIONAL

Abrir el navegador y mostrar una respuesta JSON de alguna API pública o utilizar posteriormente nuestro propio endpoint.

No es necesario buscar una API externa si queremos mantener la clase completamente local.

---

# 24. Diapositiva 21 — Base de datos

Explicar que la base de datos proporciona persistencia.

Ejemplo:

```text
Usuario
   ↓
Frontend
   ↓
Backend
   ↓
Base de datos
```

Preguntar:

> "Si apagamos el servidor, ¿queremos perder todos los usuarios?"

No.

La información debe estar almacenada persistentemente.

Esto prepara al estudiante para PostgreSQL y MongoDB.

---

# 25. Diapositiva 22 — Flujo completo

Esta diapositiva debe utilizarse como **resumen conceptual antes de entrar a Node.js**.

Repetir:

```text
Cliente
↓
Request
↓
Backend
↓
Base de datos
↓
Backend
↓
Response
↓
Cliente
```

### Pregunta

> "¿En qué parte entra Node.js?"

Todavía no responder inmediatamente.

Explicar:

> "Node.js será una de las tecnologías que utilizaremos para construir el Backend."

---

# 26. Diapositiva 23 — ¿Qué es Node.js?

Definición principal:

> Node.js es un entorno de ejecución que permite ejecutar JavaScript fuera del navegador.

### Explicación

JavaScript originalmente se asociaba principalmente con el navegador.

Node.js permite utilizar JavaScript para:

* servidores;
* scripts;
* herramientas;
* aplicaciones backend.

---

# 27. Diapositiva 24 — Node.js y V8

Explicar la diferencia:

### V8

Motor que ejecuta JavaScript.

### Node.js

Entorno que utiliza V8 y proporciona APIs y herramientas adicionales.

Una forma sencilla:

```text
Node.js
├── V8
├── APIs
├── módulos
└── herramientas
```

No entrar en detalles internos del motor.

---

# 28. Diapositiva 25 — Event Loop

Explicar de manera conceptual.

Node.js puede manejar operaciones asíncronas.

Por ejemplo:

```text
Solicitud
   ↓
Consultar recurso
   ↓
Esperar resultado
   ↓
Continuar cuando esté disponible
```

La palabra clave es:

> **Asincronía**

No es necesario enseñar todavía el funcionamiento interno del Event Loop.

---

# 29. Diapositiva 26 — Operaciones asíncronas

Ejemplos:

* Base de datos.
* Archivos.
* HTTP.
* Servicios externos.

Explicar:

> Muchas operaciones requieren esperar una respuesta externa.

Node.js proporciona mecanismos para trabajar con ellas de manera asíncrona.

---

# 30. Diapositiva 27 — Promises y async/await

Explicar brevemente:

```javascript
const users = await getUsers();
```

Significa conceptualmente:

> Esperar el resultado de una operación asíncrona.

No convertir esta sección en una clase de JavaScript avanzado.

---

# 31. Diapositiva 28 — npm

Presentar npm.

Explicar que sirve para administrar paquetes y dependencias.

### DEMOSTRACIÓN EN CONSOLA

Mostrar:

```bash
node --version
npm --version
```

Aquí podemos comprobar que Node.js y npm están instalados.

### Si Node.js no está instalado

No detener toda la clase.

Tener preparada la instalación previamente o continuar con una demostración.

---

# 32. Diapositiva 29 — Crear proyecto

### DEMOSTRACIÓN EN CONSOLA

Crear el proyecto en vivo:

```bash
mkdir backend-session-01
cd backend-session-01
npm init -y
```

Después mostrar:

```bash
dir
```

o:

```bash
ls
```

según el sistema.

Mostrar el archivo:

```text
package.json
```

Explicar que acabamos de inicializar un proyecto Node.js.

---

# 33. Diapositiva 30 — package.json

Abrir `package.json` en VS Code.

Explicar:

```json
{
  "name": "backend-session-01",
  "version": "1.0.0"
}
```

Después agregar:

```json
"type": "module"
```

Quedará:

```json
{
  "name": "backend-session-01",
  "version": "1.0.0",
  "type": "module"
}
```

Explicar que esto permitirá utilizar:

```javascript
import ...
```

---

# 34. Diapositiva 31 — node_modules y package-lock.json

Explicar que en este momento todavía puede no existir `node_modules`.

Esto es importante:

> No necesitamos `node_modules` para utilizar exclusivamente los módulos nativos de Node.js.

Para mostrar el concepto, podemos instalar posteriormente un paquete.

Pero no recomiendo introducir una dependencia externa solamente para crear `node_modules`.

Explicar conceptualmente:

```text
package.json
↓
Dependencias declaradas

package-lock.json
↓
Versiones concretas

node_modules
↓
Paquetes instalados
```

---

# 35. Diapositiva 32 — Scripts

Podemos agregar:

```json
"scripts": {
  "start": "node server.js"
}
```

Explicar:

```bash
npm start
```

ejecutará:

```bash
node server.js
```

### DEMOSTRACIÓN

Esta será la primera vez que ejecutaremos nuestro proyecto mediante npm.

---

# 36. Diapositiva 33 — Módulos

Explicar que Node.js permite dividir el código.

Mostrar:

### CommonJS

```javascript
const http = require("http");
```

### ES Modules

```javascript
import http from "http";
```

Indicar:

> Para nuestro curso utilizaremos ES Modules.

No profundizar en compatibilidad histórica.

---

# 37. Diapositiva 34 — Primer servidor

Esta es la parte central de la clase.

## DEMOSTRACIÓN EN VIVO

Crear:

```text
server.js
```

Escribir:

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

# 38. Explicar el código paso a paso

### `import`

```javascript
import http from "http";
```

Estamos importando el módulo HTTP de Node.js.

Aclarar:

> `http` es un módulo nativo de Node.js.

No tuvimos que ejecutar:

```bash
npm install http
```

---

### `createServer`

```javascript
http.createServer(...)
```

Crea un servidor HTTP.

---

### `req`

```javascript
(req, res)
```

`req` representa la Request.

---

### `res`

`res` representa la Response.

---

### `writeHead`

```javascript
res.writeHead(200, {
  "Content-Type": "text/plain"
});
```

Estamos enviando:

```text
Status Code: 200
Content-Type: text/plain
```

---

### `res.end`

```javascript
res.end("Hola desde Node.js");
```

Finaliza la respuesta y envía el contenido.

---

### `listen`

```javascript
server.listen(3000)
```

El servidor comienza a escuchar en el puerto 3000.

---

# 39. Ejecutar el servidor

### DEMOSTRACIÓN EN CONSOLA

Ejecutar:

```bash
node server.js
```

Mostrar:

```text
Servidor ejecutándose en http://localhost:3000
```

---

# 40. Probar desde el navegador

Abrir:

```text
http://localhost:3000
```

Explicar:

> El navegador es el cliente.

El navegador envía:

```text
GET /
```

Node.js procesa la solicitud y responde:

```text
200 OK
```

con:

```text
Hola desde Node.js
```

---

# 41. Mostrar nuevamente la relación conceptual

Volver a la diapositiva 35.

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

Preguntar:

> "¿Dónde está la Request?"

El navegador.

> "¿Dónde está la Response?"

En Node.js.

> "¿Cuál es el Status Code?"

200.

> "¿Cuál es el puerto?"

3000.

---

# 42. Demostración adicional con consola

Aquí podemos utilizar una segunda terminal.

Mientras el servidor está ejecutándose, abrir otra consola.

Opcionalmente probar:

```bash
curl http://localhost:3000
```

En Windows moderno normalmente está disponible `curl`.

Mostrar que devuelve:

```text
Hola desde Node.js
```

Esto permite demostrar algo importante:

> El navegador no es el único cliente.

---

# 43. Práctica del estudiante

El estudiante debe modificar el servidor.

## Endpoint `/`

Debe responder:

```text
Bienvenido a mi primer Backend con Node.js
```

## Endpoint `/about`

Debe responder:

```text
Este servidor fue creado durante la Sesión 1.
```

El docente debe proporcionar la estructura inicial y permitir que el estudiante realice la modificación.

---

# 44. Ayuda para la práctica

Si los estudiantes tienen dificultades, introducir primero:

```javascript
if (req.url === "/") {
   ...
}
```

y después:

```javascript
if (req.url === "/about") {
   ...
}
```

También pueden observar:

```javascript
console.log(req.method);
console.log(req.url);
```

Esto permite ver qué está enviando el navegador.

---

# 45. DEMOSTRACIÓN IMPORTANTE: Request en vivo

Para reforzar los conceptos, agregar temporalmente:

```javascript
console.log("Method:", req.method);
console.log("URL:", req.url);
```

Ejecutar:

```bash
node server.js
```

Abrir:

```text
http://localhost:3000
```

En consola aparecerá algo similar a:

```text
Method: GET
URL: /
```

Después abrir:

```text
http://localhost:3000/about
```

Y mostrar:

```text
Method: GET
URL: /about
```

Esto conecta directamente:

```text
Navegador
↓
Request
↓
req.method
req.url
```

---

# 46. Cierre

Volver al flujo:

```text
Cliente
   ↓
Request
   ↓
Backend
   ↓
Response
   ↓
Cliente
```

Y relacionarlo con lo aprendido:

```text
Cliente
   ↓
HTTP
   ↓
Node.js
   ↓
Servidor
```

---

# 47. Preguntas de comprobación

Antes de terminar, hacer preguntas rápidas:

### Pregunta 1

¿Qué es el Backend?

### Pregunta 2

¿Qué diferencia existe entre cliente y servidor?

### Pregunta 3

¿Qué es una Request?

### Pregunta 4

¿Qué es una Response?

### Pregunta 5

¿Qué significa `GET`?

### Pregunta 6

¿Qué significa `404`?

### Pregunta 7

¿Qué es un endpoint?

### Pregunta 8

¿Qué es JSON?

### Pregunta 9

¿Qué es Node.js?

### Pregunta 10

¿Qué significa `localhost:3000`?

### Pregunta 11

¿Qué representa `req`?

### Pregunta 12

¿Qué representa `res`?

---

# 48. Errores frecuentes que debe detectar el docente

## "Node.js es un lenguaje"

Corrección:

> Node.js no es un lenguaje. JavaScript es el lenguaje; Node.js es un entorno de ejecución.

---

## "API y Backend son lo mismo"

Corrección:

> Una API es una interfaz de comunicación; el Backend es el sistema que procesa la lógica y puede exponer APIs.

---

## "localhost es Internet"

Corrección:

> localhost representa nuestra propia computadora.

---

## "3000 es la IP"

Corrección:

> 3000 es el puerto.

---

## "GET siempre significa consultar una base de datos"

Corrección:

> GET expresa que queremos obtener un recurso. El Backend decidirá cómo obtenerlo.

---

## "Todos los requests tienen Body"

Corrección:

> No. Una Request puede no tener Body, como ocurre frecuentemente con GET.

---

## "Node.js reemplaza a JavaScript"

Corrección:

> Node.js permite ejecutar JavaScript fuera del navegador.

---

# 49. Conceptos que NO profundizar

Si aparecen preguntas sobre estos temas, responder brevemente y reservarlos para sesiones posteriores:

* Express.
* Middleware.
* Controllers.
* Services.
* Repositories.
* PostgreSQL.
* MongoDB.
* JWT.
* CORS.
* Variables de entorno.
* Docker.
* Arquitectura MVC.

Ejemplo:

> "Es un concepto importante y lo veremos cuando lleguemos a Express."

Esto evita que la primera clase se vuelva demasiado pesada.

---

# 50. Evidencia de aprendizaje

Al finalizar, el estudiante debería demostrar que puede:

### Conceptualmente

Explicar:

```text
Cliente
↓
HTTP Request
↓
Backend
↓
HTTP Response
↓
Cliente
```

### Técnicamente

Ejecutar:

```bash
node server.js
```

y acceder a:

```text
http://localhost:3000
```

### Prácticamente

Crear:

```text
GET /
GET /about
```

y devolver una respuesta diferente para cada endpoint.

---

# 51. Cierre de la sesión

Finalizar con:

> "Hoy aprendimos qué ocurre detrás de una aplicación web y construimos nuestro primer servidor. En las siguientes sesiones vamos a mejorar este servidor utilizando herramientas que nos permitan organizar las rutas, procesar solicitudes y construir APIs de manera profesional."

---

# 52. Conexión con la Sesión 2

Presentar brevemente:

```text
Sesión 1
Node.js
   ↓
Servidor HTTP básico
```

↓

```text
Sesión 2
Express.js
   ↓
Routing
   ↓
Middleware
   ↓
API
```

La pregunta que debe quedar planteada es:

> "¿Cómo podemos construir este Backend de una forma más organizada cuando nuestra aplicación tenga muchos endpoints?"

La respuesta será el punto de entrada para **Express.js**.
