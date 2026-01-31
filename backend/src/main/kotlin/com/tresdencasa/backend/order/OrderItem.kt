package com.tresdencasa.backend.order

import jakarta.persistence.*
import java.math.BigDecimal

/** Item individual dentro de una orden. */
@Entity
@Table(name = "order_items")
class OrderItem(
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY) val id: Long? = null,
        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "order_id", nullable = false)
        var order: Order? = null,
        @Column(name = "variant_id", nullable = false) val variantId: Long,
        @Column(name = "product_name", nullable = false) val productName: String,
        @Column(name = "variant_sku", nullable = false) val variantSku: String,
        @Column(nullable = false) val quantity: Int,
        @Column(name = "unit_price", nullable = false, precision = 12, scale = 2)
        val unitPrice: BigDecimal
) {
    /** Calcula el subtotal del item. */
    fun getSubtotal(): BigDecimal = unitPrice.multiply(BigDecimal(quantity))
}
