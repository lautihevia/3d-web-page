# Feature 011: Gestión de Productos (ABM) y Cloudinary

## Objetivo
Implementar el módulo de administración de productos (`/admin/products`), permitiendo listar, crear y eliminar productos, con integración de imágenes en la nube.

## Requerimientos Backend (Spring Boot)

### 1. Integración Cloudinary
* **Dependencia:** `com.cloudinary:cloudinary-http44:1.36.0` (o compatible con Spring Boot 3).
* **Configuración:** Clase `CloudinaryConfig` que lea `CLOUDINARY_URL` de las variables de entorno o `application.properties`.
* **Servicio:** `FileUploadService` con método `uploadImage(MultipartFile file): String (url)`.

### 2. Endpoints Admin (`AdminProductController`)
* `POST /api/v1/admin/products`:
    * Recibe `MultipartFile image` y datos del producto (nombre, precio, stock, descripción, brand).
    * Sube la imagen -> Obtiene URL -> Guarda Producto en DB.
* `DELETE /api/v1/admin/products/{id}`: Elimina el producto.

## Requerimientos Frontend (Next.js)

### 1. Pantalla Lista (`src/app/admin/products/page.tsx`)
* Ruta: `/admin/products`.
* **Tabla:** Imagen pequeña, Nombre, Precio, Stock, Categoría/Marca.
* **Acciones:** Botón "Eliminar" (con confirmación) y Botón "Editar" (Link).
* **Header:** Título "Productos" y botón primario "+ Nuevo Producto".

### 2. Pantalla Creación (`src/app/admin/products/new/page.tsx`)
* Formulario limpio usando `react-hook-form`.
* **Campos:**
    * Nombre, Descripción (Textarea), Precio, Stock.
    * Marca (Select con las marcas disponibles: Creality, Bambu, etc.).
* **Subida de Imagen:**
    * Input tipo `file`.
    * **Preview:** Al seleccionar el archivo, mostrar una vista previa de la imagen antes de subirla.
* **Envío:** Usar `FormData` para enviar el archivo binario al backend.

### 3. Sidebar Link
* Actualizar `Sidebar.tsx` para que el link "Productos" apunte a `/admin/products`.

---

## Actualización (ver Feature 013)

La pantalla de lista vive en `app/admin/page.tsx` (no `app/admin/products/`) y
no usa tabla sino tarjetas. Cambios:

* **Grilla de 2 columnas** (`repeat(2, 1fr)`), una sola columna bajo 900px vía
  `.rsp-admin-grid`. Tarjetas compactadas para entrar a media hoja.
* **Buscador** por nombre, marca, categoría e ID. Filtra client-side sobre el
  array completo que devuelve `GET /api/v1/admin/products` (`findAll()`, sin
  paginar), sin tocar la API. El contador del header pasa a "X de Y productos"
  con búsqueda activa.
* Los selects de tipo de los formularios `new` y `edit` incorporan **TPU** y
  **ABS** (filamentos) y **Motores** y **Display** (electrónica).
