# Feature 012: Frontend Essentials (Navbar & Páginas Estáticas)

## Objetivo
Mejorar la experiencia de usuario reflejando el estado de autenticación en el Navbar y crear las páginas institucionales faltantes.

## Requerimientos Frontend (Next.js)

### 1. Navbar Inteligente (`src/components/layout/Navbar.tsx`)
* **Estado Actual:** Muestra siempre el ícono de `User` genérico.
* **Nuevo Comportamiento:**
    * Conectar al `useAuthStore` para leer `user` e `isAuthenticated`.
    * **Caso Guest (No logueado):** Mostrar ícono User -> Link a `/auth/login`.
    * **Caso User (Logueado):** Mostrar **Avatar con Iniciales** (ej: "JP") o Nombre.
    * **Dropdown Menu (al hacer clic en el Avatar):**
        * Header: "Hola, {user.name}"
        * Item: "Mi Perfil / Pedidos" (`/profile`)
        * Item: "Panel Admin" (Solo si `user.role === 'ADMIN'`).
        * Separador.
        * Item: "Cerrar Sesión" (Color rojo, ejecuta `logout()` y redirige a home).

### 2. Página de Contacto (`src/app/contact/page.tsx`)
* **Layout:** Grid de 2 columnas (responsive).
* **Columna Info:**
    * Datos de "3D En Casa" (Email ficticio, Teléfono, Ubicación).
    * Título: "¿Tenés una idea? La imprimimos."
* **Columna Formulario:**
    * Usar `react-hook-form` + `zod`.
    * Campos: Nombre, Email, Asunto (Select: Consulta, Presupuesto, Soporte), Mensaje.
    * **Submit:** Simular envío (`await new Promise...`) y mostrar `toast` de éxito "Mensaje enviado".

### 3. Página Sobre Nosotros (`src/app/about/page.tsx`)
* **Diseño:** Institucional y limpio.
* **Contenido:**
    * **Hero:** Título "Expertos en Impresión 3D".
    * **Valores:** Cards simples (Calidad, Rapidez, Soporte Local).
    * **CTA:** Botón "Ver Tienda".

## Assets
* Usar componentes de **shadcn/ui**: `DropdownMenu`, `Avatar`, `Card`, `Form`.