import { Hero } from "@/components/home/Hero";
import { ProductCard } from "@/components/products/ProductCard";
import type { PaginatedProducts } from "@/types/product";
import Link from "next/link";
import Image from "next/image";
import { Printer, Layers, Cpu } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const PRIMARY = "#3b82f6";

const BRANDS = [
  {
    id: "bambu",
    name: "Bambu Lab",
    tag: "Impresoras Premium",
    slug: "bambu lab",
    imageUrl: "/categorias/bambulab.jpeg",
  },
  {
    id: "creality",
    name: "Creality",
    tag: "Impresoras",
    slug: "creality",
    imageUrl: "/categorias/creality.jpeg",
  },
  {
    id: "w3d",
    name: "W3D",
    tag: "Filamentos",
    slug: "w3d",
    imageUrl: "/categorias/W3d.jpeg",
  },
  {
    id: "anycubic",
    name: "Anycubic",
    tag: "Impresoras",
    slug: "anycubic",
    imageUrl: "/categorias/anycubic.webp",
  },
  {
    id: "arduino",
    name: "Arduino",
    tag: "Electrónica",
    slug: "arduino",
    imageUrl: "/categorias/arduino.jpeg",
  },
];

const CATEGORIES = [
  {
    Icon: Printer,
    title: "Impresoras 3D",
    desc: "FDM, resina y modelos industriales",
    href: "/catalog?brands=bambu+lab,creality,anycubic",
  },
  {
    Icon: Layers,
    title: "Filamentos & Insumos",
    desc: "PLA, PETG, ABS, TPU y especiales",
    href: "/catalog?brands=w3d,filamentos",
  },
  {
    Icon: Cpu,
    title: "Electrónica",
    desc: "Arduino, sensores y módulos",
    href: "/catalog?brands=arduino,electronica",
  },
];

async function getFeaturedProducts(): Promise<PaginatedProducts | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/products?featured=true&size=12`, { cache: "no-store" });
    if (!res.ok) return null;
    const data: PaginatedProducts = await res.json();
    return data.content.length > 0 ? data : null;
  } catch { return null; }
}

async function getOnSaleProducts(): Promise<PaginatedProducts | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/products?onSale=true&size=8`, { cache: "no-store" });
    if (!res.ok) return null;
    const data: PaginatedProducts = await res.json();
    return data.content.length > 0 ? data : null;
  } catch { return null; }
}

export default async function HomePage() {
  const [featuredData, onSaleData] = await Promise.all([getFeaturedProducts(), getOnSaleProducts()]);

  return (
    <>
      <Hero />

      {/* Brands Section */}
      <section className="rsp-section-pad" style={{ padding: "72px 48px", background: "#fff" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 28,
            }}
          >
            <h2
              style={{
                fontSize: 32,
                fontWeight: 700,
                margin: 0,
                letterSpacing: "-.02em",
                color: "#0b0d12",
              }}
            >
              Marcas
            </h2>
            <div style={{ fontSize: 13, color: "rgba(0,0,0,.5)" }}>
              Las mejores marcas del mercado
            </div>
          </div>

          <div
            className="rsp-5col-to-2"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5,1fr)",
              gap: 12,
            }}
          >
            {BRANDS.map((b) => (
              <Link
                key={b.id}
                href={`/store/${encodeURIComponent(b.slug)}`}
                className="group block"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="border border-[rgba(0,0,0,0.07)] rounded-2xl p-3.5 flex flex-col gap-3 bg-white transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-blue-500 cursor-pointer">
                  <div
                    style={{
                      aspectRatio: "4/3",
                      width: "100%",
                      borderRadius: 10,
                      overflow: "hidden",
                      position: "relative",
                      background: "#f5f6fa",
                    }}
                  >
                    <Image
                      src={b.imageUrl}
                      alt={b.name}
                      fill
                      sizes="20vw"
                      className="object-contain p-2"
                      style={{ mixBlendMode: "multiply" }}
                    />
                  </div>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: 15,
                          color: "#0b0d12",
                        }}
                      >
                        {b.name}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "rgba(0,0,0,.5)",
                        marginTop: 2,
                      }}
                    >
                      {b.tag}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="rsp-section-pad" style={{ padding: "0 48px 80px", background: "#fff" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div
            className="rsp-3col-to-1"
            style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}
          >
            {CATEGORIES.map(({ Icon, title, desc, href }) => (
              <Link
                key={title}
                href={href}
                className="group block"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div
                  style={{
                    background: "#f5f6fa",
                    padding: 28,
                    borderRadius: 16,
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: PRIMARY,
                    }}
                  >
                    <Icon size={22} />
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 20, color: "#0b0d12" }}>
                    {title}
                  </div>
                  <div style={{ fontSize: 14, color: "rgba(0,0,0,.6)" }}>{desc}</div>
                  <div
                    style={{
                      marginTop: "auto",
                      fontSize: 13,
                      fontWeight: 600,
                      color: PRIMARY,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    Explorar →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      {featuredData && (
        <section id="productos" className="rsp-section-pad" style={{ padding: "80px 48px", background: "#f7f6f1" }}>
          <div style={{ maxWidth: 1400, margin: "0 auto" }}>
            <div style={{ marginBottom: 32 }}>
              <div
                style={{
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: 11,
                  letterSpacing: ".18em",
                  color: PRIMARY,
                  marginBottom: 8,
                  textTransform: "uppercase",
                }}
              >
                // Catálogo
              </div>
              <h2
                style={{
                  fontSize: 36,
                  fontWeight: 700,
                  margin: 0,
                  letterSpacing: "-.025em",
                  color: "#0b0d12",
                }}
              >
                Productos Destacados
              </h2>
            </div>
            <div
              className="rsp-4col-to-2"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: 16,
              }}
            >
              {featuredData.content.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  description={product.description ?? undefined}
                  imageUrl={product.mainImageUrl ?? undefined}
                  price={product.variants[0]?.price}
                  brand={product.brand}
                  onSale={product.onSale}
                  salePrice={product.salePrice ?? undefined}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* On Sale Section */}
      {onSaleData && (
        <section className="rsp-section-pad" style={{ padding: "80px 48px", background: "#fff" }}>
          <div style={{ maxWidth: 1400, margin: "0 auto" }}>
            <div style={{ marginBottom: 32 }}>
              <div
                style={{
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: 11,
                  letterSpacing: ".18em",
                  color: "#ef4444",
                  marginBottom: 8,
                  textTransform: "uppercase",
                }}
              >
                // Ofertas
              </div>
              <h2
                style={{
                  fontSize: 36,
                  fontWeight: 700,
                  margin: 0,
                  letterSpacing: "-.025em",
                  color: "#0b0d12",
                }}
              >
                Ofertas Especiales
              </h2>
            </div>
            <div
              className="rsp-4col-to-2"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: 16,
              }}
            >
              {onSaleData.content.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  description={product.description ?? undefined}
                  imageUrl={product.mainImageUrl ?? undefined}
                  price={product.variants[0]?.price}
                  brand={product.brand}
                  onSale={product.onSale}
                  salePrice={product.salePrice ?? undefined}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
