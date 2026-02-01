"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Trash2, Package } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Product {
    id: number;
    name: string;
    description: string | null;
    brand: string | null;
    mainImageUrl: string | null;
    isActive: boolean;
    price: number | null;
    stock: number | null;
    variantCount: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

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
 * Página de lista de productos para administración.
 */
export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/v1/admin/products`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Error fetching products");

            const data = await res.json();
            setProducts(data);
        } catch (err) {
            console.error("Error:", err);
            // Mock data para desarrollo
            setProducts([
                {
                    id: 1,
                    name: "Filamento PLA Premium",
                    description: "Filamento de alta calidad",
                    brand: "Creality",
                    mainImageUrl: null,
                    isActive: true,
                    price: 12500,
                    stock: 50,
                    variantCount: 3,
                },
                {
                    id: 2,
                    name: "Ender 3 V3",
                    description: "Impresora 3D FDM",
                    brand: "Creality",
                    mainImageUrl: null,
                    isActive: true,
                    price: 285000,
                    stock: 5,
                    variantCount: 1,
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (productId: number) => {
        setDeletingId(productId);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/v1/admin/products/${productId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                setProducts(products.filter((p) => p.id !== productId));
            }
        } catch (err) {
            console.error("Error deleting product:", err);
        } finally {
            setDeletingId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="p-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 w-48 bg-slate-200 rounded"></div>
                    <div className="h-96 bg-slate-200 rounded-xl"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Productos</h1>
                    <p className="text-slate-500 mt-1">
                        Gestiona el catálogo de productos
                    </p>
                </div>
                <Link href="/admin/products/new">
                    <Button className="bg-violet-600 hover:bg-violet-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Nuevo Producto
                    </Button>
                </Link>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50">
                            <TableHead className="w-16">Imagen</TableHead>
                            <TableHead className="font-semibold">Nombre</TableHead>
                            <TableHead className="font-semibold">Marca</TableHead>
                            <TableHead className="font-semibold">Precio</TableHead>
                            <TableHead className="font-semibold">Stock</TableHead>
                            <TableHead className="font-semibold w-24">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-12">
                                    <Package className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                                    <p className="text-slate-500">No hay productos</p>
                                    <Link href="/admin/products/new">
                                        <Button variant="link" className="text-violet-600">
                                            Crear el primero
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ) : (
                            products.map((product) => (
                                <TableRow key={product.id} className="hover:bg-slate-50">
                                    <TableCell>
                                        {product.mainImageUrl ? (
                                            <Image
                                                src={product.mainImageUrl}
                                                alt={product.name}
                                                width={48}
                                                height={48}
                                                className="rounded-lg object-cover"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                                                <Package className="h-6 w-6 text-slate-400" />
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium text-slate-900">
                                                {product.name}
                                            </p>
                                            {product.variantCount > 1 && (
                                                <p className="text-xs text-slate-500">
                                                    {product.variantCount} variantes
                                                </p>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-slate-600">
                                        {product.brand || "-"}
                                    </TableCell>
                                    <TableCell className="font-semibold">
                                        {product.price ? formatPrice(product.price) : "-"}
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={`${(product.stock ?? 0) < 10
                                                    ? "text-red-600"
                                                    : "text-slate-600"
                                                }`}
                                        >
                                            {product.stock ?? 0}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    disabled={deletingId === product.id}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        ¿Eliminar producto?
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Esta acción no se puede deshacer. Se eliminará
                                                        permanentemente &quot;{product.name}&quot; y todas
                                                        sus variantes.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDelete(product.id)}
                                                        className="bg-red-600 hover:bg-red-700"
                                                    >
                                                        Eliminar
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
