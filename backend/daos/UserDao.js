import bcrypt from 'bcryptjs';

export default class UserDAO {

    async getUsers(connection) {
        const [rows] = await connection.execute(
            "SELECT * FROM users"
        );
        return rows.length > 0 ? rows : null;
    }

    async createUser(user, connection) {
        const hashedPassword = await bcrypt.hash(user.password, 10); // Criptografa a senha
        const [result] = await connection.execute(
            "INSERT INTO users (name, password) VALUES (?, ?)",
            [user.name, hashedPassword]
        );
        return result;
    }

    async getUserByName(name, connection) {
        const [rows] = await connection.execute(
            "SELECT * FROM users WHERE name = ?",
            [name]
        );
        return rows.length > 0 ? rows[0] : null;
    }
}