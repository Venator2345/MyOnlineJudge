import SyntaxAnalyser6502 from "./SyntaxAnalyser6502";

export default class Asm6502 {

    //registradores
    #pc; // 16 bits
    #x; // 8 bits
    #y; // 8 bits
    #s; // 8 bits
    #sp; // 8 bits - endereços 0x100 a 0x1ff
    #a; // 8 bits

    //memória
    #ram

    /*
    7  bit  0
    ---- ----
    NV1B DIZC
    |||| ||||
    |||| |||+- Carry
    |||| ||+-- Zero
    |||| |+--- Interrupt Disable
    |||| +---- Decimal
    |||+------ (No CPU effect; see: the B flag)
    ||+------- (No CPU effect; always pushed as 1)
    |+-------- Overflow
    +--------- Negative
    */

    convertNumber(operand) {
        let convertedNumber;
        if(operand[1] == '$') {
            convertedNumber = Number('0x' + operand.subtring(1,operand.length))
        }
        else if(operand[1] == '%') {
            convertedNumber = Number('0b' + operand.subtring(1,operand.length))
        }
        else {
            convertedNumber = Number(operand.subtring(1,operand.length))
        }
        return convertedNumber;
    }

    executeInstructions(line) {
        let operand, result, endCode;

        endCode = undefined;

        switch(line[0]) {
            case 'lda': 
            case 'ldx':
            case 'ldy':
                operand = line[1]; 
                if(operand[0] == '#') {
                    //endereçamento imediato
                    result = this.convertNumber(operand);
                }
                else {
                    if(line.length === 2) {
                        //endereçamento direto
                        result = this.#ram[this.convertNumber(operand)];
                    }
                    else {
                        //endereçamento com offset por registrador
                        if(line[2] === 'x')
                            result = this.#ram[this.convertNumber(operand) + this.#x];
                        else
                            result = this.#ram[this.convertNumber(operand) + this.#y];
                    }
                }
                if(line[0][2] === 'a')
                    this.#a = result;
                else if(line[0][2] === 'x')
                    this.#x = result;
                else
                    this.#y = result;

                if(result > 255)
                    endCode = 1; // Erro: número muito grande!
            break;
            case 'sta':
            case 'stx':
            case 'sty':
                operand = line[1]; 
                
                if(line.length === 2) {
                    //endereçamento direto
                    result = this.convertNumber(operand);
                }
                else {
                    //endereçamento com offset por registrador
                    if(line[2] === 'x')
                        result = this.convertNumber(operand) + this.#x;
                    else
                        result = this.convertNumber(operand) + this.#y;
                }
                
                if(line[0][2] === 'a')
                    this.#ram[result] = this.#a;
                else if(line[0][2] === 'x')
                    this.#ram[result] = this.#x;
                else
                    this.#ram[result] = this.#y;

                if(result > 8191)
                    endCode = 1; // Erro: número passa do limite de memória: 0x1fff!
            break;
            case 'tax':
                this.#x = this.#a;
            break;
            case 'tay':
                this.#y = this.#a;
            break;
            case 'txa':
                this.#a = this.#x;
            break;
            case 'tya':
                this.#a = this.#y;
            break;
            case 'tsx':
                this.#sp = this.#x;
            break;
            case 'txs':
                this.#x = this.#sp;
            break;
            case 'pha':
                this.#ram[256 + this.#pc] = this.#a;
                this.#pc--;
                if(this.#pc < 0)
                    this.#pc = 255;
            break;
            case 'pla':
                this.#a = this.#ram[256 + this.#pc];
                this.#pc++;
                if(this.#pc > 255)
                    this.#pc = 0;
            break;
            case 'and':
            case 'ora':
            case 'eor':
                operand = line[1]; 
                if(operand[0] == '#') {
                    //endereçamento imediato
                    result = this.convertNumber(operand);
                }
                else {
                    if(line.length === 2) {
                        //endereçamento direto
                        result = this.#ram[this.convertNumber(operand)];
                    }
                    else {
                        //endereçamento com offset por registrador
                        if(line[2] === 'x')
                            result = this.#ram[this.convertNumber(operand) + this.#x];
                        else
                            result = this.#ram[this.convertNumber(operand) + this.#y];
                    }
                }
                if(line[0] === 'and')
                    this.#a &= result;
                else if(line[0] === 'ora')
                    this.#a |= result;
                else
                    this.#a ^= result;

                this.#s[0] = (this.#a > 127)? 1 : 0; // N
                this.#s[6] = (this.#a === 0)? 1 : 0; // Z
            break;
            case 'adc':
            case 'sbc':
                
            break;
            case 'cmp':
            case 'cpx':
            case 'cpy':

            break;
            case 'rti':
                endCode = 0;
            break;
        }

        return endCode;
    }

    executeCode(input, code) {
        let output = '', endCode = null;

        // preparar registradores e simular "lixo de memória"
        this.#x = Math.floor(Math.random() * 255);
        this.#y = Math.floor(Math.random() * 255);
        this.#a = Math.floor(Math.random() * 255);
        this.#sp = Math.floor(Math.random() * 255);
        this.#s = [0,0,1,0,0,0,0,0]; // N, V, 1, B, D, I, Z, C

        code = code.toLowerCase();
        code = code.trim();
        code = code.replace(/\s+/g,' ');

        const syntaxAnalyser6502 = new SyntaxAnalyser6502();
        syntaxAnalyser6502.verifyCode(code);

        // ###################### ATENÇÃO: RTI SERÁ USADO PARA ENCERRAR O PROGRAMA! ################
        lines = code.split('\n');
        for(this.#pc = 0; endCode === undefined; this.#pc++) {
            line = lines[this.#pc].replace(',',' ');
            line = lines[this.#pc].split(' ');

            endCode = this.executeInstructions(line);

        }


    }



}