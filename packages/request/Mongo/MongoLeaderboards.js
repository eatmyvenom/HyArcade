const { MongoClient, Collection, Db } = require("mongodb");

class MongoLeaderboards {
  connector;

  /** @type {MongoClient} */
  client;

  /** @type {Db} */
  database;

  /**
   * @type {Collection<object>}
   */
  accounts;

  /**
   * @type {Collection<object>}
   */
  dailyAccounts;

  /**
   * @type {Collection<object>}
   */
  weeklyAccounts;

  /**
   * @type {Collection<object>}
   */
  monthlyAccounts;

  constructor(connector) {
    this.connector = connector;
    this.client = connector.client;
    this.database = connector.database;

    this.accounts = connector.accounts;
    this.dailyAccounts = connector.dailyAccounts;
    this.weeklyAccounts = connector.weeklyAccounts;
    this.monthlyAccounts = connector.monthlyAccounts;
  }
}

module.exports = MongoLeaderboards;
