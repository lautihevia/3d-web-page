import Image from "next/image";
import Link from "next/link";

interface CategoryCardProps {
    name: string;
    slug: string;
    imageUrl?: string;
}

/**
 * Card de categoría estilo "Apple Card" - minimalista y elegante.
 * Fondo blanco, bordes redondeados, imagen centrada, texto en esquina inferior izquierda.
 */
export function CategoryCard({ name, slug, imageUrl }: CategoryCardProps) {
    // Imagen placeholder si no hay imagen
    const image = imageUrl || "https://via.placeholder.com/400x400?text=" + encodeURIComponent(name);

    return (
        <Link href={`/categoria/${slug}`} className="group block">
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
                    <h3 className="font-bold text-sm text-slate-900">
                        {name}
                    </h3>
                </div>
            </div>
        </Link>
    );
}
