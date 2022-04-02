const MongoConnector = require("@hyarcade/requests/MongoConnector");

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {MongoConnector} connector
 */
module.exports = async (req, res, connector) => {
  if (req.method == "GET") {
    res.setHeader("Content-Type", "application/json");

    const obj = await connector.getInfo();
    const { version } = require("../../../package.json");

    res.write(JSON.stringify({ ...obj, version }));
    res.end();
  } else {
    res.statusCode = 404;
    res.end();
  }
};
