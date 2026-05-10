import Link from "next/link";

const SECTIONS = [
  {
    title: "Catálogo",
    items: [
      { label: "Impresoras", href: "/#productos" },
      { label: "Filamentos", href: "/#productos" },
      { label: "Electrónica", href: "/#productos" },
      { label: "Repuestos", href: "/#productos" },
    ],
  },
  {
    title: "Empresa",
    items: [
      { label: "Sobre nosotros", href: "/about" },
      { label: "Contacto", href: "/contact" },
    ],
  },
  {
    title: "Contacto",
    items: [
      { label: "3dencasa@gmail.com", href: null },
      { label: "+54 3492 280435", href: null },
      { label: "Rafaela, Santa Fe, Argentina", href: null },
    ],
  },
];

export function Footer() {
  return (
    <footer className="rsp-footer" style={{ background: "#0a0d18", color: "#fff", padding: "56px 48px 28px" }}>
      <div
        className="rsp-footer-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
          gap: 48,
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        <div>
          <div style={{ fontWeight: 800, fontSize: 18 }}>
            3d<span style={{ color: "#3b82f6" }}>EN</span>CASA
          </div>
          <p
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,.6)",
              marginTop: 12,
              maxWidth: 280,
              lineHeight: 1.6,
            }}
          >
            Tu aliado en impresión 3D. Productos curados, precios claros y soporte real.
          </p>
        </div>

        {SECTIONS.map((section) => (
          <div key={section.title}>
            <div
              style={{
                fontSize: 11,
                letterSpacing: ".12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,.5)",
                marginBottom: 16,
                fontFamily: "var(--font-geist-mono), monospace",
              }}
            >
              {section.title}
            </div>
            {section.items.map((item) =>
              item.href ? (
                <Link
                  key={item.label}
                  href={item.href}
                  style={{
                    display: "block",
                    fontSize: 14,
                    color: "rgba(255,255,255,.85)",
                    marginBottom: 8,
                    textDecoration: "none",
                  }}
                >
                  {item.label}
                </Link>
              ) : (
                <div
                  key={item.label}
                  style={{ fontSize: 14, color: "rgba(255,255,255,.85)", marginBottom: 8 }}
                >
                  {item.label}
                </div>
              )
            )}
          </div>
        ))}
      </div>

      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,.08)",
          marginTop: 40,
          paddingTop: 20,
          fontSize: 12,
          color: "rgba(255,255,255,.4)",
          maxWidth: 1400,
          marginInline: "auto",
        }}
      >
        © {new Date().getFullYear()} 3dENCASA. Todos los derechos reservados.
      </div>
    </footer>
  );
}
