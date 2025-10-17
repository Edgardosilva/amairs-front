"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormStore, selectUser, selectIsAuthenticated } from "@/hooks/useFormStore";
import { getUserAppointments, type Appointment } from "@/app/actions/appointments";
import { Calendar, Clock, MapPin, User, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function DashboardPage() {
  const router = useRouter();
  const user = useFormStore(selectUser);
  const isAuthenticated = useFormStore(selectIsAuthenticated);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Verificar autenticación
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Cargar citas del usuario
    const loadAppointments = async () => {
      setLoading(true);
      const result = await getUserAppointments();

      if (result.success && result.appointments) {
        setAppointments(result.appointments);
      } else {
        setError(result.error || "Error al cargar las citas");
        if (result.error?.includes("iniciar sesión")) {
          setTimeout(() => router.push("/login"), 2000);
        }
      }
      setLoading(false);
    };

    loadAppointments();
  }, [isAuthenticated, router]);

  const getEstadoColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case "confirmada":
      case "completada":
        return "text-green-600 bg-green-50";
      case "pendiente":
        return "text-yellow-600 bg-yellow-50";
      case "cancelada":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado.toLowerCase()) {
      case "confirmada":
      case "completada":
        return <CheckCircle2 className="w-4 h-4" />;
      case "cancelada":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatearFecha = (fecha: string) => {
    try {
      return format(new Date(fecha), "EEEE d 'de' MMMM, yyyy", { locale: es });
    } catch {
      return fecha;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#e8f5f7] to-[#f0f9fa] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#52a2b2] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tus citas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f5f7] to-[#f0f9fa] py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#52a2b2] mb-2">
                Mis Citas
              </h1>
              <p className="text-gray-600">
                Bienvenido{user?.nombre ? `, ${user.nombre} ${user.apellido}` : ''}
              </p>
            </div>
            <Button
              onClick={() => router.push("/agendar")}
              className="bg-[#a6d230] hover:bg-[#95bd2a] text-white"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Agendar Nueva Cita
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-red-700">
              <XCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Appointments List */}
        {!error && appointments.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No tienes citas agendadas
            </h3>
            <p className="text-gray-500 mb-6">
              ¡Agenda tu primera cita para comenzar tu experiencia con nosotros!
            </p>
            <Button
              onClick={() => router.push("/agendar")}
              className="bg-[#52a2b2] hover:bg-[#468999] text-white"
            >
              Agendar Cita
            </Button>
          </div>
        )}

        {/* Appointments Grid */}
        {!error && appointments.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                {/* Estado Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(
                      appointment.estado
                    )}`}
                  >
                    {getEstadoIcon(appointment.estado)}
                    <span className="capitalize">{appointment.estado}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    ID: {appointment.id}
                  </span>
                </div>

                {/* Procedimiento */}
                <h3 className="text-lg font-bold text-[#52a2b2] mb-4">
                  {appointment.nombre_procedimiento}
                </h3>

                {/* Detalles */}
                <div className="space-y-3">
                  {/* Paciente */}
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Paciente</p>
                      <p className="font-medium text-gray-700">
                        {appointment.paciente_atendido}
                      </p>
                    </div>
                  </div>

                  {/* Fecha */}
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Fecha</p>
                      <p className="font-medium text-gray-700 capitalize">
                        {formatearFecha(appointment.fecha)}
                      </p>
                    </div>
                  </div>

                  {/* Hora */}
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Horario</p>
                      <p className="font-medium text-gray-700">
                        {appointment.hora.slice(0, 5)} - {appointment.horaTermino.slice(0, 5)} hrs
                        <span className="text-gray-500 text-sm ml-2">
                          ({appointment.duracion} min)
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Box */}
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Ubicación</p>
                      <p className="font-medium text-gray-700">{appointment.box}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
