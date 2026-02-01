package com.tresdencasa.backend.admin

import com.tresdencasa.backend.admin.dto.AdminProductDto
import com.tresdencasa.backend.catalog.FileUploadService
import com.tresdencasa.backend.catalog.entity.Product
import com.tresdencasa.backend.catalog.entity.ProductVariant
import com.tresdencasa.backend.catalog.repository.ProductRepository
import java.math.BigDecimal
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

/**
 * Controller para administración de productos. Requiere rol ADMIN (configurado en SecurityConfig).
 */
@RestController
@RequestMapping("/api/v1/admin/products")
class AdminProductController(
        private val productRepository: ProductRepository,
        private val fileUploadService: FileUploadService
) {

    /** Lista todos los productos para el panel admin. */
    @GetMapping
    fun listProducts(): List<AdminProductDto> {
        return productRepository.findAll().map { product ->
            val firstVariant = product.variants.firstOrNull()
            AdminProductDto(
                    id = product.id,
                    name = product.name,
                    description = product.description,
                    brand = product.brand,
                    mainImageUrl = product.mainImageUrl,
                    isActive = product.isActive,
                    price = firstVariant?.price,
                    stock = firstVariant?.stockQuantity,
                    variantCount = product.variants.size
            )
        }
    }

    /** Crea un nuevo producto con imagen. Recibe datos como form fields (multipart/form-data). */
    @PostMapping(consumes = ["multipart/form-data"])
    fun createProduct(
            @RequestParam name: String,
            @RequestParam(required = false) description: String?,
            @RequestParam(required = false) brand: String?,
            @RequestParam price: BigDecimal,
            @RequestParam stock: Int,
            @RequestParam(required = false) image: MultipartFile?
    ): ResponseEntity<AdminProductDto> {

        // Subir imagen a Cloudinary si existe
        val imageUrl = image?.takeIf { !it.isEmpty }?.let { fileUploadService.uploadImage(it) }

        // Crear producto
        val product =
                Product(
                        name = name,
                        description = description,
                        brand = brand,
                        mainImageUrl = imageUrl
                )

        // Crear variante por defecto con precio y stock
        val defaultVariant =
                ProductVariant(
                        product = product,
                        sku = "SKU-${System.currentTimeMillis()}",
                        price = price,
                        stockQuantity = stock
                )
        product.addVariant(defaultVariant)

        val savedProduct = productRepository.save(product)

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                        AdminProductDto(
                                id = savedProduct.id,
                                name = savedProduct.name,
                                description = savedProduct.description,
                                brand = savedProduct.brand,
                                mainImageUrl = savedProduct.mainImageUrl,
                                isActive = savedProduct.isActive,
                                price = defaultVariant.price,
                                stock = defaultVariant.stockQuantity,
                                variantCount = 1
                        )
                )
    }

    /** Elimina un producto por ID. */
    @DeleteMapping("/{id}")
    fun deleteProduct(@PathVariable id: Long): ResponseEntity<Void> {
        val exists = productRepository.existsById(id)
        if (!exists) {
            return ResponseEntity.notFound().build()
        }

        productRepository.deleteById(id)
        return ResponseEntity.noContent().build()
    }
}
