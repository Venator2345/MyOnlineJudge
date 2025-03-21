import LexicalAnalyser6502 from "./LexicalAnalyser6502.js";

export default class SyntaxAnalyser6502 {
    #availableInstructions;

    constructor() {
        

    }

    verifyOperand(operand, expectedOperand, line) {
        let correct = true;
        line = line.replace(',',' ');

        //se tiver mais de uma vírgula, está errado
        correct = !line.includes(',');

        if(operand[0] === '#') {
            correct = expectedOperand.includes('CONST');
        }
        else if(!Number.isInteger(parseInt(token[index]))) {
            correct = expectedOperand.includes('LABEL');
        }
        else {
            if(expectedOperand.includes('ADDR') && line.length === 2)
                correct = true;
            else if(expectedOperand.includes('OFFSET') && line.length === 3) {
                if(line[3] == 'x' || line[3] == 'y')
                    correct = true;
                else
                    correct = false;
            }
            else {
                correct = false;
            }
        }

        return correct;
    }

    verifyCode(code) {
        let correct, expectedOperand;
        const lexicalAnalyser6502 = new LexicalAnalyser6502();

        this.#availableInstructions = lexicalAnalyser6502.availableInstructions;
        correct = lexicalAnalyser6502.verifyCode(code);

        if(correct) {
            const lines = code;
            for(let i = 0; i < lines.length && correct; i++) {
                const line = lines[i].split(' ');

                // a primeira palavra deve ser uma instrução da linguagem
                expectedOperand = this.#availableInstructions.get(line[0]);
                correct = expectedOperand !== undefined;

                if(expectedOperand == []) {
                    correct = line.length === 1;
                }
                else {
                    for(let j = 1; j < line.length && correct; j++) {
                        correct = verifyOperand(line[j], expectedOperand,line);
                    }   
                }

                
            }
        }

        return correct;
    }

}