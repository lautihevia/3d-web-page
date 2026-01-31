"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { FilterSidebar } from "./FilterSidebar";

interface MobileFilterDrawerProps {
    brand: string;
}

/**
 * Drawer de filtros para móvil.
 * Usa el Sheet component de shadcn/ui.
 */
export function MobileFilterDrawer({ brand }: MobileFilterDrawerProps) {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filtros
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
                <SheetHeader className="p-6 pb-0">
                    <SheetTitle>Filtros</SheetTitle>
                </SheetHeader>
                <div className="p-4">
                    <FilterSidebar brand={brand} />
                </div>
            </SheetContent>
        </Sheet>
    );
}
