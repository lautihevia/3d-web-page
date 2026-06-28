"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ImageIcon, Plus, Trash2 } from "lucide-react";
import { adminFetch, AdminSessionExpiredError, getAdminToken } from "@/lib/adminAuth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const PRIMARY = "#3b82f6";

const PRINTER_BRANDS = ["Bambu Lab", "Creality", "Anycubic", "Usados"];
const FILAMENT_BRANDS = ["W3D", "IID Max", "Creality"];
const CATEGORIES = ["Impresoras", "Filamentos", "Electrónica", "Kits y Repuestos"];
const CATEGORIES_WITHOUT_BRAND = ["Electrónica", "Kits y Repuestos"];
const FILAMENT_TYPES = ["", "Multicolor", "Tricolor", "PLA Mate", "PLA", "PETG"];
const ELECTRONICA_TYPES = ["", "Placas", "Sensores", "Insumos"];

function brandsForCategory(category: string): string[] {
  if (category === "Impresoras") return PRINTER_BRANDS;
  if (category === "Filamentos") return FILAMENT_BRANDS;
  return [];
}

// Campo "tipo" (subcategory) según la categoría. null = la categoría no usa subcategoría.
function subcategoryFieldFor(category: string): { label: string; options: string[] } | null {
  if (category === "Filamentos") return { label: "Tipo de filamento", options: FILAMENT_TYPES };
  if (category === "Electrónica") return { label: "Tipo", options: ELECTRONICA_TYPES };
  return null;
}

const IMAGE_SLOTS = [
  { key: "imageUrl" as const, label: "Imagen principal" },
  { key: "imageUrl2" as const, label: "Imagen 2" },
  { key: "imageUrl3" as const, label: "Imagen 3" },
  { key: "imageUrl4" as const, label: "Imagen 4" },
];

interface ColorImage {
  colorName: string;
  imageUrl: string;
  inStock: boolean;
}

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: "",
    brand: "Bambu Lab",
    category: "Impresoras",
    subcategory: "",
    description: "",
    imageUrl: "",
    imageUrl2: "",
    imageUrl3: "",
    imageUrl4: "",
    price: "",
    inStock: true,
    isActive: true,
    featured: false,
    technicalSpecs: "",
    compatibilityNotes: "",
    onSale: false,
    salePrice: "",
  });

  const [colorImages, setColorImages] = useState<ColorImage[]>([{ colorName: "", imageUrl: "", inStock: true }]);

  const set = (key: string, val: string | boolean) =>
    setForm((f) => ({ ...f, [key]: val }));

  const isFilament = form.category === "Filamentos";
  const hasBrand = !CATEGORIES_WITHOUT_BRAND.includes(form.category);
  const availableBrands = brandsForCategory(form.category);
  const subcatField = subcategoryFieldFor(form.category);

  const addColorRow = () => setColorImages((prev) => [...prev, { colorName: "", imageUrl: "", inStock: true }]);
  const removeColorRow = (i: number) => setColorImages((prev) => prev.filter((_, idx) => idx !== i));
  const updateColorRow = (i: number, field: keyof ColorImage, val: string | boolean) =>
    setColorImages((prev) => prev.map((row, idx) => idx === i ? { ...row, [field]: val } : row));

  useEffect(() => {
    if (!getAdminToken()) { router.push("/admin/login"); return; }

    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/products/${id}`);
        if (!res.ok) throw new Error("Not found");
        const p = await res.json();
        const knownCategory = CATEGORIES.includes(p.category) ? p.category : "Impresoras";
        const brandsForCat = brandsForCategory(knownCategory);
        const knownBrand = brandsForCat.length === 0
          ? ""
          : (brandsForCat.includes(p.brand ?? "") ? p.brand : brandsForCat[0]);
        setForm({
          name: p.name || "",
          brand: knownBrand,
          category: knownCategory,
          subcategory: p.subcategory || "",
          description: p.description || "",
          imageUrl: p.mainImageUrl || "",
          imageUrl2: p.imageUrl2 || "",
          imageUrl3: p.imageUrl3 || "",
          imageUrl4: p.imageUrl4 || "",
          price: p.variants?.[0]?.price?.toString() || "",
          inStock: p.inStock ?? true,
          isActive: p.isActive,
          featured: p.featured ?? false,
          technicalSpecs: p.technicalSpecs || "",
          compatibilityNotes: p.compatibilityNotes || "",
          onSale: p.onSale ?? false,
          salePrice: p.salePrice?.toString() || "",
        });
        if (p.colorImages && p.colorImages.length > 0) {
          setColorImages(p.colorImages.map((c: { colorName: string; imageUrl: string; inStock?: boolean }) => ({
            colorName: c.colorName,
            imageUrl: c.imageUrl,
            inStock: c.inStock ?? true,
          })));
        }
      } catch {
        setError("Producto no encontrado");
      } finally {
        setFetching(false);
      }
    };
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!getAdminToken()) { router.push("/admin/login"); return; }
    setError("");
    setLoading(true);

    try {
      const brand = hasBrand ? form.brand : "";

      const payload: Record<string, unknown> = {
        name: form.name?.trim(),
        brand: brand?.trim() || null,
        category: form.category || null,
        subcategory: form.subcategory || null,
        description: form.description?.trim() || null,
        price: form.price ? parseFloat(form.price) : null,
        inStock: form.inStock ?? true,
        isActive: form.isActive ?? true,
        featured: form.featured ?? false,
        technicalSpecs: form.technicalSpecs?.trim() || null,
        compatibilityNotes: form.compatibilityNotes?.trim() || null,
        onSale: form.onSale ?? false,
        salePrice: form.onSale && form.salePrice ? parseFloat(form.salePrice) : null,
      };

      if (isFilament) {
        const validColors = colorImages.filter((c) => c.colorName.trim() && c.imageUrl.trim());
        payload.colorImages = validColors;
        payload.imageUrl = form.imageUrl?.trim() || (validColors[0]?.imageUrl ?? null);
        payload.imageUrl2 = null;
        payload.imageUrl3 = null;
        payload.imageUrl4 = null;
      } else {
        payload.imageUrl = form.imageUrl?.trim() || null;
        payload.imageUrl2 = form.imageUrl2?.trim() || null;
        payload.imageUrl3 = form.imageUrl3?.trim() || null;
        payload.imageUrl4 = form.imageUrl4?.trim() || null;
        payload.colorImages = [];
      }

      const res = await adminFetch(`${API_URL}/api/v1/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        throw new Error(`Error ${res.status}: ${errText || "Error al actualizar"}`);
      }
      setSuccess(true);
      setTimeout(() => router.push("/admin"), 1200);
    } catch (err) {
      if (err instanceof AdminSessionExpiredError) return;
      console.error("Error al actualizar producto:", err);
      setError(err instanceof Error ? err.message : "No se pudo actualizar el producto.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div style={{ padding: "60px 40px", color: "rgba(0,0,0,.4)", fontSize: 14 }}>Cargando...</div>;

  if (success) {
    return (
      <div style={{ padding: "80px 40px", textAlign: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#dcfce7", color: "#16a34a", fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>✓</div>
        <h2 style={{ fontSize: 22, fontWeight: 700 }}>Producto actualizado</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: "32px 40px", maxWidth: 820 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
        <Link href="/admin" style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid rgba(0,0,0,.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(0,0,0,.5)", textDecoration: "none" }}>
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: "#0b0d12" }}>Editar producto</h1>
          <p style={{ fontSize: 13, color: "rgba(0,0,0,.45)", marginTop: 2 }}>ID #{id}</p>
        </div>
      </div>

      {error && (
        <div style={{ background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.2)", borderRadius: 12, padding: "12px 16px", fontSize: 13, color: "#dc2626", marginBottom: 20 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

          {/* Name */}
          <div style={{ gridColumn: "1 / -1" }}>
            <Field label="Nombre *">
              <input required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Nombre del producto" style={inputStyle} />
            </Field>
          </div>

          {/* Category */}
          <div style={{ gridColumn: hasBrand ? "auto" : "1 / -1" }}>
            <Field label="Categoría">
              <select value={form.category} onChange={(e) => {
                const newCat = e.target.value;
                const brands = brandsForCategory(newCat);
                setForm(f => ({
                  ...f,
                  category: newCat,
                  brand: brands.length === 0 ? "" : (brands.includes(f.brand) ? f.brand : brands[0]),
                  subcategory: "",
                }));
              }} style={inputStyle}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
          </div>

          {/* Brand (only when category has brand) */}
          {hasBrand && (
            <div>
              <Field label="Marca">
                <select value={form.brand} onChange={(e) => set("brand", e.target.value)} style={inputStyle}>
                  {availableBrands.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </Field>
            </div>
          )}

          {/* Subcategory (tipo) — para categorías que lo usan (filamentos, electrónica) */}
          {subcatField && (
            <div style={{ gridColumn: "1 / -1" }}>
              <Field label={subcatField.label}>
                <select value={form.subcategory} onChange={(e) => set("subcategory", e.target.value)} style={inputStyle}>
                  {subcatField.options.map((t) => (
                    <option key={t} value={t}>{t || "— Seleccioná el tipo —"}</option>
                  ))}
                </select>
              </Field>
            </div>
          )}

          {/* Price */}
          <div style={{ gridColumn: "1 / -1" }}>
            <Field label="Precio (ARS)">
              <input type="number" min="0" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="0" style={inputStyle} />
            </Field>
          </div>

          {/* Images section */}
          <div style={{ gridColumn: "1 / -1" }}>
            {isFilament ? (
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(0,0,0,.65)", marginBottom: 12 }}>
                  Colores e imágenes del filamento
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {colorImages.map((row, i) => {
                    const url = row.imageUrl.trim().startsWith("http") ? row.imageUrl.trim() : null;
                    return (
                      <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", background: "#f9fafb", border: "1px solid rgba(0,0,0,.07)", borderRadius: 12, padding: "10px 14px" }}>
                        <div style={{ width: 56, height: 56, borderRadius: 8, background: "#fff", border: "1px solid rgba(0,0,0,.08)", overflow: "hidden", position: "relative", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {url ? (
                            <Image src={url} alt={row.colorName || `Color ${i + 1}`} fill className="object-contain p-1" />
                          ) : (
                            <ImageIcon size={16} color="rgba(0,0,0,.2)" />
                          )}
                        </div>
                        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 2fr", gap: 8 }}>
                          <input
                            value={row.colorName}
                            onChange={(e) => updateColorRow(i, "colorName", e.target.value)}
                            placeholder="Nombre del color"
                            style={{ ...inputStyle, background: "#fff" }}
                          />
                          <input
                            value={row.imageUrl}
                            onChange={(e) => updateColorRow(i, "imageUrl", e.target.value)}
                            placeholder="https://res.cloudinary.com/..."
                            style={{ ...inputStyle, background: "#fff" }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => updateColorRow(i, "inStock", !row.inStock)}
                          title={row.inStock ? "Con stock — click para marcar sin stock" : "Sin stock — click para marcar con stock"}
                          style={{
                            padding: "6px 10px",
                            borderRadius: 8,
                            border: "1px solid",
                            borderColor: row.inStock ? "#22c55e55" : "#ef444455",
                            background: row.inStock ? "#22c55e18" : "#ef444418",
                            color: row.inStock ? "#16a34a" : "#dc2626",
                            fontSize: 11,
                            fontWeight: 700,
                            cursor: "pointer",
                            fontFamily: "inherit",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {row.inStock ? "✓ Stock" : "✕ Sin stock"}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeColorRow(i)}
                          disabled={colorImages.length === 1}
                          style={{ color: colorImages.length === 1 ? "rgba(0,0,0,.2)" : "#ef4444", background: "none", border: "none", cursor: colorImages.length === 1 ? "default" : "pointer", padding: 4, borderRadius: 6 }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    );
                  })}
                  <button
                    type="button"
                    onClick={addColorRow}
                    style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: PRIMARY, background: "none", border: `1px dashed ${PRIMARY}`, borderRadius: 10, padding: "9px 16px", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}
                  >
                    <Plus size={14} /> Agregar color
                  </button>
                </div>
                <div style={{ marginTop: 14 }}>
                  <div style={{ fontSize: 12, color: "rgba(0,0,0,.45)", marginBottom: 8 }}>Imagen principal (se usa la primera del color si se deja vacía)</div>
                  <input
                    value={form.imageUrl}
                    onChange={(e) => set("imageUrl", e.target.value)}
                    placeholder="https://res.cloudinary.com/..."
                    style={inputStyle}
                  />
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(0,0,0,.65)", marginBottom: 12 }}>
                  Imágenes del producto — pegá URLs de Cloudinary
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {IMAGE_SLOTS.map(({ key, label }) => {
                    const val = form[key] as string;
                    const url = val.trim().startsWith("http") ? val.trim() : null;
                    return (
                      <div key={key} style={{ display: "flex", gap: 12, alignItems: "center", background: "#f9fafb", border: "1px solid rgba(0,0,0,.07)", borderRadius: 12, padding: "10px 14px" }}>
                        <div style={{ width: 60, height: 60, borderRadius: 8, background: "#fff", border: "1px solid rgba(0,0,0,.08)", overflow: "hidden", position: "relative", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {url ? (
                            <Image src={url} alt={label} fill className="object-contain p-1" />
                          ) : (
                            <ImageIcon size={18} color="rgba(0,0,0,.2)" />
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(0,0,0,.4)", letterSpacing: ".04em", textTransform: "uppercase", marginBottom: 5 }}>{label}</div>
                          <input
                            value={val}
                            onChange={(e) => set(key, e.target.value)}
                            placeholder="https://res.cloudinary.com/..."
                            style={{ ...inputStyle, background: "#fff" }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div style={{ gridColumn: "1 / -1" }}>
            <Field label="Descripción">
              <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={4} placeholder="Descripción general del producto..." style={{ ...inputStyle, resize: "vertical" }} />
            </Field>
          </div>

          {/* Technical Specs */}
          <div style={{ gridColumn: "1 / -1" }}>
            <Field label="Especificaciones Técnicas">
              <textarea value={form.technicalSpecs} onChange={(e) => set("technicalSpecs", e.target.value)} rows={4} placeholder="Velocidad, dimensiones, materiales compatibles, temperatura de impresión..." style={{ ...inputStyle, resize: "vertical" }} />
            </Field>
          </div>

          {/* Compatibility */}
          <div style={{ gridColumn: "1 / -1" }}>
            <Field label="Compatibilidad & Uso recomendado">
              <textarea value={form.compatibilityNotes} onChange={(e) => set("compatibilityNotes", e.target.value)} rows={3} placeholder="Compatible con, recomendado para, usos ideales..." style={{ ...inputStyle, resize: "vertical" }} />
            </Field>
          </div>

          {/* Toggles */}
          <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: 16 }}>
            <Toggle
              label="Producto activo"
              desc={form.isActive ? "Visible en el catálogo" : "Oculto del catálogo"}
              value={form.isActive}
              onChange={(v) => set("isActive", v)}
            />
            {!isFilament && (
              <Toggle
                label="Hay stock"
                desc={form.inStock ? "Disponible para la venta" : "Sin stock — se muestra con cartel rojo"}
                value={form.inStock}
                onChange={(v) => set("inStock", v)}
              />
            )}
            {isFilament && (
              <div style={{ fontSize: 12, color: "rgba(0,0,0,.5)", padding: "0 2px", lineHeight: 1.4 }}>
                <strong>Stock por color:</strong> en filamentos, el stock se maneja por color en la sección de arriba (cada color tiene su botón Stock / Sin stock).
              </div>
            )}
            <Toggle
              label="Producto destacado"
              desc={form.featured ? "Se muestra en la sección destacados del inicio" : "No aparece en destacados"}
              value={form.featured}
              onChange={(v) => set("featured", v)}
            />
            <Toggle
              label="En oferta"
              desc={form.onSale ? "Se muestra en la sección de ofertas con precio rebajado" : "Sin descuento especial"}
              value={form.onSale}
              onChange={(v) => set("onSale", v)}
            />
            {form.onSale && (
              <Field label="Precio de oferta (ARS)">
                <input type="number" min="0" step="1" value={form.salePrice} onChange={(e) => set("salePrice", e.target.value)} placeholder="Precio rebajado" style={inputStyle} />
              </Field>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
          <button type="submit" disabled={loading} style={{ background: loading ? "rgba(0,0,0,.15)" : PRIMARY, color: "#fff", border: "none", padding: "13px 28px", borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
          <Link href="/admin" style={{ padding: "13px 20px", borderRadius: 12, border: "1px solid rgba(0,0,0,.1)", fontSize: 14, color: "rgba(0,0,0,.6)", textDecoration: "none", fontWeight: 500 }}>
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "rgba(0,0,0,.65)", marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

function Toggle({ label, desc, value, onChange }: { label: string; desc: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}>
      <div onClick={() => onChange(!value)} style={{ width: 44, height: 24, borderRadius: 999, background: value ? PRIMARY : "rgba(0,0,0,.15)", position: "relative", cursor: "pointer", transition: "background .2s", flexShrink: 0 }}>
        <div style={{ position: "absolute", top: 4, left: value ? 23 : 4, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left .2s", boxShadow: "0 1px 4px rgba(0,0,0,.2)" }} />
      </div>
      <div>
        <div style={{ fontWeight: 600, fontSize: 14, color: "#0b0d12" }}>{label}</div>
        <div style={{ fontSize: 12, color: "rgba(0,0,0,.45)", marginTop: 2 }}>{desc}</div>
      </div>
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 13px", borderRadius: 10,
  border: "1px solid rgba(0,0,0,.1)", fontSize: 14, fontFamily: "inherit",
  outline: "none", boxSizing: "border-box", color: "#0b0d12", background: "#fff",
};
