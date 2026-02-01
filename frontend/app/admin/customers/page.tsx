"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface User {
    id: string;
    email: string;
    fullName: string;
    role: "ADMIN" | "CUSTOMER";
}

// Mock data for development
const mockUsers: User[] = [
    { id: "1", email: "admin@3dencasa.com", fullName: "Admin User", role: "ADMIN" },
    { id: "2", email: "cliente@example.com", fullName: "Juan Pérez", role: "CUSTOMER" },
    { id: "3", email: "maria@example.com", fullName: "María García", role: "CUSTOMER" },
];

/**
 * Página de gestión de clientes en el admin.
 */
export default function CustomersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(`${API_URL}/api/v1/admin/users`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (res.ok) {
                    const data = await res.json();
                    setUsers(data);
                } else {
                    // Fallback to mock data in development
                    setUsers(mockUsers);
                }
            } catch {
                setUsers(mockUsers);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Filtrar usuarios por búsqueda
    const filteredUsers = useMemo(() => {
        if (!search.trim()) return users;
        const query = search.toLowerCase();
        return users.filter(
            (u) =>
                u.fullName.toLowerCase().includes(query) ||
                u.email.toLowerCase().includes(query)
        );
    }, [users, search]);

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Clientes</h1>
                    <p className="text-muted-foreground">
                        Gestiona los usuarios registrados en la plataforma.
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar por nombre o email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                />
            </div>

            {/* Table */}
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Usuario</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Rol</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-10">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                                        Cargando usuarios...
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-10">
                                    <Users className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                                    <p className="text-muted-foreground">
                                        {search ? "No se encontraron usuarios" : "No hay usuarios registrados"}
                                    </p>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarFallback className="bg-slate-200 text-slate-700 text-sm">
                                                    {getInitials(user.fullName)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{user.fullName}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {user.email}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={user.role === "ADMIN" ? "destructive" : "secondary"}
                                            className={
                                                user.role === "ADMIN"
                                                    ? "bg-red-100 text-red-700 hover:bg-red-100"
                                                    : "bg-blue-100 text-blue-700 hover:bg-blue-100"
                                            }
                                        >
                                            {user.role === "ADMIN" ? "Admin" : "Cliente"}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Footer stats */}
            {!isLoading && (
                <p className="text-sm text-muted-foreground">
                    Mostrando {filteredUsers.length} de {users.length} usuarios
                </p>
            )}
        </div>
    );
}
