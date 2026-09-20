import { Suspense } from "react";
import { BrandHeader } from "@/components/store/BrandHeader";
import { FilterSidebar } from "@/components/store/FilterSidebar";
import { MobileFilterDrawer } from "@/components/store/MobileFilterDrawer";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductGridSkeleton } from "@/components/products/ProductGridSkeleton";
import {
  matchingColors,
  sanitizeColorKeys,
  type MatchedColor,
  type ProductColorImage,
} from "@/lib/filamentColors";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface Product {
  id: number;
  name: string;
  description?: string;
  brand?: string;
  mainImageUrl?: string;
  isActive: boolean;
  onSale?: boolean;
  salePrice?: number;
  variants: {
    id: number;
    sku: string;
    price: number;
    stock: number;
  }[];
  colorImages?: ProductColorImage[];
}

/** Una tarjeta del listado: el producto y, si hay filtro, el color que matcheó. */
type ProductCardEntry = { product: Product; color: MatchedColor | null };

interface PageProps {
  params: Promise<{ brand: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getProducts(
  brand: string,
  minPrice?: string,
  maxPrice?: string,
  isActive?: string,
  subcategory?: string,
  colors?: string
): Promise<Product[]> {
  const params = new URLSearchParams();
  params.set("brand", brand);
  params.set("size", "50");
  if (minPrice) params.set("minPrice", minPrice);
  if (maxPrice) params.set("maxPrice", maxPrice);
  if (isActive) params.set("isActive", isActive);
  if (subcategory) params.set("subcategory", subcategory);
  if (colors) params.set("colors", colors);

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

const GRID_CLASS = "rsp-3col-to-2";
const GRID_COLUMNS = "repeat(3,1fr)";

/** Aislado en su propio componente para poder suspenderlo detrás del esqueleto. */
async function BrandResults(props: {
  brand: string;
  minPrice?: string;
  maxPrice?: string;
  isActive?: string;
  subcategory?: string;
  colors?: string;
}) {
  const products = await getProducts(
    props.brand,
    props.minPrice,
    props.maxPrice,
    props.isActive,
    props.subcategory,
    props.colors
  );

  // Con el filtro de color activo la tarjeta muestra la bobina de ese color.
  const selectedColors = sanitizeColorKeys((props.colors || "").split(","));
  const filteringByColor = selectedColors.length > 0;

  // Con filtro de color el listado se abre por color: un mismo filamento que
  // matchee celeste y rojo sale dos veces, una con cada foto.
  const cards = products.flatMap((p): ProductCardEntry[] => {
    const colors = matchingColors(p.colorImages, selectedColors);
    return colors.length > 0
      ? colors.map((color) => ({ product: p, color }))
      : [{ product: p, color: null }];
  });

  const total = filteringByColor ? cards.length : products.length;
  const noun = filteringByColor ? "resultado" : "producto";

  return (
    <>
      <div style={{ fontSize: 13, color: "rgba(0,0,0,.55)", marginBottom: 16, marginTop: 16 }}>
        {total} {noun}
        {total !== 1 ? "s" : ""} encontrado{total !== 1 ? "s" : ""}
      </div>

      {cards.length > 0 ? (
        <div
          className={GRID_CLASS}
          style={{ display: "grid", gridTemplateColumns: GRID_COLUMNS, gap: 16 }}
        >
          {cards.map(({ product, color }) => {
            return (
              <ProductCard
                key={`${product.id}-${color?.colorName ?? "main"}`}
                id={product.id}
                name={product.name}
                description={product.description}
                imageUrl={color?.imageUrl ?? product.mainImageUrl}
                price={product.variants[0]?.price}
                brand={product.brand}
                onSale={product.onSale}
                salePrice={product.salePrice}
                color={color ?? undefined}
              />
            );
          })}
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
    </>
  );
}

function BrandResultsFallback() {
  return (
    <>
      <div
        className="skeleton-box"
        style={{ height: 13, width: 160, marginBottom: 16, marginTop: 16 }}
      />
      <ProductGridSkeleton count={9} className={GRID_CLASS} columns={GRID_COLUMNS} gap={16} />
    </>
  );
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
  const subcategory =
    typeof search.subcategory === "string" ? search.subcategory : undefined;
  const colors =
    typeof search.colors === "string" ? search.colors : undefined;

  const decodedBrand = decodeURIComponent(brand);
  const suspenseKey = `${decodedBrand}|${minPrice}|${maxPrice}|${isActive}|${subcategory}|${colors}`;

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

          <Suspense key={suspenseKey} fallback={<BrandResultsFallback />}>
            <BrandResults
              brand={decodedBrand}
              minPrice={minPrice}
              maxPrice={maxPrice}
              isActive={isActive}
              subcategory={subcategory}
              colors={colors}
            />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
