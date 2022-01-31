const Logger = require("hyarcade-logger");
const Database = require("hyarcade-requests/Database");
const MongoConnector = require("hyarcade-requests/MongoConnector");

/**
 *
 */
async function main() {
  const connector = new MongoConnector("mongodb://127.0.0.1:27017");
  await connector.connect(false);

  const accounts = await Database.readDB("accounts");
  await connector.updateAccounts(accounts);
  Logger.out("Updated accounts");

  const dayAccounts = await Database.readDB("dayAccounts");
  await connector.updateDaily(dayAccounts);
  Logger.out("Updated daily");

  const weekAccounts = await Database.readDB("weeklyAccounts");
  await connector.updateWeekly(weekAccounts);
  Logger.out("Updated weekly");

  const monthlyAccounts = await Database.readDB("monthlyAccounts");
  await connector.updateMonthly(monthlyAccounts);
  Logger.out("Updated monthly");

  const disclist = await Database.readDB("disclist");
  for(const link in disclist) {
    await connector.linkDiscord(link, disclist[link]);
  }
  Logger.out("Updated discord links");

  const guilds = await Database.readDB("guilds");
  for(const guild of guilds) {
    await connector.updateGuild(guild);
  }
  Logger.out("Updated guilds");

  const hackerlist = await Database.readDB("hackerlist");
  for(const hacker of hackerlist) {
    await connector.addHacker(hacker);
  }
  Logger.out("Updated hacker list");

  const banlist = await Database.readDB("banlist");
  for(const ban of banlist) {
    await connector.addBanned(ban);
  }
  Logger.out("Updated ban list");
}

module.exports = main;