# Feature 005: Página de Marca con Filtros (Sidebar)

## Objetivo
Implementar una página dinámica de listado de productos filtrados por marca (ej: `/store/creality`), con un diseño de "Sidebar + Grilla" similar al estilo "Apple Store / Artifact".

## Referencia Visual
* **Banner Superior:** Título de la marca sobre un fondo de color sólido suave o imagen desenfocada (estilo "header pequeño").
* **Layout:** Grid de 2 columnas asimétricas:
    * **Izquierda (25%):** Barra lateral de filtros (fija o sticky).
    * **Derecha (75%):** Grilla de productos (reutilizando las Cards de la Feature 003).

## Requerimientos Backend (Spring Boot)

### 1. Actualizar Endpoint `GET /api/v1/products`
Modificar el endpoint existente para aceptar parámetros de filtrado opcionales:
* `brand` (String): Filtrar por nombre de marca exacto.
* `minPrice` (Double): Precio mínimo.
* `maxPrice` (Double): Precio máximo.
* `isActive` (Boolean): Solo mostrar disponibles (stock > 0).

*Implementación sugerida:* Usar `JpaSpecificationExecutor` o simplemente agregar los parámetros al `@Query` del repositorio para mantenerlo simple.

## Requerimientos Frontend (Next.js)

### 1. Routing (`src/app/store/[brand]/page.tsx`)
* Crear ruta dinámica que capture el nombre de la marca de la URL.
* Hacer fetch al backend enviando el filtro: `GET /api/v1/products?brand=Creality`.

### 2. Componente `FilterSidebar.tsx`
* Barra lateral a la izquierda.
* **Secciones (Acordeones o Listas):**
    * **Estado:** Switch "Solo mostrar disponibles".
    * **Precio:** Inputs de "Mínimo" y "Máximo" (o un Slider simple).
    * **Categorías:** (Opcional por ahora) Checkboxes.
* **Comportamiento:** Al cambiar un filtro, debe actualizar la URL (query params) para que la búsqueda sea "shareable" (ej: `.../creality?minPrice=100`).

### 3. Componente `BrandHeader.tsx`
* Banner delgado en la parte superior.
* Muestra el nombre de la Marca (Capitalizado) y breadcrumbs (Inicio > Tienda > Creality).

### 4. Integración en Home
* En la Home actual (`page.tsx`), las "Tarjetas de Marca" (Creality, Bambu Lab, etc.) deben ser links `Link href="/store/creality"`.

---

## Actualización (ver Feature 013)

* **Excepción en las tarjetas de marca:** Arduino ya no apunta a
  `/store/arduino` sino a `/catalog?category=Electrónica`, para que la tarjeta,
  la card de categoría y el menú superior lleven al mismo lugar. Bambu Lab,
  Creality, W3D y Anycubic siguen yendo a su página de marca.
* **Filtro "Tipo" en `FilterSidebar.tsx`:** se agregan **TPU** y **ABS** a
  `FILAMENT_TYPES`. La sección solo se muestra para marcas de filamento
  (`FILAMENT_BRAND_SLUGS`).
* **Filtros en mobile:** `MobileFilterDrawer` cubría solo `/store/[brand]`.
  `/catalog` ahora tiene su equivalente (`app/catalog/CatalogFilterDrawer.tsx`),
  así que todas las categorías tienen filtros en el celular, no solo impresoras.
