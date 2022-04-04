const Logger = require("@hyarcade/logger");
const APIRuntime = require("../APIRuntime");
const GuildResolver = require("../GuildResolver");

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {APIRuntime} runtime
 */
module.exports = async (req, res, runtime) => {
  const { mongoConnector, config } = runtime;
  if (req.method == "GET") {
    const guild = await GuildResolver(req, runtime);

    res.setHeader("Content-Type", "application/json");

    res.write(JSON.stringify(guild));
    res.end();
  } else if (req.method == "POST") {
    let data = "";
    let json = {};
    if (req.headers.authorization == config.database.pass) {
      req.on("data", d => (data += d));
      req.on("end", async () => {
        json = JSON.parse(data);
        const newGuild = json;

        mongoConnector
          .updateGuild(newGuild)
          .then(() => {})
          .catch(error => Logger.err(error.stack));

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
