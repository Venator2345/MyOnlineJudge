import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/AuthRoute.js'
import userRoutes from './routes/UserRoute.js'
import exerciseRoutes from './routes/ExerciseRoute.js';
import attemptRoutes from './routes/AttemptRoute.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/exercises',exerciseRoutes);
app.use('/attempts',attemptRoutes);

app.listen(PORT, ()=> {
    console.log('Servidor rodando na porta ' + PORT);
});
