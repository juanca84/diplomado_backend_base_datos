# Examen del Módulo 2: Arquitectura del Back-End y Bases de Datos
## Parte 1 de 2 — Preguntas 1 a 20

**Puntaje de esta parte:** 20 preguntas.  
**Puntaje total del examen completo:** 100 puntos.  
**Tiempo recomendado para el examen completo:** 60 minutos.  
**Nivel:** Intermedio–avanzado.

## Instrucciones

- Lee cuidadosamente cada pregunta.
- Selecciona una sola respuesta por pregunta.
- Cada pregunta tiene cuatro alternativas: A, B, C y D.
- No consultes las respuestas de otros estudiantes durante la evaluación.
- Registra tus respuestas en la hoja al final del documento.

---

### Pregunta 1. Node.js, Express y controladores

En una API REST desarrollada con Express, ¿cuál es la responsabilidad principal de un controlador?

A. Definir las tablas y relaciones de la base de datos.

B. Recibir la petición HTTP y coordinar la respuesta.

C. Ejecutar todas las migraciones de la base de datos.

D. Configurar las variables de entorno del sistema operativo.

---

### Pregunta 2. Métodos HTTP y códigos de estado

Una API REST recibe una petición `POST /tasks` y crea correctamente una nueva tarea. ¿Qué código HTTP es el más apropiado para indicar que el recurso fue creado?

A. `200 OK`

B. `204 No Content`

C. `201 Created`

D. `404 Not Found`

---

### Pregunta 3. Manejo de recursos inexistentes

Una API REST recibe una petición `GET /tasks/999`, pero no existe ninguna tarea con ese identificador. ¿Qué código HTTP debería devolver normalmente?

A. `201 Created`

B. `400 Bad Request`

C. `500 Internal Server Error`

D. `404 Not Found`

---

### Pregunta 4. Prisma y migraciones

¿Cuál es el propósito principal de utilizar migraciones en un proyecto que emplea Prisma y PostgreSQL?

A. Registrar y aplicar cambios versionados en la estructura de la base de datos.

B. Reemplazar todos los controladores de la API.

C. Convertir automáticamente una API REST en GraphQL.

D. Evitar la necesidad de definir modelos de datos.

---

### Pregunta 5. Bases de datos relacionales

En una base de datos relacional, ¿qué función cumple una clave foránea (*foreign key*)?

A. Garantizar que todos los campos de una tabla sean únicos.

B. Almacenar exclusivamente contraseñas cifradas.

C. Establecer una relación entre registros y ayudar a mantener la integridad referencial.

D. Reemplazar la clave primaria de todas las tablas relacionadas.

---

### Pregunta 6. Prisma Client

En una aplicación que utiliza Prisma ORM, ¿cuál es la función principal de Prisma Client?

A. Crear automáticamente las interfaces gráficas de la aplicación.

B. Proporcionar una API tipada para consultar y modificar datos mediante el código de la aplicación.

C. Sustituir el servidor HTTP de NestJS.

D. Administrar las sesiones del navegador sin configuración adicional.

---

### Pregunta 7. Arquitectura por capas

En una arquitectura por capas, ¿cuál debería ser la responsabilidad principal de la capa de servicios?

A. Definir las rutas HTTP y los parámetros de cada endpoint.

B. Dibujar los formularios de la interfaz de usuario.

C. Ejecutar exclusivamente las instrucciones de despliegue de Docker.

D. Coordinar la lógica de negocio y los casos de uso de la aplicación.

---

### Pregunta 8. Patrón Repository

¿Qué problema busca resolver principalmente el patrón Repository?

A. Encapsular el acceso a los datos y reducir el acoplamiento entre la lógica de negocio y la persistencia.

B. Evitar que una aplicación tenga servicios.

C. Reemplazar los códigos de estado HTTP por mensajes de texto.

D. Convertir cada entidad de la base de datos en un controlador.

---

### Pregunta 9. Separación de responsabilidades

Un desarrollador coloca consultas SQL o llamadas directas a Prisma en todos los controladores de una API. ¿Cuál es una consecuencia probable de esta decisión?

A. La aplicación ya no necesita una base de datos.

B. Las peticiones HTTP se convierten automáticamente en asíncronas.

C. Aumenta el acoplamiento y se dificulta mantener y probar la lógica de acceso a datos de forma independiente.

D. Se garantiza que no existan errores de persistencia.

---

### Pregunta 10. NestJS e inyección de dependencias

En NestJS, ¿qué mecanismo permite que un servicio reciba otra clase o proveedor mediante su constructor?

A. El enrutamiento estático de Express.

B. El sistema de inyección de dependencias de NestJS.

C. Las migraciones de Prisma.

D. El versionado de endpoints.

---

### Pregunta 11. Proveedores en NestJS

Un servicio necesita utilizar `TasksRepository`, pero NestJS no puede resolver esa dependencia al iniciar la aplicación. ¿Cuál podría ser la causa?

A. El endpoint no utiliza el método HTTP `GET`.

B. La base de datos contiene demasiados registros.

C. Swagger no ha generado la documentación.

D. El proveedor no está registrado o no es visible en el contexto del módulo correspondiente.

---

### Pregunta 12. Módulos de NestJS

¿Cuál es el propósito principal de un módulo en NestJS?

A. Organizar componentes relacionados y declarar proveedores, controladores e importaciones necesarias.

B. Ejecutar exclusivamente consultas SQL.

C. Reemplazar los DTO de todas las funcionalidades.

D. Almacenar directamente todas las contraseñas de los usuarios.

---

### Pregunta 13. DTO y ValidationPipe

En NestJS, ¿para qué se utilizan normalmente los DTO junto con `ValidationPipe`?

A. Para ejecutar migraciones de PostgreSQL en cada petición.

B. Para generar imágenes de Docker automáticamente.

C. Para definir la estructura esperada de los datos recibidos y validar que cumplan determinadas reglas.

D. Para evitar la necesidad de autenticación en los endpoints.

---

### Pregunta 14. Validación de peticiones

Un endpoint recibe un DTO con un campo obligatorio, pero el cliente no envía ese campo. La aplicación tiene configurada correctamente la validación mediante `ValidationPipe` y las reglas de validación correspondientes. ¿Qué debería ocurrir?

A. La aplicación debería completar siempre el campo con un valor aleatorio.

B. La petición debería rechazarse por incumplir las reglas de validación, normalmente con un código `400 Bad Request`.

C. La aplicación debería eliminar automáticamente la tabla relacionada.

D. La petición debería considerarse válida porque el cliente envió JSON.

---

### Pregunta 15. Configuración de JWT

Una API utiliza JWT para autenticar usuarios. ¿Cuál es una práctica adecuada para gestionar el secreto utilizado para firmar los tokens?

A. Publicarlo en el repositorio para que todos los desarrolladores puedan copiarlo.

B. Incluirlo directamente en el código fuente y compartirlo con los clientes.

C. Enviarlo como parte de cada respuesta HTTP para facilitar la verificación.

D. Mantenerlo en una configuración segura, como una variable de entorno protegida, y evitar exponerlo.

---

### Pregunta 16. Autenticación y autorización

¿Cuál es la diferencia entre autenticación y autorización?

A. La autenticación verifica quién es el usuario; la autorización determina qué acciones o recursos puede utilizar.

B. La autenticación administra las migraciones; la autorización crea tablas.

C. La autenticación solo se utiliza con PostgreSQL; la autorización, solo con MongoDB.

D. Ambos términos significan exactamente lo mismo.

---

### Pregunta 17. Swagger y OpenAPI

¿Cuál es el propósito de documentar una API con Swagger y OpenAPI?

A. Reemplazar la base de datos por archivos JSON.

B. Evitar que los controladores necesiten recibir peticiones HTTP.

C. Describir los endpoints, parámetros, esquemas y respuestas de la API, facilitando su comprensión y prueba.

D. Generar automáticamente todas las reglas de negocio de la aplicación.

---

### Pregunta 18. Health Check

¿Para qué sirve un endpoint de Health Check en una API?

A. Para convertir las rutas REST en consultas SQL.

B. Para informar si la aplicación o sus dependencias relevantes están operativas.

C. Para crear automáticamente usuarios administradores.

D. Para reemplazar las pruebas funcionales de la aplicación.

---

### Pregunta 19. Docker

¿Cuál es una ventaja de utilizar Docker para ejecutar una API y sus dependencias durante el desarrollo?

A. Garantiza que nunca ocurran errores de programación.

B. Elimina la necesidad de gestionar configuraciones y credenciales.

C. Convierte automáticamente cualquier base de datos relacional en una no relacional.

D. Facilita la creación de entornos reproducibles y reduce diferencias entre entornos de desarrollo y despliegue.

---

### Pregunta 20. Repository y mantenibilidad

Una aplicación utiliza una interfaz o contrato de repositorio para acceder a los datos. ¿Qué ventaja puede aportar esta decisión?

A. Permite desacoplar la lógica de negocio de los detalles de persistencia y facilita sustituir implementaciones o probar servicios.

B. Hace innecesario validar los datos recibidos por la API.

C. Garantiza que ninguna consulta a la base de datos falle.

D. Elimina la necesidad de utilizar controladores, servicios o módulos.

---

## Parte 2 de 2 — Preguntas 21 a 30

### Pregunta 21. PostgreSQL y Prisma

En Prisma 7, modificaste el modelo `Task` del esquema para agregar un campo `priority`. ¿Cuál es el flujo habitual para reflejar este cambio en una base de datos de desarrollo mediante migraciones?

A. Ejecutar únicamente `npm run start`.

B. Crear y aplicar una migración con el comando de Prisma configurado para el proyecto.

C. Modificar directamente el controlador para crear la columna.

D. Ejecutar Swagger para actualizar automáticamente la base de datos.

---

### Pregunta 22. Relaciones entre entidades

Una tarea tiene un campo `userId` que referencia a un usuario. ¿Qué ventaja ofrece definir correctamente esta relación en el modelo de datos y en PostgreSQL?

A. Permite eliminar todas las validaciones de la API.

B. Garantiza que cada usuario pueda iniciar sesión sin contraseña.

C. Ayuda a representar la relación entre tareas y usuarios y, con las restricciones adecuadas, preservar la integridad referencial.

D. Hace que todas las consultas se ejecuten sin errores.

---

### Pregunta 23. PostgreSQL y MongoDB

¿Cuál de las siguientes afirmaciones describe mejor una diferencia habitual entre PostgreSQL y MongoDB?

A. PostgreSQL es una base de datos relacional y MongoDB almacena principalmente documentos BSON.

B. MongoDB solo puede almacenar datos en tablas relacionales.

C. PostgreSQL no permite establecer relaciones entre datos.

D. MongoDB no permite consultar documentos por campos.

---

### Pregunta 24. Arquitectura por capas y Repository

En Taskflow API, `TasksService` necesita consultar tareas. ¿Cuál es la separación de responsabilidades más coherente con la arquitectura trabajada?

A. `TasksController` consulta Prisma directamente y `TasksService` solo devuelve la petición.

B. `TasksRepository` define las rutas HTTP y `TasksController` implementa las migraciones.

C. `TasksService` administra directamente las respuestas HTTP y elimina el repositorio.

D. `TasksController` recibe la petición, `TasksService` coordina la lógica de negocio y `TasksRepository` encapsula el acceso a datos.

---

### Pregunta 25. NestJS e inyección de dependencias

Un servicio de NestJS recibe una dependencia por su constructor. ¿Qué debe cumplirse normalmente para que la inyección de dependencias funcione?

A. La dependencia debe estar declarada como una variable global.

B. El proveedor debe estar registrado y disponible en el contexto de módulos, y el servicio debe declarar correctamente la dependencia.

C. La dependencia debe crearse manualmente en cada controlador.

D. El proveedor debe tener necesariamente el mismo nombre que la ruta HTTP.

---

### Pregunta 26. DTO y validaciones

Una API recibe un DTO con el campo `age` definido como número. El cliente envía el siguiente JSON:

```json
{
  "age": "veinte"
}
```

¿Cuál es la práctica más adecuada?

A. Guardar el valor sin revisarlo porque el JSON es válido.

B. Convertir siempre cualquier cadena en cero.

C. Validar el tipo y las reglas del dato en el servidor y rechazar la entrada inválida.

D. Eliminar el DTO y confiar en el frontend.

---

### Pregunta 27. Excepciones y códigos HTTP

Una petición llega correctamente al endpoint, pero el usuario no está autenticado y la ruta requiere autenticación. ¿Qué respuesta HTTP suele corresponder?

A. `401 Unauthorized`

B. `201 Created`

C. `204 No Content`

D. `301 Moved Permanently`

---

### Pregunta 28. JWT y seguridad

¿Qué afirmación sobre un JWT firmado es correcta?

A. Su contenido siempre está cifrado y nadie puede leerlo.

B. Tener un JWT significa que el usuario puede acceder a todos los recursos.

C. El token sustituye la validación de los datos recibidos.

D. La firma permite verificar la integridad y autenticidad del token, pero no cifra automáticamente su contenido.

---

### Pregunta 29. Versionado de API

¿Qué propósito tiene versionar una API, por ejemplo mediante una ruta como `/api/v1/tasks`?

A. Registrar cada consulta SQL realizada.

B. Permitir evolucionar el contrato de la API de forma controlada para reducir el impacto sobre clientes existentes.

C. Reemplazar las migraciones de la base de datos.

D. Activar automáticamente la autenticación JWT.

---

### Pregunta 30. Docker y despliegue

¿Cuál es una razón válida para usar Docker al preparar el despliegue de una API NestJS?

A. Evitar que sea necesario configurar variables de entorno.

B. Garantizar que el código esté libre de vulnerabilidades.

C. Empaquetar la aplicación y sus dependencias en una imagen para ejecutarla en un entorno reproducible.

D. Convertir automáticamente PostgreSQL en una base de datos MongoDB.

---