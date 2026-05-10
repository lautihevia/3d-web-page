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
  } catch {
    return [];
  }
}

export default async function BrandPage({ params, searchParams }: PageProps) {
  const { brand } = await params;
  const search = await searchParams;

  const minPrice =
    typeof search.minPrice === "string" ? search.minPrice : undefined;
  const maxPrice =
    typeof search.maxPrice === "string" ? search.maxPrice : undefined;
  const isActive =
    typeof search.isActive === "string" ? search.isActive : undefined;

  const decodedBrand = decodeURIComponent(brand);
  const products = await getProducts(decodedBrand, minPrice, maxPrice, isActive);

  return (
    <div style={{ background: "#f7f6f1", minHeight: "100vh" }}>
      <BrandHeader brand={decodedBrand} />

      <div
        className="rsp-section-pad rsp-store-content"
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "24px 56px 80px",
          display: "flex",
          gap: 32,
        }}
      >
        {/* Filter sidebar */}
        <div className="hidden lg:block">
          <Suspense fallback={null}>
            <FilterSidebar brand={decodedBrand} />
          </Suspense>
        </div>

        {/* Product grid */}
        <main style={{ flex: 1 }}>
          <div className="mb-4 lg:hidden">
            <Suspense fallback={null}>
              <MobileFilterDrawer brand={decodedBrand} />
            </Suspense>
          </div>

          <div
            style={{
              fontSize: 13,
              color: "rgba(0,0,0,.55)",
              marginBottom: 16,
              marginTop: 16,
            }}
          >
            {products.length} producto{products.length !== 1 ? "s" : ""} encontrado
            {products.length !== 1 ? "s" : ""}
          </div>

          {products.length > 0 ? (
            <div
              className="rsp-3col-to-2"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 16,
              }}
            >
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  description={product.description}
                  imageUrl={product.mainImageUrl}
                  price={product.variants[0]?.price}
                  brand={product.brand}
                />
              ))}
            </div>
          ) : (
            <div
              style={{
                padding: 60,
                textAlign: "center",
                background: "#fff",
                borderRadius: 16,
                color: "rgba(0,0,0,.5)",
              }}
            >
              No hay productos con esos filtros.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
