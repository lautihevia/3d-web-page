package com.tresdencasa.backend.order

import jakarta.persistence.*
import java.math.BigDecimal
import java.time.Instant

/** Entidad de orden de compra. */
@Entity
@Table(name = "orders")
class Order(
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY) val id: Long? = null,
        @Column(name = "customer_email", nullable = false) val customerEmail: String,
        @Column(name = "customer_name", nullable = false) val customerName: String,
        @Column(name = "customer_phone") val customerPhone: String? = null,
        @Column(name = "shipping_address", columnDefinition = "TEXT")
        val shippingAddress: String? = null,
        @Enumerated(EnumType.STRING)
        @Column(nullable = false)
        var status: OrderStatus = OrderStatus.PENDING,
        @Column(nullable = false, precision = 12, scale = 2) val total: BigDecimal,
        @OneToMany(mappedBy = "order", cascade = [CascadeType.ALL], orphanRemoval = true)
        val items: MutableList<OrderItem> = mutableListOf(),
        @Column(name = "created_at", nullable = false) val createdAt: Instant = Instant.now(),
        @Column(name = "updated_at") var updatedAt: Instant? = null
) {
    /** Agrega un item a la orden. */
    fun addItem(item: OrderItem) {
        items.add(item)
        item.order = this
    }
}
