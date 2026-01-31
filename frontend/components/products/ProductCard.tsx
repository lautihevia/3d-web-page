import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
    id: number;
    name: string;
    description?: string;
    imageUrl?: string;
    price?: number;
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
export function ProductCard({ id, name, description, imageUrl, price }: ProductCardProps) {
    // Imagen placeholder si no hay imagen
    const image = imageUrl || "https://via.placeholder.com/400x400?text=Sin+Imagen";

    return (
        <Link href={`/products/${id}`} className="group block">
            <div className="bg-white rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-md aspect-square relative">
                {/* Imagen centrada con padding generoso */}
                <div className="absolute inset-0 p-8 flex items-center justify-center">
                    <div className="relative w-full h-full">
                        <Image
                            src={image}
                            alt={name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                            className="object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                </div>

                {/* Texto en esquina inferior izquierda */}
                <div className="absolute bottom-0 left-0 p-6">
                    <h3 className="font-bold text-sm text-slate-900 line-clamp-2">
                        {name}
                    </h3>
                    {price !== undefined && (
                        <p className="text-xs text-slate-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            Desde {formatPrice(price)}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
}
