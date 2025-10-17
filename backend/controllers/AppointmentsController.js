import { verificarDisponibilidad } from '../helpers/verificarDisponibilidad.js';
import { verificarBox } from '../helpers/verificarBox.js';
import db from '../database.js';
import jwt from 'jsonwebtoken';


// Controlador para obtener todas las citas
export const getAllAppointments = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
          ca.id,
          pd.nombre AS procedimiento, 
          ur.nombre AS solicitante, 
          ca.paciente_atendido AS paciente, 
          ca.hora, 
          ca.fecha,
          ca.estado,
          ca.box,
          ca.horaTermino
      FROM citas_agendadas ca
      JOIN procedimientos_disponibles pd ON ca.procedimiento_id = pd.id
      JOIN usuarios_registrados ur ON ca.usuario_id = ur.id
    `);

    // Procesa citas asegurando que los datos sean válidos
    const appointments = rows
      .filter(appt => appt.fecha && appt.hora) 
      .map(appt => {
        try {
          const fechaISO = new Date(appt.fecha).toISOString().split("T")[0];
          const dateTimeString = `${fechaISO}T${appt.hora}`;
          const startDate = new Date(dateTimeString);

          if (isNaN(startDate.getTime())) {
            console.error(`Fecha inválida en ID ${appt.id}:`, appt.fecha, appt.hora);
            return null; 
          }

          return {
            id: appt.id,
            title: `${appt.procedimiento} - ${appt.paciente}`,
            start: startDate,
            state: appt.estado,
            box: appt.box,
            horaTermino: appt.horaTermino,
            procedimiento: appt.procedimiento,
            paciente: appt.paciente,
            solicitante: appt.solicitante
          };
        } catch (error) {
          console.error(`Error procesando cita ID ${appt.id}:`, error);
          return null;
        }
      })
      .filter(appt => appt !== null); 

    res.json(appointments);
  } catch (error) {
    console.error("Error obteniendo citas:", error);
    res.status(500).json({ error: "Error al obtener citas" });
  }
};



export const getAvailableAppointments = async (req, res) => {
  try {
    const { selectedDate } = req.query;

    if (!selectedDate || selectedDate.trim() === "") {
      return res.status(400).json({ error: "Date is required." });
    }

    const isValidDate = !isNaN(Date.parse(selectedDate));
    if (!isValidDate) {
      return res.status(400).json({ error: "Invalid date format." });
    }

    // Consulta horarios ocupados
    const query = `
      SELECT hora, horaTermino FROM horarios_ocupados
      WHERE fecha = ?
    `;
    const [occupiedSchedules] = await db.execute(query, [selectedDate]);
    const allTimes = generateTimeSlots("09:00", "18:00", 15); 
    const availableTimes = allTimes.filter((time) =>
      !isTimeOccupied(time, occupiedSchedules)
    );

    res.status(200).json({ availableTimes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Generar intervalos de tiempo
const generateTimeSlots = (start, end, interval) => {
  const times = [];
  let current = new Date(`1970-01-01T${start}:00`);
  const endTime = new Date(`1970-01-01T${end}:00`);

  while (current <= endTime) {
    times.push(current.toTimeString().slice(0, 5)); 
    current.setMinutes(current.getMinutes() + interval);
  }

  return times;
};

// Verificar si un horario está ocupado
const isTimeOccupied = (time, occupiedSchedules) => {
  const [hours, minutes] = time.split(":").map(Number);
  const timeInMinutes = hours * 60 + minutes;

  for (const schedule of occupiedSchedules) {
    const [startHours, startMinutes] = schedule.hora.split(":").map(Number);
    const [endHours, endMinutes] = schedule.horaTermino.split(":").map(Number);

    const startInMinutes = startHours * 60 + startMinutes;
    const endInMinutes = endHours * 60 + endMinutes;

    if (timeInMinutes >= startInMinutes && timeInMinutes < endInMinutes) {
      return true; // Está ocupado
    }
  }

  return false; // Está disponible
};



// Controlador para crear una nueva cita
export const createAppointment = async (req, res) => {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      return res.status(401).json({ error: 'Token no encontrado. Inicia sesión.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuarioId = decoded.id;

    const {
      duracion,
      fecha,
      hora,
      horaTermino,
      paciente_atendido,
      procedimiento_id,
      box,
      concurrentSessions,
      estado
    } = req.body;

    if (!fecha || !hora || !horaTermino || !procedimiento_id || !box || !concurrentSessions) {
      return res.status(400).json({ error: "Faltan datos obligatorios en la solicitud" });
    }

    // Verificar y asignar box disponible
    const boxAsignado = await verificarBox(fecha, hora, horaTermino, box, concurrentSessions);
    if (!boxAsignado) {
      return res.status(400).json({ error: "No hay un box disponible para este horario." });
    }

    // Insertar en horarios_ocupados
    const queryInsert = `
      INSERT INTO horarios_ocupados (fecha, hora, horaTermino, procedimiento_id, box, concurrent_sessions)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await db.execute(queryInsert, [
      fecha, hora, horaTermino, procedimiento_id, boxAsignado, concurrentSessions
    ]);

    // Insertar en citas_agendadas con estado "Confirmada" por defecto
    const queryInsertCitas = `
      INSERT INTO citas_agendadas 
      (usuario_id, procedimiento_id, duracion, box, estado, fecha, hora, horaTermino, paciente_atendido)
      VALUES (?, ?, ?, ?, 'Confirmada', ?, ?, ?, ?);
    `;
    await db.execute(queryInsertCitas, [
      usuarioId,
      procedimiento_id,
      duracion,
      boxAsignado,
      fecha,
      hora,
      horaTermino,
      paciente_atendido
    ]);

    console.log('✅ [CITAS] Cita creada y confirmada automáticamente');
    res.status(201).json({ 
      message: "Cita creada y confirmada exitosamente", 
      box: boxAsignado,
      estado: "Confirmada"
    });

  } catch (error) {
    console.error("Error al crear la cita:", error.message);
    res.status(500).json({ error: "Error al crear la cita" });
  }
};


export const getUserAppointments = async (req, res) => {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      return res.status(401).json({ error: 'Token no encontrado. Inicia sesión.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario_id = decoded.id;
    const query = `
        SELECT
          ca.id,
          ca.fecha,
          ca.hora,
          ca.horaTermino,
          ca.duracion,
          ca.box,
          ca.estado,
          ca.paciente_atendido,
          pd.nombre AS nombre_procedimiento,
          ur.nombre AS solicitante
        FROM citas_agendadas ca
        JOIN procedimientos_disponibles pd ON ca.procedimiento_id = pd.id
        JOIN usuarios_registrados ur ON ca.usuario_id = ur.id
        WHERE ca.usuario_id = ?
        ORDER BY ca.fecha DESC, ca.hora DESC;
    `;
    const [appointments] = await db.execute(query, [usuario_id]);
    res.status(200).json({ appointments });
  } catch (error) {
    console.error('Error al obtener citas:', error.message);
    res.status(500).json({ error: "Internal server error." });
  }
}

export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'ID de cita requerido' });
    }

    const [result] = await db.execute('SELECT * FROM citas_agendadas WHERE id = ?', [id]);

    if (!result.length) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    const cita = result[0];

    const citaDate = new Date(cita.fecha);
    const now = new Date();
    const diffInMs = citaDate - now;
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return res.status(400).json({ message: 'No se puede eliminar una cita con menos de 24 horas de anticipación.' });
    }

    await db.execute('DELETE FROM citas_agendadas WHERE id = ?', [id]);

    return res.status(200).json({ message: 'Cita eliminada correctamente' });
  } catch (error) {
    console.error("Error al eliminar la cita:", error.message);
    res.status(500).json({ message: 'Hubo un error al eliminar la cita.' });
  }
};







  

// Controlador para actualizar una cita por ID
// export const updateAppointment = (req, res) => {
//     const { id } = req.params;
//     const { date, time, box } = req.body;

//     const appointment = appointments.horaFind(a => a.id === parseInt(id));
//     if (appointment) {
//         appointment.date = date || appointment.date;
//         appointment.time = time || appointment.time;
//         appointment.box = box || appointment.box;

//         res.json(appointment);
//     } else {
//         res.status(404).json({ message: "Cita no encontrada" });
//     }
// };

// Controlador para eliminar una cita por ID
// export const deleteAppointment = (req, res) => {
//     const { id } = req.params;
//     const index = appointments.horaFindIndex(a => a.id === parseInt(id));
//     if (index !== -1) {
//         appointments.splice(index, 1);
//         res.status(204).end();
//     } else {
//         res.status(404).json({ message: "Cita no encontrada" });
//     }
// };

export default {
    getAllAppointments,
    getAvailableAppointments,
    createAppointment,
    getUserAppointments,
    deleteAppointment
};
