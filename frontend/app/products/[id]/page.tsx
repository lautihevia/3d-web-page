import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductConfigurator } from "@/components/products/ProductConfigurator";
import { InfoAccordions } from "@/components/products/InfoAccordions";
import { notFound } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface ProductVariant {
    id: number;
    sku: string;
    price: number;
    stockQuantity: number;
    attributes: Record<string, string>;
}

interface Product {
    id: number;
    name: string;
    description?: string;
    brand?: string;
    mainImageUrl?: string;
    isActive: boolean;
    variants: ProductVariant[];
}

interface PageProps {
    params: Promise<{ id: string }>;
}

/**
 * Obtiene un producto por ID desde el backend.
 */
async function getProduct(id: string): Promise<Product | null> {
    try {
        const res = await fetch(`${API_URL}/api/v1/products/${id}`, {
            cache: "no-store",
        });

        if (!res.ok) return null;

        return res.json();
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}

/**
 * Página de detalle de producto "Pro" - Estilo Artifact/Apple.
 * Layout: 60% Galería (izquierda) / 40% Configurador (derecha sticky).
 */
export default async function ProductDetailPage({ params }: PageProps) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                    {/* Columna Izquierda: Galería (60% = 3/5) */}
                    <div className="lg:col-span-3">
                        <ProductGallery
                            mainImageUrl={product.mainImageUrl}
                            productName={product.name}
                        />
                    </div>

                    {/* Columna Derecha: Configurador + Info (40% = 2/5, sticky) */}
                    <div className="lg:col-span-2">
                        <div className="lg:sticky lg:top-20 space-y-8">
                            {/* Configurador */}
                            <ProductConfigurator
                                productId={product.id}
                                productName={product.name}
                                productBrand={product.brand}
                                productImageUrl={product.mainImageUrl}
                                variants={product.variants}
                            />

                            {/* Acordeones de Información */}
                            <InfoAccordions description={product.description} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
