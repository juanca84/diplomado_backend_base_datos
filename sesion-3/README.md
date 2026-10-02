# Preparación de PostgreSQL y MongoDB con Docker

En esta guía prepararemos las bases de datos que utilizaremos durante la **Sesión 3 del módulo Backend y Bases de Datos**.

Utilizaremos Docker para ejecutar:

* **PostgreSQL** → Base de datos relacional.
* **MongoDB** → Base de datos NoSQL.

Cada base de datos tiene su propio archivo `docker-compose.yml`.

---

## 1. Requisitos

Antes de comenzar, debes tener instalado:

* Docker Desktop
* Git Bash o una terminal compatible

Puedes verificar que Docker esté instalado ejecutando:

```bash
docker --version
```

También puedes verificar Docker Compose:

```bash
docker compose version
```

Si ambos comandos muestran una versión, estás listo para continuar.

---

# 2. PostgreSQL

## 2.1 Estructura

La configuración de PostgreSQL se encuentra en:

```text
postgres/
└── docker-compose.yml
```

## 2.2 Levantar PostgreSQL

Primero entra a la carpeta:

```bash
cd postgres
```

Luego ejecuta:

```bash
docker compose up -d
```

La opción `-d` permite ejecutar el contenedor en segundo plano.

---

## 2.3 Verificar PostgreSQL

Para comprobar que el contenedor está ejecutándose:

```bash
docker compose ps
```

También puedes utilizar:

```bash
docker ps
```

Deberías observar un contenedor llamado:

```text
backend-postgres
```

con estado:

```text
Up
```

---

## 2.4 Datos de conexión

Los datos configurados para PostgreSQL son:

| Configuración | Valor        |
| ------------- | ------------ |
| Host          | `localhost`  |
| Port          | `5432`       |
| Database      | `backend_db` |
| Username      | `root`       |
| Password      | `root`       |

### Connection String

```text
postgresql://root:root@localhost:5432/backend_db
```

Estos datos también pueden utilizarse para conectarse desde herramientas como **DBeaver**.

---

## 2.5 Detener PostgreSQL

Para detener el contenedor:

```bash
docker compose down
```

Esto detiene y elimina el contenedor, pero **los datos se mantienen** porque PostgreSQL utiliza un volumen de Docker.

Para volver a levantarlo:

```bash
docker compose up -d
```

---

## 2.6 Eliminar PostgreSQL y sus datos

Si necesitas eliminar completamente el contenedor y los datos almacenados:

```bash
docker compose down -v
```

> ⚠️ **Importante:** `-v` elimina el volumen de Docker. Esto significa que los datos almacenados en PostgreSQL se perderán.

---

# 3. MongoDB

## 3.1 Estructura

La configuración de MongoDB se encuentra en:

```text
mongodb/
└── docker-compose.yml
```

## 3.2 Levantar MongoDB

Primero entra a la carpeta:

```bash
cd mongodb
```

Luego ejecuta:

```bash
docker compose up -d
```

---

## 3.3 Verificar MongoDB

Para comprobar que el contenedor está ejecutándose:

```bash
docker compose ps
```

También puedes utilizar:

```bash
docker ps
```

Deberías observar un contenedor llamado:

```text
backend-mongodb
```

con estado:

```text
Up
```

---

## 3.4 Datos de conexión

Los datos configurados para MongoDB son:

| Configuración | Valor        |
| ------------- | ------------ |
| Host          | `localhost`  |
| Port          | `27017`      |
| Database      | `backend_db` |

### Connection String

```text
mongodb://localhost:27017/backend_db
```

Puedes utilizar esta conexión desde **MongoDB Compass**.

---

## 3.5 Detener MongoDB

Para detener el contenedor:

```bash
docker compose down
```

Los datos se mantienen porque MongoDB utiliza un volumen de Docker.

Para volver a levantarlo:

```bash
docker compose up -d
```

---

## 3.6 Eliminar MongoDB y sus datos

Para eliminar el contenedor y el volumen:

```bash
docker compose down -v
```

> ⚠️ **Importante:** este comando elimina todos los datos almacenados en el volumen de MongoDB.

---

# 4. Verificar todos los contenedores

Desde cualquier carpeta puedes ejecutar:

```bash
docker ps
```

Si ambas bases de datos están funcionando, deberías encontrar:

```text
backend-postgres
backend-mongodb
```

También puedes utilizar:

```bash
docker ps -a
```

La diferencia es:

* `docker ps` → muestra los contenedores que están ejecutándose.
* `docker ps -a` → muestra todos los contenedores, incluidos los detenidos.

---

# 5. Detener ambas bases de datos

Como cada base de datos tiene su propio `docker-compose.yml`, debemos detenerlas desde sus respectivas carpetas.

### PostgreSQL

```bash
cd postgres
docker compose down
```

### MongoDB

```bash
cd ../mongodb
docker compose down
```

---

# 6. Flujo recomendado

Durante las clases podemos utilizar el siguiente flujo.

### Iniciar PostgreSQL

```bash
cd postgres
docker compose up -d
docker compose ps
```

### Iniciar MongoDB

Abrir otra terminal:

```bash
cd mongodb
docker compose up -d
docker compose ps
```

### Comprobar ambas

```bash
docker ps
```

### Finalizar la práctica

PostgreSQL:

```bash
cd postgres
docker compose down
```

MongoDB:

```bash
cd ../mongodb
docker compose down
```

---

## 7. Comandos principales

| Acción         | PostgreSQL               | MongoDB                  |
| -------------- | ------------------------ | ------------------------ |
| Levantar       | `docker compose up -d`   | `docker compose up -d`   |
| Verificar      | `docker compose ps`      | `docker compose ps`      |
| Detener        | `docker compose down`    | `docker compose down`    |
| Eliminar datos | `docker compose down -v` | `docker compose down -v` |

> **Nota:** Los comandos son iguales porque ambos servicios utilizan Docker Compose. La diferencia está en la carpeta desde donde ejecutamos los comandos.
