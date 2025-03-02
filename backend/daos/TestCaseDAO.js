export default class TestCaseDAO {
    async getTestCasesByExercise(exerciseId, connection) {
        const [result] = await connection.execute(
            'SELECT * FROM test_cases WHERE exercise_id = ?', [exerciseId]);
        return result[0] ? result : null;
    }
}