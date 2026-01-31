# Feature 009: Página de Checkout (Estilo Shopify)

## Objetivo
Crear la pantalla final de compra donde el usuario ingresa sus datos de envío y confirma el pedido.

## Referencia Visual
* **Estilo:** "One Page Checkout" (ver imagen de referencia).
* **Layout:** Pantalla dividida en escritorio (Split Screen).
    * **Izquierda (Blanco):** Formularios de información.
    * **Derecha (Gris claro / `bg-muted`):** Resumen de la orden (Sticky).

## Frontend (Next.js)

### 1. Componente: `OrderSummary.tsx` (Columna Derecha)
* Debe leer el estado desde `useCartStore` (Zustand).
* **Lista de ítems:**
    * Imagen pequeña (thumbnail) con "Badge" de cantidad en la esquina (como en la foto).
    * Título del producto y variante (ej: "MacBook Air - 16GB").
    * Precio formateado.
* **Costos:**
    * Subtotal.
    * Envío (Por ahora poner "Gratis" o un monto fijo).
    * **Total (Grande):** La suma final.

### 2. Componente: `CheckoutForm.tsx` (Columna Izquierda)
* Usar `react-hook-form` + `zod` para validación.
* **Secciones:**
    * **Contacto:** Email (con checkbox de "Enviarme novedades").
    * **Entrega:** Radio Buttons para elegir "Envío" o "Retiro".
    * **Dirección:**
        * País (Select).
        * Nombre y Apellido (Grid de 2 columnas).
        * Dirección (Calle y altura).
        * Casa/Depto (Opcional).
        * Código Postal y Ciudad (Grid de 2 columnas).
        * Provincia/Estado (Select).
        * Teléfono.

### 3. Lógica de Envío ("Pagar")
* Botón "Confirmar Pedido" al final del formulario.
* **Acción:**
    1. Validar formulario.
    2. Construir objeto JSON con: `{ shippingAddress, items: [...] }`.
    3. Enviar `POST` a `/api/v1/orders`.
    4. Si es exitoso -> Redirigir a `/checkout/success` y limpiar carrito.

## Backend (Spring Boot)
* (Igual que el plan anterior: Entidades `Order`, `OrderItem`, Controller y Service).