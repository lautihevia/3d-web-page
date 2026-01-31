# Feature 001: Catálogo de Productos (Home y Store)

## Objetivo
Mostrar un listado de productos disponibles traídos desde el Backend. Incluye la estructura base de la web (Layout).

## Backend (Spring Boot)
1.  **Modelo:** Crear entidad `Product` (id, name, brand, image_url, base_price, is_active).
    * *Nota:* Ignorar variantes complejas por ahora, usar un precio base simple.
2.  **API:** `GET /api/v1/products`
    * Debe soportar paginación (`page`, `size`).
    * Retornar JSON con lista de productos.
3.  **Data Seeding:** Crear un `CommandLineRunner` que inserte 10 productos de prueba al iniciar la app (Impresoras Ender, Filamentos Grilon, Repuestos).

## Frontend (Next.js)
1.  **Layout General:**
    * Navbar: Logo "3dencasa", Links (Inicio, Tienda), Botón "Login".
    * Footer: Copyright y Links simples.
2.  **Página Tienda (`/store`):**
    * Grid responsive (móvil 1 col, desktop 4 cols).
    * Card de Producto: Imagen, Título, Marca, Precio ("Desde $..."), Botón "Ver más".
3.  **Tech:** Usar componentes de shadcn/ui (Card, Button).

## Criterios de Aceptación
- La base de datos PostgreSQL debe tener datos iniciales.
- El frontend debe mostrar las cards reales, no datos falsos.
- Las imágenes pueden ser placeholders de internet por ahora.