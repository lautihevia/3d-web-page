# Feature 014: Filtro de color de filamentos

## Objetivo
En las tres secciones que muestran solo filamentos —`/store/W3D`, `/store/FilAr`
y `/catalog?category=Filamentos`— reemplazar el filtro de precio, que para
filamentos no aporta (todos valen casi lo mismo), por una paleta de colores
multi-selección. En impresoras y en el catálogo general el precio queda igual.

## Decisión central: un color, varias etiquetas

Los nombres de color son texto libre escrito a mano, y no siempre nombran un
color: "Bronce", "Amarillo, Azul, Rojo", "Celeste glow", "Multicolor Silk".

Por eso la relación es **de muchos a muchos**: cada fila de color se etiqueta con
varias claves de paleta y matchea si el usuario filtra por cualquiera de ellas.

```
product_color_images (#37 "Bronce")  →  product_color_palette
                                          ├── amarillo
                                          └── marron
```

Implementado como `@ElementCollection` en `ProductColorImage.paletteColors`.
Hibernate crea la tabla sola con `ddl-auto=update`; no hay migración manual.
EAGER porque el detalle y el admin siempre los necesitan, y el
`default_batch_fetch_size=100` que ya estaba configurado los agrupa.

## La paleta

Definida en dos lugares que hay que mantener en sincronía:
* `backend/.../catalog/FilamentPalette.kt`
* `frontend/lib/filamentColors.ts`

**Lisos** (círculos): blanco, negro, gris, rojo, naranja, amarillo, verde,
celeste, azul, violeta, rosado, marron, piel.

**Acabados** (chips con etiqueta): dorado, plateado, cristal, marmol,
multicolor, glow. Van con texto porque un "Mármol" o un "Cristal" no se
reconocen en un círculo de 26px.

## Precarga automática

`PaletteBackfill` (CommandLineRunner, `@Order(100)`) deduce las etiquetas del
nombre escrito a mano. Es **idempotente**: solo toca filas con `paletteColors`
vacío, así que lo que se corrija desde el admin no se pisa nunca.

`FilamentPalette.inferFrom` normaliza (minúsculas, sin acentos) y busca por
subcadena, de modo que un nombre cae en varias claves a la vez:

| Nombre | Etiquetas |
|---|---|
| `Verde Claro`, `Verde Oscuro`, `Verde jade` | verde |
| `Marrón Oscuro`, `Marrón claro` | marron |
| `Amarillo flúor` | amarillo |
| `Celeste glow` | celeste + glow |
| `Amarillo, Azul, Rojo` | amarillo + azul + rojo |
| `Dorado` | dorado + amarillo |
| `Plateado` | plateado + gris |
| `Bronce` | amarillo + marron |

Un nombre irreconocible queda sin etiquetar a propósito: es preferible que no
aparezca en el filtro a que aparezca en el color equivocado.

`FilamentPaletteTest` cubre los 28 nombres que estaban cargados en producción
cuando se agregó la feature. Si alguien toca la tabla de sinónimos y rompe uno,
el test avisa.

## Backend

* `ProductColorImage.paletteColors: MutableSet<String>`.
* `ProductSpecification.hasAnyPaletteColor(...)`: join `colorImages` →
  `paletteColors`, `IN (...)`, con `query.distinct(true)` para que un producto
  que matchee por varios colores aparezca una sola vez.
* `GET /api/v1/products` acepta `colors=rojo,azul` (OR entre claves).
* `AdminProductController`: `ColorImageInput.paletteColors` y
  `ColorImageDto.paletteColors`. Si el admin no elige nada, `paletteFor()` cae
  en la deducción por nombre, así un color cargado sin tocar la paleta igual
  queda filtrable.

## Frontend

* `lib/filamentColors.ts` — la paleta, compartida por web y admin.
* `components/store/ColorPaletteFilter.tsx` — filtro público.
* `components/admin/ColorPalettePicker.tsx` — selector en cada fila de color del
  admin, con las etiquetas elegidas en texto arriba.
* `FilterSidebar` y `CatalogFilters`: muestran Color y ocultan Precio cuando la
  marca o la categoría es de filamentos. Los drawers de mobile reusan estos
  mismos componentes, así que lo heredan sin cambios.

## Creality deja de ser marca de filamento

Sale de `FILAMENT_BRANDS` (admin), de `BRANDS_BY_CATEGORY.Filamentos`
(catálogo) y de `FILAMENT_BRAND_SLUGS` (`FilterSidebar`). Con eso
`/store/creality` vuelve a comportarse como marca de máquinas: con precio y sin
paleta de colores.

Los filamentos Creality que ya estaban cargados se dan de baja a mano desde el
admin; no quedan referencias en código.

## Orden de deploy

**El backend va primero.** Si el frontend sale antes, manda `colors=` a una API
que todavía no conoce el parámetro: Spring lo ignora en silencio y el filtro
parece funcionar pero devuelve todo. No rompe, pero engaña.

## Verificación

Contra Postgres local con datos de prueba:
* El backfill etiquetó las 10 filas existentes en el arranque.
* `?colors=amarillo` devuelve el producto cuyo color es "Dorado"
  (amarillo + dorado) — el multi-etiquetado funciona.
* `?colors=rojo,marron` no duplica el producto que matchea por varios colores
  — el `distinct` funciona.
* Las 3 secciones de filamento muestran Color y no muestran Precio;
  `/store/creality` y `/catalog?category=Impresoras` siguen con Precio y sin
  Color.

---

## Adenda: la tarjeta muestra la foto del color filtrado

La primera versión dejaba la imagen principal en las tarjetas. En uso resultó
confuso: filtrabas azul, veías una bobina negra y tenías que abrir el producto
para encontrar el azul.

**No hizo falta tocar el backend**: el listado ya serializa `colorImages`
completo (con `paletteColors` e `imageUrl`), porque `Product.colorImages` es
EAGER y el endpoint devuelve la entidad.

* `matchingColor()` en `lib/filamentColors.ts` busca el primer color —ordenado
  por `sortOrder`, para que el resultado sea estable entre recargas— cuyas
  etiquetas crucen con lo filtrado.
* `/catalog` y `/store/[brand]` le pasan esa `imageUrl` a `ProductCard` en vez
  de `mainImageUrl`. Sin filtro de color, o si nada matchea, la tarjeta queda
  como estaba.
* `ProductCard` suma la prop opcional `color`, que dibuja un punto y el nombre
  debajo del título.

El punto usa **la clave por la que el producto entró al filtro**, no la primera
etiqueta del color: si filtrás `amarillo`, un color llamado "Dorado" (etiquetado
dorado + amarillo) muestra punto amarillo, y un "Amarillo, Azul, Rojo" filtrado
por `azul` muestra punto azul. Así el punto siempre explica por qué ese producto
está en los resultados.
