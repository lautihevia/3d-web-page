import { Suspense } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductGridSkeleton } from "@/components/products/ProductGridSkeleton";
import { CatalogFilters } from "./CatalogFilters";
import { CatalogFilterDrawer } from "./CatalogFilterDrawer";
import {
  matchingColors,
  sanitizeColorKeys,
  type MatchedColor,
  type ProductColorImage,
} from "@/lib/filamentColors";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const PRIMARY = "#3b82f6";

interface Product {
  id: number;
  name: string;
  description?: string;
  brand?: string;
  mainImageUrl?: string;
  isActive: boolean;
  onSale?: boolean;
  salePrice?: number;
  variants: { id: number; sku: string; price: number; stock: number }[];
  colorImages?: ProductColorImage[];
}

/** Una tarjeta del listado: el producto y, si hay filtro, el color que matcheó. */
type ProductCardEntry = { product: Product; color: MatchedColor | null };

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function fetchProducts(params: URLSearchParams): Promise<{ content: Product[]; totalElements: number }> {
  try {
    const res = await fetch(`${API_URL}/api/v1/products?${params}`, { cache: "no-store" });
    if (!res.ok) return { content: [], totalElements: 0 };
    return res.json();
  } catch {
    return { content: [], totalElements: 0 };
  }
}

const GRID_CLASS = "rsp-3col-to-2";
const GRID_COLUMNS = "repeat(3, 1fr)";

/**
 * Hace el fetch y dibuja la grilla. Vive en su propio componente para que el
 * <Suspense> de la página pueda mostrar el esqueleto sin bloquear la navegación.
 */
async function ProductResults({ query }: { query: string }) {
  const params = new URLSearchParams(query);
  const data = await fetchProducts(params);
  // Con el filtro de color activo la tarjeta muestra la bobina de ese color.
  const selectedColors = sanitizeColorKeys((params.get("colors") || "").split(","));
  const filteringByColor = selectedColors.length > 0;

  // Con filtro de color el listado se abre por color: un mismo filamento que
  // matchee celeste y rojo sale dos veces, una con cada foto.
  const cards = data.content.flatMap((p): ProductCardEntry[] => {
    const colors = matchingColors(p.colorImages, selectedColors);
    return colors.length > 0
      ? colors.map((color) => ({ product: p, color }))
      : [{ product: p, color: null }];
  });

  // Al abrirse por color, contar productos mentiría: se cuentan resultados.
  const total = filteringByColor ? cards.length : data.totalElements;
  const noun = filteringByColor ? "resultado" : "producto";

  return (
    <>
      <div style={{ fontSize: 13, color: "rgba(0,0,0,.5)", marginBottom: 20 }}>
        {total} {noun}
        {total !== 1 ? "s" : ""} encontrado{total !== 1 ? "s" : ""}
      </div>

      {cards.length > 0 ? (
        <div
          className={GRID_CLASS}
          style={{ display: "grid", gridTemplateColumns: GRID_COLUMNS, gap: 16 }}
        >
          {cards.map(({ product: p, color }) => {
            return (
              <ProductCard
                key={`${p.id}-${color?.colorName ?? "main"}`}
                id={p.id}
                name={p.name}
                description={p.description}
                imageUrl={color?.imageUrl ?? p.mainImageUrl}
                price={p.variants[0]?.price}
                brand={p.brand}
                onSale={p.onSale}
                salePrice={p.salePrice}
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
            fontSize: 16,
          }}
        >
          No hay productos con esos filtros.
        </div>
      )}
    </>
  );
}

function ResultsFallback() {
  return (
    <>
      <div className="skeleton-box" style={{ height: 13, width: 160, marginBottom: 20 }} />
      <ProductGridSkeleton count={9} className={GRID_CLASS} columns={GRID_COLUMNS} gap={16} />
    </>
  );
}

export default async function CatalogPage({ searchParams }: PageProps) {
  const search = await searchParams;

  const str = (v: unknown) => (typeof v === "string" ? v : undefined);

  const params = new URLSearchParams();
  params.set("size", "36");
  if (str(search.brands)) params.set("brands", str(search.brands)!);
  if (str(search.brand)) params.set("brand", str(search.brand)!);
  if (str(search.category)) params.set("category", str(search.category)!);
  if (str(search.subcategory)) params.set("subcategory", str(search.subcategory)!);
  if (str(search.minPrice)) params.set("minPrice", str(search.minPrice)!);
  if (str(search.maxPrice)) params.set("maxPrice", str(search.maxPrice)!);
  if (str(search.isActive)) params.set("isActive", str(search.isActive)!);
  if (str(search.colors)) params.set("colors", str(search.colors)!);

  const query = params.toString();
  const activeCategory = str(search.category);

  return (
    <div style={{ background: "#f7f6f1", minHeight: "100vh" }}>
      {/* Dark header */}
      <div
        style={{
          background: "#0a0d18",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle at 15% 100%, ${PRIMARY}50, transparent 50%), radial-gradient(circle at 90% 0%, ${PRIMARY}28, transparent 45%)`,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
            pointerEvents: "none",
          }}
        />
        <div
          className="rsp-section-pad"
          style={{
            position: "relative",
            padding: "48px 56px 60px",
            maxWidth: 1400,
            margin: "0 auto",
          }}
        >
          {/* Breadcrumb */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 13,
              color: "rgba(255,255,255,.5)",
              marginBottom: 20,
            }}
          >
            <Link href="/" style={{ color: "rgba(255,255,255,.5)", textDecoration: "none" }}>
              Inicio
            </Link>
            <span>›</span>
            {activeCategory ? (
              <>
                <Link href="/catalog" style={{ color: "rgba(255,255,255,.5)", textDecoration: "none" }}>
                  Catálogo
                </Link>
                <span>›</span>
                <span style={{ color: "#fff" }}>{activeCategory}</span>
              </>
            ) : (
              <span style={{ color: "#fff" }}>Catálogo</span>
            )}
          </div>

          <div
            style={{
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: 11,
              letterSpacing: ".18em",
              color: PRIMARY,
              marginBottom: 14,
              textTransform: "uppercase",
            }}
          >
            // {activeCategory ? `Categoría · ${activeCategory}` : "Catálogo completo"}
          </div>
          <h1
            style={{
              fontSize: 56,
              fontWeight: 700,
              margin: 0,
              letterSpacing: "-.03em",
              lineHeight: 1,
            }}
          >
            {activeCategory ? (
              <span style={{ color: PRIMARY }}>{activeCategory}</span>
            ) : (
              <>Todos los <span style={{ color: PRIMARY }}>productos</span></>
            )}
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,.6)", marginTop: 14 }}>
            {activeCategory
              ? `Todos los productos en ${activeCategory}. Filtrá por marca, precio y disponibilidad.`
              : "Filtrá por marca, precio y disponibilidad para encontrar lo que necesitás."}
          </p>
        </div>
      </div>

      {/* Content */}
      <div
        className="rsp-catalog-layout rsp-section-pad"
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "32px 56px 80px",
          display: "flex",
          gap: 32,
          alignItems: "flex-start",
        }}
      >
        <div className="rsp-filter-sidebar">
          <Suspense fallback={null}>
            <CatalogFilters category={activeCategory} />
          </Suspense>
        </div>

        <main style={{ flex: 1 }}>
          {/* Filtros en mobile: la barra lateral se oculta bajo 900px */}
          <div className="rsp-filter-drawer" style={{ marginBottom: 16 }}>
            <Suspense fallback={null}>
              <CatalogFilterDrawer category={activeCategory} />
            </Suspense>
          </div>

          {/* key = query: al cambiar los filtros se vuelve a mostrar el esqueleto */}
          <Suspense key={query} fallback={<ResultsFallback />}>
            <ProductResults query={query} />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
