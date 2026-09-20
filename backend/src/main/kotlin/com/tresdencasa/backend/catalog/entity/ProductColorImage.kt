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
        var inStock: Boolean = true,
        /**
         * Claves de la paleta con las que se etiqueta este color, en minúscula
         * (ver FilamentPalette). Son varias a propósito: un "Bronce" se etiqueta
         * amarillo + marron y aparece al filtrar por cualquiera de los dos; un
         * tricolor lleva sus tres colores. EAGER porque tanto el detalle como el
         * admin los necesitan siempre, y el batch fetching global las agrupa.
         */
        @ElementCollection(fetch = FetchType.EAGER)
        @CollectionTable(
                name = "product_color_palette",
                joinColumns = [JoinColumn(name = "color_image_id")]
        )
        @Column(name = "palette_color")
        var paletteColors: MutableSet<String> = mutableSetOf()
)
