import Image from "next/image";

interface ProductGalleryProps {
    mainImageUrl?: string;
    productName: string;
}

/**
 * Galería de producto estilo "Pro" - Imagen principal grande con fondo limpio.
 * Futuro: Agregar thumbnails si hay múltiples imágenes.
 */
export function ProductGallery({ mainImageUrl, productName }: ProductGalleryProps) {
    const imageUrl = mainImageUrl || "https://via.placeholder.com/800x800?text=Sin+Imagen";

    return (
        <div className="w-full">
            {/* Imagen principal */}
            <div className="relative aspect-square bg-slate-50 rounded-2xl overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={productName}
                    fill
                    sizes="(max-width: 768px) 100vw, 60vw"
                    className="object-contain p-8"
                    priority
                />
            </div>

            {/* Futuro: Thumbnails */}
            {/* <div className="mt-4 grid grid-cols-4 gap-2">
                {thumbnails.map((thumb) => (
                    <button key={thumb.id} className="aspect-square bg-slate-50 rounded-lg">
                        <Image src={thumb.url} alt="" fill className="object-contain p-2" />
                    </button>
                ))}
            </div> */}
        </div>
    );
}
