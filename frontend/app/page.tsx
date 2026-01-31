import { ProductCard } from "@/components/products/ProductCard";
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
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Nuestros Productos</h1>
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
          <p className="text-destructive font-medium">
            Error al cargar los productos. Por favor, verifica que el backend esté corriendo.
          </p>
          <p className="text-muted-foreground text-sm mt-2">
            Asegúrate de que el servidor esté disponible en {API_BASE_URL}
          </p>
        </div>
      </main>
    );
  }

  const products = productsData.content;

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Header de la página */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Nuestros Productos</h1>
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
    </main>
  );
}
