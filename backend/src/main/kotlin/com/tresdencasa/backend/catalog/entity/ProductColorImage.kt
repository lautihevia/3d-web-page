package com.tresdencasa.backend.catalog.entity

import com.fasterxml.jackson.annotation.JsonIgnore
import jakarta.persistence.*

@Entity
@Table(name = "product_color_images")
class ProductColorImage(
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY) val id: Long = 0,
        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "product_id", nullable = false)
        @JsonIgnore
        var product: Product? = null,
        @Column(name = "color_name") var colorName: String = "",
        @Column(name = "image_url", columnDefinition = "TEXT") var imageUrl: String = "",
        @Column(name = "sort_order") var sortOrder: Int = 0,
        @Column(name = "in_stock", columnDefinition = "boolean DEFAULT true")
        var inStock: Boolean = true
)
