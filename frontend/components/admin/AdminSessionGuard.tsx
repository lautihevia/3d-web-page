"use client";

import { useEffect } from "react";
import { adminFetch, getAdminToken } from "@/lib/adminAuth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export function AdminSessionGuard() {
  useEffect(() => {
    if (!getAdminToken()) return;
    adminFetch(`${API_URL}/api/v1/admin/products`, { method: "GET" }).catch(() => {});
  }, []);
  return null;
}
