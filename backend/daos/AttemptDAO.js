export default class AttemptDAO {
    async createAttempt(attempt, connection) {
        const [result] = await connection.execute(
            "INSERT INTO attempt (user_code, result, user_id, exercise_id, language) VALUES (?, ?, ?, ?, ?)",
            [attempt.userCode, attempt.result, attempt.userId, attempt.exerciseId, attempt.language]
        );
        return result;
    }

    async getAttemptsByUserId(userId, connection) {
        const [result] = await connection.execute(
            "SELECT * FROM attempt WHERE user_id = ?", [userId]
        );
        return result;
    }
}