"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
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

interface ProductFormData {
    name: string;
    description: string;
    brand: string;
    price: number;
    stock: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const brands = [
    "Creality",
    "Bambu Lab",
    "Prusa",
    "Anycubic",
    "Elegoo",
    "Grilon3",
    "eSUN",
    "Otro",
];

/**
 * Página de creación de nuevo producto.
 */
export default function NewProductPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<ProductFormData>();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            // Crear preview local
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const onSubmit = async (data: ProductFormData) => {
        setIsSubmitting(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");

            // Construir FormData para envío multipart
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("description", data.description || "");
            formData.append("brand", data.brand || "");
            formData.append("price", data.price.toString());
            formData.append("stock", data.stock.toString());

            if (imageFile) {
                formData.append("image", imageFile);
            }

            const res = await fetch(`${API_URL}/api/v1/admin/products`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    // No enviar Content-Type, el browser lo setea con boundary automáticamente
                },
                body: formData,
            });

            if (!res.ok) {
                const errorData = await res.text();
                throw new Error(errorData || "Error al crear el producto");
            }

            // Éxito: redirigir a lista de productos
            router.push("/admin/products");
        } catch (err) {
            console.error("Error:", err);
            setError(err instanceof Error ? err.message : "Error al crear el producto");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-8 max-w-2xl">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/admin/products"
                    className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700 mb-4"
                >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Volver a Productos
                </Link>
                <h1 className="text-2xl font-bold text-slate-900">Nuevo Producto</h1>
                <p className="text-slate-500 mt-1">
                    Completa los datos para agregar un producto al catálogo
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Image Upload */}
                <div className="space-y-2">
                    <Label>Imagen del producto</Label>
                    <div className="flex items-start gap-4">
                        {/* Preview */}
                        <div className="w-32 h-32 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden">
                            {imagePreview ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <Upload className="h-8 w-8 text-slate-400" />
                            )}
                        </div>

                        {/* Upload Button */}
                        <div className="flex-1">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                id="image-upload"
                            />
                            <Label
                                htmlFor="image-upload"
                                className="inline-flex items-center px-4 py-2 bg-white border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                            >
                                <Upload className="h-4 w-4 mr-2" />
                                Seleccionar imagen
                            </Label>
                            {imageFile && (
                                <p className="text-sm text-slate-500 mt-2">{imageFile.name}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Name */}
                <div className="space-y-2">
                    <Label htmlFor="name">Nombre *</Label>
                    <Input
                        id="name"
                        placeholder="Ej: Filamento PLA Premium"
                        {...register("name", { required: "El nombre es obligatorio" })}
                    />
                    {errors.name && (
                        <p className="text-sm text-red-500">{errors.name.message}</p>
                    )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <Label htmlFor="description">Descripción</Label>
                    <textarea
                        id="description"
                        rows={4}
                        placeholder="Descripción detallada del producto..."
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                        {...register("description")}
                    />
                </div>

                {/* Brand */}
                <div className="space-y-2">
                    <Label htmlFor="brand">Marca</Label>
                    <Select onValueChange={(value) => setValue("brand", value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccionar marca" />
                        </SelectTrigger>
                        <SelectContent>
                            {brands.map((brand) => (
                                <SelectItem key={brand} value={brand}>
                                    {brand}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Price & Stock Row */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Price */}
                    <div className="space-y-2">
                        <Label htmlFor="price">Precio (ARS) *</Label>
                        <Input
                            id="price"
                            type="number"
                            min="0"
                            step="1"
                            placeholder="12500"
                            {...register("price", {
                                required: "El precio es obligatorio",
                                min: { value: 0, message: "El precio debe ser positivo" },
                            })}
                        />
                        {errors.price && (
                            <p className="text-sm text-red-500">{errors.price.message}</p>
                        )}
                    </div>

                    {/* Stock */}
                    <div className="space-y-2">
                        <Label htmlFor="stock">Stock *</Label>
                        <Input
                            id="stock"
                            type="number"
                            min="0"
                            step="1"
                            placeholder="50"
                            {...register("stock", {
                                required: "El stock es obligatorio",
                                min: { value: 0, message: "El stock debe ser positivo" },
                            })}
                        />
                        {errors.stock && (
                            <p className="text-sm text-red-500">{errors.stock.message}</p>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-violet-600 hover:bg-violet-700"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            "Crear Producto"
                        )}
                    </Button>
                    <Link href="/admin/products">
                        <Button type="button" variant="outline">
                            Cancelar
                        </Button>
                    </Link>
                </div>
            </form>
        </div>
    );
}
