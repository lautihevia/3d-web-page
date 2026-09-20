/**
 * Paleta canónica de colores de filamento.
 *
 * Las claves están duplicadas en el backend
 * (`backend/.../catalog/FilamentPalette.kt`): si tocás una, tocá las dos.
 *
 * Un color de producto se etiqueta con varias claves a la vez — un "Bronce" es
 * amarillo + marron y aparece al filtrar por cualquiera de los dos.
 */

export interface PaletteColor {
    key: string;
    label: string;
    /** CSS del círculo/chip. Puede ser un color plano o un degradé. */
    swatch: string;
    /** Los claros necesitan borde para no desaparecer sobre fondo blanco. */
    needsBorder?: boolean;
}

/** Colores lisos: se dibujan como círculos. */
export const SOLID_COLORS: PaletteColor[] = [
    { key: "blanco", label: "Blanco", swatch: "#ffffff", needsBorder: true },
    { key: "negro", label: "Negro", swatch: "#1a1a1a" },
    { key: "gris", label: "Gris", swatch: "#9ca3af" },
    { key: "rojo", label: "Rojo", swatch: "#dc2626" },
    { key: "naranja", label: "Naranja", swatch: "#f97316" },
    { key: "amarillo", label: "Amarillo", swatch: "#facc15" },
    { key: "verde", label: "Verde", swatch: "#22c55e" },
    { key: "celeste", label: "Celeste", swatch: "#38bdf8" },
    { key: "azul", label: "Azul", swatch: "#2563eb" },
    { key: "violeta", label: "Violeta", swatch: "#7c3aed" },
    { key: "rosado", label: "Rosado", swatch: "#ec4899" },
    { key: "marron", label: "Marrón", swatch: "#92400e" },
    { key: "piel", label: "Piel", swatch: "#e8be9b", needsBorder: true },
];

/** Acabados: van como chips de texto, cuesta reconocerlos en un círculo chico. */
export const SPECIAL_COLORS: PaletteColor[] = [
    {
        key: "dorado",
        label: "Dorado",
        swatch: "linear-gradient(135deg,#b8860b,#f5e08a 45%,#d4af37)",
    },
    {
        key: "plateado",
        label: "Plateado",
        swatch: "linear-gradient(135deg,#6b7280,#e5e7eb 45%,#9ca3af)",
        needsBorder: true,
    },
    {
        key: "cristal",
        label: "Cristal",
        swatch: "linear-gradient(135deg,rgba(255,255,255,.9),rgba(148,197,255,.55))",
        needsBorder: true,
    },
    {
        key: "marmol",
        label: "Mármol",
        swatch: "linear-gradient(135deg,#ffffff,#d1d5db 40%,#ffffff 65%,#9ca3af)",
        needsBorder: true,
    },
    {
        key: "multicolor",
        label: "Multicolor",
        swatch: "conic-gradient(#ef4444,#f59e0b,#22c55e,#38bdf8,#6366f1,#ec4899,#ef4444)",
    },
    { key: "glow", label: "Glow", swatch: "#7cffb2", needsBorder: true },
];

export const PALETTE: PaletteColor[] = [...SOLID_COLORS, ...SPECIAL_COLORS];

const BY_KEY = new Map(PALETTE.map((c) => [c.key, c]));

export function paletteColor(key: string): PaletteColor | undefined {
    return BY_KEY.get(key);
}

/** Descarta claves que no existan, para no arrastrar basura desde la URL. */
export function sanitizeColorKeys(keys: string[]): string[] {
    return keys.map((k) => k.trim().toLowerCase()).filter((k) => BY_KEY.has(k));
}
