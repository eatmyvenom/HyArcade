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

    const data = await connector.readCollection(file);

    res.setHeader("Content-Type", "application/json");
    res.write(JSON.stringify(data, fields));
    res.end();
  } else {
    res.statusCode = 404;
    res.end();
  }
};
