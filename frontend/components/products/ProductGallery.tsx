"use client";

import { useState } from "react";
import Image from "next/image";

const PRIMARY = "#3b82f6";

interface ProductGalleryProps {
  mainImageUrl?: string;
  productName: string;
  extraImageUrls?: string[];
}

function Placeholder() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: `repeating-linear-gradient(45deg, #f0f0f0 0px, #f0f0f0 10px, #f5f5f5 10px, #f5f5f5 20px)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ fontSize: 11, color: "rgba(0,0,0,.3)", letterSpacing: ".08em" }}>SIN IMAGEN</div>
    </div>
  );
}

export function ProductGallery({
  mainImageUrl,
  productName,
  extraImageUrls = [],
}: ProductGalleryProps) {
  const [selected, setSelected] = useState(0);

  // Build a 4-slot array: main + extras, pad with null to always show 4 thumbs
  const raw = [mainImageUrl ?? null, ...extraImageUrls.slice(0, 3)];
  const images: (string | null)[] = [...raw, null, null, null, null].slice(0, 4);

  const active = images[selected];

  return (
    <div style={{ width: "100%" }}>
      {/* Main image */}
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
        {active ? (
          <Image
            src={active}
            alt={productName}
            fill
            sizes="(max-width: 768px) 100vw, 55vw"
            className="object-contain p-8"
            priority
          />
        ) : (
          <Placeholder />
        )}
      </div>

      {/* Thumbnails — always 4 slots */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 8,
          marginTop: 10,
        }}
      >
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            style={{
              position: "relative",
              aspectRatio: "1/1",
              background: "#f5f6fa",
              borderRadius: 12,
              border: `2px solid ${i === selected ? PRIMARY : "rgba(0,0,0,.07)"}`,
              overflow: "hidden",
              cursor: "pointer",
              padding: 0,
              transition: "border-color .15s",
            }}
          >
            {img ? (
              <Image
                src={img}
                alt={`${productName} vista ${i + 1}`}
                fill
                sizes="15vw"
                className="object-contain p-2"
              />
            ) : (
              <Placeholder />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
