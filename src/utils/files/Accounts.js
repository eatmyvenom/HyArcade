const fs = require("fs-extra");
const Account = require("hyarcade-requests/types/Account");

module.exports = class Accounts {
  folderPath = "";

  constructor (path) {
    this.folderPath = path;
  }

  /**
   *
   *
   * @param {string} uuid
   * @returns {Account} 
   */
  async readAccount (uuid) {
    const realUuid = uuid.includes(".json") ? uuid : `${uuid}.json`;

    const file = await fs.readFile(`${this.folderPath}/${realUuid}`);
    const data = JSON.parse(file);

    return Account.from(data);
  }

  /**
   *
   *
   * @param {string} uuid
   * @param {Account} data
   */
  async writeAccount (uuid, data) {
    const string = JSON.stringify(data, null, "\t");

    await fs.writeFile(`${this.folderPath}/${uuid ?? data.uuid}.json`, string);
  }

  /**
   * 
   * @param {Account[]} accounts 
   */
  async writeAccounts (accounts) {
    for(const account of accounts) {
      await this.writeAccount(account.uuid, account);
    }
  }

  async readAccounts () {
    const files = await fs.readdir(this.folderPath);

    const accounts = [];

    for(const fileName of files) {
      accounts.push(await this.readAccount(fileName));
    }

    return accounts;
  }
};