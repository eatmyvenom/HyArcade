class DatabaseResponseError extends Error {
  constructor(message) {
    super(message);
    super.name = "EDBRES";
  }
}

module.exports = DatabaseResponseError;
