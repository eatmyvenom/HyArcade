const Logger = require("hyarcade-logger");
const MongoConnector = require("hyarcade-requests/MongoConnector");

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {MongoConnector} connector
 */
module.exports = async (req, res, connector) => {
  const url = new URL(req.url, `https://${req.headers.host}`);
  if (req.method == "GET") {
    const fields = url.searchParams.get("fields");
    const file = url.searchParams.get("path");

    Logger.log(`Sending full ${file} collection with ${fields}`);
    const data = await connector.readCollection(file);

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
