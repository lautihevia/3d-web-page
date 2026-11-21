# Feature 017: Consulta por precio mayorista en filamentos

En la ficha de **todos los filamentos** (categoría `Filamentos`, cualquier marca,
con o sin colores) se muestra debajo de "Consultá disponibilidad y formas de
pago" un enlace destacado:

> ¿Comprás por cantidad? Consultá por precio mayorista →

Abre WhatsApp con el mensaje "Hola, quiero consultar el precio mayorista del
{producto}." Componente: `components/products/WholesaleLink.tsx`.

**No-objetivos:** tarjetas de la grilla (ya están justas de espacio en mobile).
La vista de colores se elige por "tiene colores", así que la condición se evalúa
por categoría en las dos vistas del detalle.
