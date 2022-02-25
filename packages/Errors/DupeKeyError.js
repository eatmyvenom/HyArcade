class DupeKeyError extends Error {
  constructor(message) {
    super(message);
    super.name = "EDUPEKEY";
  }
}

module.exports = DupeKeyError;
