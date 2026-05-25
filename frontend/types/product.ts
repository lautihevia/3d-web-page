/**
 * Tipos de TypeScript para el catálogo de productos.
 * Basados en la respuesta de la API Spring Boot.
 */

/**
 * Variante de un producto (ej: filamento rojo 1kg).
 */
export interface ProductVariant {
    id: number;
    sku: string;
    price: number;
    stockQuantity: number;
    attributes: Record<string, unknown>;
}

/**
 * Producto del catálogo.
 */
export interface Product {
    id: number;
    name: string;
    description: string | null;
    brand: string | null;
    mainImageUrl: string | null;
    isActive: boolean;
    featured: boolean;
    onSale: boolean;
    salePrice: number | null;
    createdAt: string;
    variants: ProductVariant[];
}

/**
 * Respuesta paginada genérica de Spring Data.
 */
export interface PaginatedResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number; // Página actual (0-indexed)
    first: boolean;
    last: boolean;
    empty: boolean;
}

/**
 * Respuesta paginada específica para productos.
 */
export type PaginatedProducts = PaginatedResponse<Product>;
