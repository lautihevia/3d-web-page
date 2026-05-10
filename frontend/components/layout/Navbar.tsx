"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Impresoras", href: "/#productos" },
  { label: "Insumos", href: "/#productos" },
  { label: "Sobre nosotros", href: "/about" },
  { label: "Contacto", href: "/contact" },
];

export function Navbar() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "#0a0d18",
        borderBottom: "1px solid rgba(255,255,255,.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px 48px",
        fontFamily: "inherit",
      }}
    >
      <Link
        href="/"
        style={{
          fontWeight: 800,
          fontSize: 18,
          letterSpacing: "-.02em",
          color: "#fff",
          textDecoration: "none",
        }}
      >
        3d<span style={{ color: "#3b82f6" }}>EN</span>CASA
      </Link>

      <nav style={{ display: "flex", gap: 32 }}>
        {NAV_LINKS.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: hovered === link.label ? "#fff" : "rgba(255,255,255,.75)",
              textDecoration: "none",
              transition: "color .15s",
            }}
            onMouseEnter={() => setHovered(link.label)}
            onMouseLeave={() => setHovered(null)}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <button
        style={{
          background: "transparent",
          border: "1px solid rgba(255,255,255,.2)",
          color: "#fff",
          padding: "8px 14px",
          borderRadius: 999,
          fontSize: 13,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontFamily: "inherit",
        }}
      >
        <Search size={14} />
        Buscar
      </button>
    </header>
  );
}
