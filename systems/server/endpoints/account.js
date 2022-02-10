const { URL } = require("url");
const cfg = require("hyarcade-config").fromJSON();
const Logger = require("hyarcade-logger");
const Account = require("hyarcade-requests/types/Account");
const AccountResolver = require("../AccountResolver");
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
    res.setHeader("Content-Type", "application/json");
    let acc = await AccountResolver(connector, url);

    if (acc?.name == "INVALID-NAME" || acc?.name == undefined || acc == undefined) {
      Logger.warn(`Account query "${url.searchParams}" did not resolve.`);
      res.statusCode = 404;
      res.end(
        JSON.stringify({
          error: "ACC_UNDEFINED",
        }),
      );
      return;
    }

    res.write(JSON.stringify(acc));
    res.end();
  } else if (req.method == "POST") {
    let data = "";
    let json = {};
    if (req.headers.authorization == cfg.database.pass) {
      req.on("data", d => (data += d));
      req.on("end", async () => {
        json = JSON.parse(data);
        const newAcc = Account.from(json);
        Logger.info(`${newAcc.name} posted to database`);

        connector
          .updateAccount(newAcc)
          .then(() => {})
          .catch(Logger.err);

        res.end();
      });
    } else {
      Logger.warn("Someone tried to post without correct AUTH");
      res.statusCode = 403;
      res.end();
    }
  } else {
    res.statusCode = 404;
    res.end();
  }
};
