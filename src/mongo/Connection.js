const MongoClient = require("mongodb").MongoClient;
const cfg = require("../Config").fromJSON();
let url = cfg.dbURL;
const MongoUtils = require("./MongoUtils");

module.exports = async function connect() {
    let cli = await MongoClient.connect(url, { useUnifiedTopology: true });
    MongoUtils.client = cli;
    MongoUtils.database = await cli.db("hyarcade");
    return cli;
};
