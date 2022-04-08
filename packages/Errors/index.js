const DupeKeyError = require("./DupeKeyError");
const RequestTimeoutError = require("./RequestTimeoutError");
const MissingFieldError = require("./MissingFieldError");
const DataNotFoundError = require("./DataNotFoundError");
const HypixelResponseError = require("./HypixelResponseError");
const DatabaseResponseError = require("./DatabaseResponseError");

module.exports = {
  DatabaseResponseError,
  DupeKeyError,
  RequestTimeoutError,
  MissingFieldError,
  DataNotFoundError,
  HypixelResponseError,
};
