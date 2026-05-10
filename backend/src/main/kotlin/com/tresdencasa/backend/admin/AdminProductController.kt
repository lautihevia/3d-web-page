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

data class UpdateProductRequest(
        val name: String? = null,
        val description: String? = null,
        val brand: String? = null,
        val price: BigDecimal? = null,
        val stock: Int? = null,
        val imageUrl: String? = null,
        val isActive: Boolean? = null
)

@RestController
@RequestMapping("/api/v1/admin/products")
class AdminProductController(
        private val productRepository: ProductRepository,
        private val fileUploadService: FileUploadService
) {

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

    /**
     * Crea producto. Acepta imagen como archivo (image) o como URL de Cloudinary (imageUrl).
     * Si se proveen ambos, imageUrl tiene precedencia.
     */
    @PostMapping(consumes = ["multipart/form-data"])
    fun createProduct(
            @RequestParam name: String,
            @RequestParam(required = false) description: String?,
            @RequestParam(required = false) brand: String?,
            @RequestParam price: BigDecimal,
            @RequestParam stock: Int,
            @RequestParam(required = false) imageUrl: String?,
            @RequestParam(required = false) image: MultipartFile?
    ): ResponseEntity<AdminProductDto> {
        val finalImageUrl = when {
            !imageUrl.isNullOrBlank() -> imageUrl.trim()
            image != null && !image.isEmpty -> fileUploadService.uploadImage(image)
            else -> null
        }

        val product = Product(
                name = name,
                description = description,
                brand = brand,
                mainImageUrl = finalImageUrl
        )
        val defaultVariant = ProductVariant(
                product = product,
                sku = "SKU-${System.currentTimeMillis()}",
                price = price,
                stockQuantity = stock
        )
        product.addVariant(defaultVariant)
        val saved = productRepository.save(product)

        return ResponseEntity.status(HttpStatus.CREATED).body(
                AdminProductDto(
                        id = saved.id,
                        name = saved.name,
                        description = saved.description,
                        brand = saved.brand,
                        mainImageUrl = saved.mainImageUrl,
                        isActive = saved.isActive,
                        price = defaultVariant.price,
                        stock = defaultVariant.stockQuantity,
                        variantCount = 1
                )
        )
    }

    /** Actualiza campos de un producto (JSON body, todos opcionales). */
    @PutMapping("/{id}")
    fun updateProduct(
            @PathVariable id: Long,
            @RequestBody request: UpdateProductRequest
    ): ResponseEntity<AdminProductDto> {
        val product = productRepository.findById(id).orElse(null)
                ?: return ResponseEntity.notFound().build()

        if (request.name != null) product.name = request.name
        if (request.description != null) product.description = request.description
        if (request.brand != null) product.brand = request.brand
        if (request.imageUrl != null) product.mainImageUrl = request.imageUrl.ifBlank { null }
        if (request.isActive != null) product.isActive = request.isActive

        val firstVariant = product.variants.firstOrNull()
        if (firstVariant != null) {
            if (request.price != null) firstVariant.price = request.price
            if (request.stock != null) firstVariant.stockQuantity = request.stock
        }

        val saved = productRepository.save(product)
        return ResponseEntity.ok(
                AdminProductDto(
                        id = saved.id,
                        name = saved.name,
                        description = saved.description,
                        brand = saved.brand,
                        mainImageUrl = saved.mainImageUrl,
                        isActive = saved.isActive,
                        price = saved.variants.firstOrNull()?.price,
                        stock = saved.variants.firstOrNull()?.stockQuantity,
                        variantCount = saved.variants.size
                )
        )
    }

    @DeleteMapping("/{id}")
    fun deleteProduct(@PathVariable id: Long): ResponseEntity<Void> {
        if (!productRepository.existsById(id)) return ResponseEntity.notFound().build()
        productRepository.deleteById(id)
        return ResponseEntity.noContent().build()
    }
}
