# Feature 013: Admin - Gestión de Clientes y Configuración

## Objetivo
Completar las secciones faltantes del panel de administración (`/admin/customers` y `/admin/settings`) para dar control total sobre los usuarios y la cuenta del administrador.

## 1. Gestión de Clientes (`/admin/customers`)

### Backend (Spring Boot)
* **Endpoint:** `GET /api/v1/admin/users`
    * **Auth:** Solo ROLE_ADMIN.
    * **Response:** Lista de usuarios registrados.
    * **Datos:** ID, Nombre, Email, Rol (USER/ADMIN), Fecha de Registro.
    * *(Opcional)*: `ordersCount` (Cantidad de compras hechas).

### Frontend (Next.js)
* **Tabla de Clientes:**
    * Columnas: Avatar (iniciales), Nombre, Email, Rol (Badge: Admin=Rojo, User=Azul), Fecha Registro.
    * **Buscador:** Input simple para filtrar por email en la tabla.
* **Acciones:** Por ahora solo visualización. (No permitiremos borrar usuarios todavía para no romper integridad de órdenes).

## 2. Configuración (`/admin/settings`)

### Backend (Spring Boot)
* **Endpoint:** `PUT /api/v1/users/change-password`
    * **Body:** `{ currentPassword, newPassword }`.
    * **Validación:** Verificar que la `currentPassword` coincida antes de encriptar y guardar la nueva.

### Frontend (Next.js)
* **Diseño:** Formulario simple en una tarjeta ("Seguridad de la Cuenta").
* **Campos:**
    * Contraseña Actual.
    * Nueva Contraseña.
    * Confirmar Nueva Contraseña.
* **Acción:** Al guardar, si es exitoso, mostrar Toast y limpiar campos.

## 3. Sidebar
* Asegurar que los links en `Sidebar.tsx` apunten correctamente a:
    * Clientes -> `/admin/customers`
    * Configuración -> `/admin/settings`