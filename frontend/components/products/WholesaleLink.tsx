import { ArrowRight, Package } from "lucide-react";

const WHATSAPP = "5493492280435";

/** Enlace a WhatsApp para consultar precio mayorista; se muestra en todos los filamentos. */
export function WholesaleLink({ productName }: { productName: string }) {
  const text = `Hola, quiero consultar el precio mayorista del ${productName}.`;
  return (
    <a
      href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginTop: 14,
        padding: "10px 14px",
        borderRadius: 10,
        background: "#eff6ff",
        border: "1px solid #bfdbfe",
        color: "#1d4ed8",
        fontSize: 13,
        fontWeight: 600,
        textDecoration: "none",
      }}
    >
      <Package size={16} style={{ flexShrink: 0 }} />
      <span style={{ flex: 1 }}>¿Comprás por cantidad? Consultá por precio mayorista</span>
      <ArrowRight size={15} style={{ flexShrink: 0 }} />
    </a>
  );
}
