const fs = require("fs-extra");
const GetAsset = require("@hyarcade/utils/FileHandling/GetAsset");
const process = require("node:process");
const path = require("path");

class CommandImage {
  file = GetAsset("/arc.png");
  overlay = "#00000000";
}

class CommandImages {
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

class Database {
  url = "https://api.hyarcade.xyz";
  defaultLimit = 100;
  pass = process.env.HYARCADE_KEY;
  key = process.env.HYARCADE_KEY;
  mongoURL = "mongodb://127.0.0.1:27017";
  serverIP = "";
  keys = {};
  maxLBSize = 2000;
  defaultLBSize = 250;
  cacheTime = {
    accounts: 600000,
    guilds: 14400000,
    config: 600000,
    counts: 600,
    resources: 6000,
    leaderboards: 2400,
  };
  cacheLbs = [];
}

class MiniWallsConfig {
  lbMsg = "";
  guilds = [];
  channels = [];
}

class PresenceItem {
  activities = [
    {
      name: "Your stats",
      type: "WATCHING",
    },
  ];

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

class VerifyChannelConfig {
  channel = "";
  add = "";
  remove = "";
  blacklist = [""];
}

class DiscordBotConfig {
  key = process.env.HYARCADE_DISCORD_TOKEN;
  allEnabled = true;
  enabled = {
    guilds: [""],
    channels: [""],
  };
  verifyChannels = [new VerifyChannelConfig()];
}

class DiscordBotsConfig {
  invite = "";
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
  datagen = {
    outdateAmount: 480,
    hypixelReqTimeout: 5000,
  };
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

class RedisConfig {
  url = process.env.HYARCADE_REDIS_URL;
  leaderboardSize = 2000;
}

class SiteConfig {
  port = 5000;
}

class Config {
  _interval;
  key = process.env.HYARCADE_HYPIXEL_KEY;
  mode = "prod";
  alwaysForce = false;
  logRateLimit = true;
  cluster = "main";
  showDaytime = true;
  commandCharacter = "a!";
  webhook = JSON.stringify(process.env.HYARCADE_WEBHOOK);

  // these are classes representing the structure of
  // the files in the config directory
  commandImages = new CommandImages();
  clusters = new Clusters();
  database = new Database();
  discord = new DiscordConfig();
  discordBot = new DiscordBotsConfig();
  hypixel = new HypixelConfig();
  otherHooks = new OtherHooksConfig();
  thirdParty = new ThirdPartyConfig();
  redis = new RedisConfig();
  site = new SiteConfig();

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
    // eslint-disable-next-line no-undef
    const configDir = path.join(__dirname, "../..", "config");
    const configs = fs.readdirSync(configDir);

    let cfg = new Config();
    try {
      cfg = new Config(JSON.parse(fs.readFileSync(path.join(configDir, "config.json"))));
    } catch {
      process.emitWarning(new Error("Error reading hyarcade config"));
    }

    for (const file of configs) {
      if (file.slice(-5, file.length) == ".json") {
        cfg[file.replace(/\.json/g, "")] = JSON.parse(fs.readFileSync(path.join(configDir, file)));
      }
    }

    return cfg;
  }

  autoRefresh() {
    this._interval = setInterval(() => {
      const newCfg = Config.fromJSON();
      Object.assign(this, newCfg);
    }, 600000);
  }

  destroy() {
    clearInterval(this._interval);
    delete this;
  }
}

module.exports = Config;
