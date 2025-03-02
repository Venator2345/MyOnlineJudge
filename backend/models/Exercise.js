export default class Exercise {
    #id;
    #title;
    #description;
    #exampleInput;
    #exampleOutput;
    #exampleInput2;
    #exampleOutput2;

    constructor(id, title, description, exampleInput, exampleOutput, exampleInput2 = "", exampleOutput2 = "") {
        this.#id = id;
        this.#title = title;
        this.#description = description;
        this.#exampleInput = exampleInput;
        this.#exampleOutput = exampleOutput;
        this.#exampleInput2 = exampleInput2;
        this.#exampleOutput2 = exampleOutput2;
    }

    get id() { 
        return this.#id; 
    }

    get title() { 
        return this.#title; 
    }

    get description() { 
        return this.#description; 
    }

    get exampleInput() { 
        return this.#exampleInput; 
    }

    get exampleOutput() { 
        return this.#exampleOutput; 
    }

    get exampleInput2() { 
        return this.#exampleInput2; 
    }

    get exampleOutput2() { 
        return this.#exampleOutput2; 
    }

    set id(id) { 
        if (id > 0) 
            this.#id = id; 
    }

    set title(title) { 
        this.#title = title; 
    }

    set description(description) { 
        this.#description = description; 
    }

    set exampleInput(exampleInput) { 
        this.#exampleInput = exampleInput; 
    }

    set exampleOutput(exampleOutput) { 
        this.#exampleOutput = exampleOutput; 
    }

    set exampleInput2(exampleInput2) { 
        this.#exampleInput2 = exampleInput2; 
    }
    
    set exampleOutput2(exampleOutput2) { 
        this.#exampleOutput2 = exampleOutput2; 
    }
}