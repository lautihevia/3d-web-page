import Link from "next/link";

interface BrandHeaderProps {
  brand: string;
}

const PRIMARY = "#3b82f6";

export function BrandHeader({ brand }: BrandHeaderProps) {
  const brandName = brand.charAt(0).toUpperCase() + brand.slice(1);

  return (
    <div
      style={{
        background: "#0a0d18",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 15% 100%, ${PRIMARY}55, transparent 55%), radial-gradient(circle at 90% 0%, ${PRIMARY}33, transparent 45%)`,
          pointerEvents: "none",
        }}
      />
      {/* Grid pattern */}
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
        style={{
          position: "relative",
          padding: "56px 56px 72px",
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        {/* Breadcrumbs */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            color: "rgba(255,255,255,.55)",
            marginBottom: 20,
          }}
        >
          <Link href="/" style={{ color: "rgba(255,255,255,.55)", textDecoration: "none" }}>
            Inicio
          </Link>
          <span>›</span>
          <span style={{ color: "#fff", fontWeight: 500 }}>{brandName}</span>
        </div>

        {/* Eyebrow */}
        <div
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: 11,
            letterSpacing: ".18em",
            color: PRIMARY,
            marginBottom: 18,
            textTransform: "uppercase",
          }}
        >
          // Catálogo · {brandName.toUpperCase()}
        </div>

        {/* Title + sort */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24 }}>
          <div>
            <h1
              style={{
                fontSize: 64,
                fontWeight: 700,
                margin: 0,
                letterSpacing: "-.03em",
                lineHeight: 1,
              }}
            >
              {brandName}{" "}
              <span style={{ color: PRIMARY }}>Productos</span>
            </h1>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,.65)", marginTop: 14, maxWidth: 600 }}>
              Equipos curados de las mejores marcas. Precios visibles · Consultá disponibilidad.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
