import db from './database.js';

const query = 'SELECT * FROM horarios_ocupados WHERE fecha = "2025-12-02" AND hora = "10:00:00" ORDER BY id DESC LIMIT 1';
const [rows] = await db.execute(query);
console.log('Cita del 2 de diciembre a las 10:00:');
console.log(JSON.stringify(rows, null, 2));
process.exit(0);
