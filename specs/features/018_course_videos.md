# 018 — Sección "Curso" (videos de YouTube)

## Qué
- Nuevo ítem de menú **Curso** (desktop, mobile y footer), antes de "Contacto". Página `/curso`.
- La página lista los videos del curso como tarjetas: miniatura de YouTube, etiqueta ("Introducción", "Clase 1"...), título, descripción opcional y "Ver en YouTube ↗".
- Las tarjetas **abren YouTube en otra pestaña**; no se reproduce en la página (velocidad + métricas del canal).
- Botón "Suscribite al canal" → https://www.youtube.com/@3Dencasa

## Admin → Curso
- Pegar un link de YouTube; el título se completa solo (oEmbed de YouTube, vía backend) y es editable.
- Campos: etiqueta, título, descripción (opcional), visible.
- Lista con miniatura; reordenar con ↑ ↓, ocultar, editar, borrar.

## Backend
- Tabla `course_videos` (id, youtube_id único, label, title, description, sort_order, active).
- `GET /api/v1/course-videos` público (solo visibles, ordenados).
- Admin: `GET/POST /api/v1/admin/course-videos`, `PUT/DELETE /{id}`, `PUT /order` (lista de ids), `GET /lookup?url=` (título desde YouTube).
- Links aceptados: watch?v=, youtu.be/, shorts/, embed/, live/. Link inválido o repetido → 400.
- Seed si la tabla está vacía: Introducción (tnds14uuIxA), Clase 1 (nTEq_dpQvmc), Clase 2 (jcNfxU-czT8), Clase 3 (gsOfib-vbaA).
