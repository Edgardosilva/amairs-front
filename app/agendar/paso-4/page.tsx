"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useFormStore } from "@/hooks/useFormStore";
import { Stepper } from "@/components/booking/Stepper";
import { Button } from "@/components/ui/button";
import { crearCita } from "@/app/actions/citas";
import { 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  Briefcase,
  MapPin,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import Swal from "sweetalert2";

const steps = [
  { number: 1, title: "Datos Personales", description: "Tu información" },
  { number: 2, title: "Servicio", description: "Elige tu tratamiento" },
  { number: 3, title: "Fecha y Hora", description: "Agenda tu cita" },
  { number: 4, title: "Confirmación", description: "Revisa y confirma" },
];

export default function Paso4Page() {
  const router = useRouter();
  const formData = useFormStore((state) => state.formData);
  const resetForm = useFormStore((state) => state.resetForm);
  const [isPending, startTransition] = useTransition();

  // Validar que todos los pasos estén completos
  useEffect(() => {
    if (!formData.nombre || !formData.procedimiento) {
      router.push("/agendar/paso-1");
    } else if (!formData.fecha || !formData.hora) {
      router.push("/agendar/paso-3");
    }

  }, [formData, router]);

  const handleConfirmar = () => {
    startTransition(async () => {
      const result = await crearCita(formData);

      if (result.success) {
        const citaInfo = `
          <div class="text-left space-y-3 mt-4">
            <p class="text-base mb-4">${result.message}</p>
            <div class="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
              <p><strong>📅 Fecha:</strong> ${fechaFormateada}</p>
              <p><strong>🕐 Hora:</strong> ${formData.hora}</p>
              <p><strong>💆 Servicio:</strong> ${formData.procedimiento?.nombre}</p>
            </div>
            <p class="text-xs text-gray-500 mt-4">
              💌 Revisa tu correo <strong>${formData.correo}</strong> para confirmar tu cita
            </p>
            ${result.appointmentId ? `<p class="text-xs text-gray-400 mt-2">ID: ${result.appointmentId}</p>` : ""}
          </div>
        `;

        await Swal.fire({
          icon: "success",
          title: "¡Cita Agendada Exitosamente!",
          html: citaInfo,
          confirmButtonText: "Ver Mis Citas",
          showCancelButton: true,
          cancelButtonText: "Ir al Inicio",
          confirmButtonColor: "#52a2b2",
          cancelButtonColor: "#a6d230",
        }).then((result) => {
          resetForm();
          if (result.isConfirmed) {
            router.push("/dashboard");
          } else {
            router.push("/");
          }
        });
      } else {
        // Verificar si es un error de autenticación
        if (result.error?.includes("iniciar sesión") || result.error?.includes("autenticación")) {
          await Swal.fire({
            icon: "warning",
            title: "Sesión requerida",
            text: "Debes iniciar sesión para agendar una cita.",
            confirmButtonText: "Ir a Login",
            confirmButtonColor: "#52a2b2",
          });
          router.push("/login");
        } else {
          Swal.fire({
            icon: "error",
            title: "Error al agendar",
            text: result.error || "No se pudo crear la cita. Intenta nuevamente.",
            confirmButtonColor: "#52a2b2",
          });
        }
      }
    });
  };

  const handleVolver = () => {
    router.back();
  };

  // Formatear fecha para mostrar
  const fechaFormateada = formData.fecha
    ? format(new Date(formData.fecha), "EEEE d 'de' MMMM, yyyy", { locale: es })
    : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f5f7] to-[#f0f9fa]">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Stepper */}
        <Stepper currentStep={4} steps={steps} />

        {/* Contenido */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mt-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#a6d230]/20 rounded-full mb-4">
              <CheckCircle2 className="w-8 h-8 text-[#a6d230]" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#52a2b2] mb-2">
              Confirma tu Cita
            </h1>
            <p className="text-muted-foreground">
              Revisa que todos los datos sean correctos antes de confirmar
            </p>
          </div>

          {/* Resumen de la cita */}
          <div className="space-y-6">
            {/* Datos Personales */}
            <div className="bg-gradient-to-r from-[#52a2b2]/5 to-transparent rounded-xl p-6 border-l-4 border-[#52a2b2]">
              <h3 className="font-semibold text-lg mb-4 text-[#52a2b2] flex items-center gap-2">
                <User className="w-5 h-5" />
                Datos Personales
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#52a2b2]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-[#52a2b2]" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Nombre completo</p>
                    <p className="font-semibold">{formData.nombre} {formData.apellido}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#52a2b2]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-[#52a2b2]" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Correo electrónico</p>
                    <p className="font-semibold text-sm">{formData.correo}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#52a2b2]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-[#52a2b2]" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Teléfono</p>
                    <p className="font-semibold">{formData.telefono}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Servicio Seleccionado */}
            {formData.procedimiento && (
              <div className="bg-gradient-to-r from-[#a6d230]/5 to-transparent rounded-xl p-6 border-l-4 border-[#a6d230]">
                <h3 className="font-semibold text-lg mb-4 text-[#52a2b2] flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Servicio Seleccionado
                </h3>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#a6d230]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-6 h-6 text-[#a6d230]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-xl text-[#52a2b2] mb-2">
                      {formData.procedimiento.nombre}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className="inline-flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {formData.procedimiento.duracion} minutos
                      </span>
                      {formData.procedimiento.precio && (
                        <span className="inline-flex items-center gap-1 font-semibold text-[#a6d230]">
                          💰 ${formData.procedimiento.precio.toLocaleString("es-CL")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Fecha y Hora */}
            <div className="bg-gradient-to-r from-[#52a2b2]/5 to-transparent rounded-xl p-6 border-l-4 border-[#52a2b2]">
              <h3 className="font-semibold text-lg mb-4 text-[#52a2b2] flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Fecha y Hora de la Cita
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#52a2b2]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-[#52a2b2]" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Fecha</p>
                    <p className="font-semibold capitalize">{fechaFormateada}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#52a2b2]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-[#52a2b2]" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Hora</p>
                    <p className="font-semibold text-2xl">{formData.hora}</p>
                  </div>
                </div>

                {formData.boxAsignado && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#52a2b2]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-[#52a2b2]" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Ubicación</p>
                      <p className="font-semibold">{formData.boxAsignado}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Nota informativa */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Importante:</p>
              <p>
                Recibirás un correo de confirmación con los detalles de tu cita. 
                Por favor, llega 5 minutos antes de tu hora agendada.
              </p>
            </div>
          </div>

          {/* Botones de navegación */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t">
            <Button
              onClick={handleVolver}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto px-8"
              disabled={isPending}
            >
              Volver
            </Button>
            <div className="w-full sm:w-auto flex flex-col items-end gap-2">
              {isPending && (
                <div className="text-right space-y-1">
                  <p className="text-sm text-[#52a2b2] font-medium animate-pulse">
                    ⏳ Procesando tu cita...
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Enviando correo de confirmación (puede tardar unos segundos)
                  </p>
                </div>
              )}
              <Button
                onClick={handleConfirmar}
                disabled={isPending}
                size="lg"
                className="w-full sm:w-auto bg-[#a6d230] hover:bg-[#95bb2a] text-white px-8 font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-70"
              >
                {isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Confirmando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Confirmar Cita
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
