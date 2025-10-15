// routes/procedures.js

import express from "express";
import ProceduresController from "../controllers/ProceduresController.js";

const router = express.Router();

// Ruta para obtener todos los procedimientos
router.get("/", ProceduresController.getAllProcedures);

// Ruta para obtener un procedimiento por ID
router.get("/:id", ProceduresController.getProcedureById);

// Ruta para crear un nuevo procedimiento (esto es solo un ejemplo)
router.post("/", ProceduresController.createProcedure);

export default router;
