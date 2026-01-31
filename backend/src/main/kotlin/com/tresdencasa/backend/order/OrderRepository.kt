package com.tresdencasa.backend.order

import java.math.BigDecimal
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface OrderRepository : JpaRepository<Order, Long> {

    /** Cuenta órdenes por estado. */
    fun countByStatus(status: OrderStatus): Long

    /** Suma el total de todas las órdenes confirmadas o completadas. */
    @Query(
            "SELECT COALESCE(SUM(o.total), 0) FROM Order o WHERE o.status NOT IN ('CANCELLED', 'PENDING')"
    )
    fun sumTotalRevenue(): BigDecimal

    /** Obtiene todas las órdenes ordenadas por fecha de creación. */
    fun findAllByOrderByCreatedAtDesc(pageable: Pageable): Page<Order>
}
