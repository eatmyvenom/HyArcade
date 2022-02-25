class MissingFieldError extends Error {
  neededFields = [];
  constructor(message, neededFields = []) {
    super(message);
    super.name = "EMISSINGFIELD";
    this.neededFields = neededFields;
  }
}

module.exports = MissingFieldError;
