package com.tresdencasa.backend.catalog.entity

import jakarta.persistence.*
import java.time.Instant

/**
 * Entidad principal de productos del catálogo.
 * Representa un producto genérico (ej: "Filamento PLA Grilon") que puede tener múltiples variantes.
 */
@Entity
@Table(name = "products")
class Product(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false)
    var name: String,

    @Column(columnDefinition = "TEXT")
    var description: String? = null,

    var brand: String? = null,

    @Column(name = "main_image_url")
    var mainImageUrl: String? = null,

    @Column(name = "is_active")
    var isActive: Boolean = true,

    @Column(name = "created_at", updatable = false)
    val createdAt: Instant = Instant.now(),

    @OneToMany(mappedBy = "product", cascade = [CascadeType.ALL], orphanRemoval = true, fetch = FetchType.LAZY)
    val variants: MutableList<ProductVariant> = mutableListOf()
) {
    /**
     * Helper para agregar variantes manteniendo la relación bidireccional.
     */
    fun addVariant(variant: ProductVariant) {
        variants.add(variant)
        variant.product = this
    }

    fun removeVariant(variant: ProductVariant) {
        variants.remove(variant)
    }
}
