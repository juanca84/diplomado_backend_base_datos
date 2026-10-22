# Guía del docente — Sesión 11
## Autenticación, autorización y seguridad en NestJS

**Módulo:** Arquitectura del Back-End y Bases de Datos  
**Duración:** 135 minutos  
**Proyecto integrador:** Taskflow API  
**Stack tecnológico:** NestJS, TypeScript, Prisma ORM 7, PostgreSQL, JWT, bcrypt, Jest y Supertest.

---

# 1. Propósito de la sesión

El propósito de esta sesión es acompañar al estudiante en la transformación del Taskflow API, desarrollado en las sesiones anteriores, en una API que identifique a sus usuarios y controle el acceso a sus recursos.

El estudiante ya ha trabajado con controladores, servicios, DTOs, validaciones, excepciones, PostgreSQL, Prisma y repositorios. Por ello, no se deben volver a explicar desde cero los conceptos del CRUD, sino utilizarlos para incorporar nuevas responsabilidades al sistema.

Al finalizar, se espera que el estudiante pueda registrar usuarios, autenticar sus credenciales, generar tokens JWT, proteger endpoints y verificar que cada usuario solamente pueda modificar los recursos que tiene autorizados.

## 1.1 Resultados de aprendizaje

El estudiante deberá ser capaz de:

1. Explicar la diferencia entre autenticación y autorización.
2. Implementar el registro de usuarios utilizando hashing de contraseñas.
3. Implementar un endpoint de login.
4. Generar y verificar tokens JWT.
5. Implementar Guards en NestJS.
6. Aplicar autorización basada en roles.
7. Restringir el acceso a tareas y proyectos por propietario.
8. Escribir pruebas para los principales escenarios de seguridad.

## 1.2 Conocimientos previos

Antes de comenzar, verificar que el proyecto tenga:

- NestJS y TypeScript configurados.
- PostgreSQL disponible.
- Prisma 7 funcionando con el adaptador PostgreSQL.
- Un `PrismaService` o mecanismo equivalente de acceso a Prisma.
- Módulos de tareas y proyectos.
- Repositorios para las entidades correspondientes.
- DTOs y validaciones de la sesión 10.
- Migraciones existentes y acceso a la base de datos.

**Regla para el docente:** no reemplazar la configuración existente de Prisma 7 ni reconstruir los módulos que ya funcionan. La autenticación debe integrarse en el proyecto actual.

---

# 2. Preparación del docente

## 2.1 Revisar la estructura real del proyecto

Antes de la clase, abrir el proyecto:

```powershell
cd C:\Users\Juan Carlos\dev\taskflow-api
```

Inspeccionar los archivos:

```powershell
Get-ChildItem src -Recurse
Get-Content prisma\schema.prisma
Get-Content package.json
```

Si el proyecto utiliza una ubicación diferente para el esquema, adaptar el comando correspondiente.

Identificar:

- Cómo se llama el modelo de usuario.
- Si ya existe el campo de correo electrónico.
- Si el modelo de tarea tiene un campo `userId`.
- Cómo se relacionan los proyectos con los usuarios.
- Qué métodos existen en cada Repository.
- Cómo se inicializa Prisma 7.
- Cómo se configuran las variables de entorno.

No asumir que todos los proyectos tienen el mismo esquema. Las relaciones que se implementen en clase deben coincidir con las existentes.

## 2.2 Comprobar el funcionamiento inicial

Ejecutar las pruebas y el proyecto antes de realizar cambios:

```bash
npm run
npm test
npm run start:dev
```

Los scripts pueden variar según `package.json`; si alguno no existe, utilizar el comando definido por el proyecto.

Probar los endpoints existentes en Postman. Registrar cuáles funcionan para disponer de una referencia antes de agregar la autenticación.

## 2.3 Preparar Postman

Crear una colección llamada `Taskflow API - Sesión 11` con estas solicitudes:

| Solicitud | Propósito |
|---|---|
| `POST /auth/register` | Registrar un usuario |
| `POST /auth/login` | Iniciar sesión |
| `GET /tasks` | Consultar tareas protegidas |
| `POST /tasks` | Crear una tarea protegida |
| `PATCH /tasks/:id` | Modificar una tarea propia |
| `DELETE /tasks/:id` | Eliminar una tarea propia |
| Endpoint administrativo | Comprobar permisos por rol |

Los métodos y las rutas deben adaptarse a los que tenga el proyecto. Si actualmente utiliza `PUT` en lugar de `PATCH`, conservar esa convención.

---

# 3. Distribución de la clase

| Tiempo | Actividad docente | Evidencia esperada |
|---|---|---|
| 0–15 min | Explicar autenticación, autorización y JWT | El estudiante identifica el flujo de seguridad |
| 15–45 min | Preparar usuarios, DTOs, registro y login | Registro y login funcionales |
| 45–75 min | Implementar JWT y Guards | Endpoints protegidos |
| 75–90 min | Incorporar roles y restricciones de acceso | Permisos diferenciados |
| 90–125 min | Implementar pruebas automatizadas | Pruebas de seguridad ejecutadas |
| 125–135 min | Revisión y cierre | Demostración de la solución |

El docente debe priorizar el flujo funcional completo. Si una parte requiere más tiempo, es preferible completar el registro, el login y la protección de tareas antes de ampliar los permisos administrativos.

---

# 4. Desarrollo guiado de la sesión

## Bloque 1. Introducción a la seguridad — 15 minutos

### Objetivo

Que el estudiante comprenda por qué una API CRUD no debe permitir operaciones sin identificar al usuario y comprobar sus permisos.

### Explicación del docente

Presentar el siguiente escenario:

Ana y Carlos utilizan Taskflow API. Ambos tienen tareas almacenadas en la misma base de datos.

Ana inicia sesión y consulta sus tareas. Después, Carlos intenta modificar una tarea de Ana enviando el identificador de esa tarea.

La API no debe confiar únicamente en que Carlos conoce el identificador. Debe comprobar quién realiza la solicitud y si tiene permiso para modificar el recurso.

Explicar las tres preguntas fundamentales:

1. ¿Quién realiza la solicitud? — Autenticación.
2. ¿Qué puede hacer? — Autorización.
3. ¿Sobre qué recurso puede hacerlo? — Comprobación de propiedad y permisos.

### Preguntas para los estudiantes

- ¿Qué sucedería si cualquier persona pudiera llamar a `DELETE /tasks/:id`?
- ¿Es suficiente comprobar que el usuario tiene un token válido?
- ¿Qué diferencia existe entre un usuario autenticado y un administrador?

### Resultado esperado

El estudiante entiende que JWT, los roles y la propiedad de los recursos son mecanismos relacionados, pero no intercambiables.

---

## Bloque 2. Registro y autenticación — 30 minutos

### Paso 1. Instalar las dependencias

Solicitar que los estudiantes ejecuten:

```bash
npm install @nestjs/jwt bcrypt
npm install class-validator class-transformer
npm install -D @types/bcrypt
```

Si ya están instaladas, no es necesario repetirlas.

Explicar brevemente:

- `@nestjs/jwt`: permite firmar y verificar tokens.
- `bcrypt`: permite calcular y verificar hashes de contraseñas.
- `class-validator`: permite validar los datos recibidos.
- `class-transformer`: permite transformar los datos utilizados por los DTOs.

### Paso 2. Revisar el modelo User

Abrir `prisma/schema.prisma`.

Si el modelo ya existe, modificarlo únicamente para incorporar los campos que falten. Como referencia, se necesita un identificador, nombre, correo electrónico único, hash de contraseña y rol.

Ejemplo conceptual:

```prisma
enum UserRole {
  USER
  ADMIN
}

model User {
  id           String   @id @default(cuid())
  name         String
  email        String   @unique
  passwordHash String
  role         UserRole @default(USER)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

Este ejemplo no debe copiarse sin revisar las relaciones existentes. Si `User` ya tiene relaciones con `Task` y `Project`, se deben conservar y comprobar sus campos inversos.

**Explicación importante:** el rol predeterminado debe ser `USER`. El cliente no puede asignarse a sí mismo el rol `ADMIN` durante el registro.

### Paso 3. Crear la migración

Después de ajustar el esquema:

```bash
npx prisma migrate dev --name add_user_auth
npx prisma generate
```

En Prisma 7 se debe mantener la configuración existente del proyecto, incluido `prisma7.config.ts` si esa es la configuración utilizada.

Pedir al estudiante que verifique la migración y confirme que el modelo coincide con la base de datos.

Si aparece un error, no se debe eliminar automáticamente la base de datos ni borrar migraciones anteriores. Primero se revisan el esquema, la configuración y el estado de las migraciones.

### Paso 4. Crear los módulos necesarios

Si los módulos aún no existen:

```bash
nest g module auth
nest g controller auth
nest g service auth

nest g module users
nest g service users
```

No volver a generar módulos que ya existen.

El módulo `UsersModule` proporciona acceso a los usuarios mediante `UsersService` y `UsersRepository`. El módulo `AuthModule` utiliza esos componentes para autenticar a los usuarios.

La dependencia debe seguir esta dirección:

```text
AuthController
      |
      v
  AuthService
      |
      v
  UsersService
      |
      v
 UsersRepository
      |
      v
 PrismaService
      |
      v
  PostgreSQL
```

El docente debe enfatizar que el servicio de autenticación no realiza consultas directas a Prisma si el proyecto establece que las consultas se centralizan en los repositorios.

### Paso 5. Implementar el Repository de usuarios

El Repository debe ofrecer operaciones específicas para el acceso a los datos, como:

```typescript
findByEmail(email: string)
findById(id: string)
create(data: CreateUserRepositoryInput)
```

Los nombres son ilustrativos y deben ajustarse a las convenciones del proyecto.

Ejemplo conceptual:

```typescript
async findByEmail(email: string) {
  return this.prisma.user.findUnique({
    where: { email },
  });
}
```

Explicar que esta consulta pertenece al Repository, no al controlador ni a `AuthController`.

El Repository puede devolver el hash al servicio de autenticación cuando sea necesario. Sin embargo, las respuestas HTTP nunca deben exponerlo.

### Paso 6. Implementar el registro

Crear `RegisterDto` con validaciones para nombre, correo electrónico y contraseña.

El flujo esperado en `AuthService` es:

1. Normalizar el correo electrónico.
2. Validar los datos recibidos.
3. Comprobar si ya existe el correo.
4. Generar el hash mediante `bcrypt.hash()`.
5. Crear el usuario utilizando `UsersService`.
6. Devolver únicamente información pública.

Ejemplo del cálculo del hash:

```typescript
const passwordHash = await bcrypt.hash(password, 12);
```

El valor de costo debe verificarse en el entorno de ejecución y ajustarse según los recursos disponibles.

El docente debe explicar que un hash no es una contraseña cifrada que se pueda recuperar. Durante el login se compara la contraseña recibida con el hash almacenado.

La creación del usuario debe asignar `USER` en el servidor. No debe aceptar un rol privilegiado desde el DTO público.

### Paso 7. Probar el registro

En Postman, enviar:

```http
POST /auth/register
Content-Type: application/json
```

```json
{
  "name": "Ana Pérez",
  "email": "ana@example.com",
  "password": "ClaveSegura123!"
}
```

Verificar:

- Se crea el usuario.
- El correo queda normalizado.
- La respuesta no contiene `passwordHash`.
- Un segundo registro con el mismo correo produce un error controlado.
- Una contraseña inválida es rechazada por el DTO.

**Criterio de aceptación del bloque:** el estudiante puede registrar un usuario sin almacenar contraseñas en texto plano.

### Paso 8. Implementar el login

Crear `LoginDto` y el método `login()` en `AuthService`.

El flujo debe ser:

1. Buscar al usuario por correo.
2. Rechazar al usuario inexistente con un mensaje genérico.
3. Comparar la contraseña con `bcrypt.compare()`.
4. Rechazar una contraseña incorrecta.
5. Generar un token JWT.
6. Devolver el token y los datos públicos.

La respuesta debe evitar revelar si el correo existe.

Ejemplo de solicitud:

```json
{
  "email": "ana@example.com",
  "password": "ClaveSegura123!"
}
```

La generación del token se completa en el siguiente bloque.

---

## Bloque 3. JWT y protección de endpoints — 30 minutos

### Paso 9. Configurar JWT

Registrar `JwtModule` en `AuthModule` usando `registerAsync()` y `ConfigService`.

El secreto debe leerse desde la configuración segura del proyecto. No debe escribirse directamente en el código fuente.

Variables de ejemplo:

```dotenv
JWT_SECRET="secreto-aleatorio-de-desarrollo"
JWT_EXPIRES_IN="15m"
```

Estos valores son ilustrativos. El secreto real debe ser robusto y mantenerse fuera de Git.

En el servicio, una vez validadas las credenciales, se puede generar el token:

```typescript
const accessToken = await this.jwtService.signAsync({
  sub: user.id,
  email: user.email,
  role: user.role,
});
```

Explicar el uso de `sub`: representa la identidad del usuario al que pertenece el token.

La expiración se configura al registrar `JwtModule`. El servicio no debe confiar en datos arbitrarios enviados por el cliente para definir el usuario autenticado.

### Paso 10. Comprobar el login

Ejecutar `POST /auth/login`.

La respuesta esperada tendrá una estructura semejante a:

```json
{
  "access_token": "eyJhbGciOi...",
  "token_type": "Bearer",
  "user": {
    "id": "usr_123",
    "name": "Ana Pérez",
    "email": "ana@example.com",
    "role": "USER"
  }
}
```

El token real será diferente. No se debe incluir información sensible en el payload: JWT normalmente firma el contenido, pero no lo cifra.

### Paso 11. Implementar JwtAuthGuard

Crear:

```text
src/auth/guards/jwt-auth.guard.ts
```

El Guard debe:

1. Obtener la cabecera `Authorization`.
2. Verificar el esquema `Bearer`.
3. Extraer el token.
4. Verificar firma y expiración con `JwtService`.
5. Adjuntar el usuario autenticado a la solicitud.
6. Rechazar tokens ausentes, inválidos o expirados.

El Guard debe producir `401 Unauthorized` cuando no existe una autenticación válida.

El docente puede preguntar: ¿por qué no basta con decodificar el token? Porque decodificarlo no verifica su firma. Es necesario verificarlo con `verifyAsync()`.

### Paso 12. Registrar dependencias del Guard

El Guard necesita acceso a `JwtService`, por lo que debe declararse en un módulo que importe correctamente `JwtModule`.

El estudiante debe comprobar que la inyección de dependencias de NestJS funciona y que no existen errores de resolución de proveedores.

No se debe crear manualmente una instancia de `JwtService` dentro del Guard.

### Paso 13. Proteger el controlador de tareas

En `TasksController`, aplicar `JwtAuthGuard` a las rutas que requieren autenticación.

Ejemplo:

```typescript
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  // Endpoints existentes.
}
```

Este enfoque protege todos los handlers del controlador, salvo que se implemente una excepción explícita. Si alguna ruta debe ser pública, debe definirse cuidadosamente y documentarse.

La implementación debe conservar los métodos existentes y no duplicar el CRUD.

### Paso 14. Obtener la identidad del usuario

El usuario autenticado debe identificarse a partir del token verificado, no de un `userId` libre enviado por el cliente.

Para evitar repetir código, el docente puede enseñar un decorador personalizado, por ejemplo `@CurrentUser()`, que extraiga el usuario de `request.user`.

La idea es que el controlador pase la identidad verificada al servicio:

```typescript
return this.tasksService.findAllForUser(user.sub);
```

El método y el tipo deben corresponder a la implementación real del proyecto.

**Criterio de aceptación del bloque:** un endpoint protegido responde correctamente con un token válido y rechaza una solicitud sin token.

---

## Bloque 4. Roles y propiedad de recursos — 15 minutos

Este bloque debe distinguir dos controles diferentes.

### Paso 15. Implementar los roles

Crear un decorador `@Roles()` que almacene los roles autorizados para un handler y un `RolesGuard` que lea esos metadatos mediante `Reflector`.

Ejemplo de uso:

```typescript
@Roles('ADMIN')
@UseGuards(JwtAuthGuard, RolesGuard)
@Get('admin')
getAdminData() {
  return { message: 'Acceso autorizado' };
}
```

El ejemplo es ilustrativo; el endpoint administrativo debe tener un propósito real en la aplicación.

Explicar el orden de ejecución: primero se valida el token y luego el rol.

- Sin autenticación válida: `401`.
- Autenticado, pero sin permisos: `403`.

### Paso 16. Proteger los recursos por propietario

La autorización por rol no es suficiente para las tareas y los proyectos.

Ejemplo: Ana y Carlos tienen cuentas válidas, pero Carlos no puede modificar una tarea de Ana.

La comprobación debe efectuarse en el servicio y en la operación de persistencia, utilizando la identidad del usuario autenticado.

El Repository debe filtrar por el identificador del recurso y el propietario, según el esquema real.

Para una actualización, el criterio de consulta puede incluir:

```typescript
where: {
  id: taskId,
  userId,
}
```

Esto presupone que la relación real utiliza `Task.userId`. Si el modelo emplea otra estructura, se debe adaptar.

El servicio debe interpretar el resultado y responder de forma consistente cuando el recurso no existe o no puede ser modificado. Puede utilizar `404` para evitar revelar la existencia de recursos ajenos.

**Criterio de aceptación:** un usuario no puede consultar, actualizar ni eliminar recursos de otro usuario mediante la manipulación de identificadores.

---

## Bloque 5. Seguridad y pruebas — 35 minutos

### Paso 17. Revisar la validación global

Comprobar que `main.ts` utiliza `ValidationPipe` para validar los DTOs.

Se recomienda configurar:

- `whitelist: true`
- `forbidNonWhitelisted: true`
- `transform: true`

Explicar que estos parámetros ayudan a rechazar propiedades inesperadas y a transformar los datos de entrada, pero no reemplazan la autorización.

### Paso 18. Configurar medidas de seguridad adicionales

Demostrar brevemente:

- `helmet` para cabeceras HTTP de seguridad.
- CORS limitado a los orígenes necesarios.
- Rate limiting para reducir solicitudes automatizadas.
- Variables de entorno para secretos.
- Respuestas de error que no revelen trazas ni credenciales.

No dedicar el bloque a configurar infraestructura compleja. El objetivo es reconocer los riesgos y dejar una configuración básica coherente.

### Paso 19. Preparar las pruebas

Pedir a los estudiantes que identifiquen los escenarios esenciales.

| Escenario | Resultado esperado |
|---|---|
| Registro válido | Usuario creado |
| Correo duplicado | Error controlado |
| Login válido | Token generado |
| Contraseña incorrecta | `401` |
| Solicitud protegida sin token | `401` |
| Token inválido o expirado | `401` |
| Usuario sin rol requerido | `403` |
| Usuario intenta modificar tarea ajena | Operación denegada |
| Usuario modifica su propia tarea | Operación permitida |

### Paso 20. Ejecutar pruebas unitarias

Utilizar Jest para comprobar `AuthService`, simulando el Repository y las dependencias que correspondan.

Se deben comprobar al menos:

- Las credenciales incorrectas son rechazadas.
- Un login correcto genera un token.
- Los errores del Repository se manejan de forma adecuada.
- La respuesta no incluye el hash de la contraseña.

Las pruebas unitarias deben ser independientes de la base de datos real.

### Paso 21. Ejecutar pruebas HTTP

Con Supertest, realizar solicitudes a los endpoints de la aplicación de prueba.

Verificar que el Guard rechace una solicitud sin token y acepte un token válido.

Para probar los permisos sobre recursos, preparar al menos dos usuarios con tareas distintas y comprobar que no puedan modificar los recursos del otro.

Las pruebas de integración deben utilizar un entorno y una base de datos de prueba aislados.

**Criterio de aceptación del bloque:** las pruebas de autenticación y autorización se ejecutan y producen los resultados esperados.

---

# 5. Errores frecuentes y cómo orientar al estudiante

| Error | Orientación docente |
|---|---|
| `JwtService` no puede inyectarse | Revisar `JwtModule`, `AuthModule` y los proveedores. |
| `JWT_SECRET` no está definido | Comprobar `ConfigModule`, `.env` y la configuración de entorno. |
| Prisma no reconoce un campo | Revisar el modelo real, la migración y el cliente generado. |
| Error al aplicar la migración | Inspeccionar el esquema y el estado de migraciones antes de modificar la base. |
| Se devuelve `401` con un token válido | Revisar la cabecera `Authorization`, la firma, el secreto y la expiración. |
| Se devuelve `403` para todas las solicitudes | Comprobar el rol del usuario y el orden de los Guards. |
| El usuario puede modificar tareas ajenas | Revisar que el propietario se derive del token y se incluya en la operación del Repository. |
| Se devuelve `500` al registrar un correo duplicado | Capturar el conflicto de unicidad y traducirlo a un error HTTP apropiado. |
| La respuesta expone `passwordHash` | Crear una respuesta pública explícita y no devolver directamente el objeto completo de Prisma. |
| Las pruebas fallan por datos residuales | Aislar la base de datos de pruebas y preparar el estado de cada escenario. |

El docente debe promover la lectura de los mensajes de error y la identificación de la capa donde ocurre el problema, en lugar de corregir directamente todos los archivos del estudiante.

---

# 6. Actividad evaluable de la sesión

## Consigna para el estudiante

Ampliar el Taskflow API existente con autenticación JWT y controles de autorización, conservando la arquitectura por capas y las relaciones definidas en la base de datos.

### Entregables

1. Código del módulo de autenticación.
2. DTOs para registro e inicio de sesión.
3. Registro con hash de contraseña.
4. Login con generación de JWT.
5. Guard de autenticación.
6. Guard y decorador de roles.
7. Protección de tareas y proyectos por propietario.
8. Pruebas automatizadas.
9. Evidencias de ejecución de solicitudes en Postman.
10. Migraciones nuevas, si fueron necesarias.

### Criterios de evaluación

| Criterio | Puntaje |
|---|---:|
| Registro y almacenamiento seguro de contraseñas | 20 |
| Login y emisión de JWT | 20 |
| Guards y protección de endpoints | 20 |
| Roles y autorización por propietario | 20 |
| Pruebas y manejo de errores | 15 |
| Respeto de la arquitectura por capas | 5 |
| **Total** | **100** |

### Evidencias mínimas

El estudiante debe demostrar:

- Registro de un usuario.
- Login y obtención de un token.
- Acceso a un endpoint sin token y respuesta `401`.
- Acceso con token válido.
- Rechazo de una operación administrativa sin el rol requerido.
- Intento de modificación de una tarea ajena.
- Ejecución de las pruebas automatizadas.

---

# 7. Lista de comprobación del docente

## Antes de finalizar la clase

- [ ] El registro y el login funcionan.
- [ ] Las contraseñas se almacenan como hashes.
- [ ] El JWT se firma y verifica correctamente.
- [ ] Los endpoints protegidos rechazan solicitudes sin autenticación.
- [ ] Los roles se comprueban mediante Guards.
- [ ] La propiedad de los recursos se valida.
- [ ] Los controladores no realizan consultas directas a Prisma.
- [ ] Se mantiene la configuración existente de Prisma 7.
- [ ] Las pruebas principales se ejecutan.
- [ ] El estudiante puede explicar por qué cada control es necesario.

---

# 8. Cierre pedagógico

Para concluir, solicitar que los estudiantes expliquen el recorrido de una solicitud protegida:

1. El cliente envía el token JWT.
2. El Guard verifica el token.
3. NestJS permite continuar al controlador.
4. El servicio aplica las reglas de negocio.
5. El Repository consulta o modifica la información verificando las condiciones de acceso.
6. Prisma ejecuta la operación en PostgreSQL.
7. La API devuelve la respuesta correspondiente.

La idea principal que debe quedar clara es que **la seguridad se implementa en varias capas**. JWT identifica al usuario, los Guards permiten controlar el acceso a endpoints y las reglas de negocio junto con los repositorios protegen los recursos concretos.

Una API no es segura simplemente porque utilice JWT: también debe validar entradas, restringir operaciones, proteger la información y comprobar estos comportamientos mediante pruebas.

## Referencias para preparar la clase

- NestJS — Autenticación: https://docs.nestjs.com/security/authentication
- NestJS — Autorización: https://docs.nestjs.com/security/authorization
- NestJS — Validación: https://docs.nestjs.com/techniques/validation
- NestJS — Testing: https://docs.nestjs.com/fundamentals/testing
- Prisma ORM: https://www.prisma.io/docs
- JSON Web Tokens: https://jwt.io/introduction
