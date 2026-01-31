"use client";

import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Order {
    id: number;
    customerEmail: string;
    customerName: string;
    status: string;
    total: number;
    itemCount: number;
    createdAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const statusOptions = [
    { value: "PENDING", label: "Pendiente", color: "bg-yellow-100 text-yellow-800" },
    { value: "CONFIRMED", label: "Confirmado", color: "bg-blue-100 text-blue-800" },
    { value: "SHIPPED", label: "Enviado", color: "bg-purple-100 text-purple-800" },
    { value: "DELIVERED", label: "Entregado", color: "bg-green-100 text-green-800" },
    { value: "CANCELLED", label: "Cancelado", color: "bg-red-100 text-red-800" },
];

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
 * Formatea una fecha ISO a formato legible.
 */
function formatDate(isoDate: string): string {
    return new Date(isoDate).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

/**
 * Página de gestión de órdenes.
 */
export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/v1/admin/orders`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Error fetching orders");

            const data = await res.json();
            setOrders(data.content || []);
        } catch (err) {
            console.error("Error:", err);
            // Usar datos mock
            setOrders([
                {
                    id: 1001,
                    customerEmail: "juan@example.com",
                    customerName: "Juan Pérez",
                    status: "PENDING",
                    total: 25500,
                    itemCount: 3,
                    createdAt: new Date().toISOString(),
                },
                {
                    id: 1002,
                    customerEmail: "maria@example.com",
                    customerName: "María García",
                    status: "SHIPPED",
                    total: 42000,
                    itemCount: 2,
                    createdAt: new Date(Date.now() - 86400000).toISOString(),
                },
                {
                    id: 1003,
                    customerEmail: "carlos@example.com",
                    customerName: "Carlos López",
                    status: "DELIVERED",
                    total: 18500,
                    itemCount: 1,
                    createdAt: new Date(Date.now() - 172800000).toISOString(),
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusChange = async (orderId: number, newStatus: string) => {
        setUpdatingId(orderId);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/v1/admin/orders/${orderId}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                // Actualizar estado local
                setOrders(orders.map(order =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                ));
            }
        } catch (err) {
            console.error("Error updating status:", err);
            // Actualizar igual para demo
            setOrders(orders.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            ));
        } finally {
            setUpdatingId(null);
        }
    };

    const getStatusBadge = (status: string) => {
        const option = statusOptions.find(o => o.value === status);
        return (
            <Badge variant="secondary" className={option?.color || ""}>
                {option?.label || status}
            </Badge>
        );
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
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Órdenes</h1>
                <p className="text-slate-500 mt-1">
                    Gestiona y actualiza el estado de los pedidos
                </p>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50">
                            <TableHead className="font-semibold">ID</TableHead>
                            <TableHead className="font-semibold">Cliente</TableHead>
                            <TableHead className="font-semibold">Fecha</TableHead>
                            <TableHead className="font-semibold">Items</TableHead>
                            <TableHead className="font-semibold">Total</TableHead>
                            <TableHead className="font-semibold">Estado</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                                    No hay órdenes registradas
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => (
                                <TableRow key={order.id} className="hover:bg-slate-50">
                                    <TableCell className="font-mono text-sm">
                                        #{order.id}
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium text-slate-900">
                                                {order.customerName}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                {order.customerEmail}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-slate-600">
                                        {formatDate(order.createdAt)}
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
                                    </TableCell>
                                    <TableCell className="font-semibold">
                                        {formatPrice(order.total)}
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            value={order.status}
                                            onValueChange={(value) => handleStatusChange(order.id, value)}
                                            disabled={updatingId === order.id}
                                        >
                                            <SelectTrigger className="w-36">
                                                <SelectValue>
                                                    {getStatusBadge(order.status)}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {statusOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
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
