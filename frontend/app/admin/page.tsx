"use client";

import { useEffect, useState } from "react";
import { DollarSign, ShoppingBag, Package, Clock } from "lucide-react";

interface DashboardStats {
    totalRevenue: number;
    pendingOrders: number;
    totalOrders: number;
    activeProducts: number;
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
 * Tarjeta de KPI para el dashboard.
 */
function StatCard({
    title,
    value,
    icon: Icon,
    color,
}: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
}) {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
                </div>
                <div className={`p-3 rounded-lg ${color}`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
            </div>
        </div>
    );
}

/**
 * Página principal del dashboard de administración.
 */
export default function AdminDashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${API_URL}/api/v1/admin/stats`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error("Error fetching stats");
                }

                const data = await res.json();
                setStats(data);
            } catch (err) {
                console.error("Error:", err);
                setError("No se pudieron cargar las estadísticas");
                // Usar datos mock si falla
                setStats({
                    totalRevenue: 1250000,
                    pendingOrders: 12,
                    totalOrders: 156,
                    activeProducts: 48,
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (isLoading) {
        return (
            <div className="p-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 w-48 bg-slate-200 rounded"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-500 mt-1">
                    Bienvenido al panel de administración
                </p>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg text-sm">
                    ⚠️ {error} - Mostrando datos de ejemplo
                </div>
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Ingresos Totales"
                    value={formatPrice(stats?.totalRevenue || 0)}
                    icon={DollarSign}
                    color="bg-green-500"
                />
                <StatCard
                    title="Órdenes Pendientes"
                    value={stats?.pendingOrders || 0}
                    icon={Clock}
                    color="bg-orange-500"
                />
                <StatCard
                    title="Total de Órdenes"
                    value={stats?.totalOrders || 0}
                    icon={ShoppingBag}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Productos Activos"
                    value={stats?.activeProducts || 0}
                    icon={Package}
                    color="bg-violet-500"
                />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                    Acciones Rápidas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a
                        href="/admin/orders"
                        className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        <ShoppingBag className="h-8 w-8 text-violet-600 mb-2" />
                        <h3 className="font-medium text-slate-900">Ver Órdenes</h3>
                        <p className="text-sm text-slate-500">Gestionar pedidos</p>
                    </a>
                    <a
                        href="/admin/products"
                        className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        <Package className="h-8 w-8 text-blue-600 mb-2" />
                        <h3 className="font-medium text-slate-900">Productos</h3>
                        <p className="text-sm text-slate-500">Administrar catálogo</p>
                    </a>
                    <a
                        href="/"
                        className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        <DollarSign className="h-8 w-8 text-green-600 mb-2" />
                        <h3 className="font-medium text-slate-900">Ver Tienda</h3>
                        <p className="text-sm text-slate-500">Ir al frontend público</p>
                    </a>
                </div>
            </div>
        </div>
    );
}
