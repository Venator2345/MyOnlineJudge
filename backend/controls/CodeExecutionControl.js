import TestCaseDAO from "../daos/TestCaseDAO.js";
import db from '../db/database.js';
import { spawn } from 'child_process';

export default class CodeExecutionControl {

    async verifyTestCases(exerciseId, userCode, language) {
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

                switch(language) {
                    case 'js':
                        outputString = this.executeCode(testCases[i].input, userCode);
                    break;
                    case 'python':
                        outputString = await this.executePython(testCases[i].input, userCode);
                        outputString = outputString.replaceAll('\r','');
                    break;
                }

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

    executePython(input, userCode) {
        return new Promise((resolve, reject) => {
            const pythonProcess = spawn('python', ['execute.py', userCode]);
    
            let output = '';
            let error = '';
    
            // Enviar o código do usuário para o Python via stdin
            pythonProcess.stdin.write(input);
            pythonProcess.stdin.end();
    
            // Captura a saída do Python
            pythonProcess.stdout.on('data', (data) => {
                output += data.toString();
            });
    
            // Captura erros
            pythonProcess.stderr.on('data', (data) => {
                error += data.toString();
            });
    
            // Quando o processo finalizar
            pythonProcess.on('close', (code) => {
                if (code === 0) {
                    resolve(output);
                } else {
                    reject(`Erro no Python: ${error}`);
                }
            });
        });
    }

}