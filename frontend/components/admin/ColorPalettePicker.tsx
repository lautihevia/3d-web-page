"use client";

import { PALETTE, paletteColor } from "@/lib/filamentColors";

const PRIMARY = "#3b82f6";

interface ColorPalettePickerProps {
    selected: string[];
    onToggle: (key: string) => void;
}

/**
 * Selector de paleta para una fila de color del admin. Multi-selección a
 * propósito: un "Bronce" se etiqueta amarillo + marron y así aparece al filtrar
 * por cualquiera de los dos; un tricolor lleva sus tres colores.
 */
export function ColorPalettePicker({ selected, onToggle }: ColorPalettePickerProps) {
    const labels = selected
        .map((k) => paletteColor(k)?.label)
        .filter(Boolean)
        .join(" · ");

    return (
        <div style={{ marginTop: 10 }}>
            <div
                style={{
                    fontSize: 11,
                    color: "rgba(0,0,0,.45)",
                    marginBottom: 6,
                    display: "flex",
                    gap: 6,
                    flexWrap: "wrap",
                }}
            >
                <span style={{ fontWeight: 600 }}>Paleta</span>
                {labels ? (
                    <span style={{ color: PRIMARY, fontWeight: 600 }}>{labels}</span>
                ) : (
                    <span style={{ fontStyle: "italic" }}>
                        sin elegir — se deduce del nombre al guardar
                    </span>
                )}
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {PALETTE.map((c) => {
                    const active = selected.includes(c.key);
                    return (
                        <button
                            key={c.key}
                            type="button"
                            onClick={() => onToggle(c.key)}
                            title={c.label}
                            aria-label={c.label}
                            aria-pressed={active}
                            style={{
                                width: 22,
                                height: 22,
                                borderRadius: "50%",
                                background: c.swatch,
                                border: c.needsBorder
                                    ? "1px solid rgba(0,0,0,.2)"
                                    : "1px solid rgba(0,0,0,.08)",
                                boxShadow: active
                                    ? `0 0 0 2px #f9fafb, 0 0 0 4px ${PRIMARY}`
                                    : "none",
                                cursor: "pointer",
                                padding: 0,
                                flexShrink: 0,
                                transition: "box-shadow .15s",
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
}
