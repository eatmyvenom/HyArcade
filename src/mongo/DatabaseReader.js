const utils = require("../utils");
const MongoUtils = require("./MongoUtils");

module.exports = class DatabaseReader {
    static async getArray () {
        const {database} = MongoUtils;
        return await database.collection("accounts").find({})
            .toArray();
    }

    static async getAccount (uuid) {
        const {database} = MongoUtils;
        return await database.collection("accounts").find({
            uuid
        });
    }

    static async toJSON (path) {
        await utils.writeJSON(path, await this.getArray());
    }
};
