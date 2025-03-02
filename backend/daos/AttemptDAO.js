export default class AttemptDAO {
    async createAttempt(attempt, connection) {
        const [result] = await connection.execute(
            "INSERT INTO attempt (user_code, result, user_id, exercise_id) VALUES (?, ?, ?, ?)",
            [attempt.userCode, attempt.result, attempt.userId, attempt.exerciseId]
        );
        return result;
    }
}