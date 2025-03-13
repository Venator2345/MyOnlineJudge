import TestCaseDAO from "../daos/TestCaseDAO.js";
import db from '../db/database.js';
import { spawn, exec, execSync } from 'child_process';
import vm from 'vm';
import fs from 'fs';
import { stdout } from "process";

export default class CodeExecutionControl {

    async verifyTestCases(exerciseId, userCode, language, timeLimit) {
        const connection = await db.getConnection();
        let result = {veredict: '', output: ''};

        try {
            const testCaseDAO = new TestCaseDAO();
            const testCases = await testCaseDAO.getTestCasesByExercise(exerciseId, connection);
            let correctAnswerCount = 0;
            console.log(testCases);
            console.log(testCases.length);

            if(language === 'cpp')
                await this.compileCpp(userCode);

            for(let i = 0; i < testCases.length; i++) {

                switch(language) {
                    case 'js':
                        result = this.executeJavascript(testCases[i].input, userCode,timeLimit);
                    break;
                    case 'python':
                        result = await this.executePython(testCases[i].input, userCode,timeLimit);
                        result.output = result.output.replaceAll('\r','');
                    break;
                    case 'cpp':
                        result = await this.executeCpp(testCases[i].input, timeLimit);
                        result.output = result.output.replaceAll('\r','');
                    break;
                }

                if(result.output == testCases[i].expected_output)
                    correctAnswerCount++;
            }

            if(result.veredict === 'PENDING') {
                if(correctAnswerCount === testCases.length)
                    result.veredict = 'AC';
                else
                result.veredict = 'WA'
            }


        }catch(error) {
            console.error(error);
            result.veredict = 'ERR';
        }finally {
            connection.release();
        }

        return result.veredict;
    }

    executeJavascript(testCase, userCode, timeLimit) {
        try {
            const inputLines = testCase.split('\n');
            let inputIndex = 0;
            const outputLines = [];
    
            const sandbox = {
                input: () => {
                    if (inputIndex < inputLines.length) {
                        return inputLines[inputIndex++];
                    }
                    return '';
                },
                print: (message) => {
                    outputLines.push(String(message));
                }
            };
    
            const wrappedCode = `${userCode}`;
    
            // Executa com timeout
            vm.runInNewContext(wrappedCode, sandbox, { timeout: timeLimit });
    
            return {veredict: 'PENDING', output: outputLines.join('')};
        } catch (error) {
            if (error.name === 'TimeoutError') {
                return {veredict: 'TLE', output: ''};
            }
            console.error('Erro no JS:', error);
            return {veredict: 'ERR', output: ''};
        }
    }

    executePython(input, userCode, timeLimit) {
        return new Promise((resolve, reject) => {
            const pythonProcess = spawn('python', ['execute.py', userCode], {timeout: timeLimit + 1000});
    
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
            pythonProcess.on('close', (code, signal) => {
                if (signal === 'SIGTERM') {
                    resolve({ veredict: 'TLE', output: '' });
                } else if (code === 0) {
                    resolve({veredict: 'PENDING', output: output});
                } else {
                    reject({veredict: 'ERR', output: ''});
                }
            });
        });
    }

    async compileCpp(userCode) {
        await fs.promises.writeFile('./tmp/userCode.cpp', userCode, (err) => {
            if (err) {
              console.error('Erro ao criar arquivo: ', err);
              return null;
            }  
        });
        execSync(`g++ ./tmp/userCode.cpp -o ./tmp/userCode.exe`); 
    }

    async executeCpp(input, timeLimit) {
        return new Promise((resolve, reject) => {
            const run = spawn('./tmp/userCode.exe', null, {timeout: timeLimit});

            let output = '';
            let runError = '';

            // Captura a saída
            run.stdout.on('data', (data) => output += data.toString());
            run.stderr.on('data', (data) => runError += data.toString());

            run.on('error', (error) => {
                console.error("Erro ao executar:", error);
                reject(null);
            });

            run.on('close', (code, signal) => {
                if (signal === 'SIGTERM') {
                    resolve({ veredict: 'TLE', output: '' });
                } else if (code === 0) {
                    resolve({veredict: 'PENDING', output: output});
                } else {
                    reject({veredict: 'ERR', output: ''});
                }
            });

            // **Enviar entrada após configurar os listeners**
            run.stdin.write(input + '\n'); 
            run.stdin.end();
        });

    }

}