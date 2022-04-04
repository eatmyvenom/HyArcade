const { MissingFieldError } = require("@hyarcade/errors");
const Logger = require("@hyarcade/logger");
const APIRuntime = require("../APIRuntime");

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {APIRuntime} runtime
 */
module.exports = async (req, res, runtime) => {
  const url = new URL(req.url, `https://${req.headers.host}`);
  if (req.method == "GET") {
    const fields = url.searchParams.get("fields");
    const file = url.searchParams.get("path");

    if (file == "requests") {
      res.write(JSON.stringify([]));
      res.end();
      return;
    }

    if (file == undefined) {
      throw new MissingFieldError("No collection specified", ["path"]);
    }

    Logger.log(`Sending ${fields ?? "full"} ${file} collection`);
    const data = await runtime.mongoConnector.readCollection(file);

    res.setHeader("Content-Type", "application/json");

    // eslint-disable-next-line unicorn/no-null
    if (fields == null) {
      res.write(JSON.stringify(data));
    } else {
      res.write(JSON.stringify(data, fields.split(",")));
    }
    res.end();
  } else {
    res.statusCode = 404;
    res.end();
  }
};
