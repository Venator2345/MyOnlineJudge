import SyntaxAnalyser6502 from "./SyntaxAnalyser6502.js";

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

    //labels
    #availableLabels;

    //stdout
    #output

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
        let convertedNumber, index = 0;

        if(operand[0] === '#')
            index++;

        if(operand[index] == '$') {
            const teste = operand.substring(2,operand.length);
            index++;
            convertedNumber = Number('0x' + operand.substring(index,operand.length))
        }
        else if(operand[index] == '%') {
            index++;
            convertedNumber = Number('0b' + operand.substring(index,operand.length))
        }
        else {
            convertedNumber = Number(operand.substring(index,operand.length))
        }
        return convertedNumber;
    }

    getResult(line) {
        let result;
        const operand = line[1]; 
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
        return result;
    }

    executeInstructions(line, input) {
        let operand, result, endCode, oldAccumulatorValue, bit7;

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

                if(operand[0] !== '#' && this.convertNumber(operand) === 8192) {
                    result = parseInt(input[0]);
                    input = input.shift();
                }

                if(line[0][2] === 'a') {
                    this.#a = result;
                    this.#s[0] = (this.#a > 127)? 1 : 0; // N
                    this.#s[6] = (this.#a === 0)? 1 : 0; // Z
                }
                else if(line[0][2] === 'x') {
                    this.#x = result;
                    this.#s[0] = (this.#x > 127)? 1 : 0; // N
                    this.#s[6] = (this.#x === 0)? 1 : 0; // Z
                }
                else {
                    this.#y = result;
                    this.#s[0] = (this.#y > 127)? 1 : 0; // N
                    this.#s[6] = (this.#y === 0)? 1 : 0; // Z
                }

                if(operand[0] === '#' && result > 255)
                    endCode = 1; // Erro: número muito grande!
                else if(result > 8193) {
                    endCode = 1;
                }
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

                if(result === 8193) {
                    this.#output += String.fromCharCode(this.#ram[result]);
                }

                if(result > 8193)
                    endCode = 1; // Erro: número passa do limite de memória: 0x2001!
            break;
            case 'tax':
                this.#x = this.#a;
                this.#s[0] = (this.#x > 127)? 1 : 0; // N
                this.#s[6] = (this.#x === 0)? 1 : 0; // Z
            break;
            case 'tay':
                this.#y = this.#a;
                this.#s[0] = (this.#y > 127)? 1 : 0; // N
                this.#s[6] = (this.#y === 0)? 1 : 0; // Z
            break;
            case 'txa':
                this.#a = this.#x;
                this.#s[0] = (this.#a > 127)? 1 : 0; // N
                this.#s[6] = (this.#a === 0)? 1 : 0; // Z
            break;
            case 'tya':
                this.#a = this.#y;
                this.#s[0] = (this.#a > 127)? 1 : 0; // N
                this.#s[6] = (this.#a === 0)? 1 : 0; // Z
            break;
            case 'txs':
                this.#sp = this.#x;
            break;
            case 'tsx':
                this.#x = this.#sp;
                this.#s[0] = (this.#x > 127)? 1 : 0; // N
                this.#s[6] = (this.#x === 0)? 1 : 0; // Z
            break;
            case 'pha':
                this.#ram[256 + this.#sp] = this.#a;
                this.#sp--;
                if(this.#sp < 0)
                    this.#sp = 255;
            break;
            case 'pla':
                this.#a = this.#ram[256 + this.#sp];
                this.#sp++;
                if(this.#sp > 255)
                    this.#sp = 0;
            break;
            case 'and':
            case 'ora':
            case 'eor':
                result = this.getResult(line);
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
            case 'cmp':
            case 'cpx':
            case 'cpy':
                result = this.getResult(line);
                oldAccumulatorValue = this.#a;
                if(line[0] === 'adc') {
                    this.#a += result;
                    this.#s[0] = (this.#a > 127)? 1 : 0; // N
                    this.#s[1] = (oldAccumulatorValue <= 127 && result <= 127 && this.#a > 127)? 1 : 0; // V
                    this.#s[6] = (this.#a === 0)? 1 : 0; // Z
                    this.#s[7] = (this.#a > 255)? 1 : 0; // C

                    if(this.#a > 255)
                        this.#a %= 255;
                }
                else if(line[0] === 'sbc') {
                    this.#a += result;
                    this.#s[0] = (this.#a > 127)? 1 : 0; // N
                    this.#s[1] = (oldAccumulatorValue <= 127 && result <= 127 && this.#a > 127)? 1 : 0; // V
                    this.#s[6] = (this.#a === 0)? 1 : 0; // Z
                    this.#s[7] = (this.#a < 255)? 1 : 0; // C

                    if(this.#a < 0)
                        this.#a = 255 - (this.#a * -1);
                }
                else if(line[0] === 'cpx') {
                    this.#s[0] = (result > 127)? 1 : 0; // N
                    this.#s[6] = (this.#x === result)? 1 : 0; // Z
                    this.#s[7] = (this.#x > result)? 1 : 0; // C
                }
                else if(line[0] === 'cpy') {
                    this.#s[0] = (result > 127)? 1 : 0; // N
                    this.#s[6] = (this.#y === result)? 1 : 0; // Z
                    this.#s[7] = (this.#y > result)? 1 : 0; // C
                }
                else {
                    this.#s[0] = (result > 127)? 1 : 0; // N
                    this.#s[6] = (this.#a === result)? 1 : 0; // Z
                    this.#s[7] = (this.#a > result)? 1 : 0; // C
                }
            break;
            case 'inx':
                this.#x++;
                this.#s[0] = (this.#x > 127)? 1 : 0; // N
                this.#s[6] = (this.#x === 0)? 1 : 0; // Z
            break;
            case 'iny':
                this.#y++;
                this.#s[0] = (this.#y > 127)? 1 : 0; // N
                this.#s[6] = (this.#y === 0)? 1 : 0; // Z
            break;
            case 'dex':
                this.#x--;
                this.#s[0] = (this.#x > 127)? 1 : 0; // N
                this.#s[6] = (this.#x === 0)? 1 : 0; // Z
            break;
            case 'dey':
                this.#y--;
                this.#s[0] = (this.#y > 127)? 1 : 0; // N
                this.#s[6] = (this.#y === 0)? 1 : 0; // Z
            break;
            case 'inc':
                operand = line[1]; 
                result = this.#ram[this.convertNumber(operand)];
                this.#ram[result]++;
                this.#s[0] = (this.#ram[result] > 127)? 1 : 0; // N
                this.#s[6] = (this.#ram[result] === 0)? 1 : 0; // Z
            break;
            case 'dec':
                operand = line[1]; 
                result = this.#ram[this.convertNumber(operand)];
                this.#ram[result]--;
                this.#s[0] = (this.#ram[result] > 127)? 1 : 0; // N
                this.#s[6] = (this.#ram[result] === 0)? 1 : 0; // Z
            break;
            case 'asl':
            case 'lsr':
            case 'ror':
            case 'rol':
                result = this.getResult(line);
                bit7 = result & 128 === 128? 1 : 0;
                bit0 = result & 1;
                if(line[0] === 'asl') {
                    this.#a = result << 1;
                    this.#s[7] = bit7; // C
                }
                else if(line[0] === 'lsr') {
                    this.#a = result >> 1;
                    this.#s[7] = bit0; // C
                }
                else if(line[0] === 'rol') {
                    this.#a = result << 1;
                    // this.#a &= 254;
                    this.#a += this.#s[7];
                    this.#s[7] = bit7; // C
                }
                else {
                    this.#a = result >> 1;
                    this.#a += this.#s[7] * 128;
                    this.#s[7] = bit0; // C
                } 

            break;
            case 'jmp':
                this.#pc = this.#availableLabels.get(line[1]);
            break;
            case 'jsr':
                this.#ram[256 + this.#sp] = this.#pc & 255; // precisa separar o endereço em duas partes
                this.#sp--;
                if(this.#sp < 0)
                    this.#sp = 255;
                this.#ram[256 + this.#sp] = this.#pc & 65280; 
                this.#sp--;
                if(this.#sp < 0)
                    this.#sp = 255;
                this.#pc = this.#availableLabels.get(line[1]);
            break;
            case 'rts':
                result = this.#ram[256 + this.#sp] >> 8;
                this.#sp++;
                if(this.#sp > 255)
                    this.#sp = 0;
                result += this.#ram[256 + this.#sp];
                this.#sp++;
                if(this.#sp > 255)
                    this.#sp = 0;
                this.#pc = result;
            break;
            case 'bcc':
                if(this.#s[7] === 0)
                    this.#pc = this.#availableLabels.get(line[1]);
                if(this.#pc === undefined)
                    endCode = 1;
            break;
            case 'bcs':
                if(this.#s[7] === 1)
                    this.#pc = this.#availableLabels.get(line[1]);
                if(this.#pc === undefined)
                    endCode = 1;
            break;
            case 'beq':
                if(this.#s[6] === 1)
                    this.#pc = this.#availableLabels.get(line[1]);
                if(this.#pc === undefined)
                    endCode = 1;
            break;
            case 'bne':
                if(this.#s[6] === 0)
                    this.#pc = this.#availableLabels.get(line[1]);
                if(this.#pc === undefined)
                    endCode = 1;
            break;
            case 'bmi':
                if(this.#s[0] === 1)
                    this.#pc = this.#availableLabels.get(line[1]);
                if(this.#pc === undefined)
                    endCode = 1;
            break;
            case 'bpl':
                if(this.#s[0] === 0)
                    this.#pc = this.#availableLabels.get(line[1]);
                if(this.#pc === undefined)
                    endCode = 1;
            break;
            case 'bvc':
                if(this.#s[1] === 0)
                    this.#pc = this.#availableLabels.get(line[1]);
                if(this.#pc === undefined)
                    endCode = 1;
            break;
            case 'bvs':
                if(this.#s[1] === 1)
                    this.#pc = this.#availableLabels.get(line[1]);
                if(this.#pc === undefined)
                    endCode = 1;
            break;
            case 'clc':
                this.#s[7] = 0;
            break;
            case 'cld':
                this.#s[4] = 0;
            break;
            case 'cli':
                this.#s[5] = 0;
            break;
            case 'clv':
                this.#s[2] = 0;
            break;
            case 'sec':
                this.#s[7] = 1;
            break;
            case 'sed':
                this.#s[4] = 1;
            break;
            case 'sei':
                this.#s[5] = 1;
            break;
            case 'brk':
            case 'nop':
            break;
            case 'rti':
                endCode = 0;
            break;
            
        }

        return endCode;
    }

    executeCode(input, code, timeLimit) {
        let endCode = undefined;
        input = input.split('\n');
        this.#output = '';

        // preparar registradores e simular "lixo de memória"
        this.#x = Math.floor(Math.random() * 255);
        this.#y = Math.floor(Math.random() * 255);
        this.#a = Math.floor(Math.random() * 255);
        this.#sp = Math.floor(Math.random() * 255);
        this.#s = [0,0,1,0,0,0,0,0]; // N, V, 1, B, D, I, Z, C

        this.#availableLabels = new Map();

        this.#ram = [];
        for(let i = 0; i <= 9000; i++) {
            this.#ram[i] = Math.floor(Math.random() * 255);
        }

        code = code.toLowerCase();
        code = code.split('\n');
        for(let i = 0; i < code.length; i++) {
            code[i] = code[i].trim();
            code[i] = code[i].replace(',',' ');
            code[i] = code[i].replaceAll(/\s+/g,' ');
        }

        // remover linhas vazias
        let noBlankLineCode = [];
        for(let i = 0; i < code.length; i++) {
            if(code[i] !== '')
                noBlankLineCode.push(code[i]);
        }
        code = noBlankLineCode;

        const syntaxAnalyser6502 = new SyntaxAnalyser6502();
        if(!syntaxAnalyser6502.verifyCode(code))
            endCode = 1;

        // verificar labels
        for(let i = 0; i < code.length; i++) {
            
            const line = code[i].split(' ');
            if(line[0][line[0].length - 1] === ':')
                this.#availableLabels.set(line[0].substring(0,line[0].length - 1), i);


        }


        let startTime = performance.now();

        // ###################### ATENÇÃO: RTI SERÁ USADO PARA ENCERRAR O PROGRAMA! ################
        const lines = code;
        for(this.#pc = 0; endCode === undefined && performance.now() - startTime <= timeLimit; this.#pc++) {
            const line = lines[this.#pc].split(' ');
            endCode = this.executeInstructions(line, input);
        }

        if(performance.now() - startTime > timeLimit)
            return {veredict: 'TLE', output: this.#output};
        if(endCode === 0)
            return {veredict: 'PENDING', output: this.#output};
        return {veredict: 'ERR', output: this.#output};
    }



}