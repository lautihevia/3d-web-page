import { Suspense } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/products/ProductCard";
import { CatalogFilters } from "./CatalogFilters";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const PRIMARY = "#3b82f6";

interface Product {
  id: number;
  name: string;
  description?: string;
  brand?: string;
  mainImageUrl?: string;
  isActive: boolean;
  variants: { id: number; sku: string; price: number; stock: number }[];
}

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

export default async function CatalogPage({ searchParams }: PageProps) {
  const search = await searchParams;

  const str = (v: unknown) => (typeof v === "string" ? v : undefined);

  const params = new URLSearchParams();
  params.set("size", "36");
  if (str(search.brands)) params.set("brands", str(search.brands)!);
  if (str(search.brand)) params.set("brand", str(search.brand)!);
  if (str(search.category)) params.set("category", str(search.category)!);
  if (str(search.minPrice)) params.set("minPrice", str(search.minPrice)!);
  if (str(search.maxPrice)) params.set("maxPrice", str(search.maxPrice)!);
  if (str(search.isActive)) params.set("isActive", str(search.isActive)!);

  const data = await fetchProducts(params);
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
            <CatalogFilters />
          </Suspense>
        </div>

        <main style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 13,
              color: "rgba(0,0,0,.5)",
              marginBottom: 20,
            }}
          >
            {data.totalElements} producto{data.totalElements !== 1 ? "s" : ""} encontrado
            {data.totalElements !== 1 ? "s" : ""}
          </div>

          {data.content.length > 0 ? (
            <div
              className="rsp-3col-to-1"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 16,
              }}
            >
              {data.content.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  description={p.description}
                  imageUrl={p.mainImageUrl}
                  price={p.variants[0]?.price}
                  brand={p.brand}
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
                fontSize: 16,
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
