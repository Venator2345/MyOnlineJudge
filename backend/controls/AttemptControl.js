import AttemptDAO from '../daos/AttemptDAO.js';
import db from '../db/database.js';
import Attempt from '../models/Attempt.js';
import CodeExecutionControl from './CodeExecutionControl.js';

export default class AttempControl {

    async createAttempt(req, res) {
        const connection = await db.getConnection();

        try {
            const {userCode, userId, exerciseId, language, timeLimit} = req.body;

            const attemptDAO = new AttemptDAO();
            const attempt = new Attempt(null, null, userCode, userId, exerciseId, language);

            const codeExecutionControl = new CodeExecutionControl();

            //aqui precisa obter o resultado do codigo e comparar-----
            attempt.result = await codeExecutionControl.verifyTestCases(exerciseId, userCode, language, timeLimit);
            
            //--------------------------------------------------------

            console.log('tentativa: '+attempt.result);

            const result = await attemptDAO.createAttempt(attempt, connection);
            return res.status(201).json({message: 'Tentativa criada com sucesso!', id: result.insertId, veredict: attempt.result});
        }catch(error) {
            console.error(error);
            return res.status(500).json({error: 'Erro no servidor'});
        }finally {
            (await connection).release();
        }
    }

}