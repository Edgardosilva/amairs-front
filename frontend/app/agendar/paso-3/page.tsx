"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useFormStore } from "@/hooks/useFormStore";
import { Stepper } from "@/components/booking/Stepper";
import { Calendario } from "@/components/booking/Calendario";
import { Button } from "@/components/ui/button";
import { obtenerHorariosDisponibles } from "@/app/actions/horarios";
import { calcularRangoHorarios } from "@/lib/horarios-utils";
import { Clock, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { number: 1, title: "Datos Personales", description: "Tu información" },
  { number: 2, title: "Servicio", description: "Elige tu tratamiento" },
  { number: 3, title: "Fecha y Hora", description: "Agenda tu cita" },
  { number: 4, title: "Confirmación", description: "Revisa y confirma" },
];

export default function Paso3Page() {
  const router = useRouter();
  const formData = useFormStore((state) => state.formData);
  const setAppointment = useFormStore((state) => state.setAppointment);
  
  const [isPending, startTransition] = useTransition();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    formData.fecha ? new Date(formData.fecha) : undefined
  );
  const [selectedHora, setSelectedHora] = useState<string>(formData.hora || "");
  const [horariosDisponibles, setHorariosDisponibles] = useState<string[]>([]);
  const [selectedRange, setSelectedRange] = useState<string[]>([]);

  useEffect(() => {
    if (!formData.procedimiento) {
      router.push("/agendar/paso-2");
    }
  }, [formData.procedimiento, router]);

  useEffect(() => {
    if (selectedDate && formData.procedimiento?.id) {
      const fechaStr = format(selectedDate, "yyyy-MM-dd");
      const procedimientoId = formData.procedimiento.id;

      startTransition(async () => {
        const horarios = await obtenerHorariosDisponibles(fechaStr, procedimientoId);
        setHorariosDisponibles(horarios);
      });
    }
  }, [selectedDate, formData.procedimiento]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedHora("");
    setSelectedRange([]);
  };

  const handleHoraSelect = (hora: string) => {
    const duracion = formData.procedimiento?.duracion || 60;
    const rango = calcularRangoHorarios(hora, duracion);
    
    setSelectedHora(hora);
    setSelectedRange(rango);
  };

  const handleContinuar = () => {
    if (selectedDate && selectedHora) {
      const fechaStr = format(selectedDate, "yyyy-MM-dd");
      setAppointment(fechaStr, selectedHora, "");
      router.push("/agendar/paso-4");
    }
  };

  const handleVolver = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f5f7] to-[#f0f9fa]">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Stepper */}
        <Stepper currentStep={3} steps={steps} />

        {/* Contenido */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mt-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-[#52a2b2] mb-2">
              Selecciona Fecha y Hora
            </h1>
            <p className="text-muted-foreground">
              Elige el día y horario que mejor te acomode
            </p>
          </div>

          {/* Info del servicio seleccionado */}
          {formData.procedimiento && (
            <div className="bg-gradient-to-r from-[#52a2b2]/10 to-[#a6d230]/10 rounded-lg p-4 mb-6 border border-[#52a2b2]/20">
              <p className="text-xs text-muted-foreground font-medium mb-1">
                SERVICIO SELECCIONADO:
              </p>
              <h3 className="font-bold text-lg text-[#52a2b2]">
                {formData.procedimiento.nombre}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                ⏱️ Duración: {formData.procedimiento.duracion} minutos
              </p>
            </div>
          )}

          {/* Layout: Calendario y Horarios */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calendario */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <CalendarIcon className="w-5 h-5 text-[#52a2b2]" />
                <h3 className="font-semibold text-lg">Selecciona una fecha</h3>
              </div>
              <Calendario selected={selectedDate} onSelect={handleDateSelect} />
              
              {selectedDate && (
                <div className="mt-4 p-3 bg-[#52a2b2]/5 rounded-lg border border-[#52a2b2]/20">
                  <p className="text-sm font-medium text-[#52a2b2]">
                    📅 Fecha seleccionada:
                  </p>
                  <p className="text-lg font-bold capitalize">
                    {format(selectedDate, "EEEE d 'de' MMMM, yyyy", { locale: es })}
                  </p>
                </div>
              )}
            </div>

            {/* Horarios disponibles */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-[#52a2b2]" />
                <h3 className="font-semibold text-lg">Horarios disponibles</h3>
              </div>

              {!selectedDate ? (
                <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                  <CalendarIcon className="w-12 h-12 mb-3 opacity-30" />
                  <p>Selecciona una fecha para ver horarios</p>
                </div>
              ) : isPending ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#52a2b2] mx-auto mb-3"></div>
                    <p className="text-muted-foreground">Cargando horarios...</p>
                  </div>
                </div>
              ) : horariosDisponibles.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground">No hay horarios disponibles</p>
                  <p className="text-sm text-muted-foreground mt-2">Intenta con otra fecha</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2 max-h-96 overflow-y-auto p-1">
                  {horariosDisponibles.map((hora) => {
                    const estaEnRango = selectedRange.includes(hora);
                    const esHoraInicio = selectedHora === hora;

                    return (
                      <button
                        key={hora}
                        onClick={() => handleHoraSelect(hora)}
                        className={cn(
                          "p-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                          esHoraInicio
                            ? "bg-[#52a2b2] text-white shadow-md scale-105 ring-2 ring-[#52a2b2]/50"
                            : estaEnRango
                            ? "bg-[#a6d230]/30 text-[#52a2b2] border-2 border-[#a6d230]"
                            : "bg-white border-2 border-gray-200 hover:border-[#52a2b2] hover:shadow-md hover:bg-[#52a2b2]/5"
                        )}
                      >
                        <div className="font-semibold">{hora}</div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Hora seleccionada con rango */}
              {selectedHora && selectedRange.length > 0 && (
                <div className="mt-4 space-y-3">
                  <div className="p-3 bg-[#52a2b2]/10 rounded-lg border border-[#52a2b2]/20">
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      🕐 HORA DE INICIO:
                    </p>
                    <p className="text-lg font-bold text-[#52a2b2]">{selectedHora}</p>
                  </div>
                  <div className="p-3 bg-[#a6d230]/10 rounded-lg border border-[#a6d230]/20">
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      � BLOQUES RESERVADOS:
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedRange.join(" → ")}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Duración total: {formData.procedimiento?.duracion} minutos
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Botones de navegación */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t">
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
              disabled={!selectedDate || !selectedHora}
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
