# Módulo 2: Arquitectura del Back-End y Bases de Datos
## Sesión 11: Autenticación, autorización y seguridad en NestJS

**Duración:** 2 horas y 15 minutos (135 minutos)  
**Proyecto:** Taskflow API  
**Tecnologías:** NestJS, TypeScript, Prisma ORM 7, PostgreSQL, JWT, bcrypt, Jest y Supertest.

---

## Diapositiva 1. Objetivos de aprendizaje

Al finalizar la sesión, el estudiante será capaz de:

- Implementar autenticación mediante usuario y contraseña.
- Almacenar contraseñas de forma segura utilizando hashing.
- Generar y validar tokens JWT.
- Proteger endpoints mediante Guards.
- Implementar autorización basada en roles.
- Restringir el acceso a tareas y proyectos según su propietario.
- Mantener la arquitectura Controller → Service → Repository.
- Verificar la seguridad de los endpoints mediante pruebas.

## Diapositiva 2. Agenda de la sesión

| Bloque | Contenido | Tiempo |
|---|---|---:|
| 1 | Autenticación, autorización y JWT | 15 min |
| 2 | Usuarios, registro y login | 30 min |
| 3 | JWT, Guards y roles | 30 min |
| 4 | Seguridad de la API | 15 min |
| 5 | Pruebas unitarias y de integración | 35 min |
| 6 | Repaso y cierre | 10 min |
| **Total** | | **135 min** |

## Diapositiva 3. ¿Qué problema resuelve la autenticación?

Hasta ahora, Taskflow API permite administrar tareas y proyectos mediante endpoints REST.

Sin autenticación, cualquier cliente que pueda acceder a esos endpoints podría intentar consultar o modificar información sin demostrar su identidad.

La autenticación permite responder:

**¿Quién está realizando esta solicitud?**

La autorización permite responder:

**¿Qué operaciones puede realizar ese usuario?**

Ejemplo:

- Ana inicia sesión y recibe un token.
- Ana consulta sus tareas.
- Ana intenta modificar una tarea de otro usuario.
- La API comprueba la identidad y la propiedad del recurso antes de permitir la operación.

## Diapositiva 4. Autenticación y autorización

### Autenticación

Verifica la identidad de quien realiza una solicitud.

Ejemplo: usuario y contraseña válidos.

### Autorización

Determina qué recursos y operaciones puede utilizar el usuario autenticado.

Ejemplo: un usuario puede editar sus propias tareas, mientras que un administrador puede tener permisos adicionales.

**Importante:** autenticar correctamente a un usuario no significa que tenga permiso para acceder a todos los recursos.

## Diapositiva 5. ¿Qué es JWT?

JWT significa *JSON Web Token*.

Es un formato de token utilizado para transmitir información mediante una estructura firmada.

Un JWT suele tener tres partes:

```text
header.payload.signature
```

- **Header:** indica el tipo de token y el algoritmo utilizado.
- **Payload:** contiene las declaraciones o claims, como el identificador del usuario.
- **Signature:** permite verificar que el contenido no haya sido alterado.

Ejemplo conceptual de payload:

```json
{
  "sub": "usr_123",
  "email": "ana@example.com",
  "role": "USER"
}
```

El payload normalmente está codificado, no cifrado. No debemos incluir contraseñas ni datos sensibles en él.

## Diapositiva 6. Flujo de autenticación

```mermaid
sequenceDiagram
    participant C as Cliente
    participant A as AuthController
    participant S as AuthService
    participant R as UserRepository
    participant DB as PostgreSQL

    C->>A: POST /auth/login
    A->>S: Validar credenciales
    S->>R: Buscar usuario por email
    R->>DB: Consultar usuario
    DB-->>R: Usuario y passwordHash
    R-->>S: Usuario encontrado
    S->>S: Comparar contraseña
    S->>S: Generar JWT
    S-->>A: Token de acceso
    A-->>C: 200 OK + access_token
```

Si las credenciales son incorrectas, el servidor devuelve `401 Unauthorized` sin revelar si el correo electrónico existe.

## Diapositiva 7. Arquitectura del proyecto

Mantendremos la separación de responsabilidades.

```text
src/
├── auth/
│   ├── dto/
│   │   ├── login.dto.ts
│   │   └── register.dto.ts
│   ├── guards/
│   │   └── jwt-auth.guard.ts
│   ├── decorators/
│   │   └── roles.decorator.ts
│   ├── strategies/
│   │   └── [opcional]
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── users/
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── users.repository.ts
│   └── users.module.ts
├── tasks/
├── projects/
├── prisma/
└── app.module.ts
```

La carpeta `prisma/` puede estar ubicada en la raíz del proyecto según la estructura ya creada.

Responsabilidades:

- **Controller:** recibe solicitudes HTTP.
- **Service:** implementa las reglas de negocio.
- **Repository:** consulta y modifica datos.
- **Prisma:** ejecuta operaciones sobre PostgreSQL.
- **Guard:** verifica si la solicitud tiene autorización para continuar.

## Diapositiva 8. Preparar las dependencias

Desde la raíz del proyecto Taskflow API:

```bash
npm install @nestjs/jwt bcrypt
npm install class-validator class-transformer
npm install @nestjs/throttler helmet
npm install -D @types/bcrypt supertest @types/supertest
```

Si las dependencias de validación ya fueron instaladas en sesiones anteriores, no es necesario reinstalarlas.

Usaremos `@nestjs/jwt` para firmar y verificar tokens, y `bcrypt` para almacenar hashes de contraseñas.

No es necesario instalar Passport si implementamos nuestro propio Guard con `JwtService`.

## Diapositiva 9. Configuración de variables de entorno

En el archivo `.env`:

```dotenv
DATABASE_URL="postgresql://usuario:password@localhost:5432/taskflow"

JWT_SECRET="reemplazar-por-un-secreto-aleatorio-seguro"
JWT_EXPIRES_IN="15m"
```

Consideraciones:

- Usar el `DATABASE_URL` que ya funciona en el proyecto.
- Generar un secreto aleatorio robusto.
- No guardar secretos reales en Git.
- No utilizar valores de ejemplo en producción.
- No modificar la configuración de Prisma 7 que ya funciona.

La configuración de Prisma y la de JWT cumplen propósitos diferentes.

## Diapositiva 10. Modelo de usuario

Si el proyecto ya tiene un modelo `User`, debemos adaptarlo en lugar de duplicarlo.

Ejemplo de campos necesarios:

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

  tasks        Task[]
  projects     Project[]
}
```

Las relaciones `tasks` y `projects` deben coincidir con los campos y las relaciones reales de los modelos existentes. Si ya están definidas, se conservan sus nombres y cardinalidades.

**No se debe guardar la contraseña original.** El campo `passwordHash` almacena el hash generado por bcrypt.

Después de modificar el esquema:

```bash
npx prisma migrate dev --name add_user_auth
npx prisma generate
```

Estos comandos deben ejecutarse después de adaptar las relaciones y comprobar el esquema completo. No hay que reemplazar migraciones anteriores.

## Diapositiva 11. Crear el módulo de autenticación

Generar los componentes principales:

```bash
nest g module auth
nest g controller auth
nest g service auth
```

Si el módulo de usuarios ya existe, se reutiliza.

El módulo de autenticación dependerá de:

- `UsersModule`, para acceder a los usuarios.
- `JwtModule`, para generar tokens.
- `ConfigModule`, para leer la configuración.
- `AuthService`, para las reglas de registro e inicio de sesión.

No es responsabilidad del controlador consultar directamente PostgreSQL.

## Diapositiva 12. Registro de usuarios

Endpoint:

```http
POST /auth/register
Content-Type: application/json
```

Ejemplo de solicitud:

```json
{
  "name": "Ana Pérez",
  "email": "ana@example.com",
  "password": "ClaveSegura123!"
}
```

Flujo:

1. Validar los datos de entrada.
2. Normalizar el correo electrónico.
3. Verificar si ya existe un usuario con ese correo.
4. Calcular el hash de la contraseña.
5. Crear el usuario mediante el Repository.
6. Devolver información pública, nunca el hash.

Respuesta ilustrativa:

```json
{
  "id": "usr_123",
  "name": "Ana Pérez",
  "email": "ana@example.com",
  "role": "USER"
}
```

Código conceptual en el servicio:

```typescript
const passwordHash = await bcrypt.hash(password, 12);

const user = await this.usersService.create({
  name,
  email: email.trim().toLowerCase(),
  passwordHash,
  role: 'USER',
});
```

El cliente no debe decidir el rol durante el registro público. El servidor asigna `USER` por defecto.

El valor de `12` es un costo inicial de bcrypt que debe ajustarse y probarse en el entorno de ejecución.

## Diapositiva 13. DTO para el registro

Archivo `register.dto.ts`:

```typescript
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class RegisterDto {
  @IsString({ message: 'El nombre debe ser texto.' })
  @MinLength(2, {
    message: 'El nombre debe tener al menos 2 caracteres.',
  })
  @MaxLength(100, {
    message: 'El nombre no puede superar los 100 caracteres.',
  })
  name!: string;

  @IsEmail({}, {
    message: 'Debe proporcionar un correo electrónico válido.',
  })
  email!: string;

  @IsString({ message: 'La contraseña debe ser texto.' })
  @MinLength(10, {
    message: 'La contraseña debe tener al menos 10 caracteres.',
  })
  @MaxLength(72, {
    message: 'La contraseña no puede superar los 72 bytes de entrada de bcrypt.',
  })
  password!: string;
}
```

Nota: bcrypt tiene un límite de 72 bytes de entrada, no necesariamente 72 caracteres. En producción se debe validar ese límite correctamente y evitar truncamientos silenciosos.

Las reglas de validación deben aplicarse con un `ValidationPipe`.

## Diapositiva 14. Inicio de sesión

Endpoint:

```http
POST /auth/login
Content-Type: application/json
```

Solicitud:

```json
{
  "email": "ana@example.com",
  "password": "ClaveSegura123!"
}
```

Responsabilidades de `AuthService`:

1. Buscar al usuario mediante su correo.
2. Comparar la contraseña con `bcrypt.compare()`.
3. Rechazar credenciales incorrectas.
4. Generar el token JWT.
5. Devolver el token y los datos públicos del usuario.

Ejemplo de comparación:

```typescript
const isValid = await bcrypt.compare(
  password,
  user.passwordHash,
);

if (!isValid) {
  throw new UnauthorizedException(
    'Credenciales incorrectas.',
  );
}
```

Si el usuario no existe, también se devuelve el mismo mensaje genérico.

## Diapositiva 15. Generación del token

Una vez validada la contraseña:

```typescript
const accessToken = await this.jwtService.signAsync({
  sub: user.id,
  email: user.email,
  role: user.role,
});
```

El `sub` identifica al sujeto del token, en este caso, al usuario.

La expiración se configura en `JwtModule` usando `JWT_EXPIRES_IN`.

Respuesta:

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

El token debe transmitirse mediante HTTPS en los entornos desplegados.

## Diapositiva 16. Configurar JwtModule

En `auth.module.ts`, registrar el módulo JWT utilizando `ConfigService`:

```typescript
JwtModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    secret: config.getOrThrow<string>('JWT_SECRET'),
    signOptions: {
      expiresIn: '15m',
      algorithm: 'HS256',
    },
  }),
});
```

Este fragmento forma parte de los `imports` del módulo. El ejemplo utiliza una expiración fija; puede configurarse a partir de `JWT_EXPIRES_IN` con el tipo correspondiente de la versión instalada.

No se debe permitir que el servidor arranque con un secreto ausente o débil.

## Diapositiva 17. ¿Qué es un Guard?

Un Guard es un componente de NestJS que decide si una solicitud puede continuar hacia el controlador.

A diferencia de un middleware, un Guard tiene acceso al contexto de ejecución de NestJS, incluidos los metadatos de los handlers.

En Taskflow API lo utilizaremos para:

- Extraer el token Bearer.
- Verificar su firma.
- Comprobar su expiración.
- Identificar al usuario autenticado.
- Rechazar solicitudes sin credenciales válidas.

Un Guard de autenticación no sustituye la autorización sobre la propiedad de una tarea o un proyecto.

## Diapositiva 18. Crear JwtAuthGuard

Archivo `src/auth/guards/jwt-auth.guard.ts`:

```typescript
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

type AuthUser = {
  sub: string;
  email: string;
  role: 'USER' | 'ADMIN';
};

type AuthRequest = Request & {
  user: AuthUser;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<AuthRequest>();

    const authorization = request.headers.authorization;
    const [scheme, token] = authorization?.split(' ') ?? [];

    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException(
        'Debe iniciar sesión para acceder a este recurso.',
      );
    }

    try {
      request.user = await this.jwtService.verifyAsync<AuthUser>(
        token,
        { algorithms: ['HS256'] },
      );
    } catch {
      throw new UnauthorizedException(
        'El token es inválido o ha expirado.',
      );
    }

    return true;
  }
}
```

La clave de verificación debe proceder de la misma configuración segura usada para firmar el token.

En un proyecto real, conviene definir un tipo compartido para el usuario autenticado y verificar también que los claims requeridos tengan la estructura esperada.

## Diapositiva 19. Proteger un endpoint

Ejemplo en `tasks.controller.ts`:

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Get()
findAll(@Req() req: AuthRequest) {
  return this.tasksService.findAllForUser(req.user.sub);
}
```

El método `findAllForUser()` debe implementarse en el servicio y apoyarse en el Repository para filtrar las tareas por propietario.

La ruta debe protegerse desde el controlador o el handler según el alcance deseado.

**Resultado:** las solicitudes sin token válido reciben `401 Unauthorized`.

## Diapositiva 20. Usar el usuario autenticado

No debemos confiar en un `userId` enviado libremente por el cliente para determinar a quién pertenecen los recursos.

Incorrecto:

```json
{
  "title": "Preparar informe",
  "userId": "usr_999"
}
```

si el servidor utiliza directamente ese identificador sin verificar los permisos.

Correcto:

```typescript
const userId = request.user.sub;

return this.tasksService.create({
  ...dto,
  userId,
});
```

El identificador procede del token verificado. Si la aplicación admite que un administrador cree recursos para terceros, debe existir una regla de autorización explícita para esa operación.

## Diapositiva 21. Autorización basada en roles

Los roles permiten agrupar permisos.

Ejemplo para Taskflow:

| Rol | Permisos ilustrativos |
|---|---|
| `USER` | Administrar sus propias tareas y proyectos. |
| `ADMIN` | Acceder a operaciones administrativas autorizadas. |

Un rol no concede automáticamente acceso a todos los recursos.

Incluso un usuario con rol `USER` debe demostrar que es propietario de la tarea que quiere editar.

Para este ejemplo utilizaremos:

- Un decorador `@Roles()`.
- Un `RolesGuard`.
- Los roles almacenados en la base de datos e incorporados al token al iniciar sesión.

## Diapositiva 22. Decorador Roles

Archivo `src/auth/decorators/roles.decorator.ts`:

```typescript
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

export type UserRole = 'USER' | 'ADMIN';

export const Roles = (...roles: UserRole[]) =>
  SetMetadata(ROLES_KEY, roles);
```

Uso:

```typescript
@Roles('ADMIN')
@UseGuards(JwtAuthGuard, RolesGuard)
@Delete('users/:id')
removeUser() {
  // Operación administrativa autorizada.
}
```

El ejemplo muestra la declaración de permisos; el método real debe implementar la eliminación conforme a las reglas del proyecto.

## Diapositiva 23. Implementar RolesGuard

Archivo `src/auth/guards/roles.guard.ts`:

```typescript
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, UserRole } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!roles?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as { role?: UserRole } | undefined;

    if (!user || !roles.includes(user.role as UserRole)) {
      throw new ForbiddenException(
        'No tiene permisos para realizar esta operación.',
      );
    }

    return true;
  }
}
```

Los Guards se ejecutan en el orden en que se registran: primero `JwtAuthGuard` y luego `RolesGuard`.

El módulo debe importar y registrar las dependencias necesarias, y los usuarios autenticados deben disponer de un rol válido.

## Diapositiva 24. Diferencia entre 401 y 403

| Código | Significado | Ejemplo |
|---|---|---|
| `200 OK` | Solicitud procesada correctamente. | Consulta autorizada. |
| `201 Created` | Recurso creado. | Registro exitoso. |
| `400 Bad Request` | Datos inválidos. | DTO incorrecto. |
| `401 Unauthorized` | Falta autenticación válida. | Token ausente o expirado. |
| `403 Forbidden` | Usuario autenticado sin permiso. | Usuario sin rol administrativo. |
| `404 Not Found` | Recurso inexistente o cuya existencia no se revela. | Tarea no accesible. |
| `409 Conflict` | Conflicto con el estado del recurso. | Correo electrónico duplicado. |

Las respuestas deben ser coherentes y no revelar información sensible.

## Diapositiva 25. Protección de tareas y proyectos

La autenticación no basta para impedir que un usuario modifique recursos de otros usuarios.

Supongamos:

- Ana tiene la tarea `task-1`.
- Carlos tiene la tarea `task-2`.
- Carlos intenta actualizar `task-1`.

La API debe verificar la propiedad en la consulta o en una operación transaccional adecuada.

Ejemplo conceptual del Repository:

```typescript
async updateForUser(
  taskId: string,
  userId: string,
  data: Prisma.TaskUpdateInput,
) {
  const result = await this.prisma.task.updateMany({
    where: {
      id: taskId,
      userId,
    },
    data,
  });

  return result;
}
```

Este ejemplo supone que `Task.userId` es el campo de propietario y que el tipo de `id` coincide con el esquema real.

Como `updateMany()` devuelve un conteo y no el objeto actualizado, el servicio debe comprobar el resultado y definir cómo responder cuando no hay coincidencias.

Para operaciones que deben devolver el recurso modificado, se puede usar otra estrategia de actualización con una condición de propiedad adecuada.

## Diapositiva 26. Seguridad adicional de la API

### Validación de entradas

Configurar `ValidationPipe` global con `whitelist: true` y `forbidNonWhitelisted: true`.

### Rate limiting

Aplicar límites de solicitudes, especialmente al login y al registro, para dificultar ataques automatizados.

### Helmet

Utilizar cabeceras HTTP de seguridad mediante `helmet`.

### CORS

Permitir únicamente los orígenes necesarios para los clientes de la aplicación.

### Manejo de errores

No exponer trazas, secretos, contraseñas ni detalles internos de PostgreSQL.

### Secretos

Mantener las variables sensibles fuera del repositorio y utilizar un mecanismo seguro de configuración en producción.

## Diapositiva 27. Configuración global en NestJS

Ejemplo en `main.ts`:

```typescript
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: false,
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
```

El origen de CORS es ilustrativo y debe adaptarse al cliente real. Si se utilizan cookies para autenticación, las opciones de CORS y la protección CSRF requieren una configuración diferente.

Para habilitar rate limiting con `@nestjs/throttler`, se debe registrar `ThrottlerModule` y configurar el guard correspondiente en `AppModule` o en los endpoints pertinentes.

## Diapositiva 28. Testing en NestJS

Las pruebas permiten verificar que el comportamiento implementado coincide con los requisitos.

### Pruebas unitarias

Comprueban una unidad aislada, como `AuthService`, utilizando mocks de repositorios y servicios.

### Pruebas de integración

Comprueban la colaboración entre componentes.

### Pruebas HTTP

Comprueban el comportamiento de los endpoints utilizando Supertest.

En esta sesión nos concentraremos en:

- Login con credenciales válidas.
- Login con credenciales incorrectas.
- Acceso a endpoints sin token.
- Acceso con token válido.
- Rechazo de usuarios sin el rol requerido.
- Restricciones sobre tareas de otros usuarios.

## Diapositiva 29. Ejemplos de pruebas unitarias

Ejemplo conceptual para `AuthService`:

```typescript
describe('AuthService', () => {
  it('debe rechazar credenciales incorrectas', async () => {
    // Preparar un usuario simulado.
    // Configurar bcrypt.compare para devolver false.
    // Ejecutar el login.
    // Comprobar que se produce UnauthorizedException.
  });

  it('debe generar un token cuando las credenciales son válidas', async () => {
    // Preparar un usuario simulado.
    // Configurar bcrypt.compare para devolver true.
    // Simular la generación del token.
    // Comprobar que se devuelve access_token.
  });
});
```

Estos son esquemas de pruebas, no pruebas ejecutables completas. Los mocks deben ajustarse a los métodos reales del servicio y del Repository.

No se debe utilizar una base de datos de producción para pruebas automatizadas.

## Diapositiva 30. Pruebas de integración HTTP

Con Supertest podemos comprobar la API:

```typescript
describe('AuthController (e2e)', () => {
  it('POST /auth/login debe rechazar credenciales inválidas', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'ana@example.com',
        password: 'incorrecta',
      })
      .expect(401);
  });
});
```

Este ejemplo requiere inicializar `app` en el `beforeAll`, preparar una base de datos de pruebas y garantizar que el usuario y las credenciales de la prueba estén en el estado esperado.

Las pruebas de integración deben ejecutarse en un entorno aislado.

## Diapositiva 31. Laboratorio práctico

### Actividad: asegurar Taskflow API

Los estudiantes deben:

1. Revisar el modelo `User` existente y sus relaciones con `Task` y `Project`.
2. Añadir o verificar el almacenamiento de `passwordHash` y el rol.
3. Crear DTOs de registro e inicio de sesión.
4. Implementar el registro con bcrypt.
5. Implementar el login y la emisión de JWT.
6. Crear `JwtAuthGuard`.
7. Proteger los endpoints de tareas y proyectos.
8. Implementar autorización basada en roles.
9. Comprobar la propiedad de los recursos.
10. Escribir y ejecutar pruebas de autenticación y autorización.

La práctica debe realizarse sobre el proyecto existente y conservar las migraciones, los servicios y los repositorios ya creados.

## Diapositiva 32. Criterios de aceptación

La actividad se considera completada cuando:

- [ ] Un usuario puede registrarse con datos válidos.
- [ ] El sistema rechaza correos duplicados.
- [ ] La base de datos no almacena contraseñas en texto plano.
- [ ] Un usuario puede iniciar sesión con credenciales válidas.
- [ ] Las credenciales incorrectas producen `401`.
- [ ] Los endpoints protegidos rechazan tokens ausentes o inválidos.
- [ ] Los tokens expirados no permiten acceder.
- [ ] Los roles restringen las operaciones administrativas.
- [ ] Un usuario no puede modificar tareas de otro usuario.
- [ ] Los controladores no contienen consultas directas a Prisma.
- [ ] Las pruebas principales de autenticación y autorización pasan.

## Diapositiva 33. Repaso final

Preguntas para el grupo:

1. ¿Cuál es la diferencia entre autenticación y autorización?
2. ¿Por qué no debemos almacenar contraseñas en texto plano?
3. ¿Qué información contiene un JWT y qué información no debería contener?
4. ¿Cuál es la función de un Guard?
5. ¿En qué se diferencian los errores `401` y `403`?
6. ¿Por qué un token válido no garantiza que el usuario pueda editar cualquier tarea?
7. ¿Qué responsabilidad tiene el Repository en esta arquitectura?
8. ¿Qué pruebas son necesarias para validar la seguridad de una API?

### Cierre

Una API segura no depende únicamente de JWT. Necesita validación de datos, autenticación, autorización, comprobación de propiedad de los recursos, manejo correcto de errores y pruebas automatizadas.

El objetivo es que Taskflow API evolucione de una API CRUD funcional a una API que controle quién puede acceder a cada operación y recurso.

---

## Referencias técnicas

- Documentación de NestJS: https://docs.nestjs.com/security/authentication
- Autorización en NestJS: https://docs.nestjs.com/security/authorization
- Validación en NestJS: https://docs.nestjs.com/techniques/validation
- Testing en NestJS: https://docs.nestjs.com/fundamentals/testing
- Documentación de Prisma ORM: https://www.prisma.io/docs
- JWT: https://jwt.io/introduction
