"use server";

// Estructura basada en tu API actual
interface ApiResponse {
  availableTimes: string[]; // ["09:00", "09:30", "10:00", ...]
}

export async function obtenerHorariosDisponibles(
  fecha: string // formato: "YYYY-MM-DD"
): Promise<string[]> {
  try {
    // Tu endpoint actual de Amaris API
    const response = await fetch(
      `https://amaris-api-production.up.railway.app/appointments/available?selectedDate=${fecha}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // Cache por 30 segundos para horarios actualizados
        next: { revalidate: 30 },
      }
    );

    if (!response.ok) {
      console.error(`Error al obtener horarios: ${response.status}`);
      throw new Error("Error al obtener horarios disponibles");
    }

    const data: ApiResponse = await response.json();
    
    // Retornar los horarios disponibles directamente como tu API los envía
    return data.availableTimes || [];
  } catch (error) {
    console.error("Error al obtener horarios:", error);
    // En producción, podrías retornar [] para que el usuario sepa que no hay disponibilidad
    // O generar horarios mock solo en desarrollo
    if (process.env.NODE_ENV === "development") {
      return generarHorariosMock();
    }
    return [];
  }
}

// Función auxiliar para horarios mock (solo desarrollo)
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
