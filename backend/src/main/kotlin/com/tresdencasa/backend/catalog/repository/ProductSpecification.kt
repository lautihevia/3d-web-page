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

    /** Filtra productos con precio mínimo. */
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

    /** Filtra productos destacados (featured = true). */
    fun isFeatured(featured: Boolean?): Specification<Product> {
        return Specification { root, _, cb ->
            if (featured == true) cb.equal(root.get<Boolean>("featured"), true) else null
        }
    }

    /** Filtra productos por nombre (case-insensitive, búsqueda parcial). */
    fun hasName(name: String?): Specification<Product> {
        return Specification { root, _, cb ->
            if (name.isNullOrBlank()) null
            else cb.like(cb.lower(root.get("name")), "%${name.lowercase()}%")
        }
    }

    /** Filtra productos cuya marca esté en la lista (OR, case-insensitive). */
    fun hasAnyBrand(brands: List<String>?): Specification<Product> {
        return Specification { root, _, cb ->
            if (brands.isNullOrEmpty()) null
            else cb.lower(root.get("brand")).`in`(brands.map { it.lowercase() })
        }
    }

    /** Filtra productos cuya subcategoría esté en la lista (OR, case-insensitive). */
    fun hasAnySubcategory(subcategories: List<String>?): Specification<Product> {
        return Specification { root, _, cb ->
            if (subcategories.isNullOrEmpty()) null
            else cb.lower(root.get("subcategory")).`in`(subcategories.map { it.lowercase() })
        }
    }

    /** Filtra productos en oferta (onSale = true). */
    fun isOnSale(onSale: Boolean?): Specification<Product> {
        return Specification { root, _, cb ->
            if (onSale == true) cb.equal(root.get<Boolean>("onSale"), true) else null
        }
    }
}
