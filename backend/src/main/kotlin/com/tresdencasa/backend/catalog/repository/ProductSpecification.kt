package com.tresdencasa.backend.catalog.repository

import com.tresdencasa.backend.catalog.entity.Product
import org.springframework.data.jpa.domain.Specification

/** Especificaciones JPA para filtrado dinámico de productos. */
object ProductSpecification {

    /** Filtra productos por marca (case-insensitive). */
    fun hasBrand(brand: String?): Specification<Product> {
        return Specification { root, _, cb ->
            if (brand.isNullOrBlank()) null
            else cb.equal(cb.lower(root.get("brand")), brand.lowercase())
        }
    }

    /**
     * Filtra productos con precio mínimo. Compara contra el precio de la primera variante del
     * producto.
     */
    fun minPrice(minPrice: Double?): Specification<Product> {
        return Specification { root, query, cb ->
            if (minPrice == null) null
            else {
                val variantsJoin = root.join<Product, Any>("variants")
                query.distinct(true)
                cb.greaterThanOrEqualTo(variantsJoin.get("price"), minPrice)
            }
        }
    }

    /** Filtra productos con precio máximo. */
    fun maxPrice(maxPrice: Double?): Specification<Product> {
        return Specification { root, query, cb ->
            if (maxPrice == null) null
            else {
                val variantsJoin = root.join<Product, Any>("variants")
                query.distinct(true)
                cb.lessThanOrEqualTo(variantsJoin.get("price"), maxPrice)
            }
        }
    }

    /** Filtra productos activos (isActive = true). */
    fun isActive(onlyActive: Boolean?): Specification<Product> {
        return Specification { root, _, cb ->
            if (onlyActive == true) cb.equal(root.get<Boolean>("isActive"), true) else null
        }
    }
}
