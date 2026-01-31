# Feature 003: Rediseño de Grilla de Categorías

## Objetivo
Actualizar la visualización del listado de **categorías de productos** en la Home Page para imitar un estilo minimalista de "Tarjetas Flotantes" sobre fondo gris, mostrando 5 categorías principales.

## Referencia Visual
* **Inspiración:** Estilo de tarjetas tipo "categoría Apple" (ver imagen de referencia).
* **Fondo de Sección:** Gris claro (`bg-gray-100` o `bg-slate-50`).
* **Disposición:** **5 Tarjetas fijas** por fila en escritorio (una por categoría).

## Requerimientos Frontend

### 1. Componente `CategoryCard.tsx` (Nuevo)
Crear un componente para mostrar categorías de productos:
* **Contenedor:**
    * Fondo: Blanco puro (`bg-white`).
    * Bordes: Muy redondeados (`rounded-2xl` o `rounded-3xl`).
    * Sombra: Sutil o nula (flat design), con efecto suave al hacer hover (pequeña elevación).
    * Aspect Ratio: Cuadrado o ligeramente vertical.
* **Contenido:**
    * **Imagen/Ícono:** Centrado vertical y horizontalmente, con padding generoso para que el contenido "respire".
    * **Texto:** Nombre de la categoría ubicado en la **esquina inferior izquierda**.
    * **Tipografía:** Sans-serif, Bold, color negro/oscuro, tamaño pequeño/medio.

### 2. Categorías Fijas
Mostrar exactamente **5 categorías**:
1. Impresoras
2. Filamentos
3. Repuestos
4. Accesorios
5. Servicios

### 3. Página Principal (`page.tsx`)
* **Layout de Grilla:**
    * CSS Grid con **5 columnas fijas** en pantallas grandes (`xl`).
    * Responsive: 1 columna (móvil), 2 columnas (tablet), 5 columnas (desktop).
* **Fondo:** Asegurar que el contenedor de la grilla tenga el fondo gris suave para contrastar con las tarjetas blancas.
* **Ubicación:** Mostrar las categorías **antes** de la lista de productos individuales.