import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BrandHeaderProps {
    brand: string;
}

/**
 * Header banner para la página de marca.
 * Muestra el nombre de la marca capitalizado y breadcrumbs de navegación.
 */
export function BrandHeader({ brand }: BrandHeaderProps) {
    // Capitalizar nombre de marca
    const brandName = brand.charAt(0).toUpperCase() + brand.slice(1);

    return (
        <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumbs */}
                <nav className="flex items-center space-x-2 text-sm text-blue-200 mb-2">
                    <Link href="/" className="hover:text-white transition-colors">
                        Inicio
                    </Link>
                    <ChevronRight className="h-4 w-4" />
                    <Link href="/store" className="hover:text-white transition-colors">
                        Tienda
                    </Link>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-white font-medium">{brandName}</span>
                </nav>

                {/* Título */}
                <h1 className="text-3xl md:text-4xl font-bold">{brandName}</h1>
                <p className="text-blue-100 mt-2">
                    Explorá todos los productos de {brandName}
                </p>
            </div>
        </header>
    );
}
