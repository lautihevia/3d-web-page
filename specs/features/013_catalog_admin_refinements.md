# Feature 013: Ajustes de Catálogo, Filtros y Panel Admin

## Objetivo
Unificar los caminos de navegación hacia la categoría Electrónica, simplificar el
detalle de filamento, completar la oferta de filtros (tipos de material y
subcategorías de electrónica) y hacer más operable la lista de productos del
panel admin.

Solo frontend: el backend ya acepta `category` y `subcategory` como texto libre
(`ProductSpecification.hasCategory` / `hasAnySubcategory`), así que los valores
nuevos funcionan apenas se cargan desde el admin.

## 1. Panel Admin — Lista de productos (`app/admin/page.tsx`)

### Grilla de 2 columnas
* El listado pasa de una columna (`flex-column`) a `display: grid` con
  `repeat(2, 1fr)` y `gap: 10`, para ver el doble de productos sin scrollear.
* El contenedor sube de `maxWidth: 1100` a `1400`.
* Las tarjetas se compactan para entrar a media hoja: thumbnail 52→44px,
  padding `14px 20px`→`12px 14px`, gap 16→12, nombre 15→14px, bloque de precio
  `minWidth` 110→92, botones de acción 34→32px.
* En mobile vuelve a una columna vía `.rsp-admin-grid` (media query de 900px en
  `globals.css`).
* Los estados vacíos (sin productos / sin resultados) usan `gridColumn: "1 / -1"`.

### Buscador
* Input con ícono de lupa y botón de limpiar, arriba de la lista.
* **Filtrado client-side:** `GET /api/v1/admin/products` devuelve el catálogo
  completo sin paginar (`findAll()`), así que el filtro corre sobre el array ya
  cargado — es instantáneo y no requiere cambios en la API.
* Matchea contra nombre, marca, categoría e ID (con y sin `#`).
* El contador del header muestra "X de Y productos" cuando hay búsqueda activa.

## 2. Navegación a Electrónica (`app/page.tsx`)

Los tres caminos a Electrónica ahora caen en la misma URL,
`/catalog?category=Electrónica`:
* Tarjeta de marca **Arduino** (antes `/store/arduino`).
* Tarjeta de categoría **Electrónica** (antes `?brands=arduino,electronica`).
* Menú superior → Insumos → Electrónica (ya apuntaba ahí).

En el mismo movimiento, las otras tarjetas de categoría pasan de filtrar por
marca a filtrar por categoría: **Impresoras 3D** → `?category=Impresoras`,
**Filamentos & Insumos** → `?category=Filamentos`.

El array `BRANDS` cambia el campo `slug` por `href`, para que cada tarjeta de
marca declare su destino (página de marca o categoría) en un solo lugar. Bambu
Lab, Creality, W3D y Anycubic siguen yendo a `/store/<marca>`.

## 3. Detalle de filamento en una columna (`FilamentProductView.tsx`)

Layout apilado, centrado, `maxWidth: 780px` (si no, la imagen queda
desproporcionada en escritorio). Orden:

1. Badge de stock + marca
2. **Título** — bajó de 48px a 32px
3. **Imagen grande** del color seleccionado
4. **Selector de color por texto** (chips) — único control de color
5. Caja de precio + CTA (email / WhatsApp)
6. `InfoAccordions`

* **Se elimina la fila de miniaturas por color.** La imagen grande es el único
  lugar donde se ve el filamento; se elige con los chips de texto.
* Se pierde el `position: sticky` de la caja de precio, que no aplica en columna
  única.
* La vista de producto **no** filamento (`ProductGallery` + 2 columnas en
  `app/products/[id]/page.tsx`) queda sin cambios.

## 4. Filtros

### Tipos de filamento: + TPU, + ABS
Se agregan en los tres lugares que mantienen la lista por separado:
* `components/store/FilterSidebar.tsx` → `FILAMENT_TYPES` (páginas de marca).
* `app/catalog/CatalogFilters.tsx` → `SUBCATEGORIES_BY_CATEGORY.Filamentos`.
* `app/admin/products/new/page.tsx` y `edit/[id]/page.tsx` → `FILAMENT_TYPES`.

> **Deuda conocida:** las tres listas siguen desincronizadas entre sí
> (`FilterSidebar` incluye además "Creality" y "Hyper Serie PLA", que son marca
> y línea, no material). Unificarlas en un módulo compartido queda pendiente.

### Subcategorías de Electrónica: + Motores, + Display
Lista final: `Placas, Sensores, Motores, Display, Insumos`, en
`SUBCATEGORIES_BY_CATEGORY.Electrónica` y en `ELECTRONICA_TYPES` de los dos
formularios del admin.

### Filtros en mobile para todas las categorías
* **Problema:** en `/catalog` la barra lateral se oculta bajo 900px
  (`.rsp-filter-sidebar { display: none }`) y no había reemplazo, así que en el
  celular solo se veían filtros en las páginas de marca (impresoras), que sí
  tienen `MobileFilterDrawer`.
* **Solución:** nuevo `app/catalog/CatalogFilterDrawer.tsx`, mismo patrón de
  drawer lateral, montado dentro del `<main>` de `/catalog`.
* `CatalogFilters` gana dos props: `compact` (panel a ancho completo, sin
  sticky) y `onApplied` (callback tras navegar, para cerrar el drawer). Así
  "Aplicar filtros" navega y cierra en un solo click, sin botón extra.
* Nueva clase `.rsp-filter-drawer` en `globals.css`: `display: none` por
  defecto, `block` dentro del media query de 900px — el mismo umbral en el que
  desaparece la barra lateral, para que nunca se vean las dos ni ninguna.

## Verificación
* `npm run build` en `frontend/` — compila y typechequea.
* `npm run lint` — quedan 8 errores **pre-existentes**
  (`react/jsx-no-comment-textnodes` por los rótulos decorativos `// KICKER` en
  JSX, y un `react-hooks/set-state-in-effect` en `SearchModal.tsx`); ninguno en
  los archivos de esta feature.

## Nota operativa
TPU, ABS, Motores y Display son solo opciones de filtro. Hasta que no se editen
productos existentes asignándoles esos tipos desde el admin, esos filtros
devuelven cero resultados.

---

## Actualización (ver Feature 014)

La deuda que este documento dejaba anotada sigue abierta: los tipos de filamento
continúan definidos por separado en `FilterSidebar`, `CatalogFilters` y los dos
formularios del admin.

En cambio, la **paleta de colores** que agrega la Feature 014 sí nació
centralizada en `lib/filamentColors.ts` (frontend) y `FilamentPalette.kt`
(backend) — es el patrón a seguir si alguna vez se unifican los tipos.

El filtro de **Precio** dejó de mostrarse en las secciones de filamento. Sigue
intacto en impresoras y en el catálogo sin categoría.
