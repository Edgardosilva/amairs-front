"use server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://amaris-api-production.up.railway.app';

interface ApiResponse {
  availableTimes: string[];
}

export async function obtenerHorariosDisponibles(
  fecha: string,
  procedimiento_id: string
): Promise<string[]> {
  try {
    const response = await fetch(
      `${API_URL}/appointments/available?selectedDate=${fecha}&procedimiento_id=${procedimiento_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error(`Error al obtener horarios: ${response.status}`);
      throw new Error("Error al obtener horarios disponibles");
    }

    const data: ApiResponse = await response.json();
    return data.availableTimes || [];
  } catch (error) {
    console.error("Error al obtener horarios:", error);
    if (process.env.NODE_ENV === "development") {
      return generarHorariosMock();
    }
    return [];
  }
}

function generarHorariosMock(): string[] {
  return [
    "09:00", "09:15", "09:30", "09:45",
    "10:00", "10:15", "10:30", "10:45",
    "11:00", "11:15", "11:30", "11:45",
    "14:00", "14:15", "14:30", "14:45",
    "15:00", "15:15", "15:30", "15:45",
    "16:00", "16:30", "17:00", "17:30"
  ];
}
