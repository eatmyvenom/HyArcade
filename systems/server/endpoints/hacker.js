const Logger = require("hyarcade-logger");
const MongoConnector = require("hyarcade-requests/MongoConnector");
const cfg = require("hyarcade-config").fromJSON();

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {MongoConnector} connector
 */
module.exports = async (req, res, connector) => {
  const url = new URL(req.url, `https://${req.headers.host}`);
  if (req.method == "GET") {
    const action = url.searchParams.get("action");
    const uuid = url.searchParams.get("uuid");

    if (req.headers.authorization == cfg.database.pass) {
      Logger.out(`Hacker - ${action} => ${uuid}`);
      await (action == "add" ? connector.addHacker(uuid) : connector.deleteHacker(uuid));
      res.setHeader("Content-Type", "application/json");
      res.write(JSON.stringify({ success: true }));
      res.end();
    } else {
      res.setHeader("Content-Type", "application/json");
      res.statusCode = 403;
      res.write(JSON.stringify({ error: "MISSING AUTH" }));
      res.end();
    }
  } else {
    res.statusCode = 404;
    res.end();
  }
};
