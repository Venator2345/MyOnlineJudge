import TestCaseDAO from "../daos/TestCaseDAO.js";
import db from '../db/database.js';

export default class CodeExecutionControl {

    async verifyTestCases(exerciseId, userCode) {
        const connection = await db.getConnection();
        let veredict;

        try {
            const testCaseDAO = new TestCaseDAO();
            const testCases = await testCaseDAO.getTestCasesByExercise(exerciseId, connection);
            let outputString;
            let correctAnswerCount = 0;
            console.log(testCases);
            console.log(testCases.length);

            for(let i = 0; i < testCases.length; i++) {
                outputString = this.executeCode(testCases[i].input, userCode);

                if(outputString == testCases[i].expected_output)
                    correctAnswerCount++;
            }

            if(outputString === null)
                veredict = 'ERR';
            else if(correctAnswerCount === testCases.length)
                veredict = 'AC';
            else
                veredict = 'WA'

        }catch(error) {
            console.error(error);
            veredict = 'ERR';
        }finally {
            connection.release();
        }

        return veredict;
    }

    executeCode(testCase, userCode) {

        try {
            const result = new Function('inputString', 
                `
                let outputString = '';

                console.log = function(message) {
                    outputString += message;
                    outputString += '\\n';
                };

                ${userCode}
                
                return outputString;`)(testCase);
    
            return result;
        } catch (error) {
            return null;
        }
    }

}