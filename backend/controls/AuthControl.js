import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserDAO from '../daos/UserDao.js';
import db from '../db/database.js';

export default class AuthController {
    login = async (req, res) => {
        const connection = await db.getConnection();

        try {
            const { name, password } = req.body;

            if (!name || !password) {
                return res.status(400).json({ message: "Nome e senha são obrigatórios" });
            }

            const userDAO = new UserDAO();
            const user = await userDAO.getUserByName(name,connection);

            if (!user) {
                return res.status(401).json({ message: "Usuário não encontrado" });
            }

            console.log(password + ' x ' + user.password);

            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ message: "Senha incorreta" });
            }

            const token = jwt.sign({ id: user.id, name: user.name }, process.env.JWT_SECRET, { expiresIn: "1h" });

            console.log("login realizado");
            return res.json({ token });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro no servidor" });
        } finally {
            connection.release(); 
        }
    };
}
