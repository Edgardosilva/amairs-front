import express from "express";
import AppointmentsController from "../controllers/AppointmentsController.js";

const router = express.Router();

// Ruta para obtener todas las citas
router.get("/getAllAppointments", AppointmentsController.getAllAppointments);

router.get("/getUserAppointments", AppointmentsController.getUserAppointments);

router.post("/", AppointmentsController.createAppointment);

router.post("/deleteAppointments", AppointmentsController.deleteAppointment);

router.get("/confirmar-cita/:token", AppointmentsController.confirmarCita);

router.get('/confirmar-cita/:token/detalles', AppointmentsController.getAppointmentByToken);

router.get("/available", AppointmentsController.getAvailableAppointments);

// router.delete("/:id", AppointmentsController.deleteAppointment);

export default router;
