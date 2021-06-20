module.exports = async function (database, account) {
    let col = await database.collection("accounts");
    return await col.insertOne(account);
};
