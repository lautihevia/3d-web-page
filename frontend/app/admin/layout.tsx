"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Package, LogOut, Plus } from "lucide-react";
import { clearAdminToken } from "@/lib/adminAuth";
import { AdminSessionGuard } from "@/components/admin/AdminSessionGuard";

const PRIMARY = "#3b82f6";

const NAV = [
  { label: "Productos", href: "/admin", icon: Package },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = () => {
    clearAdminToken();
    router.push("/admin/login");
  };

  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "inherit" }}>
      <AdminSessionGuard />
      {/* Sidebar */}
      <aside
        style={{
          width: 220,
          flexShrink: 0,
          background: "#0a0d18",
          borderRight: "1px solid rgba(255,255,255,.08)",
          display: "flex",
          flexDirection: "column",
          padding: "28px 0",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        {/* Logo */}
        <div style={{ padding: "0 20px 28px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
          <Link
            href="/admin"
            style={{ fontWeight: 800, fontSize: 16, color: "#fff", textDecoration: "none", letterSpacing: "-.02em" }}
          >
            3d<span style={{ color: PRIMARY }}>EN</span>CASA
          </Link>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,.35)", marginTop: 4, letterSpacing: ".06em" }}>
            ADMIN
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "16px 12px" }}>
          {NAV.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: active ? 600 : 400,
                  color: active ? "#fff" : "rgba(255,255,255,.6)",
                  background: active ? "rgba(255,255,255,.08)" : "transparent",
                  textDecoration: "none",
                  marginBottom: 2,
                  transition: "all .15s",
                }}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* New product shortcut */}
        <div style={{ padding: "0 12px 12px" }}>
          <Link
            href="/admin/products/new"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: PRIMARY,
              color: "#fff",
              padding: "10px 14px",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            <Plus size={15} />
            Nuevo producto
          </Link>
        </div>

        {/* Logout */}
        <div style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,.08)" }}>
          <button
            onClick={logout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "100%",
              padding: "10px 12px",
              borderRadius: 10,
              fontSize: 13,
              color: "rgba(255,255,255,.5)",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              textAlign: "left",
            }}
          >
            <LogOut size={15} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, background: "#f7f6f1", minHeight: "100vh", overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}
