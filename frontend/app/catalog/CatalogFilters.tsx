"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";

const PRIMARY = "#3b82f6";

const BRAND_OPTIONS = [
  { label: "Bambu Lab", value: "bambu lab", group: "Impresoras" },
  { label: "Creality", value: "creality", group: "Impresoras" },
  { label: "Anycubic", value: "anycubic", group: "Impresoras" },
  { label: "W3D", value: "w3d", group: "Filamentos" },
  { label: "Arduino", value: "arduino", group: "Electrónica" },
];

const PRICE_PRESETS = [
  { label: "Hasta $500k", min: "", max: "500000" },
  { label: "$500k – $1M", min: "500000", max: "1000000" },
  { label: "+$1M", min: "1000000", max: "" },
];

interface CatalogFiltersProps {
  className?: string;
}

export function CatalogFilters({ className }: CatalogFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialBrands = (searchParams.get("brands") || "")
    .split(",")
    .map((b) => b.trim())
    .filter(Boolean);

  const [selectedBrands, setSelectedBrands] = useState<string[]>(initialBrands);
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [onlyAvailable, setOnlyAvailable] = useState(
    searchParams.get("isActive") === "true"
  );

  const toggleBrand = (val: string) => {
    setSelectedBrands((prev) =>
      prev.includes(val) ? prev.filter((b) => b !== val) : [...prev, val]
    );
  };

  const applyPreset = (min: string, max: string) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  const apply = useCallback(() => {
    const params = new URLSearchParams();
    if (selectedBrands.length) params.set("brands", selectedBrands.join(","));
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (onlyAvailable) params.set("isActive", "true");
    router.push(`/catalog${params.toString() ? `?${params}` : ""}`);
  }, [selectedBrands, minPrice, maxPrice, onlyAvailable, router]);

  const clear = () => {
    setSelectedBrands([]);
    setMinPrice("");
    setMaxPrice("");
    setOnlyAvailable(false);
    router.push("/catalog");
  };

  const hasFilters =
    selectedBrands.length > 0 || minPrice || maxPrice || onlyAvailable;

  return (
    <aside
      className={className}
      style={{
        width: 240,
        flexShrink: 0,
        position: "sticky",
        top: 80,
        alignSelf: "flex-start",
      }}
    >
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
          <span style={{ fontWeight: 700, fontSize: 15, color: "#0b0d12" }}>
            Filtros
          </span>
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
              Limpiar todo
            </button>
          )}
        </div>

        {/* Disponibilidad */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(0,0,0,.45)", marginBottom: 12, fontWeight: 600 }}>
            Disponibilidad
          </div>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              fontSize: 14,
              color: "#0b0d12",
            }}
          >
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

        {/* Marca */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(0,0,0,.45)", marginBottom: 12, fontWeight: 600 }}>
            Marca
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {BRAND_OPTIONS.map((b) => {
              const checked = selectedBrands.includes(b.value);
              return (
                <label
                  key={b.value}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    cursor: "pointer",
                    fontSize: 14,
                    color: checked ? "#0b0d12" : "rgba(0,0,0,.65)",
                  }}
                >
                  <div
                    onClick={() => toggleBrand(b.value)}
                    style={{
                      width: 18,
                      height: 18,
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
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4l2.5 2.5L9 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span style={{ flex: 1 }}>{b.label}</span>
                  <span style={{ fontSize: 11, color: "rgba(0,0,0,.35)", background: "rgba(0,0,0,.05)", padding: "1px 6px", borderRadius: 999 }}>
                    {b.group}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Precio */}
        <div style={{ padding: "16px 20px" }}>
          <div style={{ fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(0,0,0,.45)", marginBottom: 12, fontWeight: 600 }}>
            Precio
          </div>

          {/* Presets */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
            {PRICE_PRESETS.map((p) => {
              const active = minPrice === p.min && maxPrice === p.max;
              return (
                <button
                  key={p.label}
                  onClick={() => applyPreset(p.min, p.max)}
                  style={{
                    fontSize: 12,
                    padding: "4px 10px",
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

          {/* Manual range */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { label: "Mín", value: minPrice, set: setMinPrice, placeholder: "$0" },
              { label: "Máx", value: maxPrice, set: setMaxPrice, placeholder: "Sin límite" },
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

      {/* Apply button */}
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
