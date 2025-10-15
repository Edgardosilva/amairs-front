// Utilidades para manejo de horarios (funciones síncronas)

/**
 * Calcula el rango de horarios que ocupa un procedimiento
 * @param horaInicio - Hora de inicio en formato "HH:MM" (ej: "09:00")
 * @param duracionMinutos - Duración del procedimiento en minutos
 * @returns Array de strings con los horarios en intervalos de 15 minutos
 */
export function calcularRangoHorarios(
  horaInicio: string, 
  duracionMinutos: number
): string[] {
  const [hours, minutes] = horaInicio.split(':').map(Number);
  const start = new Date(2000, 0, 1, hours, minutes);
  const range: string[] = [];
  
  // Agregar el horario inicial
  range.push(horaInicio);
  
  // Agregar horarios en intervalos de 15 minutos hasta completar la duración
  for (let i = 15; i <= duracionMinutos; i += 15) {
    const nextTime = new Date(start.getTime() + i * 60 * 1000);
    const formattedTime = `${String(nextTime.getHours()).padStart(2, '0')}:${String(nextTime.getMinutes()).padStart(2, '0')}`;
    range.push(formattedTime);
  }
  
  return range;
}

/**
 * Formatea una fecha a string en formato YYYY-MM-DD
 */
export function formatearFecha(fecha: Date): string {
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, '0');
  const day = String(fecha.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Valida si un horario está en formato HH:MM
 */
export function validarFormatoHorario(horario: string): boolean {
  const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return regex.test(horario);
}
