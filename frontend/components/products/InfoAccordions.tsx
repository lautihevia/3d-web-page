import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Package, FileText, CheckCircle, Truck } from "lucide-react";

interface InfoAccordionsProps {
    description?: string;
}

/**
 * Acordeones de información del producto.
 * Secciones colapsables con iconos.
 */
export function InfoAccordions({ description }: InfoAccordionsProps) {
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
            <AccordionItem value="specs">
                <AccordionTrigger className="text-sm font-medium hover:no-underline">
                    <div className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Especificaciones Técnicas
                    </div>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-slate-600">
                    <ul className="space-y-1">
                        <li>• Información técnica detallada próximamente</li>
                    </ul>
                </AccordionContent>
            </AccordionItem>

            {/* Compatibilidad */}
            <AccordionItem value="compatibilidad">
                <AccordionTrigger className="text-sm font-medium hover:no-underline">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Compatibilidad & Uso recomendado
                    </div>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-slate-600">
                    Información de compatibilidad próximamente.
                </AccordionContent>
            </AccordionItem>

            {/* Envíos */}
            <AccordionItem value="envios">
                <AccordionTrigger className="text-sm font-medium hover:no-underline">
                    <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        Envíos y Pick Up
                    </div>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-slate-600">
                    <p className="mb-2"><strong>Envío a domicilio:</strong> 3-5 días hábiles</p>
                    <p><strong>Retiro en tienda:</strong> Disponible en CABA</p>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
