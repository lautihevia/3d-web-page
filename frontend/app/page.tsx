import { Suspense } from "react";
import { Hero } from "@/components/home/Hero";
import { DistributorMarquee } from "@/components/home/DistributorMarquee";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductGridSkeleton } from "@/components/products/ProductGridSkeleton";
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
    href: "/store/bambu%20lab",
    imageUrl: "/categorias/bambulab.jpeg",
  },
  {
    id: "creality",
    name: "Creality",
    tag: "Impresoras",
    href: "/store/creality",
    imageUrl: "/categorias/creality.jpeg",
  },
  {
    id: "w3d",
    name: "W3D",
    tag: "Filamentos",
    href: "/store/w3d",
    imageUrl: "/categorias/W3d.jpeg",
  },
  {
    id: "anycubic",
    name: "Anycubic",
    tag: "Impresoras",
    href: "/store/anycubic",
    imageUrl: "/categorias/anycubic.webp",
  },
  {
    id: "arduino",
    name: "Arduino",
    tag: "Electrónica",
    href: "/catalog?category=Electr%C3%B3nica",
    imageUrl: "/categorias/arduino.jpeg",
  },
  {
    id: "filar",
    name: "FilAr",
    tag: "Filamentos",
    href: "/store/FilAr",
    imageUrl:
      "https://res.cloudinary.com/dlykb1mb6/image/upload/v1789857517/filar_logo_zondmc.png",
  },
];

const CATEGORIES = [
  {
    Icon: Printer,
    title: "Impresoras 3D",
    desc: "FDM, resina y modelos industriales",
    href: "/catalog?category=Impresoras",
  },
  {
    Icon: Layers,
    title: "Filamentos & Insumos",
    desc: "PLA, PETG, ABS, TPU y especiales",
    href: "/catalog?category=Filamentos",
  },
  {
    Icon: Cpu,
    title: "Electrónica",
    desc: "Arduino, sensores y módulos",
    href: "/catalog?category=Electr%C3%B3nica",
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

const HOME_GRID_CLASS = "rsp-4col-to-2";
const HOME_GRID_COLUMNS = "repeat(4,1fr)";

/** Cabecera compartida por la sección real y por su esqueleto. */
function SectionHeading({ kicker, title, color }: { kicker: string; title: string; color: string }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div
        style={{
          fontFamily: "var(--font-geist-mono), monospace",
          fontSize: 11,
          letterSpacing: ".18em",
          color,
          marginBottom: 8,
          textTransform: "uppercase",
        }}
      >
        // {kicker}
      </div>
      <h2 style={{ fontSize: 36, fontWeight: 700, margin: 0, letterSpacing: "-.025em", color: "#0b0d12" }}>
        {title}
      </h2>
    </div>
  );
}

function HomeSectionFallback({
  kicker,
  title,
  color,
  background,
  count,
}: {
  kicker: string;
  title: string;
  color: string;
  background: string;
  count: number;
}) {
  return (
    <section className="rsp-section-pad" style={{ padding: "80px 48px", background }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <SectionHeading kicker={kicker} title={title} color={color} />
        <ProductGridSkeleton
          count={count}
          className={HOME_GRID_CLASS}
          columns={HOME_GRID_COLUMNS}
          gap={16}
        />
      </div>
    </section>
  );
}

async function FeaturedSection() {
  const featuredData = await getFeaturedProducts();
  if (!featuredData) return null;

  return (
    <section id="productos" className="rsp-section-pad" style={{ padding: "80px 48px", background: "#f7f6f1" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <SectionHeading kicker="Catálogo" title="Productos Destacados" color={PRIMARY} />
        <div
          className={HOME_GRID_CLASS}
          style={{ display: "grid", gridTemplateColumns: HOME_GRID_COLUMNS, gap: 16 }}
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
  );
}

async function OnSaleSection() {
  const onSaleData = await getOnSaleProducts();
  if (!onSaleData) return null;

  return (
    <section className="rsp-section-pad" style={{ padding: "80px 48px", background: "#fff" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        <SectionHeading kicker="Ofertas" title="Ofertas Especiales" color="#ef4444" />
        <div
          className={HOME_GRID_CLASS}
          style={{ display: "grid", gridTemplateColumns: HOME_GRID_COLUMNS, gap: 16 }}
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
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Cinta de distribuidor, en la división entre el hero y el fondo blanco */}
      <DistributorMarquee />

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
            className="rsp-6col-to-2"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6,1fr)",
              gap: 12,
            }}
          >
            {BRANDS.map((b) => (
              <Link
                key={b.id}
                href={b.href}
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
                      sizes="(max-width: 900px) 50vw, 16vw"
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
      <Suspense
        fallback={
          <HomeSectionFallback
            kicker="Catálogo"
            title="Productos Destacados"
            color={PRIMARY}
            background="#f7f6f1"
            count={8}
          />
        }
      >
        <FeaturedSection />
      </Suspense>

      {/* On Sale Section */}
      <Suspense
        fallback={
          <HomeSectionFallback
            kicker="Ofertas"
            title="Ofertas Especiales"
            color="#ef4444"
            background="#fff"
            count={4}
          />
        }
      >
        <OnSaleSection />
      </Suspense>
    </>
  );
}
