package com.tresdencasa.backend.catalog.controller

import com.tresdencasa.backend.catalog.entity.Product
import com.tresdencasa.backend.catalog.repository.ProductRepository
import com.tresdencasa.backend.catalog.repository.ProductSpecification
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.jpa.domain.Specification
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

/**
 * Controller REST para gestión de productos del catálogo. Endpoints públicos para listar y
 * consultar productos.
 */
@RestController
@RequestMapping("/api/v1/products")
class ProductController(private val productRepository: ProductRepository) {

    /**
     * GET /api/v1/products Retorna una lista paginada de productos con filtros opcionales.
     *
     * @param page Número de página (0-indexed), default 0
     * @param size Cantidad de elementos por página, default 10
     * @param brand Filtro por marca (opcional)
     * @param minPrice Precio mínimo (opcional)
     * @param maxPrice Precio máximo (opcional)
     * @param isActive Solo productos activos (opcional)
     */
    @GetMapping
    fun getAllProducts(
            @RequestParam(defaultValue = "0") page: Int,
            @RequestParam(defaultValue = "10") size: Int,
            @RequestParam(required = false) brand: String?,
            @RequestParam(required = false) brands: String?,
            @RequestParam(required = false) name: String?,
            @RequestParam(required = false) minPrice: Double?,
            @RequestParam(required = false) maxPrice: Double?,
            @RequestParam(required = false) isActive: Boolean?,
            @RequestParam(required = false) featured: Boolean?,
            @RequestParam(required = false) subcategory: String?,
            @RequestParam(required = false) onSale: Boolean?
    ): Page<Product> {
        val pageable = PageRequest.of(page, size)

        val brandList = brands?.split(",")?.map { it.trim() }?.filter { it.isNotBlank() }
        val subcategoryList = subcategory?.split(",")?.map { it.trim() }?.filter { it.isNotBlank() }

        val spec =
                Specification.where(ProductSpecification.hasBrand(if (brandList.isNullOrEmpty()) brand else null))
                        .and(ProductSpecification.hasAnyBrand(brandList))
                        .and(ProductSpecification.hasName(name))
                        .and(ProductSpecification.minPrice(minPrice))
                        .and(ProductSpecification.maxPrice(maxPrice))
                        .and(ProductSpecification.isActive(isActive))
                        .and(ProductSpecification.isFeatured(featured))
                        .and(ProductSpecification.hasAnySubcategory(subcategoryList))
                        .and(ProductSpecification.isOnSale(onSale))

        return productRepository.findAll(spec, pageable)
    }

    /**
     * GET /api/v1/products/{id} Retorna un producto específico con todas sus variantes.
     *
     * @param id ID del producto
     * @return Producto completo o 404 si no existe
     */
    @GetMapping("/{id}")
    fun getProductById(@PathVariable id: Long): ResponseEntity<Product> {
        return productRepository
                .findById(id)
                .map { product -> ResponseEntity.ok(product) }
                .orElse(ResponseEntity.notFound().build())
    }
}
