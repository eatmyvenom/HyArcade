class RequestTimeoutError extends Error {
  constructor(message) {
    super(message);
  }
}

module.exports = RequestTimeoutError;
