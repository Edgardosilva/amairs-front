"use server";

import { cookies } from "next/headers";

export interface Appointment {
  id: string;
  fecha: string;
  hora: string;
  horaTermino: string;
  paciente_atendido: string;
  procedimiento_id: string;
  procedimiento?: {
    id: string;
    nombre: string;
    duracion: number;
    precio: number;
  };
  estado: string;
  box: string;
  duracion: number;
  createdAt?: string;
  updatedAt?: string;
}

interface GetAppointmentsResponse {
  success: boolean;
  appointments?: Appointment[];
  error?: string;
}

export async function getUserAppointments(): Promise<GetAppointmentsResponse> {
  try {
    // Obtener el token de autenticación
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return {
        success: false,
        error: "Debes iniciar sesión para ver tus citas",
      };
    }

    // Hacer GET al endpoint
    const response = await fetch(
      "https://amaris-api-production.up.railway.app/appointments/getUserAppointments",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cookie": `access_token=${token}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        return {
          success: false,
          error: "Sesión expirada. Por favor inicia sesión nuevamente.",
        };
      }
      return {
        success: false,
        error: `Error ${response.status}: No se pudieron obtener las citas`,
      };
    }

    const data = await response.json();

    return {
      success: true,
      appointments: data.appointments || data || [],
    };
  } catch (error) {
    console.error("Error al obtener citas:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al conectar con el servidor",
    };
  }
}
