"use client";

import { useState, useEffect, ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Users,
    Settings,
    ArrowLeft,
    LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminLayoutProps {
    children: ReactNode;
}

const sidebarLinks = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/orders", label: "Órdenes", icon: ShoppingBag },
    { href: "/admin/products", label: "Productos", icon: Package },
    { href: "/admin/customers", label: "Clientes", icon: Users },
    { href: "/admin/settings", label: "Configuración", icon: Settings },
];

/**
 * Layout del panel de administración con sidebar lateral.
 */
export default function AdminLayout({ children }: AdminLayoutProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Verificar autorización (rol ADMIN)
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/auth/login?redirect=/admin");
            return;
        }

        // Decodificar JWT para verificar rol
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            if (payload.role === "ADMIN") {
                setIsAuthorized(true);
            } else {
                router.push("/");
            }
        } catch {
            router.push("/auth/login?redirect=/admin");
        }

        setIsLoading(false);
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
                <div className="animate-pulse text-slate-500">Cargando...</div>
            </div>
        );
    }

    if (!isAuthorized) {
        return null;
    }

    return (
        <div className="min-h-screen flex bg-slate-100">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col">
                {/* Logo */}
                <div className="p-6 border-b border-slate-700">
                    <h1 className="text-xl font-bold">3dENCASA</h1>
                    <p className="text-xs text-slate-400 mt-1">Panel Admin</p>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6">
                    <ul className="space-y-1 px-3">
                        {sidebarLinks.map((link) => {
                            const isActive = pathname === link.href;
                            const Icon = link.icon;

                            return (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                                ? "bg-violet-600 text-white"
                                                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                            }`}
                                    >
                                        <Icon className="h-5 w-5" />
                                        <span className="font-medium">{link.label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-slate-700 space-y-2">
                    <Link href="/">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Volver a la Tienda
                        </Button>
                    </Link>
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full justify-start text-slate-400 hover:text-red-400 hover:bg-slate-800"
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        Cerrar Sesión
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    );
}
