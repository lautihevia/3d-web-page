package com.tresdencasa.backend.catalog.repository

import com.tresdencasa.backend.catalog.entity.ProductVariant
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ProductVariantRepository : JpaRepository<ProductVariant, Long> {
    
    /**
     * Busca una variante por su SKU único.
     */
    fun findBySku(sku: String): ProductVariant?
    
    /**
     * Obtiene todas las variantes de un producto.
     */
    fun findByProductId(productId: Long): List<ProductVariant>
    
    /**
     * Verifica si existe una variante con el SKU dado.
     */
    fun existsBySku(sku: String): Boolean
}
