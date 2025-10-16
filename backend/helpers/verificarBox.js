import db from '../database.js';

export const verificarBox = async (fecha, hora, horaTermino,box, concurrentSessions) => {
  try {

    const querySolapamientos = `
      SELECT box, concurrent_sessions 
      FROM horarios_ocupados 
      WHERE fecha = ? AND (
        (hora >= ? AND hora < ?) OR 
        (horaTermino > ? AND horaTermino <= ?) OR 
        (hora <= ? AND horaTermino >= ?)
      )
    `;

    const [solapados] = await db.execute(querySolapamientos, [
      fecha,
      hora,
      horaTermino,
      hora,
      horaTermino,
      hora,
      horaTermino,
    ]);

    if (box === "Solo en box 2") {
        const box2Ocupado = solapados.some(cita => cita.box === "Box 2");
        if (!box2Ocupado) {
          return "Box 2"; 
        } else {
          return null; 
        }
      }

    if (box === "Solo en gym") {
        const hayConflictoEnGym = solapados.some(cita => cita.box === "Gym");
        if (hayConflictoEnGym) {
          return null; 
        }
        return "Gym"; 
      }
      
    if (concurrentSessions === 1) {
        const hayConflicto = solapados.some(cita => cita.concurrent_sessions === 1);
        if (hayConflicto) {
          return null; 
        }
        const boxesOcupados = new Set(solapados.map(cita => cita.box));
        const boxDisponible = ["Box 1", "Box 2", "Box 3"].find(box => !boxesOcupados.has(box));
        return boxDisponible || null;
      }
      
    if (concurrentSessions > 1) {
      const boxesDisponibles = ["Box 1", "Box 2", "Box 3"];
      for (const box of boxesDisponibles) {
        const sesionesEnMismoBox = solapados.filter(cita => cita.box === box);
        const sesionesEnMismoBoxActuales = sesionesEnMismoBox.reduce(
          (total, registro) => total + registro.concurrent_sessions,
          0
        );

        if (sesionesEnMismoBoxActuales + concurrentSessions <= 3) {
          return box; 
        }
      }
    }

    return null; 
  } catch (error) {
    console.error("Error verificando disponibilidad de box:", error);
    throw new Error("Error al verificar la disponibilidad del box.");
  }
};
