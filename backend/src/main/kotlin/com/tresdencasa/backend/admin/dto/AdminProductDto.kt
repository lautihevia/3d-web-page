package com.tresdencasa.backend.admin.dto

import java.math.BigDecimal

/** DTO para respuesta de producto en el panel admin. */
data class AdminProductDto(
        val id: Long,
        val name: String,
        val description: String?,
        val brand: String?,
        val mainImageUrl: String?,
        val isActive: Boolean,
        val price: BigDecimal?,
        val stock: Int?,
        val variantCount: Int
)
