import db from '../database.js';

export const verificarBox = async (fecha, hora, horaTermino,box, concurrentSessions) => {
  try {
    // Consultar las reservas existentes en la base de datos que se solapen con el horario
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

    console.log("Registros solapados encontrados:", solapados);

    if (box === "Solo en box 2") {
        const box2Ocupado = solapados.some(cita => cita.box === "Box 2");
        if (!box2Ocupado) {
          return "Box 2"; // Asigna automáticamente al box 2 si está disponible
        } else {
          console.log("Box 2 no está disponible en esta franja horaria.");
          return null; // Box 2 está ocupado, no se puede asignar
        }
      }

    if (box === "Solo en gym") {
        const hayConflictoEnGym = solapados.some(cita => cita.box === "Gym");
        console.log("hayConflictoEnGym =", hayConflictoEnGym);
        if (hayConflictoEnGym) {
          console.log("Ya hay un procedimiento reservado en el box 'Gym' en este horario.");
          return null; 
        }
        console.log("Asignando al box 'Gym'.");
        return "Gym"; 
      }
      
    if (concurrentSessions === 1) {
        const hayConflicto = solapados.some(cita => cita.concurrent_sessions === 1);
        if (hayConflicto) {
          console.log('Ya hay un procedimiento exclusivo en ese horario');
          return null; // No se puede agendar porque ya hay un procedimiento exclusivo
        }
        const boxesOcupados = new Set(solapados.map(cita => cita.box));
        const boxDisponible = ["Box 1", "Box 2", "Box 3"].find(box => !boxesOcupados.has(box));
        return boxDisponible || null;
      }
      

    // Si el procedimiento permite concurrencia, validar disponibilidad por box
    if (concurrentSessions > 1) {
      const boxesDisponibles = ["Box 1", "Box 2", "Box 3"];
      for (const box of boxesDisponibles) {
        const sesionesEnMismoBox = solapados.filter(cita => cita.box === box);
        const sesionesEnMismoBoxActuales = sesionesEnMismoBox.reduce(
          (total, registro) => total + registro.concurrent_sessions,
          0
        );

        if (sesionesEnMismoBoxActuales + concurrentSessions <= 3) {
          return box; // Retorna el box donde puede agendarse la cita
        }
      }
    }

    console.log("No hay boxes disponibles para este horario");
    return null; // Si no encuentra un box disponible, retorna null
  } catch (error) {
    console.error("Error verificando disponibilidad de box:", error);
    throw new Error("Error al verificar la disponibilidad del box.");
  }
};
