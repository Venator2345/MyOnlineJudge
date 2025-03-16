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

    executeCode(input, output, code) {
        // preparar registradores e simular "lixo de memória"
        this.#x = Math.floor(Math.random() * 255);
        this.#y = Math.floor(Math.random() * 255);
        this.#a = Math.floor(Math.random() * 255);
        this.#sp = Math.floor(Math.random() * 255);

    }



}