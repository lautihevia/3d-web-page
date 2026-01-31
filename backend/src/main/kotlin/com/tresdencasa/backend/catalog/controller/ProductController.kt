package com.tresdencasa.backend.catalog.controller

import com.tresdencasa.backend.catalog.entity.Product
import com.tresdencasa.backend.catalog.repository.ProductRepository
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

/**
 * Controller REST para gestión de productos del catálogo.
 * Endpoints públicos para listar y consultar productos.
 */
@RestController
@RequestMapping("/api/v1/products")
class ProductController(
    private val productRepository: ProductRepository
) {

    /**
     * GET /api/v1/products
     * Retorna una lista paginada de productos activos.
     * 
     * @param page Número de página (0-indexed), default 0
     * @param size Cantidad de elementos por página, default 10
     */
    @GetMapping
    fun getAllProducts(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") size: Int
    ): Page<Product> {
        val pageable = PageRequest.of(page, size)
        return productRepository.findAll(pageable)
    }

    /**
     * GET /api/v1/products/{id}
     * Retorna un producto específico con todas sus variantes.
     * 
     * @param id ID del producto
     * @return Producto completo o 404 si no existe
     */
    @GetMapping("/{id}")
    fun getProductById(@PathVariable id: Long): ResponseEntity<Product> {
        return productRepository.findById(id)
            .map { product -> ResponseEntity.ok(product) }
            .orElse(ResponseEntity.notFound().build())
    }
}
