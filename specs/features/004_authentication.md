# Feature 004: Autenticación de Usuarios (JWT)

## Objetivo
Permitir que los usuarios se registren y logueen en la plataforma para poder realizar compras futuras. Implementar seguridad basada en JWT.

## Backend (Spring Boot + Security)

### 1. Modelo de Datos (`User`)
* Tabla `users`: `id`, `email` (unique), `password` (hashed), `full_name`, `role` (CUSTOMER, ADMIN).
* Entidad JPA correspondiente.

### 2. Seguridad (JWT)
* **JwtService:** Componente para generar tokens firmados y validarlos.
* **SecurityConfig:** Actualizar para proteger rutas sensibles (por ahora ninguna crítica, pero preparar el terreno) y permitir acceso público a `/auth/**`.
* **PasswordEncoder:** Usar `BCrypt` para hashear contraseñas.

### 3. API Endpoints (`AuthController`)
* `POST /api/v1/auth/register`: Recibe `{email, password, fullName}`. Retorna Token JWT.
* `POST /api/v1/auth/login`: Recibe `{email, password}`. Retorna Token JWT.

## Frontend (Next.js + React Hook Form)

### 1. Páginas de Autenticación
* `/auth/login`: Formulario de inicio de sesión.
* `/auth/register`: Formulario de registro.
* **Diseño:** Centrado, minimalista, usando componentes `shadcn/ui` (Input, Button, Card, Form).

### 2. Lógica de Cliente
* **Validación:** Usar `zod` y `react-hook-form` para validar emails y contraseñas en el cliente.
* **Persistencia:** Al recibir el JWT del backend, guardarlo en `localStorage` o `Cookies` (para simplificar ahora: localStorage).
* **Navegación:** Redirigir al Home (`/`) tras un login exitoso.

## Criterios de Aceptación
* Un usuario puede crear una cuenta y recibir un token.
* Un usuario puede loguearse con credenciales válidas.
* Si la contraseña es incorrecta, el frontend muestra un error claro.