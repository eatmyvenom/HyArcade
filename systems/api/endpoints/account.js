const { URL } = require("url");
const Logger = require("@hyarcade/logger");
const AccountResolver = require("../AccountResolver");
const APIRuntime = require("../APIRuntime");
const { DeepMerge } = require("@hyarcade/helpers-objects");
const { Account } = require("@hyarcade/account");

let fakeData;

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {APIRuntime} runtime
 */
module.exports = async (req, res, runtime) => {
  if (fakeData == undefined) {
    fakeData = await runtime.mongoConnector.fakePlayers.find().toArray();
  }

  const url = new URL(req.url, `https://${req.headers.host}`);
  if (req.method == "GET") {
    res.setHeader("Content-Type", "application/json");
    const resolvedAccount = await AccountResolver(runtime, url);

    if (resolvedAccount?.name == "INVALID-NAME" || resolvedAccount?.name == undefined || resolvedAccount == undefined) {
      Logger.warn(`${url.searchParams} could not resolve to anything`);
      res.statusCode = 200;
      res.end(
        JSON.stringify({
          error: "ACC_UNDEFINED",
        }),
      );
      return;
    }

    const time = url.searchParams.get("time");
    let response = {};

    if (time != undefined && time != "lifetime") {
      response.acc = resolvedAccount;
      const snapshotAccount = await runtime.mongoConnector.getTimedAccount(resolvedAccount.uuid, time);
      response.timed = snapshotAccount;
    } else {
      response = resolvedAccount;
    }

    res.write(JSON.stringify(response));
    res.end();
  } else if (req.method == "POST") {
    let data = "";
    let json = {};

    const key = runtime.config.database.keys[req.headers.key];
    const fullAuth = req.headers.authorization == runtime.config.database.pass;
    const keyValid = key != undefined && key.perms.includes("push");

    if (fullAuth || keyValid) {
      req.on("data", d => (data += d));
      req.on("end", async () => {
        json = JSON.parse(data);
        let newAcc = Account.from(json);

        const fakeAcc = fakeData.find(a => a.uuid == newAcc.uuid);
        if (fakeAcc != undefined) {
          Logger.info(`Overwriting data for ${newAcc.name}`);
          newAcc = DeepMerge(newAcc, fakeAcc);
        }

        runtime.mongoConnector
          .updateAccount(newAcc)
          .then(() => {})
          .catch(error => Logger.err(error.stack));

        res.end();
      });
    } else {
      Logger.warn("Someone tried to POST without auth");
      res.statusCode = 403;
      res.end();
    }
  } else if (req.method == "DELETE") {
    const key = runtime.config.database.keys[req.headers.key];
    const fullAuth = req.headers.authorization == runtime.config.database.pass;
    const keyValid = key != undefined && key.perms.includes("push");

    if (fullAuth || keyValid) {
      const uuid = url.searchParams.get("uuid");

      Logger.warn(`Removing ${uuid} from database!`);
      const del = await runtime.mongoConnector.accounts.deleteMany({ uuid });
      Logger.debug(JSON.stringify(del));
      res.write(JSON.stringify(del));
      res.end();
    } else {
      Logger.warn("Someone tried to DELETE without auth");
      res.statusCode = 403;
      res.end();
    }
  } else {
    res.statusCode = 404;
    res.end();
  }
};
