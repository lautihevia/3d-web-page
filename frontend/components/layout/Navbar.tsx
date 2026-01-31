"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, User, ShoppingCart, ChevronDown } from "lucide-react";

/**
 * Navbar global de la aplicación.
 * Incluye logo, menú con dropdowns, y acciones (búsqueda, usuario, carrito).
 */
export function Navbar() {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const toggleDropdown = (menu: string) => {
        setOpenDropdown(openDropdown === menu ? null : menu);
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
                            href="/contacto"
                            className="text-slate-300 hover:text-white transition-colors"
                        >
                            Contacto
                        </Link>

                        {/* Link: Sobre Nosotros */}
                        <Link
                            href="/sobre-nosotros"
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
                        <Link
                            href="/login"
                            aria-label="Iniciar sesión"
                            className="text-slate-300 hover:text-white transition-colors"
                        >
                            <User className="h-5 w-5" />
                        </Link>
                        <Link
                            href="/carrito"
                            aria-label="Carrito de compras"
                            className="text-slate-300 hover:text-white transition-colors relative"
                        >
                            <ShoppingCart className="h-5 w-5" />
                            {/* Badge de cantidad (opcional) */}
                            {/* <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span> */}
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
