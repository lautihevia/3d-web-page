import { ProductCard } from "@/components/products/ProductCard";
import { Hero } from "@/components/home/Hero";
import { CategoryCard } from "@/components/home/CategoryCard";
import type { PaginatedProducts } from "@/types/product";

/**
 * URL base del API de backend.
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/**
 * Obtiene los productos del catálogo desde el backend.
 */
async function getProducts(): Promise<PaginatedProducts> {
  const response = await fetch(`${API_BASE_URL}/api/v1/products`, {
    cache: "no-store", // No cachear para desarrollo
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Error al obtener productos: ${response.status}`);
  }

  return response.json();
}

/**
 * Página principal del catálogo de productos.
 * Server Component con fetch SSR.
 */
export default async function HomePage() {
  let productsData: PaginatedProducts;

  try {
    productsData = await getProducts();
  } catch (error) {
    console.error("Error fetching products:", error);
    return (
      <>
        <Hero />
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">Nuestros Productos</h2>
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
              <p className="text-destructive font-medium">
                Error al cargar los productos. Por favor, verifica que el backend esté corriendo.
              </p>
              <p className="text-muted-foreground text-sm mt-2">
                Asegúrate de que el servidor esté disponible en {API_BASE_URL}
              </p>
            </div>
          </div>
        </section>
      </>
    );
  }

  const products = productsData.content;

  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Categorías - 5 tarjetas fijas */}
      <section className="py-16">
        <div className="container mx-auto px-4">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            <CategoryCard name="Bambu Lab" slug="impresoras/bambulab" imageUrl="/categorias/bambulab-categoria.jpeg" />
            <CategoryCard name="Creality" slug="impresoras/creality" imageUrl="/categorias/creality-categoria.jpeg" />
            <CategoryCard name="Hellbot" slug="impresoras/hellbot" imageUrl="/categorias/hellbot-categoria.jpeg" />
            <CategoryCard name="W3D" slug="insumos/w3d" imageUrl="/categorias/w3d-categoria.jpeg" />
            <CategoryCard name="Arduino" slug="electronica/arduino" imageUrl="/categorias/arduino-categoria.jpeg" />
          </div>
        </div>
      </section>

      {/* Catálogo de Productos */}
      <section id="productos" className="py-16">
        <div className="container mx-auto px-4">
          {/* Header de la página */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Nuestros Productos</h2>
            <p className="text-muted-foreground">
              {productsData.totalElements} producto{productsData.totalElements !== 1 ? "s" : ""} encontrado{productsData.totalElements !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Grilla de productos */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No hay productos disponibles en este momento.
              </p>
            </div>
          )}

          {/* Info de paginación */}
          {productsData.totalPages > 1 && (
            <div className="mt-8 text-center text-sm text-muted-foreground">
              Página {productsData.number + 1} de {productsData.totalPages}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

