package com.tresdencasa.backend.catalog.repository

import com.tresdencasa.backend.catalog.entity.Product
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ProductRepository : JpaRepository<Product, Long> {
    
    /**
     * Obtiene todos los productos activos.
     */
    fun findByIsActiveTrue(): List<Product>
    
    /**
     * Busca productos por nombre (case-insensitive, partial match).
     */
    fun findByNameContainingIgnoreCase(name: String): List<Product>
    
    /**
     * Busca productos por marca.
     */
    fun findByBrand(brand: String): List<Product>
}
