"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormStore } from "@/hooks/useFormStore";
import { Stepper } from "@/components/booking/Stepper";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Procedimiento } from "@/types";

const steps = [
  { number: 1, title: "Datos Personales", description: "Tu información" },
  { number: 2, title: "Servicio", description: "Elige tu tratamiento" },
  { number: 3, title: "Fecha y Hora", description: "Agenda tu cita" },
  { number: 4, title: "Confirmación", description: "Revisa y confirma" },
];

const servicios: Procedimiento[] = [
  { id: "1", nombre: "Limpieza Facial Básica", duracion: 45, precio: 25000, descripcion: "Duración: 45 min", box: "Cualquier box", concurrentSessions: 1 },
  { id: "2", nombre: "Limpieza Facial Premium", duracion: 90, precio: 45000, descripcion: "Duración: 90 min", box: "Cualquier box", concurrentSessions: 1 },
  { id: "3", nombre: "Limpieza Facial Superpremium", duracion: 120, precio: 65000, descripcion: "Duración: 120 min", box: "Cualquier box", concurrentSessions: 1 },
  { id: "4", nombre: "Masaje (30 min)", duracion: 30, precio: 20000, descripcion: "Duración: 30 min", box: "Box 3", concurrentSessions: 1 },
  { id: "5", nombre: "Masaje (45 min)", duracion: 45, precio: 30000, descripcion: "Duración: 45 min", box: "Box 3", concurrentSessions: 1 },
  { id: "6", nombre: "Entrenamiento Funcional", duracion: 60, precio: 35000, descripcion: "Duración: 60 min", box: "Box 4", concurrentSessions: 1 },
  { id: "7", nombre: "Drenaje Linfático", duracion: 60, precio: 40000, descripcion: "Duración: 60 min", box: "Cualquier box", concurrentSessions: 1 },
  { id: "8", nombre: "Presoterapia", duracion: 60, precio: 35000, descripcion: "Duración: 60 min", box: "Cualquier box", concurrentSessions: 2 },
  { id: "9", nombre: "Lifting de Pestañas", duracion: 120, precio: 55000, descripcion: "Duración: 120 min", box: "Cualquier box", concurrentSessions: 1 },
  { id: "10", nombre: "Radiofrecuencia Facial", duracion: 45, precio: 42000, descripcion: "Duración: 45 min", box: "Cualquier box", concurrentSessions: 1 },
];

export default function Paso2Page() {
  const router = useRouter();
  const { formData, setProcedimiento } = useFormStore();
  const [selectedService, setSelectedService] = useState<Procedimiento | null>(
    formData.procedimiento
  );

  const handleSelectService = (servicio: Procedimiento) => {
    setSelectedService(servicio);
  };

  const handleContinuar = () => {
    if (selectedService) {
      setProcedimiento(selectedService);
      router.push("/agendar/paso-3");
    }
  };

  const handleVolver = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f5f7] to-[#f0f9fa]">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Stepper */}
        <Stepper currentStep={2} steps={steps} />

        {/* Contenido */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mt-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#52a2b2] mb-2">
              ¿Qué Servicio Deseas?
            </h1>
            <p className="text-muted-foreground">
              Selecciona el tratamiento que deseas agendar
            </p>
          </div>

          {/* Grid de servicios - Diseño compacto */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8 max-h-[500px] overflow-y-auto px-2 py-1">
            {servicios.map((servicio) => (
              <button
                key={servicio.id}
                onClick={() => handleSelectService(servicio)}
                className={cn(
                  "relative p-4 rounded-lg border-2 text-left transition-all duration-200 hover:shadow-md",
                  selectedService?.id === servicio.id
                    ? "border-[#52a2b2] bg-[#52a2b2]/5 shadow-md scale-[1.02]"
                    : "border-gray-200 hover:border-[#52a2b2]/50"
                )}
              >
                {/* Check indicator */}
                {selectedService?.id === servicio.id && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-[#52a2b2] rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}

                <h3 className="font-semibold text-sm mb-1.5 pr-6 leading-tight">
                  {servicio.nombre}
                </h3>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {servicio.duracion} min
                  </p>
                  {servicio.precio && (
                    <p className="text-xs font-semibold text-[#52a2b2]">
                      ${servicio.precio.toLocaleString("es-CL")}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Servicio seleccionado - Card informativa */}
          {selectedService && (
            <div className="bg-gradient-to-r from-[#52a2b2]/10 to-[#a6d230]/10 rounded-lg p-4 mb-6 border border-[#52a2b2]/20">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-1">
                    SERVICIO SELECCIONADO:
                  </p>
                  <h3 className="font-bold text-lg text-[#52a2b2] mb-1">
                    {selectedService.nombre}
                  </h3>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">
                      ⏱️ {selectedService.duracion} minutos
                    </span>
                    {selectedService.precio && (
                      <span className="font-semibold text-[#a6d230]">
                        💰 ${selectedService.precio.toLocaleString("es-CL")}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedService(null)}
                  className="text-xs text-gray-500 hover:text-red-500 transition-colors"
                >
                  Cambiar
                </button>
              </div>
            </div>
          )}

          {/* Botones de navegación */}
          <div className="flex justify-between items-center">
            <Button
              onClick={handleVolver}
              variant="outline"
              size="lg"
              className="px-8"
            >
              Volver
            </Button>
            <Button
              onClick={handleContinuar}
              disabled={!selectedService}
              size="lg"
              className="bg-[#52a2b2] hover:bg-[#458a98] text-white px-8 disabled:opacity-50"
            >
              Continuar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
