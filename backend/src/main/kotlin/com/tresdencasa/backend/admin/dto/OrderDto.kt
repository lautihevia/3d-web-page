package com.tresdencasa.backend.admin.dto

import com.tresdencasa.backend.order.OrderStatus
import java.math.BigDecimal
import java.time.Instant

/** DTO para representar una orden en la respuesta del admin. */
data class OrderDto(
        val id: Long,
        val customerEmail: String,
        val customerName: String,
        val status: OrderStatus,
        val total: BigDecimal,
        val itemCount: Int,
        val createdAt: Instant
)

/** Request para actualizar el estado de una orden. */
data class UpdateOrderStatusRequest(val status: OrderStatus)
