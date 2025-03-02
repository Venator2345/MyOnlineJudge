export default class ExerciseDAO {
    
    async getExercises(connection) {
        const [rows] = await connection.execute(
            "SELECT * FROM exercises"
        );
        return rows.length > 0 ? rows : null;
    }

    async getExerciseById(id, connection) {
        const [rows] = await connection.execute(
            "SELECT * FROM exercises WHERE id = ?", [id]
        );

        return rows.length ? rows[0] : null;
    }

}