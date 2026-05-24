package com.tresdencasa.backend.catalog.entity

import jakarta.persistence.*
import java.math.BigDecimal
import java.time.Instant

/**
 * Entidad principal de productos del catálogo. Representa un producto genérico (ej: "Filamento PLA
 * Grilon") que puede tener múltiples variantes.
 */
@Entity
@Table(name = "products")
class Product(
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY) val id: Long = 0,
        @Column(nullable = false) var name: String,
        @Column(columnDefinition = "TEXT") var description: String? = null,
        var brand: String? = null,
        var category: String? = null,
        var subcategory: String? = null,
        @Column(name = "main_image_url") var mainImageUrl: String? = null,
        @Column(name = "image_url_2") var imageUrl2: String? = null,
        @Column(name = "image_url_3") var imageUrl3: String? = null,
        @Column(name = "image_url_4") var imageUrl4: String? = null,
        @Column(name = "is_active") var isActive: Boolean = true,
        @Column(name = "is_featured", columnDefinition = "boolean DEFAULT false")
        var featured: Boolean = false,
        @Column(name = "technical_specs", columnDefinition = "TEXT") var technicalSpecs: String? = null,
        @Column(name = "compatibility_notes", columnDefinition = "TEXT") var compatibilityNotes: String? = null,
        @Column(name = "on_sale", columnDefinition = "boolean DEFAULT false") var onSale: Boolean = false,
        @Column(name = "sale_price") var salePrice: BigDecimal? = null,
        @Column(name = "created_at", updatable = false) val createdAt: Instant = Instant.now(),
        @OneToMany(
                mappedBy = "product",
                cascade = [CascadeType.ALL],
                orphanRemoval = true,
                fetch = FetchType.LAZY
        )
        val variants: MutableList<ProductVariant> = mutableListOf(),
        @OneToMany(
                mappedBy = "product",
                cascade = [CascadeType.ALL],
                orphanRemoval = true,
                fetch = FetchType.EAGER
        )
        @OrderBy("sortOrder ASC")
        val colorImages: MutableList<ProductColorImage> = mutableListOf()
) {
    fun addVariant(variant: ProductVariant) {
        variants.add(variant)
        variant.product = this
    }

    fun removeVariant(variant: ProductVariant) {
        variants.remove(variant)
    }

    fun addColorImage(colorImage: ProductColorImage) {
        colorImages.add(colorImage)
        colorImage.product = this
    }
}
