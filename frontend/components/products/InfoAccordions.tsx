import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Package, FileText, CheckCircle } from "lucide-react";

interface InfoAccordionsProps {
    description?: string;
    technicalSpecs?: string;
    compatibilityNotes?: string;
}

export function InfoAccordions({ description, technicalSpecs, compatibilityNotes }: InfoAccordionsProps) {
    return (
        <Accordion type="multiple" defaultValue={["descripcion"]} className="w-full">
            {/* Descripción */}
            <AccordionItem value="descripcion">
                <AccordionTrigger className="text-sm font-medium hover:no-underline">
                    <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Descripción
                    </div>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-slate-600">
                    {description || "Información del producto no disponible."}
                </AccordionContent>
            </AccordionItem>

            {/* Especificaciones Técnicas */}
            {technicalSpecs && (
                <AccordionItem value="specs">
                    <AccordionTrigger className="text-sm font-medium hover:no-underline">
                        <div className="flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            Especificaciones Técnicas
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-slate-600 whitespace-pre-line">
                        {technicalSpecs}
                    </AccordionContent>
                </AccordionItem>
            )}

            {/* Compatibilidad */}
            {compatibilityNotes && (
                <AccordionItem value="compatibilidad">
                    <AccordionTrigger className="text-sm font-medium hover:no-underline">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Compatibilidad & Uso recomendado
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-slate-600 whitespace-pre-line">
                        {compatibilityNotes}
                    </AccordionContent>
                </AccordionItem>
            )}

        </Accordion>
    );
}
