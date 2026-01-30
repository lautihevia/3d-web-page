# 01. Contexto del Proyecto y Reglas Técnicas

## Descripción General
Plataforma de E-commerce para "3dencasa", dedicada a la venta de insumos de impresión 3D (impresoras, filamentos, repuestos) y servicios.
Objetivo: Venta minorista con gestión de stock estricta, variantes complejas de productos, integración de pagos (Mercado Pago) y envíos.

## Stack Tecnológico Definido
- **Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS.
- **UI Library:** shadcn/ui (basado en Radix UI).
- **Backend:** Spring Boot 3+ (Kotlin), Spring Security (JWT), Spring Data JPA.
- **Base de Datos:** PostgreSQL 15+.
- **Infraestructura:** Docker (Dev), VPS Linux (Prod).
- **Imágenes:** Cloudinary (API gratuita para optimización).

## Reglas de Arquitectura
1. **Monorepo:** Frontend y Backend conviven en el mismo repositorio para facilitar la coherencia de tipos.
2. **Vertical Slicing:** Desarrollamos por "Feature" (Back + Front simultáneamente) y no por capas.
3. **Idioma:** Código, Variables y Commits en **Inglés**. Comentarios explicativos y Textos de UI en **Español**.
4. **Manejo de Dinero:** En Backend usar siempre `BigDecimal`. En Frontend usar librerías de formateo (Intl.NumberFormat).
5. **Fechas:** UTC en Base de Datos (`Instant` en Java). Conversión a zona horaria del usuario en el navegador.

## Reglas de Negocio Clave
- **Variantes:** Un producto (ej: Filamento) tiene variantes (Color Rojo, Azul). El Stock se controla a nivel Variante.
- **Stock Estricto:** No se permite checkout si `stock < quantity`. Bloqueo optimista (Optimistic Locking) en DB.
- **Usuarios:** Compra requiere registro y login obligatorio.
- **Carritos:** Persistencia híbrida (Local Storage para anónimos, Base de Datos al loguearse).