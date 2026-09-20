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
  /** Color con el que abrir, si se llegó desde una tarjeta filtrada por color. */
  initialColorName?: string;
}

function formatPrice(price: number): string {
  return "$" + price.toLocaleString("es-AR");
}

/**
 * Vista de detalle de filamento: una sola columna centrada.
 * Orden: título → imagen grande del color activo → selector de color por texto
 * → precio y CTA → acordeones. El color se elige solo con los chips de texto;
 * la imagen grande es el único lugar donde se ve el filamento.
 */
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
  initialColorName,
}: FilamentProductViewProps) {
  // findIndex devuelve -1 si el color no existe; ahí se cae al primero.
  const [selectedIdx, setSelectedIdx] = useState(() =>
    Math.max(
      0,
      colorImages.findIndex((c) => c.colorName === initialColorName)
    )
  );
  const active = colorImages[selectedIdx] ?? colorImages[0];
  const activeInStock = active?.inStock !== false;
  const anyInStock = colorImages.some((c) => c.inStock !== false);

  return (
    <section
      className="rsp-section-pad"
      style={{
        padding: "32px 24px 64px",
        maxWidth: 780,
        margin: "0 auto",
      }}
    >
      {/* Stock + marca */}
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

      {/* Título */}
      <h1
        style={{
          fontSize: 32,
          fontWeight: 700,
          letterSpacing: "-.02em",
          margin: "10px 0 20px",
          lineHeight: 1.15,
        }}
      >
        {productName}
      </h1>

      {/* Imagen grande — la maneja el color seleccionado */}
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
            sizes="(max-width: 820px) 100vw, 780px"
            className="object-contain p-8"
            priority
          />
        )}
      </div>

      {/* Selector de color por texto */}
      <div style={{ marginTop: 24 }}>
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

      {/* Precio */}
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
    </section>
  );
}
