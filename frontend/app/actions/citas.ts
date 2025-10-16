"use server";

import { cookies } from "next/headers";
import type { FormData } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://amaris-api-production.up.railway.app';

interface CrearCitaResponse {
  success: boolean;
  message?: string;
  appointmentId?: string;
  error?: string;
}

export async function crearCita(formData: FormData): Promise<CrearCitaResponse> {
  try {
    // Obtener el token de autenticación
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return {
        success: false,
        error: "Debes iniciar sesión para agendar una cita",
      };
    }

    // Verificar autenticación con el endpoint existente
    const authResponse = await fetch(
      `${API_URL}/login/auth/me`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cookie": `access_token=${token}`,
        },
      }
    );

    if (!authResponse.ok) {
      return {
        success: false,
        error: "Sesión expirada. Por favor inicia sesión nuevamente.",
      };
    }

    const authData = await authResponse.json();

    if (!authData.authenticated) {
      return {
        success: false,
        error: "Sesión expirada. Por favor inicia sesión nuevamente.",
      };
    }

    // Obtener el usuarioId del usuario autenticado
    const usuarioId = authData.user.id;

    // Validar que todos los datos estén presentes
    if (!formData.nombre || !formData.apellido || !formData.correo || !formData.telefono) {
      return {
        success: false,
        error: "Datos personales incompletos",
      };
    }

    if (!formData.procedimiento) {
      return {
        success: false,
        error: "No se ha seleccionado un procedimiento",
      };
    }

    if (!formData.fecha || !formData.hora) {
      return {
        success: false,
        error: "Fecha u hora no seleccionada",
      };
    }

    // Calcular hora de término basada en la duración del procedimiento
    const [horas, minutos] = formData.hora.split(':').map(Number);
    const duracionMinutos = formData.procedimiento.duracion || 60;
    const horaInicioDate = new Date();
    horaInicioDate.setHours(horas, minutos, 0);
    const horaTerminoDate = new Date(horaInicioDate.getTime() + duracionMinutos * 60000);
    const horaTermino = `${String(horaTerminoDate.getHours()).padStart(2, '0')}:${String(horaTerminoDate.getMinutes()).padStart(2, '0')}`;

    // Preparar datos en el formato que espera tu API
    const appointmentData = {
      usuarioId: usuarioId,
      procedimiento_id: formData.procedimiento.id,
      fecha: formData.fecha,
      hora: formData.hora,
      horaTermino: horaTermino,
      paciente_atendido: `${formData.nombre} ${formData.apellido}`,
      duracion: formData.procedimiento.duracion,
      box: formData.procedimiento.box || "Cualquier box",
      concurrentSessions: formData.procedimiento.concurrentSessions || 1,
      estado: "Pendiente",
    };

    console.log("📤 [CITAS] Enviando datos:", JSON.stringify(appointmentData, null, 2));

    // Hacer POST a tu API - sin timeout para permitir que el correo se envíe completamente
    const response = await fetch(
      `${API_URL}/appointments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cookie": `access_token=${token}`,
        },
        body: JSON.stringify(appointmentData),
      }
    );

    // Manejo de errores HTTP
    if (!response.ok) {
      // Intentar obtener el error del backend
      let errorData;
      const contentType = response.headers.get("content-type");
      
      try {
        if (contentType?.includes("application/json")) {
          errorData = await response.json();
        } else {
          const textError = await response.text();
          errorData = { message: textError };
          console.error("❌ [CITAS] Error HTML/texto del backend:", textError.substring(0, 500));
        }
      } catch (e) {
        errorData = { message: `Error ${response.status} del servidor` };
      }

      console.error("❌ [CITAS] Error completo:", errorData);
      
      return {
        success: false,
        error: errorData.message || errorData.error || `Error ${response.status}: No se pudo crear la cita`,
      };
    }

    // Parsear respuesta exitosa
    const result = await response.json();
    console.log("✅ [CITAS] Cita creada:", result);

    return {
      success: true,
      message: result.message || "¡Cita agendada exitosamente! Recibirás un correo de confirmación pronto.",
      appointmentId: result.appointmentId || result.id,
    };
  } catch (error) {
    console.error("Error al crear cita:", error);
    
    // Errores de red o conectividad
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        success: false,
        error: "No se pudo conectar con el servidor. Verifica tu conexión a internet.",
      };
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error inesperado al procesar la cita",
    };
  }
}
