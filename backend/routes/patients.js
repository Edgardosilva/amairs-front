import express from 'express';
import { searchPatients, getPatientHistory } from '../controllers/PatientsController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/search', verifyToken, searchPatients);
router.get('/:pacienteId/history', verifyToken, getPatientHistory);

export default router;
