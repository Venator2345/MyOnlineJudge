import ExerciseDAO from '../daos/ExerciseDAO.js';
import db from '../db/database.js';

export default class ExerciseControl {

    async getExercises(req, res) {
        const connection = await db.getConnection();

        try {
            const exerciseDAO = new ExerciseDAO();
            const exercises = await exerciseDAO.getExercises(connection);
            
            return res.status(200).json(exercises);
        }
        catch(error) {
            console.error(error);
            return res.status(500).json({ error: "Erro no servidor" });
        }finally {
            connection.release(); 
        }
    }

    async getExerciseById(req, res) {
        const connection = await db.getConnection();

        try {
            const { id } = req.params;
            const exerciseDAO = new ExerciseDAO();
            const exercise = await exerciseDAO.getExerciseById(id, connection);
            
            return res.status(200).json(exercise);
        }
        catch(error) {
            console.error(error);
            return res.status(500).json({ error: "Erro no servidor" });
        }finally {
            connection.release(); 
        }
    }

}