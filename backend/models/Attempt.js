export default class Attempt {
    #id;
    #result;
    #userCode;
    #userId;
    #exerciseId;
    #language

    constructor(id, result, userCode, userId, exerciseId, language) {
        this.#id = id;
        this.#result = result;
        this.#userCode = userCode;
        this.#userId = userId;
        this.#exerciseId = exerciseId;
        this.#language = language;
    }

    get id() { 
        return this.#id; 
    }

    get result() { 
        return this.#result; 
    }

    get userCode() { 
        return this.#userCode; 
    }

    get userId() { 
        return this.#userId; 
    }

    get exerciseId() { 
        return this.#exerciseId; 
    }

    get language() { 
        return this.#language; 
    }

    set id(id) { 
        if (id > 0) 
            this.#id = id; 
    }

    set result(result) { 
        this.#result = result; 
    }

    set userCode(userCode) { 
        this.#userCode = userCode; 
    }

    set userId(userId) { 
        if (userId > 0) 
            this.#userId = userId; 
    }
    
    set exerciseId(exerciseId) { 
        if (exerciseId > 0) 
            this.#exerciseId = exerciseId; 
    }

    set language(language) { 
        this.#language = language; 
    }
}