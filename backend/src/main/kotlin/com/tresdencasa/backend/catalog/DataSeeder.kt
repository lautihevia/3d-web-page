package com.tresdencasa.backend.catalog

import com.tresdencasa.backend.catalog.entity.Product
import com.tresdencasa.backend.catalog.entity.ProductVariant
import com.tresdencasa.backend.catalog.repository.ProductRepository
import org.springframework.boot.CommandLineRunner
import org.springframework.stereotype.Component
import java.math.BigDecimal

/**
 * Componente para sembrar datos de prueba al iniciar la aplicación.
 * Solo inserta datos si la base está vacía.
 */
@Component
class DataSeeder(
    private val productRepository: ProductRepository
) : CommandLineRunner {

    override fun run(vararg args: String) {
        if (productRepository.count() > 0) {
            println("📦 Datos ya existentes, saltando seeding...")
            return
        }

        seedProducts()
        println("✅ Data seeding completado exitosamente")
    }

    private fun seedProducts() {
        // ─────────────────────────────────────────────────────────────
        // Producto 1: Impresora 3D (sin variantes por ahora)
        // ─────────────────────────────────────────────────────────────
        val printer = Product(
            name = "Ender 3 V3",
            description = "Impresora 3D Creality Ender 3 V3 con sistema CoreXZ. " +
                    "Velocidad máxima de 500mm/s, pantalla táctil y nivelación automática.",
            brand = "Creality",
            mainImageUrl = "https://images.3dencasa.com/products/ender3v3.jpg"
        )
        productRepository.save(printer)
        println("   └── Creada impresora: ${printer.name}")

        // ─────────────────────────────────────────────────────────────
        // Producto 2: Filamento PLA con variantes de color
        // ─────────────────────────────────────────────────────────────
        val filament = Product(
            name = "Grilon PLA",
            description = "Filamento PLA de alta calidad fabricado en Argentina. " +
                    "Excelente adhesión entre capas y acabado superficial brillante.",
            brand = "Grilon3"
        )

        // Variante Roja
        val variantRed = ProductVariant(
            product = filament,
            sku = "GRI-PLA-RED",
            price = BigDecimal("8500.00"),
            stockQuantity = 50,
            attributes = mutableMapOf(
                "color" to "Rojo",
                "peso" to "1kg",
                "diametro" to "1.75mm",
                "material" to "PLA"
            )
        )

        // Variante Negra
        val variantBlack = ProductVariant(
            product = filament,
            sku = "GRI-PLA-BLK",
            price = BigDecimal("8500.00"),
            stockQuantity = 30,
            attributes = mutableMapOf(
                "color" to "Negro",
                "peso" to "1kg",
                "diametro" to "1.75mm",
                "material" to "PLA"
            )
        )

        // Agregar variantes al producto
        filament.addVariant(variantRed)
        filament.addVariant(variantBlack)

        productRepository.save(filament)
        println("   └── Creado filamento: ${filament.name} con ${filament.variants.size} variantes")

        println("   Resumen: 2 productos, 2 variantes de filamento")
    }
}
