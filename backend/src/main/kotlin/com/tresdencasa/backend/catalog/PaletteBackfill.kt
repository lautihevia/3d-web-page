package com.tresdencasa.backend.catalog

import com.tresdencasa.backend.catalog.repository.ProductRepository
import org.springframework.boot.CommandLineRunner
import org.springframework.core.annotation.Order
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

/**
 * Completa `paletteColors` de los colores que todavía no lo tengan, deduciéndolo
 * del nombre escrito a mano. Corre en cada arranque pero es idempotente: solo
 * toca filas vacías, así que lo que el admin corrija a mano no se pisa nunca.
 *
 * Existe para no tener que retaggear a mano el catálogo que ya estaba cargado
 * cuando se agregó el filtro de color.
 */
@Component
@Order(100)
class PaletteBackfill(private val productRepository: ProductRepository) : CommandLineRunner {

    @Transactional
    override fun run(vararg args: String) {
        val products = productRepository.findAll()
        var touched = 0

        for (product in products) {
            var changed = false
            for (colorImage in product.colorImages) {
                if (colorImage.paletteColors.isNotEmpty()) continue
                val inferred = FilamentPalette.inferFrom(colorImage.colorName)
                if (inferred.isEmpty()) continue
                colorImage.paletteColors = inferred
                changed = true
                touched++
            }
            if (changed) productRepository.save(product)
        }

        if (touched > 0) {
            println("🎨 Paleta: $touched colores etiquetados automáticamente")
        }
    }
}
