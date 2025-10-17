import express from "express";
import AppointmentsController from "../controllers/AppointmentsController.js";
import { verifyAdmin, verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Rutas protegidas para admin
router.get("/getAllAppointments", verifyAdmin, AppointmentsController.getAllAppointments);

// Rutas protegidas para usuarios autenticados
router.get("/getUserAppointments", verifyToken, AppointmentsController.getUserAppointments);

router.post("/", verifyToken, AppointmentsController.createAppointment);

router.post("/deleteAppointments", verifyToken, AppointmentsController.deleteAppointment);

// Rutas públicas
router.get("/available", AppointmentsController.getAvailableAppointments);

export default router;
