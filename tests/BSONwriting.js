/* eslint-disable */

const { readFileSync } = require("fs");
const DynamicBSONreader = require("../src/utils/files/DynamicBSONreader");
const DynamicBSONwriter = require("../src/utils/files/DynamicBSONwriter");

async function main() {
    await DynamicBSONwriter(JSON.parse(readFileSync("data/accounts.json")), "test.bson");
    return await DynamicBSONreader("test.bson");
}

main()
    .then(console.log)
    .catch(console.error);