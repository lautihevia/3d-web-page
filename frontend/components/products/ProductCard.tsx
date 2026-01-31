import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
 * Card de producto para la grilla del catálogo.
 */
export function ProductCard({ product }: ProductCardProps) {
    const minPrice = getMinPrice(product);

    // Imagen placeholder si no hay imagen
    const imageUrl = product.mainImageUrl || "https://via.placeholder.com/400x300?text=Sin+Imagen";

    return (
        <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            {/* Imagen del producto */}
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Badge de marca */}
                {product.brand && (
                    <span className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-xs font-medium px-2 py-1 rounded-md">
                        {product.brand}
                    </span>
                )}
            </div>

            <CardHeader className="py-4">
                <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
            </CardHeader>

            <CardContent className="py-0">
                {product.description && (
                    <p className="text-muted-foreground text-sm line-clamp-2">
                        {product.description}
                    </p>
                )}

                {/* Precio */}
                <div className="mt-3 font-semibold text-lg">
                    {minPrice !== null ? (
                        <span>
                            Desde <span className="text-primary">{formatPrice(minPrice)}</span>
                        </span>
                    ) : (
                        <span className="text-muted-foreground">Ver precio</span>
                    )}
                </div>

                {/* Variantes disponibles */}
                {product.variants.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                        {product.variants.length} variante{product.variants.length > 1 ? "s" : ""} disponible{product.variants.length > 1 ? "s" : ""}
                    </p>
                )}
            </CardContent>

            <CardFooter className="pt-4">
                <Button asChild className="w-full">
                    <Link href={`/products/${product.id}`}>
                        Ver Detalle
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
