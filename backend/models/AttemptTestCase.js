export default class AttemptTestCase {
    #id;
    #attemptId;
    #testCaseId;
    #userOutput;

    constructor(id, attemptId, testCaseId, userOutput) {
        this.#id = id;
        this.#attemptId = attemptId;
        this.#testCaseId = testCaseId;
        this.#userOutput = userOutput;
    }

    get id() {
        return this.#id;
    }

    get attemptId() {
        return this.#attemptId;
    }

    get testCaseId() {
        return this.#testCaseId;
    }

    get userOutput() {
        return this.#userOutput;
    }

    set id(id) {
        if (id > 0)
            this.#id = id;
    }

    set attemptId(attemptId) {
        if (attemptId > 0)
            this.#attemptId = attemptId;
    }

    set testCaseId(testCaseId) {
        if (testCaseId > 0)
            this.#testCaseId = testCaseId;
    }

    set userOutput(userOutput) {
        this.#userOutput = userOutput;
    }
}