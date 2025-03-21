export default class LexicalAnalyser6502 {
    #availableInstructions;
    

    constructor() {
        this.#availableInstructions = new Map();

        // CONST - endereçamento imediato
        // ADDR - endereçamento direto
        // OFFSET - endereçamento com offset por registrador

        // operações load/store
        this.#availableInstructions.set('lda',['CONST','ADDR','OFFSET']);
        this.#availableInstructions.set('sta',['ADDR','OFFSET']);
        this.#availableInstructions.set('ldx',['CONST','ADDR']);
        this.#availableInstructions.set('stx',['ADDR','OFFSET']);
        this.#availableInstructions.set('ldy',['CONST','ADDR']);
        this.#availableInstructions.set('sty',['ADDR','OFFSET']);

        // transferências entre registradores
        this.#availableInstructions.set('tax',['NONE']);
        this.#availableInstructions.set('tay',['NONE']);
        this.#availableInstructions.set('txa',['NONE']);
        this.#availableInstructions.set('tya',['NONE']);

        // operações com a pilha
        this.#availableInstructions.set('tsx',['NONE']);
        this.#availableInstructions.set('txs',['NONE']);
        this.#availableInstructions.set('pha',['NONE']);
        this.#availableInstructions.set('php',['NONE']); // NÃO IMPLEMENTADO AINDA
        this.#availableInstructions.set('pla',['NONE']);
        this.#availableInstructions.set('plp',['NONE']); // NÃO IMPLEMENTADO AINDA

        // operações lógicas
        this.#availableInstructions.set('bit',['ADDR']); // NÃO IMPLEMENTADO AINDA
        this.#availableInstructions.set('and',['CONST','ADDR','OFFSET']);
        this.#availableInstructions.set('ora',['CONST','ADDR','OFFSET']);
        this.#availableInstructions.set('eor',['CONST','ADDR','OFFSET']);

        // operações aritméticas
        this.#availableInstructions.set('adc',['CONST','ADDR','OFFSET']);
        this.#availableInstructions.set('sbc',['CONST','ADDR','OFFSET']);
        this.#availableInstructions.set('cmp',['CONST','ADDR','OFFSET']);
        this.#availableInstructions.set('cpx',['CONST','ADDR']);
        this.#availableInstructions.set('cpy',['CONST','ADDR']);

        // incremento e decremento
        this.#availableInstructions.set('inx',['NONE']);
        this.#availableInstructions.set('iny',['NONE']);
        this.#availableInstructions.set('dex',['NONE']);
        this.#availableInstructions.set('dey',['NONE']);
        this.#availableInstructions.set('inc',['ADDR']);
        this.#availableInstructions.set('dec',['ADDR']);

        // deslocamentos (shifts)
        this.#availableInstructions.set('asl',['ADDR','OFFSET','ACC']);
        this.#availableInstructions.set('lsr',['ADDR','OFFSET','ACC']);
        this.#availableInstructions.set('ror',['ADDR','OFFSET','ACC']);
        this.#availableInstructions.set('rol',['ADDR','OFFSET','ACC']);

        // saltos e chamadas
        this.#availableInstructions.set('jmp',['LABEL']);
        this.#availableInstructions.set('jsr',['LABEL']);
        this.#availableInstructions.set('rts',['NONE']);

        // branches
        this.#availableInstructions.set('bcc',['LABEL']);
        this.#availableInstructions.set('bcs',['LABEL']);
        this.#availableInstructions.set('beq',['LABEL']);
        this.#availableInstructions.set('bmi',['LABEL']);
        this.#availableInstructions.set('bne',['LABEL']);
        this.#availableInstructions.set('bpl',['LABEL']);
        this.#availableInstructions.set('bvc',['LABEL']);
        this.#availableInstructions.set('bvs',['LABEL']);

        // ações com registrador de status
        this.#availableInstructions.set('clc',['NONE']);
        this.#availableInstructions.set('cld',['NONE']);
        this.#availableInstructions.set('cli',['NONE']);
        this.#availableInstructions.set('clv',['NONE']);
        this.#availableInstructions.set('sec',['NONE']);
        this.#availableInstructions.set('sed',['NONE']);
        this.#availableInstructions.set('sei',['NONE']);

        // outras funções
        this.#availableInstructions.set('brk',['NONE']);
        this.#availableInstructions.set('nop',['NONE']);
        this.#availableInstructions.set('rti',['NONE']);
    }

    verifyToken(token) {
        let correct;
        // verificar se é palavra da linguagem
        correct = (this.#availableInstructions.get(token) !== undefined);

        // verificar se é um operando válido
        if(!correct) {
            let index = 0;
            if(token[0]==='#') {
                index++;
            }

            if(token[index]==='$') {
                // hexadecimal
                index++;
                const regex = /^[a-f0-9_]+$/;               
                const substr = token.substring(index, token.length);
                correct = regex.test(substr);
            }
            else if(token[index]==='%') {
                // binário
                index++;
                const regex = /^[01_]+$/;
                const substr = token.substring(index, token.length);
                correct = regex.test(substr);
            }
            else if(Number.isInteger(parseInt(token[index]))) {
                // decimal 
                const regex = /^[0-9_]+$/;
                const substr = token.substring(index, token.length);
                correct = regex.test(substr);
            }
            else if(token === 'x' || token === 'y' || token === 'a') {
                correct = true;
            }
            else {
                // pode ser nome de label
                correct = token[token.length - 1] === ':';
            }
        }

        return correct;
    }

    verifyCode(code) {
        let correct = true;
        const lines = code;
        for(let i = 0; i < lines.length && correct; i++) {
            const line = lines[i].split(' ');
            for(let j = 0; j < line.length && correct; j++) {
                correct = this.verifyToken(line[j]);
            }
        }
        return correct;
    }

    get availableInstructions() {
        return this.#availableInstructions;
    }
    
}