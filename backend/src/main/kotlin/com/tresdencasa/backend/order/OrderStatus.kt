package com.tresdencasa.backend.order

/** Estados posibles de una orden. */
enum class OrderStatus {
    PENDING, // Pendiente de pago/confirmación
    CONFIRMED, // Pagada y confirmada
    SHIPPED, // Enviada
    DELIVERED, // Entregada
    CANCELLED // Cancelada
}
