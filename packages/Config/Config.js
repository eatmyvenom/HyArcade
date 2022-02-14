const fs = require("fs");
const { Snowflake, Presence } = require("discord.js");

class BotUser {
  username = "";
  icon = "";
  /**
   *
   * @type {Presence[]}
   * @memberof BotUser
   */
  presences = [];
}

class DiscordConfig {
  token = "";
  backupToken = "";
  miniToken = "";
  mwToken = "";
  testToken = "";

  /**
   *
   * @type {string[]}
   * @memberof DiscordConfig
   */
  trustedUsers = [];

  /**
   *
   * @type {Snowflake}
   * @memberof DiscordConfig
   */
  logChannel = "";

  /**
   *
   * @type {Snowflake}
   * @memberof DiscordConfig
   */
  errChannel = "";

  /**
   *
   * @type {Presence[]}
   * @memberof DiscordConfig
   */
  presences = [];

  /**
   *
   * @type {object.<string, BotUser>}
   * @memberof DiscordConfig
   */
  setup = {};
}

class Webhook {
  id = "";
  token = "";
  username = "";
  pfp = "";
}

class EventManager {
  /**
   *
   * @type {Webhook}
   * @memberof EventManager
   */
  webhook = {};
  winMod = 0;
  name = "";
}

class Config {
  key = "";
  altkeys = [];
  dbURL = "";
  dbPass = "";
  mode = "";
  alwaysForce = false;
  logRateLimit = true;
  watchdogTimeout = 30000;
  cluster = "";
  sortDirection = "";
  printAllWins = false;
  arcadeWinLimit = 0;
  cringeGameLowerBound = 0;
  cringeGameUpperBound = 0;
  showDaytime = false;
  commandCharacter = "";
  clusterTarget = "";
  clusters = {};

  /**
   *
   * @type {object.<string, EventManager>}
   * @memberof Config
   */
  events = {};

  /**
   *
   * @type {Webhook}
   * @memberof Config
   */
  webhook = {};

  /**
   *
   * @type {DiscordConfig}
   * @memberof Config
   */
  discord = {};

  /**
   *
   * @type {object.<string, Webhook>}
   * @memberof Config
   */
  otherHooks = {};

  mojang = class MojangSettings {
    sleep = 0;
  };

  std = class STDControl {
    disable = false;
    out = "";
    err = "";
  };

  constructor(json) {
    for (const thing in json) {
      this[thing] = json[thing];
    }
  }

  /**
   *
   * @returns {Config}
   */
  static fromJSON() {
    const configs = fs.readdirSync("config");

    const cfg = new Config(JSON.parse(fs.readFileSync("config/config.json")));

    for (const file of configs) {
      if (file.slice(-5, file.length) == ".json") {
        cfg[file.replace(/\.json/g, "")] = JSON.parse(fs.readFileSync(`config/${file}`));
      }
    }

    return cfg;
  }
}

module.exports = Config;
