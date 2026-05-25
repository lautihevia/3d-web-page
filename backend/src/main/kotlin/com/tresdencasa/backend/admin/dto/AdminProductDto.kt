package com.tresdencasa.backend.admin.dto

import java.math.BigDecimal

data class ColorImageDto(
        val id: Long,
        val colorName: String,
        val imageUrl: String,
        val sortOrder: Int
)

/** DTO para respuesta de producto en el panel admin. */
data class AdminProductDto(
        val id: Long,
        val name: String,
        val description: String?,
        val brand: String?,
        val category: String?,
        val subcategory: String?,
        val mainImageUrl: String?,
        val imageUrl2: String?,
        val imageUrl3: String?,
        val imageUrl4: String?,
        val isActive: Boolean,
        val featured: Boolean,
        val technicalSpecs: String?,
        val compatibilityNotes: String?,
        val onSale: Boolean,
        val salePrice: BigDecimal?,
        val price: BigDecimal?,
        val stock: Int?,
        val variantCount: Int,
        val colorImages: List<ColorImageDto>
)
