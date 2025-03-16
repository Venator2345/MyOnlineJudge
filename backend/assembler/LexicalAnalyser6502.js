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
        this.#availableInstructions.set('tax',[]);
        this.#availableInstructions.set('tay',[]);
        this.#availableInstructions.set('txa',[]);
        this.#availableInstructions.set('tya',[]);

        // operações com a pilha
        this.#availableInstructions.set('tsx',[]);
        this.#availableInstructions.set('txs',[]);
        this.#availableInstructions.set('pha',[]);
        this.#availableInstructions.set('php',[]);
        this.#availableInstructions.set('pla',[]);
        this.#availableInstructions.set('plp',[]);

        // operações lógicas
        this.#availableInstructions.set('bit',['ADDR']);
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
        this.#availableInstructions.set('inx',[]);
        this.#availableInstructions.set('iny',[]);
        this.#availableInstructions.set('dex',[]);
        this.#availableInstructions.set('dey',[]);
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
        this.#availableInstructions.set('rts',[]);

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
        this.#availableInstructions.set('clc',[]);
        this.#availableInstructions.set('cld',[]);
        this.#availableInstructions.set('cli',[]);
        this.#availableInstructions.set('clv',[]);
        this.#availableInstructions.set('sec',[]);
        this.#availableInstructions.set('sed',[]);
        this.#availableInstructions.set('sei',[]);

        // outras funções
        this.#availableInstructions.set('brk',[]);
        this.#availableInstructions.set('nop',[]);
        this.#availableInstructions.set('rti',[]);
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
                const regex = /^[A-Fa-f0-9_]+$/;
                const substr = token.substring(index, token.length() - index);
                correct = regex.test(substr);
            }
            else if(token[index]==='%') {
                // binário
                const regex = /^[01_]+$/;
                const substr = token.substring(index, token.length() - index);
                correct = regex.test(substr);
            }
            else if(Number.isInteger(parseInt(token[index]))) {
                // decimal 
                const regex = /^[0-9_]+$/;
                const substr = token.substring(index, token.length() - index);
                correct = regex.test(substr);
            }
            else {
                // pode ser nome de label
                correct = true;
            }
        }

        return correct;
    }

    verifyCode(code) {
        let correct = true;
        lines = code.split('\n');
        for(let i = 0; i < lines.length && correct; i++) {
            line = lines[i].split(' ');
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