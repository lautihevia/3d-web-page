interface ProductGridSkeletonProps {
  /** Cuántas tarjetas fantasma dibujar. */
  count?: number;
  /** Misma clase responsive que la grilla real, para que no salte el layout. */
  className?: string;
  /** Mismo gridTemplateColumns que la grilla real. */
  columns?: string;
  gap?: number;
}

function ProductCardSkeleton() {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        border: "1px solid rgba(0,0,0,.06)",
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div className="skeleton-box" style={{ aspectRatio: "1/1", width: "100%", borderRadius: 10 }} />
      <div>
        <div className="skeleton-box" style={{ height: 17, width: "85%", marginTop: 4 }} />
        <div className="skeleton-box" style={{ height: 17, width: "55%", marginTop: 6 }} />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginTop: "auto",
          paddingTop: 8,
        }}
      >
        <div style={{ flex: 1 }}>
          <div className="skeleton-box" style={{ height: 11, width: 42 }} />
          <div className="skeleton-box" style={{ height: 18, width: 88, marginTop: 6 }} />
        </div>
        <div className="skeleton-box" style={{ height: 13, width: 74 }} />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({
  count = 6,
  className,
  columns = "repeat(3, 1fr)",
  gap = 16,
}: ProductGridSkeletonProps) {
  return (
    <div
      className={className}
      style={{ display: "grid", gridTemplateColumns: columns, gap }}
      aria-busy="true"
      aria-label="Cargando productos"
    >
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
