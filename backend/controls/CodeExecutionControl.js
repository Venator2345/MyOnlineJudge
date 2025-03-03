import TestCaseDAO from "../daos/TestCaseDAO.js";
import db from '../db/database.js';
import { spawn, exec, execSync } from 'child_process';
import vm from 'vm';
import fs from 'fs';
import { stdout } from "process";

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

            if(language === 'cpp')
                await this.compileCpp(userCode);

            for(let i = 0; i < testCases.length; i++) {

                switch(language) {
                    case 'js':
                        outputString = this.executeJavascript(testCases[i].input, userCode);
                    break;
                    case 'python':
                        outputString = await this.executePython(testCases[i].input, userCode);
                        outputString = outputString.replaceAll('\r','');
                    break;
                    case 'cpp':
                        outputString = await this.executeCpp(testCases[i].input, userCode);
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

    executeJavascript(testCase, userCode) {
        try {
            // Cria um array pra simular linhas de entrada
            const inputLines = testCase.split('\n');
            let inputIndex = 0;
            
            // Array pra capturar as saídas
            const outputLines = [];
            
            // Contexto isolado com funções personalizadas
            const sandbox = {
                input: () => {
                    if (inputIndex < inputLines.length) {
                        return inputLines[inputIndex++];
                    }
                    return ''; // Retorna vazio se acabar
                },
                print: (message) => {
                    outputLines.push(String(message));
                }
            };
            
            // Junta o código do usuário com um wrapper pra chamar a função principal
            const wrappedCode = `
                ${userCode}
            `;
            
            // Executa o código no contexto do sandbox
            vm.runInNewContext(wrappedCode, sandbox);
            
            // Retorna a saída como string com \n
            return outputLines.join('');
        } catch (error) {
            console.error(error);
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

    async compileCpp(userCode) {
        await fs.promises.writeFile('./tmp/userCode.cpp', userCode, (err) => {
            if (err) {
              console.error('Erro ao criar arquivo: ', err);
              return null;
            }  
        });
        execSync(`g++ ./tmp/userCode.cpp -o ./tmp/userCode.exe`); 
    }

    async executeCpp(input) {
        return new Promise((resolve, reject) => {
            const run = spawn('./tmp/userCode.exe');

            let output = '';
            let runError = '';

            // Captura a saída
            run.stdout.on('data', (data) => output += data.toString());
            run.stderr.on('data', (data) => runError += data.toString());

            run.on('error', (error) => {
                console.error("Erro ao executar:", error);
                reject(null);
            });

            run.on('close', (code) => {
                if (code === 0) {
                    resolve(output);
                } else {
                    console.error("Erro na execução:", runError);
                    reject(null);
                }
            });

            // **Enviar entrada após configurar os listeners**
            run.stdin.write(input + '\n'); 
            run.stdin.end();
        });

    }

}