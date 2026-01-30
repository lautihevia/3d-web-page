```markdown
# 04. Estructura Frontend (Next.js)

## Stack Específico
- **Framework:** Next.js 14+ (App Router).
- **Estilos:** Tailwind CSS.
- **Componentes:** shadcn/ui (Instalar componentes individuales según necesidad).
- **Iconos:** Lucide React.
- **State Management:** Zustand (Carrito), TanStack Query (Server State).

## Estructura de Directorios (`/src/app`)

- `(public)/`: Grupo de rutas públicas (Layout con Navbar y Footer estándar).
    - `page.tsx`: Home (Hero, Featured Products).
    - `store/page.tsx`: Catálogo con filtros laterales.
    - `store/[slug]/page.tsx`: Detalle de producto (Selector de variantes).
    - `cart/page.tsx`: Vista del carrito antes del checkout.

- `(auth)/`: Grupo de rutas de autenticación.
    - `login/page.tsx`
    - `register/page.tsx`

- `(checkout)/`: Layout minimalista (sin navbar distractora).
    - `checkout/page.tsx`: Formulario de envío y pago.

## Componentes Clave (Components Folder)
- `ui/`: Componentes base de shadcn (Button, Input, Card).
- `products/ProductGrid.tsx`: Muestra la grilla.
- `products/VariantSelector.tsx`: Lógica compleja para seleccionar atributos del JSONB.
- `cart/CartSheet.tsx`: Drawer lateral para vista rápida del carrito.

## Integración con IA (Prompting)
Para generar UI, se proveerán capturas de pantalla de referencia. La IA debe replicar usando clases de Tailwind y componentes de shadcn/ui.