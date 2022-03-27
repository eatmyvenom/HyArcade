class HypixelResponseError extends Error {
  code = 200;
  constructor(message, code) {
    super(message);
    super.name = "EHYPIXELSUX";
    this.code = code;
  }
}

module.exports = HypixelResponseError;
