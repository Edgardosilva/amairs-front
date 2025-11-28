import express from 'express';
import proceduresRouter from './routes/procedures.js';
import appoimentsRouter from './routes/appoiments.js';
import loginRouter from './routes/login.js';
import patientsRouter from './routes/patients.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';

const app = express();

dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.disable('x-powered-by')

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001';

// Lista de orígenes permitidos
const allowedOrigins = [
  FRONTEND_URL,
  'http://localhost:3001',
  'https://amaris-frontend-production.up.railway.app'
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true'); 
  next();
});

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET, POST, PUT, DELETE',
  credentials: true,  
}));

// Manejar peticiones preflight
app.options('*', cors());

app.use('/procedures', proceduresRouter);
app.use('/appointments', appoimentsRouter);
app.use('/login', loginRouter);
app.use('/patients', patientsRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
