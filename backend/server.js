import express from 'express';
import proceduresRouter from './routes/procedures.js';
import appoimentsRouter from './routes/appoiments.js';
import loginRouter from './routes/login.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';

const app = express();

dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.disable('x-powered-by')
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://amairsweb.vercel.app'); 
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true'); 
  next();
});

app.use(cors({
  origin: 'https://amairsweb.vercel.app',  
  methods: 'GET, POST, PUT, DELETE',
  credentials: true,  
}));

app.use('/procedures', proceduresRouter);
app.use('/appointments', appoimentsRouter);
app.use('/login', loginRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
