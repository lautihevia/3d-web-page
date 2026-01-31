# Feature 007: Página de Detalle "Pro" (Estilo Artifact)

## Objetivo
Reemplazar la vista de detalle básica por una interfaz de alta conversión inspirada en "Artifact/Apple". Debe permitir configurar el producto (elegir variantes) y mostrar información técnica colapsable.

## Referencia Visual
* **Layout:** Doble columna asimétrica (Escritorio).
    * **Columna Izquierda (60%):** Galería de imágenes (Imagen principal grande + miniaturas o sticky scroll).
    * **Columna Derecha (40%):** Configuración y Compra.
* **Estilo:** Fondo blanco limpio, tipografía sans-serif moderna, botones con esquinas redondeadas pero sutiles.

## Componentes Frontend (Next.js)

### 1. `ProductGallery.tsx` (Izquierda)
* Imagen principal de alta resolución.
* Si hay más fotos, mostrarlas debajo o al costado.
* Fondo de la imagen: Gris muy suave o blanco, según la foto.

### 2. `ProductConfigurator.tsx` (Derecha - Client Component)
Este es el componente interactivo complejo.
* **Header:** Título del producto, Precio actual (dinámico), SKU pequeño.
* **Selectores de Atributos:**
    * Iterar sobre los atributos disponibles en las variantes (ej: "Color", "Material", "Peso").
    * **UI:** Usar botones tipo "Pill" (bordes redondeados).
    * **Estados:**
        * *Selected:* Borde negro/azul grueso.
        * *Available:* Borde gris fino.
        * *Out of Stock:* Gris claro y tachado (diagonal line) o deshabilitado.
* **Selector de Cantidad:** Input simple `[- 1 +]`.
* **Botones de Acción:**
    * "Añadir al carrito" (Primario - Color Violeta/Brand).
    * "Comprar ahora" (Secundario - Oscuro).

### 3. `InfoAccordions.tsx` (Derecha - Abajo)
* Usar componente `Accordion` de shadcn/ui.
* Secciones:
    * "Descripción"
    * "Especificaciones Técnicas"
    * "Compatibilidad & Uso"
    * "Envíos y Pick Up"

## Lógica de Variantes (JSONB)
* El frontend debe recibir el array de `variants`.
* Debe extraer dinámicamente las "Keys" (ej: Color, RAM) para renderizar los grupos de opciones.
* Al hacer clic en una opción, debe filtrar las variantes para encontrar la combinación correcta y actualizar el precio.