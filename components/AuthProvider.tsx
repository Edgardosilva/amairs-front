"use client";

import { useEffect } from "react";
import { useFormStore } from "@/hooks/useFormStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user } = useFormStore();

  useEffect(() => {
    // El usuario ya está cargado desde localStorage gracias a persist
    // Solo necesitamos verificar si la cookie todavía es válida
    const verificarSesion = async () => {
      try {
        const response = await fetch("/api/verify-session");
        const data = await response.json();
        
        if (!data.isAuthenticated && user) {
          // La sesión expiró pero el store todavía tiene datos
          useFormStore.getState().logout();
        }
      } catch (error) {
        console.error("Error al verificar sesión:", error);
      }
    };

    if (user) {
      verificarSesion();
    }
  }, [user]);

  return <>{children}</>;
}
