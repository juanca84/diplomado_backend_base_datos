# Guía del estudiante — Sesión 11
## Implementación de autenticación, autorización y seguridad en Taskflow API

**Módulo:** Arquitectura del Back-End y Bases de Datos  
**Duración de referencia:** 2 horas y 15 minutos  
**Proyecto:** Taskflow API  
**Tecnologías:** NestJS, TypeScript, Prisma ORM 7, PostgreSQL, JWT, bcrypt, Jest y Supertest.

---

# 1. Objetivo de la práctica

En las sesiones anteriores desarrollaste endpoints REST para administrar tareas y proyectos utilizando NestJS, DTOs, validaciones, servicios, repositorios y PostgreSQL.

En esta sesión ampliarás el proyecto para incorporar autenticación y autorización.

Al finalizar, podrás:

- Registrar usuarios de forma segura.
- Almacenar contraseñas utilizando hashing.
- Iniciar sesión y generar tokens JWT.
- Proteger endpoints con Guards.
- Restringir operaciones según los roles de los usuarios.
- Evitar que un usuario modifique tareas de otro usuario.
- Ejecutar pruebas para verificar la seguridad de la API.

## Arquitectura que debes conservar

```text
Cliente HTTP
    |
    v
Controller
    |
    v
Service
    |
    v
Repository
    |
    v
PrismaService
    |
    v
PostgreSQL
```

Los Guards controlan el acceso antes de que se ejecute el controlador.

**Importante:** trabajarás sobre el Taskflow API existente. No debes crear otro proyecto ni reemplazar las funcionalidades implementadas en sesiones anteriores.

---

# 2. Preparar el proyecto

Abre una terminal en la carpeta del proyecto:

```powershell
cd C:\Users\Juan Carlos\dev\taskflow-backend
```

Comprueba que el proyecto funciona antes de comenzar:

```bash
npm run start:dev
```

Si tienes pruebas configuradas:

```bash
npm test
```

Revisa la estructura actual de `src/` y el archivo `prisma/schema.prisma`.

Identifica:

- El modelo `User`, si ya existe.
- El modelo `Task`.
- El modelo `Project`.
- Los repositorios existentes.
- El servicio de Prisma.
- La configuración de variables de entorno.

No elimines archivos ni migraciones existentes.

# 3. Instalar las dependencias

Ejecuta:

```bash
npm install @nestjs/jwt bcrypt
npm install class-validator class-transformer
npm install @nestjs/throttler helmet
npm install -D @types/bcrypt supertest @types/supertest
```

Estas dependencias cumplen diferentes funciones:

| Paquete | Función |
|---|---|
| `@nestjs/jwt` | Generar y verificar tokens JWT |
| `bcrypt` | Calcular y verificar hashes de contraseñas |
| `class-validator` | Validar datos recibidos |
| `class-transformer` | Transformar datos utilizados por los DTOs |
| `@nestjs/throttler` | Limitar solicitudes |
| `helmet` | Añadir cabeceras HTTP de seguridad |
| `supertest` | Probar endpoints HTTP |

NestJS normalmente ya incorpora Jest en los proyectos creados con su CLI. No reinstales sus dependencias si ya están configuradas.

# 4. Preparar el modelo de usuarios

## 4.1 Revisar `schema.prisma`

Abre el archivo `prisma/schema.prisma`.

Si el modelo `User` ya existe, debes ampliarlo, no duplicarlo.

Como referencia, el usuario necesita:

- Un identificador.
- Un nombre.
- Un correo electrónico único.
- Un hash de contraseña.
- Un rol.
- Fechas de creación y actualización.

Ejemplo de modelo:

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

Este modelo es una referencia mínima. Conserva las relaciones existentes con `Task` y `Project` y verifica que los campos inversos sean compatibles.

Por ejemplo, si las tareas pertenecen directamente a un usuario, el modelo `Task` podría contener:

```prisma
userId String
user   User   @relation(fields: [userId], references: [id])
```

En ese caso, el modelo `User` también debe incluir la relación inversa correspondiente.

Si los proyectos y tareas tienen una relación más compleja, adapta el esquema a tu diseño real.

## 4.2 Crear la migración

Una vez actualizado el esquema:

```bash
npx prisma migrate dev --name add_user_auth
npx prisma generate
```

Utiliza la configuración Prisma 7 que ya funciona en tu proyecto, incluido `prisma7.config.ts` si corresponde.

No elimines migraciones anteriores ni reinicies la base de datos para resolver errores de esquema.

**¿Por qué almacenamos `passwordHash` y no `password`?**

Porque la contraseña original no debe quedar almacenada en la base de datos. Utilizaremos bcrypt para generar un hash y comparar posteriormente las credenciales.

# 5. Crear los módulos de autenticación y usuarios

Si todavía no tienes los componentes correspondientes, ejecuta:

```bash
nest g module users
nest g service users

nest g module auth
nest g controller auth
nest g service auth
```

No vuelvas a generar componentes que ya existen.

La estructura de referencia será:

```text
src/
├── auth/
│   ├── dto/
│   │   ├── register.dto.ts
│   │   └── login.dto.ts
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   ├── decorators/
│   │   ├── current-user.decorator.ts
│   │   └── roles.decorator.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── users/
│   ├── users.repository.ts
│   ├── users.service.ts
│   └── users.module.ts
├── tasks/
├── projects/
└── app.module.ts
```

Adapta la estructura a las carpetas existentes en tu proyecto.

# 6. Implementar el Repository de usuarios

Crea `src/users/users.repository.ts`.

Este componente centraliza las consultas a PostgreSQL mediante Prisma.

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  create(data: {
    name: string;
    email: string;
    passwordHash: string;
  }) {
    return this.prisma.user.create({
      data: {
        ...data,
        role: 'USER',
      },
    });
  }
}
```

**Nota:** la importación de `PrismaService` debe coincidir con la ubicación real de tu servicio de Prisma. Si el proyecto utiliza otro nombre o un cliente generado en una ruta específica, conserva esa configuración.

El método `create()` asigna el rol `USER` desde el servidor. Así evitamos que un usuario se registre como administrador enviando un campo adicional.

# 7. Implementar UsersService

Crea o modifica `src/users/users.service.ts`.

Este servicio utiliza el Repository para acceder a los datos.

```typescript
import {
  ConflictException,
  Injectable,
} from '@nestjs/common';

import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
  ) {}

  async findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  async findById(id: string) {
    return this.usersRepository.findById(id);
  }

  async create(data: {
    name: string;
    email: string;
    passwordHash: string;
  }) {
    const existingUser =
      await this.usersRepository.findByEmail(data.email);

    if (existingUser) {
      throw new ConflictException(
        'Ya existe un usuario con ese correo electrónico.',
      );
    }

    return this.usersRepository.create(data);
  }
}
```

Esta implementación permite manejar el caso habitual de correo duplicado. Como la consulta y la inserción son operaciones separadas, también debes contemplar la restricción única de PostgreSQL para evitar conflictos de concurrencia.

En una implementación robusta, captura el error de unicidad de Prisma y conviértelo en un error HTTP controlado.

## 7.1 Configurar UsersModule

En `src/users/users.module.ts`:

```typescript
import { Module } from '@nestjs/common';

import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
```

La importación `PrismaModule` debe corresponder a la estructura de tu proyecto. Si el módulo de Prisma ya es global, la configuración puede ser diferente.

# 8. Crear el DTO de registro

Crea `src/auth/dto/register.dto.ts`.

```typescript
import {
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsString({
    message: 'El nombre debe ser texto.',
  })
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

  @IsString({
    message: 'La contraseña debe ser texto.',
  })
  @MinLength(10, {
    message: 'La contraseña debe tener al menos 10 caracteres.',
  })
  password!: string;
}
```

Bcrypt admite como máximo 72 bytes de entrada. Para evitar truncamientos, una implementación de producción debe validar ese límite en bytes, no asumir que equivale a 72 caracteres.

No incluyas `role` en este DTO. El servidor asignará el rol inicial.

# 9. Crear el DTO de login

Crea `src/auth/dto/login.dto.ts`.

```typescript
import {
  IsEmail,
  IsString,
  MaxLength,
} from 'class-validator';

export class LoginDto {
  @IsEmail({}, {
    message: 'Debe proporcionar un correo electrónico válido.',
  })
  email!: string;

  @IsString({
    message: 'La contraseña debe ser texto.',
  })
  @MaxLength(72, {
    message: 'La contraseña supera el límite admitido.',
  })
  password!: string;
}
```

El límite de longitud del ejemplo evita entradas excesivas, pero no reemplaza una validación exacta de los bytes de entrada a bcrypt.

# 10. Implementar el registro de usuarios

Crea el archivo `src/auth/auth.service.ts`.

Primero implementaremos el registro. En este paso, el servicio recibe el DTO, calcula el hash y delega la creación al servicio de usuarios.

```typescript
import {
  Injectable,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();

    const passwordHash = await bcrypt.hash(
      dto.password,
      12,
    );

    const user = await this.usersService.create({
      name: dto.name.trim(),
      email,
      passwordHash,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}
```

El método no devuelve `passwordHash`, aunque el Repository lo almacene en la base de datos.

El costo de bcrypt debe ajustarse al rendimiento del entorno. En aplicaciones reales también debes implementar una política de contraseñas y limitar intentos automatizados.

# 11. Configurar JWT

## 11.1 Variables de entorno

En `.env`, añade una variable para el secreto y otra para la expiración:

```dotenv
JWT_SECRET="reemplazar-por-un-secreto-aleatorio-seguro"
JWT_EXPIRES_IN="15m"
```

Utiliza el `DATABASE_URL` existente y no reemplaces la configuración de Prisma.

No subas secretos reales al repositorio.

## 11.2 Registrar JwtModule

En `src/auth/auth.module.ts`, configura el módulo JWT con `ConfigService`.

El proyecto debe tener `ConfigModule` configurado. Si ya lo tiene en `AppModule`, comprueba si es global antes de modificarlo.

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    ConfigModule,
    UsersModule,

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
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
```

En este ejemplo se utiliza una expiración fija de 15 minutos. Si deseas leer `JWT_EXPIRES_IN`, debes validar y tipar ese valor según la versión instalada de `@nestjs/jwt`.

Si el secreto no está configurado, la aplicación debe fallar al arrancar en lugar de utilizar una clave insegura.

# 12. Implementar el login

En `AuthService`, añade los siguientes imports:

```typescript
import {
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
```

Añade `JwtService` al constructor:

```typescript
constructor(
  private readonly usersService: UsersService,
  private readonly jwtService: JwtService,
) {}
```

Después, incorpora el método `login()`:

```typescript
async login(dto: LoginDto) {
  const email = dto.email.trim().toLowerCase();

  const user = await this.usersService.findByEmail(email);

  if (!user) {
    throw new UnauthorizedException(
      'Credenciales incorrectas.',
    );
  }

  const isValid = await bcrypt.compare(
    dto.password,
    user.passwordHash,
  );

  if (!isValid) {
    throw new UnauthorizedException(
      'Credenciales incorrectas.',
    );
  }

  const accessToken = await this.jwtService.signAsync({
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    access_token: accessToken,
    token_type: 'Bearer',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}
```

Se utiliza el mismo mensaje para el correo inexistente y la contraseña incorrecta, evitando revelar qué cuentas están registradas.

El payload del token contiene el identificador del usuario en `sub`. No debes incluir la contraseña ni su hash.

# 13. Crear AuthController

En `src/auth/auth.controller.ts`:

```typescript
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
```

Con esto tendrás dos endpoints públicos:

- `POST /auth/register`
- `POST /auth/login`

El endpoint de registro normalmente responderá `201 Created`, mientras que el login responderá `200 OK`.

# 14. Configurar la validación global

En `main.ts`, verifica que exista un `ValidationPipe` global.

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);
```

Esto permite validar los DTOs y rechazar propiedades no declaradas.

Por ejemplo, si un usuario envía `role: "ADMIN"` en el registro, la solicitud debe rechazarse porque el DTO no incluye ese campo.

# 15. Probar registro y login en Postman

## 15.1 Registro

Envía:

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

Comprueba que:

- Se crea el usuario.
- La respuesta no incluye el hash.
- El correo duplicado produce un error controlado.
- Los datos inválidos son rechazados.

## 15.2 Login

Envía:

```http
POST /auth/login
Content-Type: application/json
```

```json
{
  "email": "ana@example.com",
  "password": "ClaveSegura123!"
}
```

Copia el valor de `access_token`. Lo utilizarás para acceder a las rutas protegidas.

# 16. Implementar JwtAuthGuard

Crea `src/auth/guards/jwt-auth.guard.ts`.

Este Guard verificará el token antes de permitir el acceso al controlador.

```typescript
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

export interface AuthUser {
  sub: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export type AuthRequest = Request & {
  user: AuthUser;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<AuthRequest>();

    const authorization =
      request.headers.authorization;

    const [scheme, token] =
      authorization?.split(' ') ?? [];

    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException(
        'Debe iniciar sesión para acceder a este recurso.',
      );
    }

    try {
      request.user =
        await this.jwtService.verifyAsync<AuthUser>(
          token,
          {
            algorithms: ['HS256'],
          },
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

La verificación utiliza el secreto configurado en `JwtModule`. Además, se limita el algoritmo admitido a `HS256`.

En una aplicación de producción, valida también que los claims requeridos tengan los tipos esperados y que el usuario siga habilitado, si existe ese requisito de negocio.

# 17. Crear un decorador para obtener al usuario autenticado

Crea `src/auth/decorators/current-user.decorator.ts`.

```typescript
import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

import { AuthRequest } from '../guards/jwt-auth.guard';

export const CurrentUser = createParamDecorator(
  (
    _data: unknown,
    context: ExecutionContext,
  ) => {
    const request = context
      .switchToHttp()
      .getRequest<AuthRequest>();

    return request.user;
  },
);
```

Este decorador evita tener que extraer manualmente `request.user` en cada controlador.

Solo debe utilizarse en endpoints donde el Guard correspondiente haya verificado el token.

# 18. Proteger el controlador de tareas

En el controlador existente, importa:

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
```

Aplica el Guard:

```typescript
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  // Conservar los endpoints existentes.
}
```

Si tu proyecto tiene rutas públicas y privadas dentro del mismo controlador, aplica el Guard por método o define una estrategia explícita para distinguirlas.

Prueba `GET /tasks` en Postman sin enviar token. Debe responder `401 Unauthorized`.

Después, envía el token en la cabecera:

```http
Authorization: Bearer TU_ACCESS_TOKEN
```

El endpoint debe aceptar el token válido.

**Importante:** este paso autentica al usuario, pero todavía debes filtrar las tareas por propietario.

# 19. Restringir el acceso a las tareas por propietario

Un usuario autenticado no debe poder acceder a todas las tareas únicamente porque tiene un token válido.

Para este ejemplo, asumiremos que `Task` contiene `userId` y que cada tarea pertenece directamente a un usuario.

## 19.1 Obtener el usuario desde el token

En `TasksController`, utiliza el decorador:

```typescript
@Get()
findAll(@CurrentUser() user: AuthUser) {
  return this.tasksService.findAllForUser(user.sub);
}
```

Asegúrate de importar `Get`, `CurrentUser`, `AuthUser` y el servicio correspondiente.

El método `findAllForUser()` debe existir en el servicio y delegar en el Repository.

## 19.2 Modificar el Repository

Añade un método similar a este en el Repository de tareas:

```typescript
findAllForUser(userId: string) {
  return this.prisma.task.findMany({
    where: {
      userId,
    },
  });
}
```

Este ejemplo presupone que el campo de propietario es `Task.userId`. Si tu modelo tiene otra estructura, modifica la consulta de acuerdo con la relación real.

En `TasksService`, añade el método:

```typescript
findAllForUser(userId: string) {
  return this.tasksRepository.findAllForUser(userId);
}
```

Adapta los nombres de los servicios y repositorios a los existentes. No crees una segunda implementación del CRUD.

## 19.3 Crear tareas para el usuario autenticado

El propietario de la tarea debe proceder del token verificado.

Ejemplo:

```typescript
@Post()
create(
  @Body() dto: CreateTaskDto,
  @CurrentUser() user: AuthUser,
) {
  return this.tasksService.createForUser(
    dto,
    user.sub,
  );
}
```

El servicio debe asignar el `userId` a partir de `user.sub`, no del cuerpo de la solicitud.

El cliente no debe poder elegir arbitrariamente el propietario de sus nuevas tareas.

## 19.4 Proteger actualización y eliminación

Para modificar una tarea, el Repository debe comprobar que el identificador y el propietario coinciden.

Ejemplo conceptual:

```typescript
async updateForUser(
  taskId: string,
  userId: string,
  data: Prisma.TaskUpdateInput,
) {
  return this.prisma.task.updateMany({
    where: {
      id: taskId,
      userId,
    },
    data,
  });
}
```

Este ejemplo requiere importar el tipo `Prisma` desde el cliente generado por tu proyecto. La ruta de importación puede variar según la configuración de Prisma 7.

Como `updateMany()` devuelve un conteo, el servicio debe comprobarlo:

- Si se modificó un registro, la operación fue exitosa.
- Si no hubo coincidencias, no debe devolverse un éxito ficticio.

La misma regla debe aplicarse a la eliminación y a las consultas de tareas individuales.

Si el proyecto relaciona las tareas con un proyecto y el propietario se determina a través de este, debes verificar la autorización utilizando esa relación.

# 20. Implementar autorización por roles

Los roles permiten restringir determinadas operaciones a usuarios autorizados.

Para esta práctica utilizaremos dos roles:

- `USER`
- `ADMIN`

## 20.1 Crear Roles decorator

Crea `src/auth/decorators/roles.decorator.ts`.

```typescript
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

export type UserRole = 'USER' | 'ADMIN';

export const Roles = (...roles: UserRole[]) =>
  SetMetadata(ROLES_KEY, roles);
```

## 20.2 Crear RolesGuard

Crea `src/auth/guards/roles.guard.ts`.

```typescript
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import {
  ROLES_KEY,
  UserRole,
} from '../decorators/roles.decorator';

import { AuthRequest } from './jwt-auth.guard';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean {
    const roles =
      this.reflector.getAllAndOverride<UserRole[]>(
        ROLES_KEY,
        [
          context.getHandler(),
          context.getClass(),
        ],
      );

    if (!roles?.length) {
      return true;
    }

    const request = context
      .switchToHttp()
      .getRequest<AuthRequest>();

    if (
      !request.user ||
      !roles.includes(request.user.role)
    ) {
      throw new ForbiddenException(
        'No tiene permisos para realizar esta operación.',
      );
    }

    return true;
  }
}
```

Los dos Guards deben ejecutarse en este orden:

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
```

Primero se valida el token y luego se comprueba el rol.

## 20.3 Aplicar el rol a una ruta

Ejemplo de una ruta administrativa:

```typescript
@Roles('ADMIN')
@UseGuards(JwtAuthGuard, RolesGuard)
@Get('admin')
getAdminData() {
  return {
    message: 'Acceso autorizado',
  };
}
```

Este endpoint es ilustrativo. Debes aplicarlo a una operación administrativa real o utilizarlo como endpoint de demostración.

No basta con modificar el payload de un token manualmente. El servidor debe verificar la firma y obtener el rol desde una fuente confiable.

Además, si se requiere revocar inmediatamente permisos cambiados en la base de datos, debes comprobar los permisos actuales en el servidor en vez de confiar únicamente en el rol incluido en un token aún vigente.

# 21. Configurar medidas básicas de seguridad

En `main.ts`, puedes añadir Helmet y configurar CORS según el cliente de tu aplicación.

```typescript
import helmet from 'helmet';

app.use(helmet());

app.enableCors({
  origin: ['http://localhost:5173'],
  methods: [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
  ],
});
```

El origen utilizado es un ejemplo para desarrollo. Sustitúyelo por el origen real del frontend.

Si utilizas cookies, deberás configurar CORS y protección CSRF de acuerdo con ese mecanismo de autenticación.

Para el rate limiting, registra `ThrottlerModule` en `AppModule` y configura un `ThrottlerGuard` global o por endpoint. Aplica límites especialmente al registro y al login.

No subas `.env` con secretos al repositorio.

# 22. Pruebas de seguridad en Postman

Crea una colección con los siguientes escenarios.

| Prueba | Acción | Resultado esperado |
|---|---|---|
| 1 | Registrar un usuario válido | `201 Created` |
| 2 | Registrar el mismo correo | Error controlado |
| 3 | Login con credenciales correctas | `200 OK` y token |
| 4 | Login con contraseña incorrecta | `401` |
| 5 | Consultar tareas sin token | `401` |
| 6 | Consultar tareas con token válido | Respuesta autorizada |
| 7 | Usar un token inválido | `401` |
| 8 | Acceder a ruta administrativa como `USER` | `403` |
| 9 | Modificar una tarea propia | Operación permitida |
| 10 | Modificar una tarea ajena | Operación denegada |

Para las pruebas de propiedad, registra dos usuarios distintos y crea tareas asociadas a cada uno.

Prueba a utilizar el token de Ana para modificar una tarea de Carlos. La operación debe ser rechazada.

# 23. Pruebas automatizadas

NestJS utiliza Jest para las pruebas unitarias y permite utilizar Supertest para pruebas HTTP.

Primero revisa los scripts del proyecto:

```bash
npm run
```

Si existen los scripts habituales, puedes ejecutar:

```bash
npm test
npm run test:e2e
```

Los nombres pueden variar según `package.json`.

## 23.1 Casos unitarios

En `AuthService`, prueba:

- Login con contraseña incorrecta.
- Login con contraseña correcta.
- Usuario inexistente.
- Error al crear un usuario duplicado.
- Generación de token en un login válido.

Utiliza mocks para `UsersService`, `UsersRepository` y `JwtService`, según la unidad que estés probando.

## 23.2 Casos de integración

Prueba mediante solicitudes HTTP:

- Registro válido.
- Login válido.
- Acceso sin token.
- Token inválido o expirado.
- Acceso denegado por rol.
- Intento de modificar un recurso ajeno.

Las pruebas de integración deben utilizar una base de datos aislada y datos preparados para cada escenario. No utilices datos de producción.

# 24. Errores frecuentes

| Problema | Qué debes revisar |
|---|---|
| No se encuentra `PrismaService` | La ruta del import y el módulo que lo exporta |
| No se encuentra `JwtService` | La configuración de `JwtModule` y las dependencias del módulo |
| `JWT_SECRET` no está definido | Variables de entorno y `ConfigModule` |
| Prisma no reconoce un campo | `schema.prisma`, migración y cliente generado |
| Login devuelve `401` | Correo, contraseña y hash almacenado |
| Todas las rutas devuelven `401` | Cabecera Bearer, firma y expiración del token |
| Usuario recibe `403` inesperadamente | Rol del usuario y orden de ejecución de los Guards |
| Se puede modificar una tarea ajena | Filtro por propietario en el servicio y Repository |
| Se devuelve `500` con correo duplicado | Manejo del error de unicidad de Prisma |
| Las pruebas no son consistentes | Estado de la base de datos de pruebas y mocks |

# 25. Entrega de la actividad

Entrega los siguientes elementos:

1. Código actualizado del Taskflow API.
2. DTOs de registro e inicio de sesión.
3. Implementación del registro y login.
4. Guards de autenticación y roles.
5. Decoradores utilizados.
6. Cambios necesarios en los repositorios de tareas y proyectos.
7. Pruebas automatizadas.
8. Evidencias de las solicitudes en Postman.
9. Migraciones nuevas, si corresponde.

## Criterios de aceptación

- [ ] El registro funciona.
- [ ] Las contraseñas se almacenan mediante hashes.
- [ ] El login genera un token JWT.
- [ ] Los endpoints protegidos rechazan solicitudes sin autenticación.
- [ ] Los roles controlan el acceso a operaciones autorizadas.
- [ ] Los usuarios no pueden modificar tareas ajenas.
- [ ] Los controladores no acceden directamente a Prisma.
- [ ] La configuración de Prisma 7 se conserva.
- [ ] Las pruebas principales se ejecutan correctamente.

---

# 26. Conclusión

En esta sesión ampliaste Taskflow API para incorporar autenticación, autorización y controles de seguridad.

Recuerda las responsabilidades de cada componente:

- **Controller:** recibe solicitudes y devuelve respuestas HTTP.
- **Service:** implementa las reglas de negocio.
- **Repository:** centraliza las operaciones de persistencia.
- **Prisma:** facilita el acceso a PostgreSQL.
- **JWT:** permite verificar la identidad representada por un token.
- **Guards:** controlan si una solicitud puede continuar.
- **Roles y reglas de propiedad:** limitan las operaciones que un usuario puede realizar.

Una API segura no depende únicamente de JWT. También necesita validación, control de acceso a recursos, manejo correcto de errores y pruebas automatizadas.

## Documentación de referencia

- NestJS Authentication: https://docs.nestjs.com/security/authentication
- NestJS Authorization: https://docs.nestjs.com/security/authorization
- NestJS Validation: https://docs.nestjs.com/techniques/validation
- NestJS Testing: https://docs.nestjs.com/fundamentals/testing
- Prisma ORM: https://www.prisma.io/docs
- JSON Web Tokens: https://jwt.io/introduction
