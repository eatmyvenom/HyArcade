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
    const id = url.searchParams.get("id");

    if (req.headers.authorization == cfg.database.pass) {
      if (action == "ls") {
        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify(await connector.getDiscordAccounts()));
      } else if (action == "ln") {
        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify({ success: true }));
        await connector.linkDiscord(id, uuid);
      } else {
        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify({ success: true }));
        await connector.unlinkDiscord(uuid);
        await connector.unlinkDiscord(id);
      }

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
