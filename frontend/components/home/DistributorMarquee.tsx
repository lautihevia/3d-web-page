const PRIMARY = "#3b82f6";

const CLAIMS = [
  "Distribuidores Oficiales W3D",
  "Distribuidores Oficiales FilAr",
];

/**
 * Cinta de distribuidor oficial, en la división entre el hero oscuro y la
 * sección blanca. Se desplaza sola de izquierda a derecha con una animación
 * CSS (sin JS): la pista lleva la secuencia dos veces y va de -50% a 0, así
 * el corte entre copias nunca se ve. Se frena al pasar el mouse y con
 * prefers-reduced-motion (ver .marquee-track en globals.css).
 */
export function DistributorMarquee() {
  // Se repite para que la pista supere el ancho de pantallas anchas.
  const sequence = [...CLAIMS, ...CLAIMS, ...CLAIMS, ...CLAIMS];

  return (
    <div
      className="marquee"
      style={{
        background: PRIMARY,
        color: "#fff",
        borderTop: "1px solid rgba(255,255,255,.18)",
        borderBottom: "1px solid rgba(0,0,0,.08)",
      }}
    >
      <div className="marquee-track" style={{ padding: "12px 0" }}>
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1}
            style={{ display: "flex", flexShrink: 0 }}
          >
            {sequence.map((claim, i) => (
              <span
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  padding: "0 18px",
                  whiteSpace: "nowrap",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: ".16em",
                  textTransform: "uppercase",
                }}
              >
                <span style={{ opacity: 0.5, fontSize: 9 }}>◆</span>
                {claim}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
