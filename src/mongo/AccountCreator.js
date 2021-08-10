module.exports = async function (database, account) {
  const col = await database.collection("accounts");
  return await col.insertOne(account);
};
