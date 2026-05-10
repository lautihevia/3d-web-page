import { ProductGallery } from "@/components/products/ProductGallery";
import { InfoAccordions } from "@/components/products/InfoAccordions";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Mail } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const PRIMARY = "#3b82f6";

interface ProductVariant {
  id: number;
  sku: string;
  price: number;
  stockQuantity: number;
  attributes: Record<string, string>;
}

interface Product {
  id: number;
  name: string;
  description?: string;
  brand?: string;
  category?: string;
  mainImageUrl?: string;
  imageUrl2?: string;
  imageUrl3?: string;
  imageUrl4?: string;
  isActive: boolean;
  variants: ProductVariant[];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

function formatPrice(price: number): string {
  return "$" + price.toLocaleString("es-AR");
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_URL}/api/v1/products/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  const price = product.variants[0]?.price;
  const inStock = product.variants.some((v) => v.stockQuantity > 0);

  return (
    <div
      style={{
        background: "#f7f6f1",
        minHeight: "100vh",
        fontFamily: "inherit",
        color: "#0b0d12",
      }}
    >
      {/* Dark page hero */}
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
            background: `radial-gradient(circle at 15% 100%, ${PRIMARY}55, transparent 55%), radial-gradient(circle at 90% 0%, ${PRIMARY}33, transparent 45%)`,
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
            padding: "32px 56px 48px",
            maxWidth: 1400,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 13,
              color: "rgba(255,255,255,.55)",
            }}
          >
            <Link href="/" style={{ color: "rgba(255,255,255,.55)", textDecoration: "none" }}>Inicio</Link>
            <span>›</span>
            <Link href="/#productos" style={{ color: "rgba(255,255,255,.55)", textDecoration: "none" }}>Tienda</Link>
            {product.brand && (
              <>
                <span>›</span>
                <span style={{ color: "rgba(255,255,255,.55)" }}>{product.brand}</span>
              </>
            )}
            <span>›</span>
            <span style={{ color: "#fff" }}>{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <section
        className="rsp-2col rsp-section-pad"
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
          gap: 56,
          padding: "32px 56px 64px",
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        {/* Gallery */}
        <ProductGallery
          mainImageUrl={product.mainImageUrl}
          productName={product.name}
          extraImageUrls={[product.imageUrl2, product.imageUrl3, product.imageUrl4].filter(Boolean) as string[]}
        />

        {/* Info + CTA */}
        <div style={{ position: "sticky", top: 20, alignSelf: "flex-start" }}>
          {/* Stock + brand badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12,
              color: PRIMARY,
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: inStock ? "#22c55e" : "#ef4444",
              }}
            />
            {inStock ? "EN STOCK" : "SIN STOCK"}
            {product.brand && ` · ${product.brand.toUpperCase()}`}
          </div>

          {/* Product name */}
          <h1
            style={{
              fontSize: 48,
              fontWeight: 700,
              letterSpacing: "-.03em",
              margin: "12px 0 6px",
              lineHeight: 1.05,
            }}
          >
            {product.name}
          </h1>

          {/* Price box */}
          <div
            style={{
              marginTop: 28,
              padding: 24,
              background: "#fff",
              borderRadius: 16,
              border: "1px solid rgba(0,0,0,.05)",
            }}
          >
            <div style={{ fontSize: 13, color: "rgba(0,0,0,.55)" }}>
              Precio de referencia
            </div>
            <div
              style={{
                fontSize: 44,
                fontWeight: 700,
                color: PRIMARY,
                letterSpacing: "-.02em",
                marginTop: 4,
              }}
            >
              {price ? formatPrice(price) : "Consultar precio"}
            </div>
            <div
              style={{ fontSize: 13, color: "rgba(0,0,0,.5)", marginTop: 8 }}
            >
              Consultá disponibilidad y formas de pago.
            </div>

            {/* CTA buttons */}
            <div className="rsp-cta-stack" style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <a
                href="mailto:contacto@3dencasa.com"
                style={{
                  flex: 1,
                  background: "#0b0d12",
                  color: "#fff",
                  padding: "14px 20px",
                  borderRadius: 10,
                  fontWeight: 600,
                  fontSize: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  textDecoration: "none",
                  fontFamily: "inherit",
                }}
              >
                <Mail size={16} />
                Consultar por email
              </a>
              <a
                href="https://wa.me/5491100000000"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  background: "#25D366",
                  color: "#fff",
                  padding: "14px 20px",
                  borderRadius: 10,
                  fontWeight: 600,
                  fontSize: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  textDecoration: "none",
                  fontFamily: "inherit",
                }}
              >
                Por WhatsApp
              </a>
            </div>
          </div>

          {/* Info accordions */}
          <div style={{ marginTop: 32 }}>
            <InfoAccordions description={product.description} />
          </div>
        </div>
      </section>
    </div>
  );
}
