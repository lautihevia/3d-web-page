import { Suspense } from "react";
import { BrandHeader } from "@/components/store/BrandHeader";
import { FilterSidebar } from "@/components/store/FilterSidebar";
import { MobileFilterDrawer } from "@/components/store/MobileFilterDrawer";
import { ProductCard } from "@/components/products/ProductCard";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface Product {
    id: number;
    name: string;
    description?: string;
    brand?: string;
    mainImageUrl?: string;
    isActive: boolean;
    variants: {
        id: number;
        sku: string;
        price: number;
        stock: number;
    }[];
}

interface PageProps {
    params: Promise<{ brand: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * Obtiene productos filtrados del backend.
 */
async function getProducts(
    brand: string,
    minPrice?: string,
    maxPrice?: string,
    isActive?: string
): Promise<Product[]> {
    const params = new URLSearchParams();
    params.set("brand", brand);
    params.set("size", "50");

    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (isActive) params.set("isActive", isActive);

    try {
        const res = await fetch(`${API_URL}/api/v1/products?${params.toString()}`, {
            cache: "no-store",
        });

        if (!res.ok) return [];

        const data = await res.json();
        return data.content || [];
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

/**
 * Página dinámica de marca con filtros.
 * Layout: Sidebar (filtros) + Grilla de productos.
 */
export default async function BrandPage({ params, searchParams }: PageProps) {
    const { brand } = await params;
    const search = await searchParams;

    const minPrice = typeof search.minPrice === "string" ? search.minPrice : undefined;
    const maxPrice = typeof search.maxPrice === "string" ? search.maxPrice : undefined;
    const isActive = typeof search.isActive === "string" ? search.isActive : undefined;

    const products = await getProducts(brand, minPrice, maxPrice, isActive);

    return (
        <div className="min-h-screen bg-slate-100">
            {/* Header */}
            <BrandHeader brand={brand} />

            {/* Contenido principal */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar - Oculto en móvil por defecto */}
                    <div className="hidden lg:block">
                        <Suspense fallback={<div>Cargando filtros...</div>}>
                            <FilterSidebar brand={brand} />
                        </Suspense>
                    </div>

                    {/* Grilla de productos */}
                    <main className="flex-1">
                        {/* Mobile filter button */}
                        <div className="mb-4 lg:hidden">
                            <Suspense fallback={null}>
                                <MobileFilterDrawer brand={brand} />
                            </Suspense>
                        </div>

                        {products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        id={product.id}
                                        name={product.name}
                                        description={product.description}
                                        imageUrl={product.mainImageUrl || "/placeholder-product.png"}
                                        price={product.variants[0]?.price}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <p className="text-xl text-slate-600 mb-2">
                                    No hay productos disponibles
                                </p>
                                <p className="text-slate-400">
                                    Probá ajustando los filtros o volvé más tarde.
                                </p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
