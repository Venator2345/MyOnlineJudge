import LexicalAnalyser6502 from "./LexicalAnalyser6502.js";

export default class SyntaxAnalyser6502 {
    #availableInstructions;

    constructor() {
        

    }

    verifyOperand(operand, expectedOperand, line) {
        let correct = true;

        //se tiver mais de uma vírgula, está errado
        let colonCounter;
        for(let i = 0; i < line.length; i++) {
            correct &= !line[i].includes(',');
        }

        if(correct) {
            if(operand[0] === '#') {
                correct = expectedOperand.includes('CONST');
            }
            else if(!Number.isInteger(parseInt(operand[0])) && operand[0] !== '$' && operand[0] !== '%') {
                correct = expectedOperand.includes('LABEL');
            }
            else {
                if(expectedOperand.includes('ADDR') && line.length === 2)
                    correct = true;
                else if(expectedOperand.includes('OFFSET') && line.length === 3) {
                    if(line[2] == 'x' || line[2] == 'y')
                        correct = true;
                    else
                        correct = false;
                }
                else {
                    correct = false;
                }
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

                // a primeira palavra deve ser uma instrução da linguagem ou uma label
                expectedOperand = this.#availableInstructions.get(line[0]);
                correct = expectedOperand !== undefined || line[0][line[0].length - 1] === ':';

                if(line[0][line[0].length - 1] === ':') {
                    correct = line.length === 1;
                }
                else if(expectedOperand.includes('NONE')) {
                    correct = line.length === 1;
                }
                else {                    
                    correct = this.verifyOperand(line[1], expectedOperand,line);  
                }

                
            }
        }

        return correct;
    }

}