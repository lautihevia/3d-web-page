"use client";

import { useState } from "react";
import Image from "next/image";
import { Mail } from "lucide-react";
import { InfoAccordions } from "@/components/products/InfoAccordions";

const PRIMARY = "#3b82f6";

interface ColorImage {
  id: number;
  colorName: string;
  imageUrl: string;
  sortOrder: number;
  inStock?: boolean;
}

interface FilamentProductViewProps {
  productName: string;
  brand?: string;
  description?: string;
  technicalSpecs?: string;
  compatibilityNotes?: string;
  price?: number;
  onSale?: boolean;
  salePrice?: number;
  colorImages: ColorImage[];
}

function formatPrice(price: number): string {
  return "$" + price.toLocaleString("es-AR");
}

export function FilamentProductView({
  productName,
  brand,
  description,
  technicalSpecs,
  compatibilityNotes,
  price,
  onSale,
  salePrice,
  colorImages,
}: FilamentProductViewProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const active = colorImages[selectedIdx] ?? colorImages[0];
  const activeInStock = active?.inStock !== false;
  const anyInStock = colorImages.some((c) => c.inStock !== false);

  return (
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
      <div>
        {/* Main image (driven by selected color) */}
        <div
          style={{
            position: "relative",
            aspectRatio: "1/1",
            background: "#f5f6fa",
            borderRadius: 20,
            overflow: "hidden",
            border: "1px solid rgba(0,0,0,.06)",
          }}
        >
          {active && (
            <Image
              src={active.imageUrl}
              alt={`${productName} — ${active.colorName}`}
              fill
              sizes="(max-width: 768px) 100vw, 55vw"
              className="object-contain p-8"
              priority
            />
          )}
        </div>

        {/* Thumbnails — one per color (only when there is more than one) */}
        {colorImages.length > 1 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 8,
              marginTop: 10,
            }}
          >
            {colorImages.map((ci, i) => (
              <button
                key={ci.id}
                onClick={() => setSelectedIdx(i)}
                title={ci.colorName}
                style={{
                  position: "relative",
                  aspectRatio: "1/1",
                  background: "#f5f6fa",
                  borderRadius: 12,
                  border: `2px solid ${i === selectedIdx ? PRIMARY : "rgba(0,0,0,.07)"}`,
                  overflow: "hidden",
                  cursor: "pointer",
                  padding: 0,
                  transition: "border-color .15s",
                }}
              >
                <Image
                  src={ci.imageUrl}
                  alt={`${productName} — ${ci.colorName}`}
                  fill
                  sizes="15vw"
                  className="object-contain p-2"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info + CTA */}
      <div style={{ position: "sticky", top: 20, alignSelf: "flex-start" }}>
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
              background: anyInStock ? "#22c55e" : "#ef4444",
            }}
          />
          {anyInStock ? "EN STOCK" : "SIN STOCK"}
          {brand && ` · ${brand.toUpperCase()}`}
        </div>

        <h1
          style={{
            fontSize: 48,
            fontWeight: 700,
            letterSpacing: "-.03em",
            margin: "12px 0 6px",
            lineHeight: 1.05,
          }}
        >
          {productName}
        </h1>

        {/* Color selector chips */}
        <div style={{ marginTop: 22 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "rgba(0,0,0,.55)",
              letterSpacing: ".06em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Color:{" "}
            <span style={{ color: "#0b0d12", textTransform: "none", letterSpacing: 0 }}>
              {active?.colorName ?? "—"}
            </span>
            {!activeInStock && (
              <span style={{ color: "#dc2626", textTransform: "none", letterSpacing: 0, marginLeft: 8, fontWeight: 700 }}>
                · Sin stock
              </span>
            )}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {colorImages.map((ci, i) => {
              const isActive = i === selectedIdx;
              const inStock = ci.inStock !== false;
              const RED = "#dc2626";
              const borderColor = !inStock
                ? (isActive ? RED : "#ef444466")
                : (isActive ? PRIMARY : "rgba(0,0,0,.12)");
              const bg = !inStock
                ? (isActive ? "#ef444418" : "#ef44440a")
                : (isActive ? `${PRIMARY}12` : "#fff");
              const textColor = !inStock ? RED : (isActive ? PRIMARY : "#0b0d12");
              return (
                <button
                  key={ci.id}
                  onClick={() => setSelectedIdx(i)}
                  title={inStock ? ci.colorName : `${ci.colorName} — sin stock`}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 999,
                    border: `1.5px solid ${borderColor}`,
                    background: bg,
                    color: textColor,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all .15s",
                    textDecoration: !inStock ? "line-through" : "none",
                  }}
                >
                  {ci.colorName}
                </button>
              );
            })}
          </div>
        </div>

        {/* Price box */}
        <div
          style={{
            marginTop: 24,
            padding: 24,
            background: "#fff",
            borderRadius: 16,
            border: "1px solid rgba(0,0,0,.05)",
          }}
        >
          <div style={{ fontSize: 13, color: "rgba(0,0,0,.55)" }}>
            {onSale && salePrice ? "Precio de oferta" : "Precio de referencia"}
          </div>
          {onSale && salePrice ? (
            <>
              <div style={{ fontSize: 44, fontWeight: 700, color: "#ef4444", letterSpacing: "-.02em", marginTop: 4 }}>
                {formatPrice(salePrice)}
              </div>
              <div style={{ fontSize: 22, fontWeight: 500, color: "rgba(0,0,0,.35)", textDecoration: "line-through", marginTop: 2 }}>
                {price ? formatPrice(price) : ""}
              </div>
            </>
          ) : (
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
          )}
          <div style={{ fontSize: 13, color: "rgba(0,0,0,.5)", marginTop: 8 }}>
            Consultá disponibilidad y formas de pago.
          </div>

          <div className="rsp-cta-stack" style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <a
              href="mailto:3dencasa@gmail.com"
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
              href={`https://wa.me/5493492280435?text=${encodeURIComponent(`Hola, me interesa el ${productName} en color ${active?.colorName ?? ""}.`)}`}
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

        <div style={{ marginTop: 32 }}>
          <InfoAccordions
            description={description}
            technicalSpecs={technicalSpecs}
            compatibilityNotes={compatibilityNotes}
          />
        </div>
      </div>
    </section>
  );
}
