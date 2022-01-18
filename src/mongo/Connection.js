const {
  MongoClient
} = require("mongodb");
const cfg = require("hyarcade-config").fromJSON();
const url = cfg.dbURL;
const MongoUtils = require("./MongoUtils");

module.exports = async function connect () {
  const cli = await MongoClient.connect(url, {
    useUnifiedTopology: true
  });
  MongoUtils.client = cli;
  MongoUtils.database = await cli.db("hyarcade");
  return cli;
};
