package com.tresdencasa.backend.catalog.entity

import jakarta.persistence.*
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import java.math.BigDecimal

/**
 * Variante de un producto con atributos dinámicos en JSONB.
 * Cada variante tiene su propio SKU, precio, stock y atributos específicos.
 * Ej: Filamento rojo 1kg, Filamento negro 1kg.
 */
@Entity
@Table(name = "product_variants")
class ProductVariant(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    var product: Product,

    @Column(nullable = false, unique = true)
    var sku: String,

    @Column(nullable = false, precision = 10, scale = 2)
    var price: BigDecimal,

    @Column(name = "stock_quantity", nullable = false)
    var stockQuantity: Int = 0,

    /**
     * Versión para Optimistic Locking.
     * Previene condiciones de carrera al actualizar stock.
     */
    @Version
    var version: Int = 0,

    /**
     * Atributos dinámicos almacenados como JSONB en PostgreSQL.
     * Ejemplo: {"color": "Rojo", "peso": "1kg", "material": "PLA"}
     * 
     * Hibernate 6+ soporta JSONB nativamente con @JdbcTypeCode(SqlTypes.JSON).
     */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    var attributes: MutableMap<String, Any> = mutableMapOf()
)
