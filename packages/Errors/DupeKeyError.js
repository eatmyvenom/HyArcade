class DupeKeyError extends Error {
  constructor(message) {
    super(message);
  }
}

module.exports = DupeKeyError;
