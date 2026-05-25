"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";

const PRIMARY = "#3b82f6";

const PRICE_PRESETS = [
  { label: "Hasta $500k", min: "", max: "500000" },
  { label: "$500k – $1M", min: "500000", max: "1000000" },
  { label: "+$1M", min: "1000000", max: "" },
];

const FILAMENT_TYPES = [
  "Multicolor",
  "Tricolor",
  "PLA Mate",
  "PLA",
  "PETG",
  "Creality",
  "Hyper Serie PLA",
];

const FILAMENT_BRAND_SLUGS = ["w3d", "filamentos", "creality"];

interface FilterSidebarProps {
  brand: string;
  compact?: boolean;
}

export function FilterSidebar({ brand, compact = false }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isFilamentBrand = FILAMENT_BRAND_SLUGS.includes(brand.toLowerCase());

  const initialTypes = (searchParams.get("subcategory") || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [onlyAvailable, setOnlyAvailable] = useState(
    searchParams.get("isActive") === "true"
  );
  const [selectedTypes, setSelectedTypes] = useState<string[]>(initialTypes);

  const toggleType = (val: string) =>
    setSelectedTypes((prev) =>
      prev.includes(val) ? prev.filter((t) => t !== val) : [...prev, val]
    );

  const applyPreset = (min: string, max: string) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  const apply = useCallback(() => {
    const params = new URLSearchParams();
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (onlyAvailable) params.set("isActive", "true");
    if (selectedTypes.length) params.set("subcategory", selectedTypes.join(","));
    router.push(`/store/${brand}${params.toString() ? `?${params}` : ""}`);
  }, [brand, minPrice, maxPrice, onlyAvailable, selectedTypes, router]);

  const clear = () => {
    setMinPrice("");
    setMaxPrice("");
    setOnlyAvailable(false);
    setSelectedTypes([]);
    router.push(`/store/${brand}`);
  };

  const hasFilters = minPrice || maxPrice || onlyAvailable || selectedTypes.length > 0;

  return (
    <aside style={compact ? { width: "100%" } : { width: 220, flexShrink: 0, position: "sticky", top: 80, alignSelf: "flex-start" }}>
      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          border: "1px solid rgba(0,0,0,.07)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid rgba(0,0,0,.06)",
          }}
        >
          <span style={{ fontWeight: 700, fontSize: 15, color: "#0b0d12" }}>Filtros</span>
          {hasFilters && (
            <button
              onClick={clear}
              style={{
                fontSize: 12,
                color: PRIMARY,
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: 600,
              }}
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Tipo de filamento — solo para marcas de filamentos */}
        {isFilamentBrand && (
          <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(0,0,0,.06)" }}>
            <div style={{ fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(0,0,0,.45)", marginBottom: 12, fontWeight: 600 }}>
              Tipo
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {FILAMENT_TYPES.map((t) => {
                const checked = selectedTypes.includes(t);
                return (
                  <label
                    key={t}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 9,
                      cursor: "pointer",
                      fontSize: 13,
                      color: checked ? "#0b0d12" : "rgba(0,0,0,.65)",
                    }}
                  >
                    <div
                      onClick={() => toggleType(t)}
                      style={{
                        width: 17,
                        height: 17,
                        borderRadius: 5,
                        border: `2px solid ${checked ? PRIMARY : "rgba(0,0,0,.2)"}`,
                        background: checked ? PRIMARY : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        transition: "all .15s",
                      }}
                    >
                      {checked && (
                        <svg width="9" height="7" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4l2.5 2.5L9 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span>{t}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Disponibilidad */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(0,0,0,.45)", marginBottom: 12, fontWeight: 600 }}>
            Disponibilidad
          </div>
          <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", fontSize: 14, color: "#0b0d12" }}>
            Solo en stock
            <div
              onClick={() => setOnlyAvailable((v) => !v)}
              style={{
                width: 40,
                height: 22,
                borderRadius: 999,
                background: onlyAvailable ? PRIMARY : "rgba(0,0,0,.12)",
                position: "relative",
                cursor: "pointer",
                transition: "background .2s",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 3,
                  left: onlyAvailable ? 21 : 3,
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: "#fff",
                  transition: "left .2s",
                  boxShadow: "0 1px 4px rgba(0,0,0,.2)",
                }}
              />
            </div>
          </label>
        </div>

        {/* Precio */}
        <div style={{ padding: "16px 20px" }}>
          <div style={{ fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(0,0,0,.45)", marginBottom: 12, fontWeight: 600 }}>
            Precio
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
            {PRICE_PRESETS.map((p) => {
              const active = minPrice === p.min && maxPrice === p.max;
              return (
                <button
                  key={p.label}
                  onClick={() => applyPreset(p.min, p.max)}
                  style={{
                    fontSize: 11,
                    padding: "4px 9px",
                    borderRadius: 999,
                    border: `1px solid ${active ? PRIMARY : "rgba(0,0,0,.12)"}`,
                    background: active ? `${PRIMARY}12` : "transparent",
                    color: active ? PRIMARY : "rgba(0,0,0,.6)",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontWeight: active ? 600 : 400,
                    transition: "all .15s",
                  }}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { label: "Mín", value: minPrice, set: setMinPrice, placeholder: "$0" },
              { label: "Máx", value: maxPrice, set: setMaxPrice, placeholder: "∞" },
            ].map(({ label, value, set, placeholder }) => (
              <div key={label}>
                <div style={{ fontSize: 11, color: "rgba(0,0,0,.45)", marginBottom: 4 }}>{label}</div>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => set(e.target.value)}
                  placeholder={placeholder}
                  style={{
                    width: "100%",
                    padding: "7px 10px",
                    borderRadius: 8,
                    border: "1px solid rgba(0,0,0,.1)",
                    fontSize: 13,
                    fontFamily: "inherit",
                    outline: "none",
                    boxSizing: "border-box",
                    color: "#0b0d12",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={apply}
        style={{
          width: "100%",
          marginTop: 10,
          background: PRIMARY,
          color: "#fff",
          border: "none",
          padding: "13px",
          borderRadius: 12,
          fontWeight: 600,
          fontSize: 14,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        Aplicar filtros
      </button>
    </aside>
  );
}
