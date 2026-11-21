# Feature 016: Productos sin stock en las grillas

## Objetivo
Hoy "SIN STOCK" solo se ve al entrar al producto. En **todas las grillas**
(catálogo, `/store/[marca]`, home "Destacados" y "Ofertas") los productos sin
stock tienen que:
1. ir **al final** por defecto,
2. verse con **filtro gris**,
3. mostrar el cartel **"Sin stock"**.

**No-objetivos:** el buscador del navbar (es una lista de sugerencias, no una
grilla); stock por color en las tarjetas.

## Qué es "sin stock"
Igual que la ficha del producto, **a nivel producto**:
* sin colores → `products.in_stock`
* con colores → disponible si **algún** color tiene `in_stock = true`

Con el filtro de color activo, una tarjeta de un color sin stock de un filamento
que sí tiene otros colores **no** se marca ni se reordena (decisión explícita).

## Enfoques considerados
1. **Campo calculado con `@Formula` (elegido).** `Product.available` lo calcula la
   base al leer; siempre correcto, nada que sincronizar, y viaja en el JSON.
2. Columna persistida recalculada al guardar: dato duplicado que se puede
   desincronizar (cambios por color no ensucian al producto padre) y necesita backfill.
3. Orden armado con Criteria en `ProductSpecification`: más código y frágil con
   la query de conteo de la paginación.

## Backend
* `Product.available: Boolean` con `@Formula`:
  ```sql
  case when exists (select 1 from product_color_images c where c.product_id = id)
       then exists (select 1 from product_color_images c where c.product_id = id and c.in_stock)
       else coalesce(in_stock, true) end
  ```
* `GET /api/v1/products` ordena por `available DESC, id ASC` (dentro de cada
  grupo, más antiguo primero: es prácticamente el orden que se ve hoy).
* Se serializa como `available` en el JSON del producto.

## Frontend
* `ProductCard` recibe `available?: boolean` (default `true`). Si es `false`:
  imagen en escala de grises y atenuada, precio atenuado, y un cartel
  **"Sin stock"** centrado sobre la imagen. La tarjeta sigue siendo clickeable.
* Las 4 grillas pasan `available={product.available}`.

## Queda a criterio del implementador
Estilo exacto del cartel y del gris, siguiendo la estética de la tarjeta.
