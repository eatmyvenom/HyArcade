const fs = require("fs");
const process = require("node:process");

class CommandImage {
  file = "assets/arc.png";
  overlay = "#00000000";
}

class CommandImages {
  profile = new CommandImage();
  topGames = new CommandImage();
  leaderboard = new CommandImage();
  gameStats = new CommandImage();
}

class Clusters {
  main = {
    name: "main",
    key: process.env.HYARCADE_HYPIXEL_KEY,
    tasks: ["accs"],
    flags: [],
  };
}

class DatabaseKey {
  limit = 120;
  perms = [];
}

class Database {
  url = "https://api.hyarcade.xyz";
  defaultLimit = 120;
  pass = process.env.HYARCADE_KEY;
  key = process.env.HYARCADE_KEY;
  serverIP = "";
  /**
   * @type {object<string, DatabaseKey>}
   */
  keys = {};
}

class MiniWallsConfig {
  lbMsg = "";
  guilds = [];
  channels = [];
}

class PresenceItem {
  activities = {
    name: "Your stats",
    type: "WATCHING",
  };

  status = "online";
}

class SetupItem {
  username = "Arcade Bot";
  icon = "https://i.vnmm.dev/arcadepfp2.png";
  presences = [new PresenceItem()];
}

class DiscordSetupConfig {
  bot = new SetupItem();
  mini = new SetupItem();
  test = new SetupItem();
  mw = new SetupItem();
}

class DiscordConfig {
  token = process.env.HYARCADE_DISCORD_TOKEN;
  mwToken = process.env.HYARCADE_DISCORD_TOKEN;
  testToken = process.env.HYARCADE_DISCORD_TOKEN;

  trustedUsers = ["156952208045375488"];
  miniWalls = new MiniWallsConfig();
  logChannel = process.env.HYARCADE_LOG_CHANNEL;
  errChannel = process.env.HYARCADE_LOG_CHANNEL;
  cmdChannel = process.env.HYARCADE_LOG_CHANNEL;
  verifyChannel = process.env.HYARCADE_LOG_CHANNEL;
  statusHook = process.env.HYARCADE_WEBHOOKV2;

  leaderboards = {};
  lbArchive = {};

  presences = [new PresenceItem()];
  setup = new DiscordSetupConfig();
}

class DiscordBotConfig {
  key = process.env.HYARCADE_DISCORD_TOKEN;
  allEnabled = true;
  enabled = {
    guilds: [""],
    channels: [""],
  };
}

class DiscordBotsConfig {
  arcadeBot = new DiscordBotConfig();
  miniWallsBot = new DiscordBotConfig();
  testBot = new DiscordBotConfig();
}

class HypixelConfig {
  mainKey = process.env.HYARCADE_HYPIXEL_KEY;
  botKey = process.env.HYARCADE_HYPIXEL_KEY;
  batchKeys = [process.env.HYARCADE_HYPIXEL_KEY];
  loginLimit = 86400000;
  importanceLimit = 5000;
  minImportance = 500;
  leaderboardLimit = 10;
  segmentSize = 20;
  concurrentBatches = 6;
  alwaysForce = false;
  autoUpdate = true;
  localInterfaces = [];
}

class OtherHooksConfig {
  TO = {};
  HS = {};
  MW = {};
  TEST = {};
  DW = {};
}

class ThirdPartyConfig {
  observerKey = "";
  slothPixelKey = "";
}

class Config {
  key = process.env.HYARCADE_HYPIXEL_KEY;
  mode = "prod";
  alwaysForce = false;
  logRateLimit = true;
  cluster = "main";
  showDaytime = true;
  commandCharacter = "a!";
  webhook = JSON.stringify(process.env.HYARCADE_WEBHOOK);

  // these are classes representing the structure of
  // the files in the config directory except for the
  // config.json file.
  commandImages = new CommandImages();
  clusters = new Clusters();
  database = new Database();
  discord = new DiscordConfig();
  discordBot = new DiscordBotsConfig();
  hypixel = new HypixelConfig();
  otherHooks = new OtherHooksConfig();
  thirdParty = new ThirdPartyConfig();

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

    let cfg = new Config();
    try {
      cfg = new Config(JSON.parse(fs.readFileSync("config/config.json")));
      // eslint-disable-next-line no-empty
    } catch {}

    for (const file of configs) {
      if (file.slice(-5, file.length) == ".json") {
        cfg[file.replace(/\.json/g, "")] = JSON.parse(fs.readFileSync(`config/${file}`));
      }
    }

    return cfg;
  }
}

module.exports = Config;
