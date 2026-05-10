"use client";

import Link from "next/link";
import { Search, ChevronDown, Menu, X } from "lucide-react";
import { useState, useRef } from "react";
import { SearchModal } from "./SearchModal";

const PRIMARY = "#3b82f6";

const IMPRESORAS = [
  { label: "Bambu Lab", href: "/store/bambu lab", tag: "Premium" },
  { label: "Creality", href: "/store/creality", tag: "Profesional" },
  { label: "Anycubic", href: "/store/anycubic", tag: "Accesible" },
];

const INSUMOS = [
  { label: "Filamentos", href: "/store/filamentos" },
  { label: "Electrónica", href: "/store/electronica" },
  { label: "Herramientas", href: "/store/herramientas" },
];

interface DropdownProps {
  label: string;
  items: { label: string; href: string; tag?: string }[];
}

function NavDropdown({ label, items }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const enter = () => { clearTimeout(timer.current); setOpen(true); };
  const leave = () => { timer.current = setTimeout(() => setOpen(false), 180); };

  return (
    <div style={{ position: "relative" }} onMouseEnter={enter} onMouseLeave={leave}>
      <button
        style={{
          background: "transparent", border: "none", cursor: "pointer",
          fontSize: 14, fontWeight: 500, color: open ? "#fff" : "rgba(255,255,255,.75)",
          display: "flex", alignItems: "center", gap: 4, fontFamily: "inherit", padding: 0,
          transition: "color .15s",
        }}
      >
        {label}
        <ChevronDown size={14} style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s", opacity: 0.6 }} />
      </button>

      {open && (
        <div
          style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", width: "max(100%, 220px)", paddingTop: 10, zIndex: 100 }}
          onMouseEnter={enter} onMouseLeave={leave}
        >
          <div style={{ width: 12, height: 6, margin: "0 auto", overflow: "hidden" }}>
            <div style={{ width: 10, height: 10, background: "#0c0f1e", border: "1px solid rgba(255,255,255,.1)", transform: "rotate(45deg)", margin: "3px auto 0" }} />
          </div>
          <div style={{ background: "#0c0f1e", border: "1px solid rgba(255,255,255,.1)", borderRadius: 14, padding: 8, boxShadow: "0 20px 60px rgba(0,0,0,.6)" }}>
            {items.map((item) => (
              <Link
                key={item.label} href={item.href}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: 8, color: "rgba(255,255,255,.8)", textDecoration: "none", fontSize: 14, fontWeight: 500 }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,.07)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,.8)"; }}
              >
                {item.label}
                {item.tag && <span style={{ fontSize: 10, fontWeight: 600, color: PRIMARY, background: `${PRIMARY}18`, padding: "2px 6px", borderRadius: 999 }}>{item.tag}</span>}
              </Link>
            ))}
            <div style={{ borderTop: "1px solid rgba(255,255,255,.06)", margin: "6px 0 2px" }} />
            <Link href="/catalog" style={{ display: "block", padding: "9px 14px", borderRadius: 8, color: PRIMARY, textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
              Ver todo →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header
        style={{
          position: "sticky", top: 0, zIndex: 50,
          background: "#0a0d18", borderBottom: "1px solid rgba(255,255,255,.08)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 28px", fontFamily: "inherit",
        }}
      >
        <Link href="/" style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-.02em", color: "#fff", textDecoration: "none" }}>
          3d<span style={{ color: PRIMARY }}>EN</span>CASA
        </Link>

        {/* Desktop nav */}
        <nav className="nav-links-desktop" style={{ gap: 32, alignItems: "center" }}>
          <NavDropdown label="Impresoras" items={IMPRESORAS} />
          <NavDropdown label="Insumos" items={INSUMOS} />
          <Link href="/about" style={{ fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,.75)", textDecoration: "none" }}>Sobre nosotros</Link>
          <Link href="/contact" style={{ fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,.75)", textDecoration: "none" }}>Contacto</Link>
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => setSearchOpen(true)}
            className="nav-search-btn"
            style={{
              background: "transparent", border: "1px solid rgba(255,255,255,.2)", color: "#fff",
              padding: "8px 14px", borderRadius: 999, fontSize: 13, cursor: "pointer",
              alignItems: "center", gap: 6, fontFamily: "inherit",
            }}
          >
            <Search size={14} /> Buscar
          </button>

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="nav-hamburger"
            style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", display: "none", padding: 4 }}
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 200,
            background: "#0a0d18",
            display: "flex", flexDirection: "column",
            overflowY: "auto",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
            <span style={{ fontWeight: 800, fontSize: 18, color: "#fff", letterSpacing: "-.02em" }}>
              3d<span style={{ color: PRIMARY }}>EN</span>CASA
            </span>
            <button onClick={() => setMobileOpen(false)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", padding: 4 }}>
              <X size={24} />
            </button>
          </div>

          {/* Search */}
          <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
            <button
              onClick={() => { setMobileOpen(false); setSearchOpen(true); }}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)",
                borderRadius: 12, padding: "12px 16px", color: "rgba(255,255,255,.6)",
                fontSize: 14, cursor: "pointer", fontFamily: "inherit",
              }}
            >
              <Search size={16} /> Buscar productos...
            </button>
          </div>

          {/* Links */}
          <nav style={{ padding: "8px 16px", flex: 1 }}>
            {/* Impresoras section */}
            <div style={{ padding: "12px 8px 6px", fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(255,255,255,.35)", fontWeight: 600 }}>
              Impresoras
            </div>
            {IMPRESORAS.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 12px", borderRadius: 12, color: "#fff", textDecoration: "none", fontSize: 15, fontWeight: 500 }}>
                {item.label}
                {item.tag && <span style={{ fontSize: 11, color: PRIMARY, background: `${PRIMARY}18`, padding: "2px 8px", borderRadius: 999, fontWeight: 600 }}>{item.tag}</span>}
              </Link>
            ))}

            <div style={{ height: 1, background: "rgba(255,255,255,.06)", margin: "8px 0" }} />

            {/* Insumos section */}
            <div style={{ padding: "12px 8px 6px", fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(255,255,255,.35)", fontWeight: 600 }}>
              Insumos
            </div>
            {INSUMOS.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                style={{ display: "block", padding: "13px 12px", borderRadius: 12, color: "#fff", textDecoration: "none", fontSize: 15, fontWeight: 500 }}>
                {item.label}
              </Link>
            ))}

            <div style={{ height: 1, background: "rgba(255,255,255,.06)", margin: "8px 0" }} />

            {/* Main links */}
            {[{ label: "Catálogo completo", href: "/catalog" }, { label: "Sobre nosotros", href: "/about" }, { label: "Contacto", href: "/contact" }].map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                style={{ display: "block", padding: "13px 12px", borderRadius: 12, color: "#fff", textDecoration: "none", fontSize: 15, fontWeight: 500 }}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </>
  );
}
