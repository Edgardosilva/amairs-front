import db from '../database.js';

export const verificarDisponibilidad = async (fecha, hora, horaTermino, concurrentSessions) => {
  try {

    console.log(`Verificando disponibilidad proc c, en verificarDispo = ${concurrentSessions}`);

    if (!concurrentSessions) {
    console.error("ConcurrentSessions no recibido correctamente.");
    return false; // Bloquea si el valor es inválido
    }
    
    const querySolapamientos = `
        SELECT box, concurrent_sessions 
        FROM horarios_ocupados 
        WHERE fecha = ? AND hora BETWEEN ? AND ?
      `;

    const [solapados] = await db.execute(querySolapamientos, [fecha, hora, horaTermino]);

 
    if (concurrentSessions === 1) {
      const hayConflicto = solapados.some(cita => cita.concurrent_sessions === 1);
      if (hayConflicto) {
        console.log('Ya hay un procedimiento exclusivo en ese horario');
        return null; // No se puede agendar porque ya hay un procedimiento exclusivo
      }
    }
  
    if (concurrentSessions === 3) {
      const sesionesEnMismoBox = solapados.filter(cita => cita.box === box);
      const sesionesEnMismoBoxActuales = sesionesEnMismoBox.reduce(
        (total, registro) => total + registro.concurrent_sessions,
        0
      );

      if (sesionesEnMismoBoxActuales + concurrentSessions > 3) {
        console.log("Excede el límite de sesiones concurrentes en el mismo box");
        return null; // Excede el límite de sesiones concurrentes en el mismo box
      }
    }

    return true; // Retorna el box asignado
  } catch (error) {
    console.error("Error verificando disponibilidad:", error);
    throw new Error("Error al verificar disponibilidad.");
  }
};
