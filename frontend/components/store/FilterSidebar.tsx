"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface FilterSidebarProps {
    brand: string;
}

/**
 * Sidebar de filtros para la página de marca.
 * Actualiza los query params en la URL para mantener filtros "shareables".
 */
export function FilterSidebar({ brand }: FilterSidebarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Estado local para inputs
    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
    const [onlyAvailable, setOnlyAvailable] = useState(
        searchParams.get("isActive") === "true"
    );

    /**
     * Actualiza la URL con los nuevos filtros.
     */
    const applyFilters = useCallback(() => {
        const params = new URLSearchParams();

        if (minPrice) params.set("minPrice", minPrice);
        if (maxPrice) params.set("maxPrice", maxPrice);
        if (onlyAvailable) params.set("isActive", "true");

        const queryString = params.toString();
        router.push(`/store/${brand}${queryString ? `?${queryString}` : ""}`);
    }, [brand, minPrice, maxPrice, onlyAvailable, router]);

    /**
     * Limpia todos los filtros.
     */
    const clearFilters = () => {
        setMinPrice("");
        setMaxPrice("");
        setOnlyAvailable(false);
        router.push(`/store/${brand}`);
    };

    return (
        <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="sticky top-20 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">Filtros</h3>
                    <button
                        onClick={clearFilters}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        Limpiar
                    </button>
                </div>

                <Accordion type="multiple" defaultValue={["disponibilidad", "precio"]} className="w-full">
                    {/* Disponibilidad */}
                    <AccordionItem value="disponibilidad">
                        <AccordionTrigger className="text-sm font-medium">
                            Disponibilidad
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="flex items-center justify-between py-2">
                                <Label htmlFor="available" className="text-sm text-slate-600">
                                    Solo disponibles
                                </Label>
                                <Switch
                                    id="available"
                                    checked={onlyAvailable}
                                    onCheckedChange={(checked) => {
                                        setOnlyAvailable(checked);
                                    }}
                                />
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Precio */}
                    <AccordionItem value="precio">
                        <AccordionTrigger className="text-sm font-medium">
                            Precio
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-3">
                                <div>
                                    <Label htmlFor="minPrice" className="text-xs text-slate-500">
                                        Mínimo
                                    </Label>
                                    <Input
                                        id="minPrice"
                                        type="number"
                                        placeholder="$0"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="maxPrice" className="text-xs text-slate-500">
                                        Máximo
                                    </Label>
                                    <Input
                                        id="maxPrice"
                                        type="number"
                                        placeholder="$999999"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                {/* Aplicar Filtros */}
                <Button onClick={applyFilters} className="w-full mt-4">
                    Aplicar Filtros
                </Button>
            </div>
        </aside>
    );
}
