export default class TestCase {
    #id;
    #input;
    #expectedOutput;
    #exerciseId;

    constructor(id, input, expectedOutput, exerciseId) {
        this.#id = id;
        this.#input = input;
        this.#expectedOutput = expectedOutput;
        this.#exerciseId = exerciseId;
    }

    get id() { 
        return this.#id; 
    }

    get input() { 
        return this.#input; 
    }

    get expectedOutput() { 
        return this.#expectedOutput; 
    }

    get exerciseId() { 
        return this.#exerciseId; 
    }

    set id(id) { 
        if (id > 0) 
            this.#id = id; 
    }

    set input(input) { 
        this.#input = input; 
    }
    set expectedOutput(expectedOutput) { 
        this.#expectedOutput = expectedOutput; 
    }
    set exerciseId(exerciseId) { 
        if (exerciseId > 0) 
            this.#exerciseId = exerciseId; 
    }
}