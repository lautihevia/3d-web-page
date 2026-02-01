"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, User, ChevronDown, LogOut, LayoutDashboard, UserCircle } from "lucide-react";
import { CartSheet } from "@/components/cart/CartSheet";
import { useAuthStore } from "@/store/auth";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

/**
 * Navbar global de la aplicación.
 * Incluye logo, menú con dropdowns, y acciones (búsqueda, usuario, carrito).
 */
export function Navbar() {
    const router = useRouter();
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const { user, isAuthenticated, isLoading, logout, initialize } = useAuthStore();

    // Inicializar auth store al montar
    useEffect(() => {
        initialize();
    }, [initialize]);

    const toggleDropdown = (menu: string) => {
        setOpenDropdown(openDropdown === menu ? null : menu);
    };

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    // Obtener iniciales del usuario
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <nav className="sticky top-0 z-50 bg-blue-600 border-b border-b-blue-600">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo - Izquierda */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-xl font-bold text-white tracking-tight">
                            3dENCASA
                        </Link>
                    </div>

                    {/* Menú Central */}
                    <div className="hidden md:flex items-center space-x-8">
                        {/* Dropdown: Impresoras */}
                        <div className="relative group">
                            <button
                                onClick={() => toggleDropdown("impresoras")}
                                className="flex items-center space-x-1 text-slate-300 hover:text-white transition-colors"
                            >
                                <span>Impresoras</span>
                                <ChevronDown className="h-4 w-4" />
                            </button>
                            {openDropdown === "impresoras" && (
                                <div className="absolute top-full left-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-md shadow-lg py-2">
                                    <Link
                                        href="/productos/impresoras/ender-3"
                                        className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                                    >
                                        Ender 3
                                    </Link>
                                    <Link
                                        href="/productos/impresoras/ender-5"
                                        className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                                    >
                                        Ender 5
                                    </Link>
                                    <Link
                                        href="/productos/impresoras"
                                        className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                                    >
                                        Ver todas
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Dropdown: Insumos */}
                        <div className="relative group">
                            <button
                                onClick={() => toggleDropdown("insumos")}
                                className="flex items-center space-x-1 text-slate-300 hover:text-white transition-colors"
                            >
                                <span>Insumos</span>
                                <ChevronDown className="h-4 w-4" />
                            </button>
                            {openDropdown === "insumos" && (
                                <div className="absolute top-full left-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-md shadow-lg py-2">
                                    <Link
                                        href="/productos/insumos/filamentos"
                                        className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                                    >
                                        Filamentos
                                    </Link>
                                    <Link
                                        href="/productos/insumos/repuestos"
                                        className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                                    >
                                        Repuestos
                                    </Link>
                                    <Link
                                        href="/productos/insumos"
                                        className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                                    >
                                        Ver todos
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Link: Contacto */}
                        <Link
                            href="/contact"
                            className="text-slate-300 hover:text-white transition-colors"
                        >
                            Contacto
                        </Link>

                        {/* Link: Sobre Nosotros */}
                        <Link
                            href="/about"
                            className="text-slate-300 hover:text-white transition-colors"
                        >
                            Sobre Nosotros
                        </Link>
                    </div>

                    {/* Iconos de Acción - Derecha */}
                    <div className="flex items-center space-x-4">
                        <button
                            aria-label="Buscar"
                            className="text-slate-300 hover:text-white transition-colors"
                        >
                            <Search className="h-5 w-5" />
                        </button>

                        {/* User Icon / Avatar Dropdown */}
                        {isLoading ? (
                            <div className="w-8 h-8 rounded-full bg-slate-500/50 animate-pulse" />
                        ) : isAuthenticated && user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full">
                                        <Avatar className="h-8 w-8 bg-violet-600 hover:bg-violet-500 transition-colors cursor-pointer">
                                            <AvatarFallback className="bg-violet-600 text-white text-sm font-medium">
                                                {getInitials(user.fullName)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>
                                        <div className="flex flex-col">
                                            <span className="font-medium">Hola, {user.fullName.split(" ")[0]}</span>
                                            <span className="text-xs text-muted-foreground">{user.email}</span>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/profile" className="cursor-pointer">
                                            <UserCircle className="mr-2 h-4 w-4" />
                                            Mi Perfil
                                        </Link>
                                    </DropdownMenuItem>
                                    {user.role === "ADMIN" && (
                                        <DropdownMenuItem asChild>
                                            <Link href="/admin" className="cursor-pointer">
                                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                                Panel Admin
                                            </Link>
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={handleLogout}
                                        className="text-red-600 focus:text-red-600 cursor-pointer"
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Cerrar Sesión
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link
                                href="/auth/login"
                                aria-label="Iniciar sesión"
                                className="text-slate-300 hover:text-white transition-colors"
                            >
                                <User className="h-5 w-5" />
                            </Link>
                        )}

                        <CartSheet />
                    </div>
                </div>
            </div>
        </nav>
    );
}
