class NotImpletementedError extends Error {
    constructor(message) {
        super(message);
        this.name = "NotImplementedError";
      }
}

class DecimalError extends Error {
    constructor(message) {
        super(message);
        this.name = "DecimalError";
      }
}

class UndefinedError extends Error {
    constructor(message) {
        super(`Property is either undefined or null: ${message}`);
        this.name = "UndefinedError";
      }
}

window.NotImpletementedError = NotImpletementedError;