import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";

interface ProductCardProps {
    product: Product;
}

/**
 * Calcula el precio mínimo de las variantes de un producto.
 * Retorna null si no hay variantes.
 */
function getMinPrice(product: Product): number | null {
    if (product.variants.length === 0) {
        return null;
    }
    return Math.min(...product.variants.map((v) => v.price));
}

/**
 * Formatea un precio en pesos argentinos.
 */
function formatPrice(price: number): string {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}

/**
 * Card de producto estilo "Apple Card" - minimalista y elegante.
 * Fondo blanco, bordes redondeados, imagen centrada, texto en esquina inferior izquierda.
 */
export function ProductCard({ product }: ProductCardProps) {
    const minPrice = getMinPrice(product);

    // Imagen placeholder si no hay imagen
    const imageUrl = product.mainImageUrl || "https://via.placeholder.com/400x400?text=Sin+Imagen";

    return (
        <Link href={`/products/${product.id}`} className="group block">
            <div className="bg-white rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-md aspect-square relative">
                {/* Imagen centrada con padding generoso */}
                <div className="absolute inset-0 p-8 flex items-center justify-center">
                    <div className="relative w-full h-full">
                        <Image
                            src={imageUrl}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                            className="object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                </div>

                {/* Texto en esquina inferior izquierda */}
                <div className="absolute bottom-0 left-0 p-6">
                    <h3 className="font-bold text-sm text-slate-900 line-clamp-2">
                        {product.name}
                    </h3>
                    {minPrice !== null && (
                        <p className="text-xs text-slate-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            Desde {formatPrice(minPrice)}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
}
