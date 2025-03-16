import LexicalAnalyser6502 from "./LexicalAnalyser6502";

export default class SyntaxAnalyser6502 {
    #availableInstructions;

    constructor() {
        

    }

    verifyOperand(operand, expectedOperand) {
        let correct = true;

        if(operand[0] === '#') {
            correct = expectedOperand.includes('CONST');
        }
        else if(!Number.isInteger(parseInt(token[index]))) {
            correct = expectedOperand.includes('LABEL');
        }
        else {
            
        }

        return correct;
    }

    verifyCode(code) {
        let correct, expectedOperand;
        const lexicalAnalyser6502 = new LexicalAnalyser6502();

        code = code.trim();
        code = code.replace(/\s+/g,' ');
        this.#availableInstructions = lexicalAnalyser6502.availableInstructions;
        correct = lexicalAnalyser6502.verifyCode(code);

        if(correct) {
            lines = code.split('\n');
            for(let i = 0; i < lines.length && correct; i++) {
                line = lines[i].split(' ');

                // a primeira palavra deve ser uma instrução da linguagem
                expectedOperand = this.#availableInstructions.get(line[0]);
                correct = expectedOperand !== undefined;

                if(expectedOperand == []) {
                    correct = line.length === 1;
                }
                else {
                    for(let j = 1; j < line.length && correct; j++) {
                        correct = verifyOperand(line[j], expectedOperand);
                    }   
                }

                
            }
        }

        return correct;
    }

}