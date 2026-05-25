package com.tresdencasa.backend.admin

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.tresdencasa.backend.admin.dto.AdminProductDto
import com.tresdencasa.backend.admin.dto.ColorImageDto
import com.tresdencasa.backend.catalog.FileUploadService
import com.tresdencasa.backend.catalog.entity.Product
import com.tresdencasa.backend.catalog.entity.ProductColorImage
import com.tresdencasa.backend.catalog.entity.ProductVariant
import com.tresdencasa.backend.catalog.repository.ProductRepository
import java.math.BigDecimal
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

data class ColorImageInput(
        val colorName: String = "",
        val imageUrl: String = "",
        val sortOrder: Int = 0
)

data class UpdateProductRequest(
        val name: String? = null,
        val description: String? = null,
        val brand: String? = null,
        val category: String? = null,
        val subcategory: String? = null,
        val price: BigDecimal? = null,
        val stock: Int? = null,
        val imageUrl: String? = null,
        val imageUrl2: String? = null,
        val imageUrl3: String? = null,
        val imageUrl4: String? = null,
        val isActive: Boolean? = null,
        val featured: Boolean? = null,
        val technicalSpecs: String? = null,
        val compatibilityNotes: String? = null,
        val onSale: Boolean? = null,
        val salePrice: BigDecimal? = null,
        val colorImages: List<ColorImageInput>? = null
)

@RestController
@RequestMapping("/api/v1/admin/products")
class AdminProductController(
        private val productRepository: ProductRepository,
        private val fileUploadService: FileUploadService
) {
    private val objectMapper = jacksonObjectMapper()

    private fun Product.toDto() = AdminProductDto(
            id = id,
            name = name,
            description = description,
            brand = brand,
            category = category,
            subcategory = subcategory,
            mainImageUrl = mainImageUrl,
            imageUrl2 = imageUrl2,
            imageUrl3 = imageUrl3,
            imageUrl4 = imageUrl4,
            isActive = isActive,
            featured = featured,
            technicalSpecs = technicalSpecs,
            compatibilityNotes = compatibilityNotes,
            onSale = onSale,
            salePrice = salePrice,
            price = variants.firstOrNull()?.price,
            stock = variants.firstOrNull()?.stockQuantity,
            variantCount = variants.size,
            colorImages = colorImages.map { ColorImageDto(it.id, it.colorName, it.imageUrl, it.sortOrder) }
    )

    @GetMapping
    fun listProducts(): List<AdminProductDto> = productRepository.findAll().map { it.toDto() }

    @PostMapping(consumes = ["multipart/form-data"])
    fun createProduct(
            @RequestParam name: String,
            @RequestParam(required = false) description: String?,
            @RequestParam(required = false) brand: String?,
            @RequestParam(required = false) category: String?,
            @RequestParam(required = false) subcategory: String?,
            @RequestParam price: BigDecimal,
            @RequestParam stock: Int,
            @RequestParam(required = false) imageUrl: String?,
            @RequestParam(required = false) imageUrl2: String?,
            @RequestParam(required = false) imageUrl3: String?,
            @RequestParam(required = false) imageUrl4: String?,
            @RequestParam(required = false) image: MultipartFile?,
            @RequestParam(required = false) featured: Boolean?,
            @RequestParam(required = false) colorImagesJson: String?,
            @RequestParam(required = false) technicalSpecs: String?,
            @RequestParam(required = false) compatibilityNotes: String?,
            @RequestParam(required = false) onSale: Boolean?,
            @RequestParam(required = false) salePrice: BigDecimal?
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
                subcategory = subcategory?.ifBlank { null },
                mainImageUrl = finalImageUrl,
                imageUrl2 = imageUrl2?.ifBlank { null },
                imageUrl3 = imageUrl3?.ifBlank { null },
                imageUrl4 = imageUrl4?.ifBlank { null },
                featured = featured ?: false,
                technicalSpecs = technicalSpecs?.ifBlank { null },
                compatibilityNotes = compatibilityNotes?.ifBlank { null },
                onSale = onSale ?: false,
                salePrice = salePrice
        )
        val defaultVariant = ProductVariant(
                product = product,
                sku = "SKU-${System.currentTimeMillis()}",
                price = price,
                stockQuantity = stock
        )
        product.addVariant(defaultVariant)

        if (!colorImagesJson.isNullOrBlank()) {
            try {
                val colorInputs: List<ColorImageInput> = objectMapper.readValue(
                        colorImagesJson,
                        object : TypeReference<List<ColorImageInput>>() {}
                )
                colorInputs.forEachIndexed { i, ci ->
                    if (ci.colorName.isNotBlank() && ci.imageUrl.isNotBlank()) {
                        product.addColorImage(ProductColorImage(
                                colorName = ci.colorName.trim(),
                                imageUrl = ci.imageUrl.trim(),
                                sortOrder = ci.sortOrder.takeIf { it > 0 } ?: i
                        ))
                    }
                }
            } catch (_: Exception) {}
        }

        val saved = productRepository.save(product)
        return ResponseEntity.status(HttpStatus.CREATED).body(saved.toDto())
    }

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
        if (request.subcategory != null) product.subcategory = request.subcategory.ifBlank { null }
        if (request.imageUrl != null) product.mainImageUrl = request.imageUrl.ifBlank { null }
        if (request.imageUrl2 != null) product.imageUrl2 = request.imageUrl2.ifBlank { null }
        if (request.imageUrl3 != null) product.imageUrl3 = request.imageUrl3.ifBlank { null }
        if (request.imageUrl4 != null) product.imageUrl4 = request.imageUrl4.ifBlank { null }
        if (request.isActive != null) product.isActive = request.isActive
        if (request.featured != null) product.featured = request.featured
        if (request.technicalSpecs != null) product.technicalSpecs = request.technicalSpecs.ifBlank { null }
        if (request.compatibilityNotes != null) product.compatibilityNotes = request.compatibilityNotes.ifBlank { null }
        if (request.onSale != null) {
            product.onSale = request.onSale
            if (!request.onSale) product.salePrice = null
        }
        if (request.salePrice != null) product.salePrice = request.salePrice

        val firstVariant = product.variants.firstOrNull()
        if (firstVariant != null) {
            if (request.price != null) firstVariant.price = request.price
            if (request.stock != null) firstVariant.stockQuantity = request.stock
        }

        if (request.colorImages != null) {
            product.colorImages.clear()
            request.colorImages.forEachIndexed { i, ci ->
                if (ci.colorName.isNotBlank() && ci.imageUrl.isNotBlank()) {
                    product.addColorImage(ProductColorImage(
                            colorName = ci.colorName.trim(),
                            imageUrl = ci.imageUrl.trim(),
                            sortOrder = ci.sortOrder.takeIf { it > 0 } ?: i
                    ))
                }
            }
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
