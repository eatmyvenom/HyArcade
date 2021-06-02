const utils = require("../utils");
const MongoUtils = require("./MongoUtils");

module.exports = class DatabaseReader {
    static async getArray() {
        let database = MongoUtils.database;
        return await database.collection("accounts").find({}).toArray();
    }

    static async getAccount(uuid) {
        let database = MongoUtils.database;
        return await database.collection("accounts").find({ uuid : uuid })
    }

    static async toJSON(path) {
        await utils.writeJSON(path, await this.getArray());
    }
}