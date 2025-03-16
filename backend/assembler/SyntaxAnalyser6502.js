import LexicalAnalyser6502 from "./LexicalAnalyser6502";

export default class SyntaxAnalyser6502 {
    #availableInstructions;

    constructor() {
        

    }

    verifyCode(code) {
        const lexicalAnalyser6502 = new LexicalAnalyser6502();
        this.#availableInstructions = lexicalAnalyser6502.availableInstructions;
    }

}