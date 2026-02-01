"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const contactSchema = z.object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z.string().email("Ingresa un email válido"),
    subject: z.string().min(1, "Selecciona un asunto"),
    message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
});

type ContactFormData = z.infer<typeof contactSchema>;

/**
 * Página de contacto con formulario y datos de la empresa.
 */
export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
    });

    const onSubmit = async (data: ContactFormData) => {
        setIsSubmitting(true);

        // Simular envío
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log("Form data:", data);

        setIsSubmitting(false);
        setIsSuccess(true);
        reset();

        // Ocultar mensaje de éxito después de 5 segundos
        setTimeout(() => setIsSuccess(false), 5000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Hero Section */}
            <div className="bg-blue-600 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Contactanos</h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                        ¿Tenés una idea? La imprimimos. Estamos acá para ayudarte con tu proyecto.
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {/* Columna Info */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">
                                Información de Contacto
                            </h2>
                            <p className="text-slate-600 mb-8">
                                Somos expertos en impresión 3D con años de experiencia.
                                No dudes en contactarnos para consultas, presupuestos o soporte técnico.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Mail className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">Email</h3>
                                    <p className="text-slate-600">contacto@3dencasa.com</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Phone className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">Teléfono</h3>
                                    <p className="text-slate-600">+54 11 1234-5678</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <MapPin className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">Ubicación</h3>
                                    <p className="text-slate-600">Buenos Aires, Argentina</p>
                                </div>
                            </div>
                        </div>

                        {/* Horarios */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                            <h3 className="font-semibold text-slate-900 mb-4">Horarios de Atención</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Lunes a Viernes</span>
                                    <span className="font-medium">9:00 - 18:00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Sábados</span>
                                    <span className="font-medium">10:00 - 14:00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Domingos</span>
                                    <span className="text-slate-400">Cerrado</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Columna Formulario */}
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">
                            Envianos un mensaje
                        </h2>

                        {isSuccess && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <p className="text-green-800 font-medium">
                                    ¡Mensaje enviado con éxito! Te responderemos pronto.
                                </p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            {/* Nombre */}
                            <div className="space-y-2">
                                <Label htmlFor="name">Nombre *</Label>
                                <Input
                                    id="name"
                                    placeholder="Tu nombre completo"
                                    {...register("name")}
                                    className={errors.name ? "border-red-500" : ""}
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500">{errors.name.message}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="tu@email.com"
                                    {...register("email")}
                                    className={errors.email ? "border-red-500" : ""}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500">{errors.email.message}</p>
                                )}
                            </div>

                            {/* Asunto */}
                            <div className="space-y-2">
                                <Label htmlFor="subject">Asunto *</Label>
                                <Select onValueChange={(value) => setValue("subject", value)}>
                                    <SelectTrigger className={errors.subject ? "border-red-500" : ""}>
                                        <SelectValue placeholder="Selecciona un asunto" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="consulta">Consulta General</SelectItem>
                                        <SelectItem value="presupuesto">Solicitar Presupuesto</SelectItem>
                                        <SelectItem value="soporte">Soporte Técnico</SelectItem>
                                        <SelectItem value="otro">Otro</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.subject && (
                                    <p className="text-sm text-red-500">{errors.subject.message}</p>
                                )}
                            </div>

                            {/* Mensaje */}
                            <div className="space-y-2">
                                <Label htmlFor="message">Mensaje *</Label>
                                <textarea
                                    id="message"
                                    rows={5}
                                    placeholder="Contanos cómo podemos ayudarte..."
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${errors.message ? "border-red-500" : "border-slate-300"
                                        }`}
                                    {...register("message")}
                                />
                                {errors.message && (
                                    <p className="text-sm text-red-500">{errors.message.message}</p>
                                )}
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 hover:bg-blue-700"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Enviando...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" />
                                        Enviar Mensaje
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
