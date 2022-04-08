class DataNotFoundError extends Error {
  constructor(message) {
    super(message);
    super.name = "ENODATA";
  }
}

module.exports = DataNotFoundError;
