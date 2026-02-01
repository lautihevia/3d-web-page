import Link from "next/link";
import { Cpu, Truck, HeartHandshake, ArrowRight, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const values = [
    {
        icon: Cpu,
        title: "Tecnología de Punta",
        description:
            "Trabajamos con las mejores marcas del mercado: Creality, Bambu Lab, Prusa y más.",
    },
    {
        icon: Truck,
        title: "Envíos a Todo el País",
        description:
            "Logística rápida y segura. Tu pedido llega a cualquier punto de Argentina.",
    },
    {
        icon: HeartHandshake,
        title: "Asesoramiento Real",
        description:
            "No solo vendemos, imprimimos. Te ayudamos a elegir lo mejor para tu proyecto.",
    },
];

/**
 * Página Sobre Nosotros - Diseño profesional tipo landing de startup.
 */
export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-violet-50">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.08),transparent_50%)]" />

                <div className="container mx-auto px-4 py-20 md:py-32 relative">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
                            <Printer className="h-4 w-4" />
                            Desde 2020 en Argentina
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
                            Expertos en{" "}
                            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                                Materializar Ideas
                            </span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Somos tu aliado en impresión 3D. Vendemos equipos, insumos y
                            brindamos el soporte técnico que necesitás para hacer realidad
                            cualquier proyecto.
                        </p>
                    </div>
                </div>
            </section>

            {/* Historia Section */}
            <section className="py-20 md:py-28">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl mx-auto">
                        {/* Imagen */}
                        <div className="relative">
                            <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl shadow-lg overflow-hidden border border-slate-200">
                                {/* Placeholder visual */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <Printer className="h-20 w-20 text-slate-300 mx-auto mb-4" />
                                        <p className="text-sm text-slate-400">Imagen del taller</p>
                                    </div>
                                </div>
                            </div>
                            {/* Badge flotante */}
                            <div className="absolute -bottom-4 -right-4 md:-right-6 bg-blue-600 text-white px-5 py-3 rounded-xl shadow-lg">
                                <span className="text-2xl font-bold">+5000</span>
                                <span className="text-sm block text-blue-100">Clientes felices</span>
                            </div>
                        </div>

                        {/* Texto */}
                        <div className="space-y-6">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                                Nuestra Historia
                            </h2>
                            <Separator className="w-16 bg-blue-600 h-1" />
                            <div className="space-y-4 text-muted-foreground text-lg">
                                <p>
                                    Nacimos de la pasión por la tecnología y la fabricación digital.
                                    Lo que empezó como un hobby se convirtió en una misión:
                                    <strong className="text-slate-700"> hacer accesible la impresión 3D para todos.</strong>
                                </p>
                                <p>
                                    Hoy somos referentes en Argentina, ofreciendo impresoras,
                                    filamentos y repuestos de las mejores marcas, siempre con
                                    asesoramiento personalizado.
                                </p>
                                <p>
                                    Creemos que cada persona tiene una idea que merece ser
                                    materializada. Nosotros te damos las herramientas.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Por qué elegirnos */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            ¿Por qué elegirnos?
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                            Más que una tienda, somos tu partner en impresión 3D.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {values.map((value, index) => {
                            const Icon = value.icon;
                            return (
                                <Card
                                    key={index}
                                    className="border-0 shadow-md hover:shadow-lg transition-shadow bg-white"
                                >
                                    <CardContent className="p-8 text-center">
                                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-violet-500 rounded-xl flex items-center justify-center mx-auto mb-5">
                                            <Icon className="h-7 w-7 text-white" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-slate-900 mb-3">
                                            {value.title}
                                        </h3>
                                        <p className="text-muted-foreground">
                                            {value.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}
