export const procedures = [
    { id: 1, name: "Limpieza facial básica", duration: 45 },
    { id: 2, name: "Limpieza facial premium", duration: 90 },
    { id: 3, name: "Limpieza facial superpremium", duration: 120 },
    { id: 4, name: "Masaje 30 min", duration: 30 },
    { id: 5, name: "Masaje 45 min", duration: 45 },
    { id: 6, name: "Drenaje linfático", duration: 60 },
    { id: 7, name: "Presoterapia", duration: 60 },
    { id: 8, name: "Lifting de pestañas", duration: 120 },
    { id: 9, name: "Radiofrecuencia facial", duration: 45 },
    { id: 10, name: "Entrenamiento funcional 30 min", duration: 30 },
    { id: 11, name: "Entrenamiento funcional 50 min", duration: 60 },
];

export const getAllProcedures = (req, res) => {
    res.json(procedures);
};

export const getProcedureById = (req, res) => {
    const procedure = procedures.find(p => p.id === parseInt(req.params.id));
    if (procedure) {
        res.json(procedure);
    } else {
        res.status(404).json({ message: "Procedimiento no encontrado" });
    }
};

export const createProcedure = (req, res) => {
    const newProcedure = {
        id: procedures.length + 1, 
        name: req.body.name,
        duration: req.body.duration
    };
    procedures.push(newProcedure);
    res.status(201).json(newProcedure);
};
  

export default {
    getAllProcedures,
    getProcedureById,
    createProcedure,
};
 