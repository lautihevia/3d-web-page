# Feature 002: UI General y Landing Page

## Objetivo
Dotar a la aplicación de una identidad visual profesional, incluyendo componentes estructurales globales (Footer) y una sección de bienvenida (Hero) para la página principal.

## Requerimientos Visuales
* **Estilo:** Minimalista, "Tech", usando la paleta de colores de shadcn/ui (Slate/Zinc).
* **Modo:** Dark/Light mode compatible (prioridad Dark por la temática "maker").

## Componentes a Implementar

### 1. Footer Global (`src/components/layout/Footer.tsx`)
Debe ser visible en todas las URL de la aplicación.
* **Estructura:**
    * **Columna 1 (Marca):** Logo de texto "3dencasa" y breve slogan.
    * **Columna 2 (Navegación):** Links a Inicio, Tienda, y futuro Login.
    * **Columna 3 (Social):** Iconos para redes sociales (GitHub, Instagram, etc) usando `lucide-react`.
* **Ubicación:** Debe inyectarse en `src/app/layout.tsx`.

### 2. Hero Section (`src/components/home/Hero.tsx`)
Banner principal para la Home Page (`/`).
* **Contenido:**
    * Título H1 impactante ("Materializa tus ideas").
    * Subtítulo descriptivo.
    * **Call to Action (CTA):** Botón principal "Ver Catálogo" y secundario "Servicios".
* **Diseño:** Debe ocupar un espacio significativo del "above the fold" (lo primero que se ve). Fondo con gradiente o preparado para imagen.

## Integración
* Modificar `src/app/page.tsx` para renderizar el `Hero` antes de la grilla de productos (`ProductGrid`).