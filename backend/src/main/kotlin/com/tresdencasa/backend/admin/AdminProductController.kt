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
        val category: String? = null,
        val price: BigDecimal? = null,
        val stock: Int? = null,
        val imageUrl: String? = null,
        val imageUrl2: String? = null,
        val imageUrl3: String? = null,
        val imageUrl4: String? = null,
        val isActive: Boolean? = null
)

@RestController
@RequestMapping("/api/v1/admin/products")
class AdminProductController(
        private val productRepository: ProductRepository,
        private val fileUploadService: FileUploadService
) {

    private fun Product.toDto() = AdminProductDto(
            id = id,
            name = name,
            description = description,
            brand = brand,
            category = category,
            mainImageUrl = mainImageUrl,
            imageUrl2 = imageUrl2,
            imageUrl3 = imageUrl3,
            imageUrl4 = imageUrl4,
            isActive = isActive,
            price = variants.firstOrNull()?.price,
            stock = variants.firstOrNull()?.stockQuantity,
            variantCount = variants.size
    )

    @GetMapping
    fun listProducts(): List<AdminProductDto> = productRepository.findAll().map { it.toDto() }

    /**
     * Crea producto. Acepta imagen como archivo (image) o como URL de Cloudinary (imageUrl).
     * Si se proveen ambos, imageUrl tiene precedencia.
     */
    @PostMapping(consumes = ["multipart/form-data"])
    fun createProduct(
            @RequestParam name: String,
            @RequestParam(required = false) description: String?,
            @RequestParam(required = false) brand: String?,
            @RequestParam(required = false) category: String?,
            @RequestParam price: BigDecimal,
            @RequestParam stock: Int,
            @RequestParam(required = false) imageUrl: String?,
            @RequestParam(required = false) imageUrl2: String?,
            @RequestParam(required = false) imageUrl3: String?,
            @RequestParam(required = false) imageUrl4: String?,
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
                category = category?.ifBlank { null },
                mainImageUrl = finalImageUrl,
                imageUrl2 = imageUrl2?.ifBlank { null },
                imageUrl3 = imageUrl3?.ifBlank { null },
                imageUrl4 = imageUrl4?.ifBlank { null }
        )
        val defaultVariant = ProductVariant(
                product = product,
                sku = "SKU-${System.currentTimeMillis()}",
                price = price,
                stockQuantity = stock
        )
        product.addVariant(defaultVariant)
        val saved = productRepository.save(product)
        return ResponseEntity.status(HttpStatus.CREATED).body(saved.toDto())
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
        if (request.description != null) product.description = request.description.ifBlank { null }
        if (request.brand != null) product.brand = request.brand.ifBlank { null }
        if (request.category != null) product.category = request.category.ifBlank { null }
        if (request.imageUrl != null) product.mainImageUrl = request.imageUrl.ifBlank { null }
        if (request.imageUrl2 != null) product.imageUrl2 = request.imageUrl2.ifBlank { null }
        if (request.imageUrl3 != null) product.imageUrl3 = request.imageUrl3.ifBlank { null }
        if (request.imageUrl4 != null) product.imageUrl4 = request.imageUrl4.ifBlank { null }
        if (request.isActive != null) product.isActive = request.isActive

        val firstVariant = product.variants.firstOrNull()
        if (firstVariant != null) {
            if (request.price != null) firstVariant.price = request.price
            if (request.stock != null) firstVariant.stockQuantity = request.stock
        }

        val saved = productRepository.save(product)
        return ResponseEntity.ok(saved.toDto())
    }

    @DeleteMapping("/{id}")
    fun deleteProduct(@PathVariable id: Long): ResponseEntity<Void> {
        if (!productRepository.existsById(id)) return ResponseEntity.notFound().build()
        productRepository.deleteById(id)
        return ResponseEntity.noContent().build()
    }
}
