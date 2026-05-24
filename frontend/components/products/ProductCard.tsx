"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

interface ProductCardProps {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  brand?: string | null;
  tag?: string;
  onSale?: boolean;
  salePrice?: number;
}

function formatPrice(price: number): string {
  return "$" + price.toLocaleString("es-AR");
}

export function ProductCard({
  id,
  name,
  imageUrl,
  price,
  brand,
  tag,
  onSale,
  salePrice,
}: ProductCardProps) {
  const [hover, setHover] = useState(false);
  const primary = "#3b82f6";

  return (
    <Link href={`/products/${id}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          background: "#fff",
          borderRadius: 14,
          border: `1px solid ${hover ? primary : "rgba(0,0,0,.06)"}`,
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          cursor: "pointer",
          transition: ".2s",
          transform: hover ? "translateY(-3px)" : "translateY(0)",
          boxShadow: hover ? "0 12px 30px rgba(0,0,0,.08)" : "none",
        }}
      >
        {/* Image */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              aspectRatio: "1/1",
              width: "100%",
              borderRadius: 10,
              overflow: "hidden",
              background: imageUrl
                ? "#f5f6fa"
                : "repeating-linear-gradient(135deg, #f1f1ed 0 12px, #e9e9e3 12px 24px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-contain p-4"
              />
            ) : (
              <span
                style={{
                  fontFamily: "var(--font-geist-mono), monospace",
                  fontSize: 11,
                  letterSpacing: ".08em",
                  color: "rgba(0,0,0,.4)",
                  background: "#fff",
                  padding: "4px 8px",
                  borderRadius: 4,
                }}
              >
                ↳ {name.toLowerCase()}
              </span>
            )}
          </div>

          {brand && (
            <div
              style={{
                position: "absolute",
                top: 10,
                left: 10,
                padding: "4px 10px",
                borderRadius: 999,
                background: "#fff",
                fontSize: 11,
                fontWeight: 600,
                color: primary,
                boxShadow: "0 2px 8px rgba(0,0,0,.08)",
              }}
            >
              {brand}
            </div>
          )}
          {onSale && salePrice && (
            <div
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                padding: "4px 10px",
                borderRadius: 999,
                background: "#ef4444",
                color: "#fff",
                fontSize: 11,
                fontWeight: 700,
                boxShadow: "0 2px 8px rgba(0,0,0,.12)",
              }}
            >
              OFERTA
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {tag && (
            <div
              style={{
                fontSize: 11,
                color: "rgba(0,0,0,.5)",
                fontFamily: "var(--font-geist-mono), monospace",
                letterSpacing: ".05em",
                textTransform: "uppercase",
              }}
            >
              {tag}
            </div>
          )}
          <div
            style={{
              fontWeight: 700,
              fontSize: 17,
              marginTop: 4,
              letterSpacing: "-.01em",
              color: "#0b0d12",
            }}
          >
            {name}
          </div>
        </div>

        {/* Price + CTA */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "auto",
            paddingTop: 8,
          }}
        >
          <div>
            <div style={{ fontSize: 11, color: "rgba(0,0,0,.5)" }}>
              {onSale && salePrice ? "Precio de oferta" : "Precio"}
            </div>
            {onSale && salePrice ? (
              <>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#ef4444" }}>
                  {formatPrice(salePrice)}
                </div>
                <div style={{ fontSize: 13, color: "rgba(0,0,0,.4)", textDecoration: "line-through" }}>
                  {price !== undefined ? formatPrice(price) : ""}
                </div>
              </>
            ) : (
              <div style={{ fontSize: 18, fontWeight: 700, color: primary }}>
                {price !== undefined ? formatPrice(price) : "Consultar"}
              </div>
            )}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              fontWeight: 600,
              color: "#0b0d12",
              opacity: hover ? 1 : 0.6,
              transition: ".2s",
            }}
          >
            Ver detalle <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </Link>
  );
}
