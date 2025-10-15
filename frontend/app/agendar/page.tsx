"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormStore } from "@/hooks/useFormStore";

export default function AgendarPage() {
  const router = useRouter();
  const { resetForm } = useFormStore();

  useEffect(() => {
    // Opcional: Resetear el formulario al iniciar un nuevo agendamiento
    // Puedes comentar esta línea si quieres mantener los datos previos
    resetForm();
    
    // Redirigir al paso 1
    router.push("/agendar/paso-1");
  }, [router, resetForm]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e8f5f7] to-[#f0f9fa]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#52a2b2] mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Iniciando agendamiento...</p>
      </div>
    </div>
  );
}
