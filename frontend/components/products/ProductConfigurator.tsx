"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Check } from "lucide-react";
import { useCartStore } from "@/store/cart";

interface ProductVariant {
    id: number;
    sku: string;
    price: number;
    stockQuantity: number;
    attributes: Record<string, string>;
}

interface ProductConfiguratorProps {
    productId: number;
    productName: string;
    productBrand?: string;
    productImageUrl?: string;
    variants: ProductVariant[];
}

/**
 * Formatea un precio en pesos argentinos.
 */
function formatPrice(price: number): string {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
}

/**
 * Configurador dinámico de producto con selección de variantes.
 * Extrae atributos del JSONB y renderiza selectores pill-style.
 */
export function ProductConfigurator({
    productId,
    productName,
    productBrand,
    productImageUrl,
    variants
}: ProductConfiguratorProps) {
    // Cart store
    const addItem = useCartStore((state) => state.addItem);

    // Estado: atributos seleccionados por el usuario
    const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
    const [quantity, setQuantity] = useState(1);
    const [isAdded, setIsAdded] = useState(false);

    /**
     * Extrae las claves de atributos únicas de todas las variantes.
     * Ejemplo: ["Processor", "RAM", "Storage"]
     */
    const attributeKeys = useMemo(() => {
        const keys = new Set<string>();
        variants.forEach((variant) => {
            Object.keys(variant.attributes).forEach((key) => keys.add(key));
        });
        return Array.from(keys);
    }, [variants]);

    /**
     * Para cada clave de atributo, obtiene los valores únicos disponibles.
     * Ejemplo: { "Processor": ["M4 10-Core", "M4 12-Core"], "RAM": ["16GB", "32GB"] }
     */
    const attributeOptions = useMemo(() => {
        const options: Record<string, string[]> = {};
        attributeKeys.forEach((key) => {
            const values = new Set<string>();
            variants.forEach((variant) => {
                if (variant.attributes[key]) {
                    values.add(variant.attributes[key]);
                }
            });
            options[key] = Array.from(values);
        });
        return options;
    }, [attributeKeys, variants]);

    /**
     * Encuentra la variante que coincide con TODOS los atributos seleccionados.
     */
    const selectedVariant = useMemo(() => {
        return variants.find((variant) => {
            return attributeKeys.every((key) => {
                const selectedValue = selectedAttributes[key];
                if (!selectedValue) return true; // Si no hay selección, no filtrar por esta key
                return variant.attributes[key] === selectedValue;
            });
        });
    }, [variants, selectedAttributes, attributeKeys]);

    /**
     * Verifica si una opción específica está disponible (tiene stock).
     */
    const isOptionAvailable = (attributeKey: string, optionValue: string): boolean => {
        // Crear una copia de los atributos seleccionados con esta opción
        const testSelection = { ...selectedAttributes, [attributeKey]: optionValue };

        // Buscar si existe alguna variante con esta combinación que tenga stock
        return variants.some((variant) => {
            const matches = Object.entries(testSelection).every(([key, value]) => {
                return variant.attributes[key] === value;
            });
            return matches && variant.stockQuantity > 0;
        });
    };

    /**
     * Maneja la selección de un atributo.
     */
    const handleAttributeSelect = (key: string, value: string) => {
        setSelectedAttributes((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleQuantityChange = (delta: number) => {
        setQuantity((prev) => Math.max(1, prev + delta));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">{productName}</h1>
                <div className="mt-2 flex items-baseline gap-3">
                    <p className="text-2xl font-semibold text-slate-900">
                        {selectedVariant ? formatPrice(selectedVariant.price) : "Seleccione opciones"}
                    </p>
                    {selectedVariant && (
                        <p className="text-sm text-slate-500">SKU: {selectedVariant.sku}</p>
                    )}
                </div>
            </div>

            <Separator />

            {/* Selectores de Atributos */}
            {attributeKeys.map((attributeKey) => (
                <div key={attributeKey}>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        {attributeKey}
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {attributeOptions[attributeKey]?.map((optionValue) => {
                            const isSelected = selectedAttributes[attributeKey] === optionValue;
                            const isAvailable = isOptionAvailable(attributeKey, optionValue);

                            return (
                                <button
                                    key={optionValue}
                                    onClick={() => handleAttributeSelect(attributeKey, optionValue)}
                                    disabled={!isAvailable}
                                    className={`
                                        relative px-4 py-2 rounded-full text-sm font-medium transition-all
                                        ${isSelected
                                            ? "border-2 border-slate-900 bg-slate-50 text-slate-900"
                                            : "border border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                                        }
                                        ${!isAvailable && "opacity-40 cursor-not-allowed"}
                                    `}
                                >
                                    {optionValue}
                                    {!isAvailable && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-full h-px bg-slate-400 rotate-[-20deg]" />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}

            <Separator />

            {/* Selector de Cantidad */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    Cantidad
                </label>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                    >
                        <Minus className="h-4 w-4" />
                    </Button>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 text-center border border-slate-300 rounded-md py-2"
                    />
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(1)}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <Separator />

            {/* Botones de Acción */}
            <div className="space-y-3">
                <Button
                    className={`w-full py-6 text-base font-semibold rounded-xl transition-all ${isAdded
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "bg-violet-600 hover:bg-violet-700 text-white"
                        }`}
                    disabled={!selectedVariant || selectedVariant.stockQuantity === 0}
                    onClick={() => {
                        if (selectedVariant) {
                            addItem(
                                {
                                    id: productId,
                                    name: productName,
                                    brand: productBrand,
                                    mainImageUrl: productImageUrl,
                                },
                                {
                                    id: selectedVariant.id,
                                    sku: selectedVariant.sku,
                                    price: selectedVariant.price,
                                    attributes: selectedVariant.attributes,
                                },
                                quantity
                            );
                            setIsAdded(true);
                            setTimeout(() => setIsAdded(false), 2000);
                        }
                    }}
                >
                    {isAdded ? (
                        <span className="flex items-center justify-center gap-2">
                            <Check className="h-5 w-5" />
                            ¡Agregado!
                        </span>
                    ) : (
                        "Añadir al carrito"
                    )}
                </Button>
                <Button
                    variant="outline"
                    className="w-full border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white py-6 text-base font-semibold rounded-xl"
                    disabled={!selectedVariant || selectedVariant.stockQuantity === 0}
                >
                    Comprar ahora
                </Button>
            </div>

            {/* Stock Info */}
            {selectedVariant && (
                <div className="text-sm text-slate-600">
                    {selectedVariant.stockQuantity > 0 ? (
                        <p className="text-green-600">✓ En stock ({selectedVariant.stockQuantity} disponibles)</p>
                    ) : (
                        <p className="text-red-600">Sin stock</p>
                    )}
                </div>
            )}
        </div>
    );
}
