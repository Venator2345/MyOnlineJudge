import User from "../models/User.js";
import UserDAO from "../daos/UserDao.js";
import db from '../db/database.js';

export default class UserControl {

    getUsers = async(req, res) => {
        const connection = await db.getConnection();

        try {
            const userDAO = new UserDAO();
            const users = await userDAO.getUsers(connection);

            return res.status(200).json(users);

        } catch(error) {
            console.error(error);
            return res.status(500).json({ error: "Erro no servidor" });
        } finally {
            connection.release(); 
        }
    }

    createUser = async(req, res) => {
        const connection = await db.getConnection();

        try {
            const { name, password } = req.body;
            const newUser = new User(null, name, password);

            const userDAO = new UserDAO();
            const result = await userDAO.createUser(newUser, connection);
            return res.status(201).json({ message: 'Usuário criado com sucesso', id: result.insertId });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro no servidor" });
        } finally {
            connection.release(); 
        }

    };
}