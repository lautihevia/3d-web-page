# Feature 008: Carrito de Compras (Global State & UI)

## Objetivo
Implementar la lógica global del carrito de compras para que el usuario pueda agregar productos, ver su resumen, editar cantidades y persistir la selección al navegar o recargar la página.

## Requerimientos Frontend (Next.js)

### 1. State Management (Zustand)
* Implementar un store global (`useCartStore`).
* **Datos del Item:**
    * `product`: Datos básicos (id, nombre, imagen, marca).
    * `variant`: Datos de la variante seleccionada (id, precio, atributos, sku).
    * `quantity`: Cantidad elegida.
* **Acciones:**
    * `addItem(item)`: Si ya existe (misma variante), suma cantidad. Si no, lo agrega.
    * `removeItem(variantId)`: Elimina el ítem.
    * `updateQuantity(variantId, quantity)`: Sube o baja cantidad.
    * `clearCart()`: Vacía todo.
    * `getTotal()`: Calcula el precio total.
* **Persistencia:** Usar middleware `persist` de Zustand para guardar en `localStorage`.

### 2. UI Component: `CartSheet` (Panel Lateral)
* Usar componente `Sheet` de **shadcn/ui**.
* **Ubicación:** Se abre al hacer clic en el ícono del carrito en el `Navbar`.
* **Contenido:**
    * **Header:** Título "Tu Carrito (X ítems)".
    * **Lista:** Scrollable con los ítems agregados.
        * Cada ítem muestra: Imagen pequeña, Nombre, Variantes (ej: "Color: Rojo"), Precio unitario x Cantidad, Botón de eliminar (ícono basura).
        * Selector de cantidad simple `[- 1 +]`.
    * **Footer:**
        * Subtotal calculado.
        * Botón principal "Iniciar Compra" (Checkout).
* **Estado Vacío:** Si no hay ítems, mostrar ilustración o texto amigable invitando a comprar.

### 3. Integración
* Conectar el botón "Agregar al Carrito" de la **Feature 007 (ProductDetail)** con el `addItem` del store.
* Conectar el ícono del carrito en el `Navbar` para abrir el `Sheet`.