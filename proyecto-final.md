# Proyecto Integrador: MovieLog API

**Módulo:** Arquitectura del Back-End y Bases de Datos

## 1. Objetivo

Desarrollar una API REST para administrar un catálogo de películas y sus reseñas, aplicando los conocimientos adquiridos durante el módulo.

## 2. Instrucciones

1. Crear el proyecto utilizando Express o NestJS y TypeScript.
2. Configurar PostgreSQL y Prisma.
3. Implementar los modelos `Movie` (Película) y `Review` (Reseña), incluyendo sus relaciones.
4. Implementar las operaciones CRUD de películas.
5. Implementar la creación y consulta de reseñas.
6. Organizar el código mediante las capas Controller, Service y Repository.
7. Validar los datos de entrada y manejar los errores adecuadamente.
8. Crear migraciones y datos iniciales (*seed*).
9. Documentar los endpoints con Swagger/OpenAPI.
10. Configurar Docker Compose y las variables de entorno.
11. Implementar un endpoint de health check y versionar las rutas mediante `/api/v1`.
12. Crear una colección Postman que permita ejecutar y verificar los endpoints implementados.
13. Registrar en el repositorio Git las evidencias de ejecución de la API REST mediante capturas de pantalla de Postman.

## 3. Modelos de datos

### Movie — Película

| Campo | Descripción |
|---|---|
| `id` | Identificador |
| `title` | Título |
| `director` | Director |
| `releaseYear` | Año de estreno |
| `genre` | Género cinematográfico |
| `createdAt` | Fecha de creación |

### Review — Reseña

| Campo | Descripción |
|---|---|
| `id` | Identificador |
| `authorName` | Nombre del autor |
| `rating` | Puntuación del 1 al 5 |
| `comment` | Comentario |
| `movieId` | Identificador de la película asociada |
| `createdAt` | Fecha de creación |

Una película puede tener muchas reseñas, mientras que cada reseña pertenece a una sola película.

## 4. Endpoints mínimos

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/v1/movies` | Registrar película |
| GET | `/api/v1/movies` | Listar películas |
| GET | `/api/v1/movies/:id` | Consultar película |
| PATCH | `/api/v1/movies/:id` | Actualizar película |
| DELETE | `/api/v1/movies/:id` | Eliminar película |
| POST | `/api/v1/movies/:id/reviews` | Crear reseña |
| GET | `/api/v1/movies/:id/reviews` | Listar reseñas de una película |
| GET | `/api/v1/health` | Verificar el estado de la API |

## 5. Requisitos técnicos

- Node.js y TypeScript.
- Express o NestJS, a elección del estudiante.
- PostgreSQL y Prisma.
- Migraciones y datos iniciales (*seed*).
- Arquitectura por capas: Controller, Service y Repository.
- DTO y validación de datos.
- Manejo adecuado de errores HTTP.
- Documentación Swagger/OpenAPI.
- Docker Compose y variables de entorno.
- Health check y versionado de la API.
- Colección Postman con las solicitudes utilizadas para verificar los endpoints.
- Evidencias gráficas de la ejecución de la API REST almacenadas en el repositorio Git.

No se requiere implementar una interfaz gráfica, autenticación ni servicios externos.

## 6. Evidencias de ejecución en Postman

El estudiante deberá crear una carpeta llamada `evidencias` en la raíz de su repositorio y almacenar las capturas de pantalla que demuestren el funcionamiento de la API REST.

Las evidencias deberán incluir, como mínimo:

1. **Health check:** respuesta exitosa del endpoint `/api/v1/health`.
2. **Crear película:** solicitud POST con respuesta satisfactoria.
3. **Listar películas:** solicitud GET mostrando los registros.
4. **Consultar película:** solicitud GET de una película específica.
5. **Actualizar película:** solicitud PATCH mostrando el resultado.
6. **Eliminar película:** solicitud DELETE mostrando la respuesta.
7. **Crear reseña:** solicitud POST para registrar una reseña asociada a una película.
8. **Consultar reseñas:** solicitud GET mostrando las reseñas registradas.

Las capturas deben mostrar el método HTTP, la URL solicitada, el código de estado HTTP y el cuerpo de la respuesta cuando corresponda.

Las imágenes deben corresponder a ejecuciones reales de la API desarrollada por el estudiante. No se aceptarán capturas de ejemplo que no correspondan al proyecto entregado.

## 7. Entregables

- Código fuente en un repositorio Git.
- Esquema de Prisma, migraciones y seed.
- Archivo Docker Compose.
- Documentación Swagger.
- Colección Postman exportada.
- Carpeta `evidencias/` con las capturas de pantalla de las ejecuciones en Postman.
- Archivo README con instrucciones de instalación, configuración y ejecución.

El repositorio deberá tener una estructura similar a la siguiente:

```text
movielog-api/
├── src/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── evidencias/
│   ├── 01-health-check.png
│   ├── 02-crear-pelicula.png
│   ├── 03-listar-peliculas.png
│   ├── 04-consultar-pelicula.png
│   ├── 05-actualizar-pelicula.png
│   ├── 06-eliminar-pelicula.png
│   ├── 07-crear-resena.png
│   └── 08-listar-resenas.png
├── postman/
│   └── MovieLog.postman_collection.json
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

La estructura es orientativa y puede adaptarse al framework elegido. El archivo `.env` con credenciales reales no debe subirse al repositorio; únicamente se incluirá `.env.example` con los nombres de las variables necesarias.

## 8. Criterios de evaluación

| Criterio | Puntaje |
|---|---:|
| Operaciones CRUD y endpoints | 20 |
| Modelos, relaciones y persistencia | 20 |
| Arquitectura por capas y Repository | 20 |
| Validaciones y manejo de errores | 20 |
| Swagger y colección Postman | 10 |
| README y evidencias de ejecución | 10 |
| Docker y configuración | (opcional)
| **Total** | **100** |

## 9. Resultado esperado

Una API REST funcional que permita administrar películas y reseñas, conectada a PostgreSQL y organizada según los principios de arquitectura backend estudiados durante el módulo.

El repositorio deberá permitir revisar el código fuente, comprender cómo ejecutar el proyecto y verificar su funcionamiento mediante la colección Postman y las capturas de pantalla entregadas.