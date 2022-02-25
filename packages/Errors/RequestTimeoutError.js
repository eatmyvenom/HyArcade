class RequestTimeoutError extends Error {
  constructor(message) {
    super(message);
    super.name = "EREQTIMEOUT";
  }
}

module.exports = RequestTimeoutError;
