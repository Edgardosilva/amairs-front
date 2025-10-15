import { verificarDisponibilidad } from '../helpers/verificarDisponibilidad.js';
import { verificarBox } from '../helpers/verificarBox.js';
import { sendConfirmationEmail } from '../helpers/emailService.js'; // Ajusta el path si es necesario
import db from '../database.js';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';



// Datos de ejemplo para citas (puedes reemplazarlos con datos reales o traerlos de una base de datos)
// export const appointments = [];

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
          ca.estado
      FROM citas_agendadas ca
      JOIN procedimientos_disponibles pd ON ca.procedimiento_id = pd.id
      JOIN usuarios_registrados ur ON ca.usuario_id = ur.id
    `);

    // 🔹 Verifica qué datos devuelve la BD
    console.log("Datos crudos de la BD:", rows);

    // 🔹 Procesa citas asegurando que los datos sean válidos
    const appointments = rows
      .filter(appt => appt.fecha && appt.hora) // Filtra registros inválidos
      .map(appt => {
        try {
          const fechaISO = new Date(appt.fecha).toISOString().split("T")[0]; // Convierte fecha a 'YYYY-MM-DD'
          const dateTimeString = `${fechaISO}T${appt.hora}`; // Formato completo de fecha y hora
          const startDate = new Date(dateTimeString);

          if (isNaN(startDate.getTime())) {
            console.error(`Fecha inválida en ID ${appt.id}:`, appt.fecha, appt.hora);
            return null; // Ignorar registros con fechas incorrectas
          }

          return {
            id: appt.id,
            title: `${appt.procedimiento} - ${appt.paciente}`,
            start: startDate,
            state: appt.estado // Convierte a formato ISO
          };
        } catch (error) {
          console.error(`Error procesando cita ID ${appt.id}:`, error);
          return null;
        }
      })
      .filter(appt => appt !== null); // Elimina valores inválidos

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

    // Define rango de horarios posibles (por ejemplo, de 09:00 a 18:00)
    const allTimes = generateTimeSlots("09:00", "18:00", 15); // Genera intervalos de 15 minutos
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
    times.push(current.toTimeString().slice(0, 5)); // Formato HH:MM
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

    // Buscar el email del usuario autenticado
    const [userResult] = await db.execute(
      'SELECT email FROM usuarios_registrados WHERE id = ?',
      [usuarioId]
    );

    if (!userResult.length) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const email = userResult[0].email;

    // Generar token único para confirmación
    const tokenConfirmacion = uuidv4();

    // Insertar en horarios_ocupados
    const queryInsert = `
      INSERT INTO horarios_ocupados (fecha, hora, horaTermino, procedimiento_id, box, concurrent_sessions)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await db.execute(queryInsert, [
      fecha, hora, horaTermino, procedimiento_id, boxAsignado, concurrentSessions
    ]);

    // Insertar en citas_agendadas
    const queryInsertCitas = `
      INSERT INTO citas_agendadas 
      (usuario_id, procedimiento_id, duracion, box, estado, fecha, hora, horaTermino, paciente_atendido, token_confirmacion)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    await db.execute(queryInsertCitas, [
      usuarioId,
      procedimiento_id,
      duracion,
      boxAsignado,
      estado,
      fecha,
      hora,
      horaTermino,
      paciente_atendido,
      tokenConfirmacion
    ]);

    // Responder inmediatamente al cliente
    res.status(201).json({ message: "Cita creada exitosamente", box: boxAsignado });

    // Enviar el correo en segundo plano (no bloquea la respuesta)
    sendConfirmationEmail(email, tokenConfirmacion)
      .then(() => {
        console.log(`✅ Correo de confirmación enviado a ${email}`);
      })
      .catch((emailError) => {
        console.error(`❌ Error al enviar correo a ${email}:`, emailError.message);
        // La cita ya fue creada, solo falló el envío del correo
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
          pd.nombre AS procedimiento,
          ur.nombre AS solicitante,
          ca.paciente_atendido AS paciente,
          ca.hora,
          ca.fecha,
          ca.estado
        FROM citas_agendadas ca
        JOIN procedimientos_disponibles pd ON ca.procedimiento_id = pd.id
        JOIN usuarios_registrados ur ON ca.usuario_id = ur.id
        WHERE ca.usuario_id = ?;
    `;
    const [appointments] = await db.execute(query, [usuario_id]);
    res.status(200).json({ appointments });
    console.log(appointments)
  } catch (error) {
    console.error('Error al obtener citas:', error.message);
    res.status(500).json({ error: "Internal server error." });
  }
}

export const getAppointmentByToken = async (req, res) => {
  try {
    const { token } = req.params;

    const [result] = await db.execute(
      `SELECT 
        ca.*, 
        pd.nombre AS nombre_procedimiento
      FROM citas_agendadas ca
      JOIN procedimientos_disponibles pd 
        ON ca.procedimiento_id = pd.id
      WHERE ca.token_confirmacion = ?`,
      [token]
    );

    if (!result.length) {
      return res.status(404).json({ error: "Cita no encontrada" });
    }

    res.status(200).json({ cita: result[0] });
  } catch (error) {
    console.error("Error al obtener cita:", error);
    res.status(500).json({ error: "Error interno" });
  }
};



export const confirmarCita = async (req, res) => {
  try {
    const { token } = req.params;

    const [result] = await db.execute(
      'SELECT * FROM citas_agendadas WHERE token_confirmacion = ?',
      [token]
    );

    if (!result.length) {
      return res.status(404).send('Token inválido o cita no encontrada');
    }

    const cita = result[0];

    if (cita.estado === 'Confirmada') {
      return res.send('Esta cita ya ha sido confirmada anteriormente.');
    }

    await db.execute(
      'UPDATE citas_agendadas SET estado = "Confirmada" WHERE token_confirmacion = ?',
      [token]
    );

    return res.redirect(`https://amairsweb.vercel.app/confirmar-cita/${token}`);


  } catch (error) {
    console.error("Error al confirmar la cita:", error.message);
    res.status(500).send('Hubo un error al confirmar la cita.');
  }
};



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
    sendConfirmationEmail,
    confirmarCita,
    getAppointmentByToken,
    deleteAppointment,
    // updateAppointment,
    // deleteAppointment
};
