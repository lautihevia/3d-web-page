package com.tresdencasa.backend.admin

import com.tresdencasa.backend.admin.dto.DashboardStats
import com.tresdencasa.backend.admin.dto.OrderDto
import com.tresdencasa.backend.admin.dto.UpdateOrderStatusRequest
import com.tresdencasa.backend.catalog.repository.ProductRepository
import com.tresdencasa.backend.order.OrderRepository
import com.tresdencasa.backend.order.OrderStatus
import java.time.Instant
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

/**
 * Controller para endpoints de administración. Requiere rol ADMIN (configurado en SecurityConfig).
 */
@RestController
@RequestMapping("/api/v1/admin")
class AdminOrderController(
        private val orderRepository: OrderRepository,
        private val productRepository: ProductRepository
) {

    /** Obtiene estadísticas del dashboard. */
    @GetMapping("/stats")
    fun getStats(): DashboardStats {
        val totalRevenue = orderRepository.sumTotalRevenue()
        val pendingOrders = orderRepository.countByStatus(OrderStatus.PENDING)
        val totalOrders = orderRepository.count()
        val activeProducts = productRepository.count()

        return DashboardStats(
                totalRevenue = totalRevenue,
                pendingOrders = pendingOrders,
                totalOrders = totalOrders,
                activeProducts = activeProducts
        )
    }

    /** Lista todas las órdenes (paginadas). */
    @GetMapping("/orders")
    fun getOrders(
            @RequestParam(defaultValue = "0") page: Int,
            @RequestParam(defaultValue = "20") size: Int
    ): Page<OrderDto> {
        val pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"))

        return orderRepository.findAllByOrderByCreatedAtDesc(pageable).map { order ->
            OrderDto(
                    id = order.id!!,
                    customerEmail = order.customerEmail,
                    customerName = order.customerName,
                    status = order.status,
                    total = order.total,
                    itemCount = order.items.size,
                    createdAt = order.createdAt
            )
        }
    }

    /** Actualiza el estado de una orden. */
    @PatchMapping("/orders/{id}/status")
    fun updateOrderStatus(
            @PathVariable id: Long,
            @RequestBody request: UpdateOrderStatusRequest
    ): ResponseEntity<OrderDto> {
        val order =
                orderRepository.findById(id).orElse(null)
                        ?: return ResponseEntity.notFound().build()

        order.status = request.status
        order.updatedAt = Instant.now()

        val savedOrder = orderRepository.save(order)

        return ResponseEntity.ok(
                OrderDto(
                        id = savedOrder.id!!,
                        customerEmail = savedOrder.customerEmail,
                        customerName = savedOrder.customerName,
                        status = savedOrder.status,
                        total = savedOrder.total,
                        itemCount = savedOrder.items.size,
                        createdAt = savedOrder.createdAt
                )
        )
    }
}
