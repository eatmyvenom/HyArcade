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
    const uuid = url.searchParams.get("uuid");
    const memberUUID = url.searchParams.get("member");

    let guild;
    if (uuid) {
      guild = await connector.getGuild(uuid);
    } else if (memberUUID) {
      guild = await connector.getGuildByMember(memberUUID);
    }

    res.setHeader("Content-Type", "application/json");

    res.write(JSON.stringify(guild));
    res.end();
  } else {
    res.statusCode = 404;
    res.end();
  }
};
