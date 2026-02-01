# Feature 010: Admin Dashboard & Gestión de Órdenes

## Objetivo
Crear un panel de administración protegido (`/admin`) donde el administrador pueda ver métricas clave y gestionar todas las órdenes recibidas.

## Requerimientos Backend (Spring Boot)

### 1. Seguridad (Roles)
* **Configuración:** Asegurar que las rutas `/api/v1/admin/**` requieran el rol `ADMIN`.
* **Data Seeding:** Crear un usuario Admin por defecto al iniciar la app (si no existe).
    * Email: `admin@3dencasa.com`
    * Pass: `admin123`
    * Role: `ADMIN`

### 2. Endpoints Admin (`AdminOrderController`)
* `GET /api/v1/admin/orders`: Retorna todas las órdenes del sistema (paginadas).
* `GET /api/v1/admin/stats`: Retorna métricas simples (Total vendido, Cantidad de órdenes, Productos sin stock).
* `PATCH /api/v1/admin/orders/{id}/status`: Permite cambiar el estado de una orden (ej: de PENDING a SHIPPED).

## Requerimientos Frontend (Next.js)

### 1. Protección de Rutas (Middleware)
* Crear lógica para proteger `/admin`. Si el usuario no es Admin, redirigir a `/` o `/auth/login`.

### 2. Admin Layout (`src/app/admin/layout.tsx`)
* Diseño distinto al de la tienda pública.
* **Sidebar Lateral Fijo:**
    * Logo.
    * Links: Dashboard, Órdenes, Productos (Futuro), Clientes, Configuración.
    * Botón "Volver a la Tienda".

### 3. Pantalla Dashboard (`src/app/admin/page.tsx`)
* **Tarjetas de KPI:**
    * "Ingresos Totales" (Suma de ventas).
    * "Órdenes Pendientes" (Número).
    * "Productos Activos".
* **Gráfico Simple (Opcional):** Barras de ventas últimos 7 días (usar `recharts` si es posible, o solo texto por ahora).

### 4. Pantalla de Órdenes (`src/app/admin/orders/page.tsx`)
* **Tabla Avanzada:**
    * Columnas: ID, Cliente (Email), Fecha, Estado (Select editable), Total, Acciones.
    * **Acción:** Al cambiar el estado en el Select, llamar al endpoint `PATCH` para actualizarlo real-time.