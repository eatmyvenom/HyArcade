/* eslint-disable unicorn/no-array-for-each */
/* eslint-disable unicorn/no-array-callback-reference */
/* eslint-disable unicorn/no-array-method-this-argument */
const os = require("node:os");
const { LoggerInstance } = require("@hyarcade/logger");
const { MongoClient, Collection, Db } = require("mongodb");
const CommandMetadata = require("@hyarcade/structures/Discord/CommandMetadata");
const config = require("@hyarcade/config");
const cfg = config.fromJSON();

const Logger = new LoggerInstance("Mongo", "📦");

class DiscordObject {
  uuid = "";
  discordID = "";
}

class HackerObject {
  uuid = "";
}

class BannedObject {
  uuid = "";
}

class RequesterObject {
  recentRequests = 0;
  address = "";
  key = "";
  firstCall = 0;
}

class MongoConnector {
  /**
   * @type {MongoClient}
   */
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

  /**
   * @type {Collection<DiscordObject>}
   */
  discordList;

  /**
   * @type {Collection<object>}
   */
  guilds;

  /**
   * @type {Collection<HackerObject>}
   */
  hackerList;

  /**
   * @type {Collection<BannedObject>}
   */
  bannedList;

  /**
   * @type {Collection<CommandMetadata>}
   */
  commands;

  /**
   * @type {Collection<object>}
   */
  webpages;

  /** @type {Collection<RequesterObject>} */
  requests;

  /**
   * @type {Collection<object>}
   */
  fakePlayers;

  /**
   * @type {Collection<object>}
   */
  ezMsgs;

  /**
   * Creates an instance of MongoConnector.
   *
   * @memberof MongoConnector
   */
  constructor() {
    this.client = new MongoClient(cfg.database.mongoURL, { maxPoolSize: 750, minPoolSize: 50 });
  }

  async connect(index = true) {
    Logger.verbose("Connecting to Mongo database");
    await this.client.connect();

    this.database = this.client.db("hyarcade");

    this.accounts = this.database.collection("accounts");

    this.hypixel = this.database.collection("hypixel");

    this.dailyAccounts = this.database.collection("dailyAccounts");
    this.weeklyAccounts = this.database.collection("weeklyAccounts");
    this.monthlyAccounts = this.database.collection("monthlyAccounts");

    this.discordList = this.database.collection("discordList");

    this.hackerList = this.database.collection("hackerlist");
    this.bannedList = this.database.collection("banlist");
    this.blackList = this.database.collection("blacklist");

    this.guilds = this.database.collection("guilds");

    this.dailyGuilds = this.database.collection("dailyGuilds");
    this.weeklyGuilds = this.database.collection("weeklyGuilds");
    this.monthlyGuilds = this.database.collection("monthlyGuilds");

    this.webpages = this.database.collection("webpages");
    this.commands = this.database.collection("commands");
    this.requests = this.database.collection("requests");

    this.fakePlayers = this.database.collection("fakePlayers");

    this.ezMsgs = this.database.collection("ezMsgs");

    if (index) {
      await this.guilds.createIndex({ uuid: 1 });

      await this.accounts.createIndex({ uuid: 1 });
      await this.accounts.createIndex({ importance: -1 });
      await this.accounts.createIndex({ "miniWalls.wins": -1 });
      await this.accounts.createIndex({ "partyGames.wins": -1 });
      await this.accounts.createIndex({ name: 1 });

      await this.dailyAccounts.createIndex({ uuid: 1 });
      await this.dailyAccounts.createIndex({ importance: -1 });
      await this.dailyAccounts.createIndex({ "miniWalls.wins": -1 });
      await this.dailyAccounts.createIndex({ "partyGames.wins": -1 });

      await this.weeklyAccounts.createIndex({ uuid: 1 });
      await this.weeklyAccounts.createIndex({ importance: -1 });
      await this.weeklyAccounts.createIndex({ "miniWalls.wins": -1 });
      await this.weeklyAccounts.createIndex({ "partyGames.wins": -1 });

      await this.monthlyAccounts.createIndex({ uuid: 1 });
      await this.monthlyAccounts.createIndex({ importance: -1 });
      await this.monthlyAccounts.createIndex({ "miniWalls.wins": -1 });
      await this.monthlyAccounts.createIndex({ "partyGames.wins": -1 });

      await this.discordList.createIndex({ discordID: 1 });
    }

    cfg.autoRefresh();
    Logger.log("MongoDB connection established...");
  }

  async readCollection(collection) {
    if (this[collection] == undefined) {
      // Exit if query will throw an error
      return;
    }

    const coll = await this[collection].find().toArray();
    Logger.debug("Collection converted to array");

    return coll;
  }

  async snapshotAccounts(time) {
    let realTime = time;
    if (time == "day") {
      realTime = "daily";
    }

    if (this[`${realTime}Accounts`] == undefined) {
      // Exit if query will throw an error
      return;
    }

    Logger.info(`Snapshotting to "${realTime}Accounts" collection`);

    const cursor = this.accounts.find();

    /** @type {Collection} */
    const newCollection = this[`${realTime}Accounts`];

    await cursor.forEach(async account => {
      delete account._id;
      await newCollection.replaceOne({ uuid: account.uuid }, account, { upsert: true });
    });

    Logger.info("Snapshot process completed");
  }

  async snapshotGuilds(time) {
    let realTime = time;
    if (time == "day") {
      realTime = "daily";
    }

    if (this[`${realTime}Guilds`] == undefined) {
      // Exit if query will throw an error
      return;
    }

    Logger.info(`Snapshotting to "${realTime}Guilds" collection`);

    const cursor = this.accounts.find();

    /** @type {Collection} */
    const newCollection = this[`${realTime}Guilds`];

    await cursor.forEach(async guild => {
      delete guild._id;
      await newCollection.replaceOne({ uuid: guild.uuid }, guild, { upsert: true });
    });

    Logger.info("Snapshot process completed");
  }

  async getAccount(input) {
    if (input.length == 32 || input.length == 36) {
      return await this.accounts.findOne({ uuid: input });
    } else if (input.length == 18) {
      const resolvedDiscord = await this.discordList.findOne({ discordID: input });
      if (resolvedDiscord) {
        return await this.accounts.findOne({ uuid: resolvedDiscord.uuid });
      }

      Logger.warn(`${input} was not able to be resolved to a discord account`);
      return;
    } else {
      // eslint-disable-next-line camelcase
      return await this.accounts.findOne({ name_lower: input.toLowerCase() });
    }
  }

  async getTimedAccount(uuid, time) {
    let realTime = time;
    if (time == "day") {
      realTime = "daily";
    }

    if (this[`${realTime}Accounts`] == undefined) {
      // Exit if query will throw an error
      return;
    }

    return await this[`${realTime}Accounts`].findOne({ uuid });
  }

  /**
   *
   * @param {object} guild
   */
  async updateGuild(guild) {
    if (guild._id) {
      delete guild._id;
    }

    Logger.info("Updating guild data in mongo");
    guild.uuid = guild.uuid.toLowerCase();

    const update = await this.guilds.replaceOne({ uuid: guild.uuid }, guild, { upsert: true });
    Logger.verbose(`Modified ${update.modifiedCount} document(s) in guild collection.`);
  }

  async getGuild(guildID) {
    return await this.guilds.findOne({ uuid: guildID });
  }

  /**
   *
   * @param {string} memberUUID
   * @returns {object}
   */
  async getGuildByMember(memberUUID) {
    return await this.guilds.findOne({ memberUUIDs: memberUUID.toLowerCase() });
  }

  /**
   *
   *
   * @param {object} accs
   * @memberof MongoConnector
   */
  async updateAccounts(accs) {
    for (const acc of accs) {
      await this.accounts.replaceOne({ uuid: acc.uuid }, acc, { upsert: true });
    }

    Logger.info("Accounts updated");
  }

  /**
   *
   *
   * @param {object} accs
   * @memberof MongoConnector
   */
  async updateDaily(accs) {
    for (const acc of accs) {
      await this.dailyAccounts.replaceOne({ uuid: acc.uuid }, acc, { upsert: true });
    }
  }

  /**
   *
   *
   * @param {object} accs
   * @memberof MongoConnector
   */
  async updateWeekly(accs) {
    for (const acc of accs) {
      await this.weeklyAccounts.replaceOne({ uuid: acc.uuid }, acc, { upsert: true });
    }
  }

  /**
   *
   *
   * @param {object} accs
   * @memberof MongoConnector
   */
  async updateMonthly(accs) {
    for (const acc of accs) {
      await this.monthlyAccounts.replaceOne({ uuid: acc.uuid }, acc, { upsert: true });
    }
  }

  async updateAccount(acc) {
    await this.accounts.replaceOne({ uuid: acc.uuid }, acc, { upsert: true });
  }

  async getOldLeaderboard(stat, time, reverse = false, limit = 10) {
    if (limit == 0) {
      return [];
    }

    let realTime = time;
    if (time == "day") {
      realTime = "daily";
    }

    if (this[`${realTime}Accounts`] == undefined) {
      // Exit if query will throw an error
      return [];
    }

    const options = {
      sort: {
        [stat]: reverse ? 1 : -1,
      },
      projection: {
        _id: 0,
        uuid: 1,
        name: 1,
        rank: 1,
        plusColor: 1,
        banned: 1,
        hacker: 1,
        importance: 1,
        mvpColor: 1,
        [stat]: 1,
      },
      limit,
    };

    return await this[`${realTime}Accounts`].find({}, options).toArray();
  }

  async getLeaderboard(stat, reverse = false, limit = 10) {
    if (limit == 0) {
      return [];
    }

    const options = {
      sort: {
        [stat]: reverse ? 1 : -1,
      },
      projection: {
        _id: 0,
        uuid: 1,
        name: 1,
        rank: 1,
        plusColor: 1,
        banned: 1,
        hacker: 1,
        importance: 1,
        mvpColor: 1,
        [stat]: 1,
      },
      limit,
    };

    return await this.accounts.find({}, options).toArray();
  }

  async getHistoricalLeaderboard(stat, time, reverse = false, limit = 10) {
    if (limit == 0) {
      return [];
    }

    let realTime = time;
    if (time == "day") {
      realTime = "daily";
    }

    if (this[`${realTime}Accounts`] == undefined) {
      // Exit if query will throw an error
      return [];
    }

    const pipeline = [];

    const earlyFilter = {
      $match: { [stat]: { $gt: 0 } },
    };
    pipeline.push(earlyFilter);

    const lookup = {
      from: this[`${realTime}Accounts`].collectionName,
      let: { uuid: "$uuid" },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ["$uuid", "$$uuid"] },
          },
        },
        { $project: { [stat]: 1, _id: 0, uuid: 1 } },
      ],
      as: "historicalData",
    };
    pipeline.push({ $lookup: lookup });

    const match = {
      $match: { historicalData: { $size: 1 } },
    };
    pipeline.push(match);

    const project = {
      _id: 0,
      uuid: 1,
      name: 1,
      rank: 1,
      banned: 1,
      hacker: 1,
      importance: 1,
      plusColor: 1,
      mvpColor: 1,
      historicalData: 1,
      [stat]: 1,
      lbProp: {
        $subtract: [
          `$${stat}`,
          {
            $reduce: {
              input: "$historicalData",
              initialValue: 0,
              in: { $max: ["$$value", `$$this.${stat}`] },
            },
          },
        ],
      },
    };
    pipeline.push({ $project: project });

    const sort = { lbProp: reverse ? 1 : -1 };
    pipeline.push({ $sort: sort }, { $limit: limit });

    const historical = await this.accounts.aggregate(pipeline).toArray();

    return historical;
  }

  async getMiniWallsLeaderboard(stat, limit) {
    if (limit == 0) {
      return [];
    }

    const options = {
      sort: {
        [stat]: -1,
      },
      projection: {
        _id: 0,
        uuid: 1,
        name: 1,
        rank: 1,
        plusColor: 1,
        banned: 1,
        hacker: 1,
        importance: 1,
        mvpColor: 1,
        [stat]: 1,
        miniWalls: 1,
      },
      limit,
    };

    const hackerArr = await this.hackerList.find().toArray();
    const hackers = hackerArr.map(h => h.uuid);

    const query = { uuid: { $nin: hackers } };

    return await this.accounts.find(query, options).toArray();
  }

  async getHistoricalMiniWallsLeaderboard(stat, time, limit = 10) {
    if (limit == 0) {
      return [];
    }

    let realTime = time;
    if (time == "day") {
      realTime = "daily";
    }

    const hackerArr = await this.hackerList.find().toArray();
    const hackers = hackerArr.map(h => h.uuid);

    if (this[`${realTime}Accounts`] == undefined) {
      // Exit if query will throw an error
      return [];
    }

    const pipeline = [];

    const lookup = {
      from: this[`${realTime}Accounts`].collectionName,
      let: { uuid: "$uuid" },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ["$uuid", "$$uuid"] },
          },
        },
        { $project: { miniWalls: 1, _id: 0, uuid: 1 } },
      ],
      as: "historicalData",
    };
    pipeline.push({ $lookup: lookup });

    const match = {
      $match: { historicalData: { $size: 1 }, uuid: { $nin: hackers } },
    };

    pipeline.push(match);

    const project = {
      _id: 0,
      uuid: 1,
      name: 1,
      rank: 1,
      banned: 1,
      hacker: 1,
      importance: 1,
      plusColor: 1,
      mvpColor: 1,
      historicalData: 1,
      miniWalls: 1,
      lbProp: {
        $subtract: [
          `$${stat}`,
          {
            $reduce: {
              input: "$historicalData",
              initialValue: 0,
              in: { $max: ["$$value", `$$this.${stat}`] },
            },
          },
        ],
      },
    };
    pipeline.push({ $project: project });

    const sort = { lbProp: -1 };
    pipeline.push({ $sort: sort }, { $limit: limit });

    const historical = await this.accounts.aggregate(pipeline).toArray();

    return historical;
  }

  async getGuildLeaderboard(stat, reverse = false, limit = 10) {
    if (limit == 0) {
      return [];
    }

    const options = {
      sort: {
        [stat]: reverse ? 1 : -1,
      },
      projection: {
        _id: 0,
        uuid: 1,
        name: 1,
        color: 1,
        tag: 1,
        [stat]: 1,
      },
      limit,
    };

    return await this.guilds.find({}, options).toArray();
  }

  async getGuildHistoricalLeaderboard(stat, time, reverse = false, limit = 10) {
    if (limit == 0) {
      return [];
    }

    let realTime = time;
    if (time == "day") {
      realTime = "daily";
    }

    if (this[`${realTime}Guilds`] == undefined) {
      // Exit if query will throw an error
      return [];
    }

    const pipeline = [];

    const earlyFilter = {
      $match: { [stat]: { $gt: 0 } },
    };
    pipeline.push(earlyFilter);

    const lookup = {
      from: this[`${realTime}Guilds`].collectionName,
      let: { uuid: "$uuid" },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ["$uuid", "$$uuid"] },
          },
        },
        { $project: { [stat]: 1, _id: 0, uuid: 1 } },
      ],
      as: "historicalData",
    };
    pipeline.push({ $lookup: lookup });

    const match = {
      $match: { historicalData: { $size: 1 } },
    };
    pipeline.push(match);

    const project = {
      _id: 0,
      uuid: 1,
      name: 1,
      rank: 1,
      banned: 1,
      hacker: 1,
      importance: 1,
      plusColor: 1,
      mvpColor: 1,
      historicalData: 1,
      [stat]: 1,
      lbProp: {
        $subtract: [
          `$${stat}`,
          {
            $reduce: {
              input: "$historicalData",
              initialValue: 0,
              in: { $max: ["$$value", `$$this.${stat}`] },
            },
          },
        ],
      },
    };
    pipeline.push({ $project: project });

    const sort = { lbProp: reverse ? 1 : -1 };
    pipeline.push({ $sort: sort }, { $limit: limit });

    const historical = await this.guilds.aggregate(pipeline).toArray();

    return historical;
  }

  async getLeaderboarders(limit) {
    const leaderboarders = [
      ...(await this.getLeaderboard("achievementPoints", false, limit)),
      ...(await this.getLeaderboard("importance", false, limit)),
      ...(await this.getLeaderboard("blockingDead.wins", false, limit)),
      ...(await this.getLeaderboard("bountyHunters.wins", false, limit)),
      ...(await this.getLeaderboard("captureTheWool.kills", false, limit)),
      ...(await this.getLeaderboard("captureTheWool.woolCaptures", false, limit)),
      ...(await this.getLeaderboard("creeperAttack.maxWave", false, limit)),
      ...(await this.getLeaderboard("dragonWars.wins", false, limit)),
      ...(await this.getLeaderboard("enderSpleef.wins", false, limit)),
      ...(await this.getLeaderboard("farmhunt.wins", false, limit)),
      ...(await this.getLeaderboard("football.wins", false, limit)),
      ...(await this.getLeaderboard("galaxyWars.wins", false, limit)),
      ...(await this.getLeaderboard("hideAndSeek.wins", false, limit)),
      ...(await this.getLeaderboard("holeInTheWall.wins", false, limit)),
      ...(await this.getLeaderboard("hypixelSays.wins", false, limit)),
      ...(await this.getLeaderboard("partyGames.wins", false, limit)),
      ...(await this.getLeaderboard("pixelPainters.wins", false, limit)),
      ...(await this.getLeaderboard("throwOut.wins", false, limit)),
      ...(await this.getLeaderboard("zombies.wins_zombies", false, limit)),
      ...(await this.getLeaderboard("miniWalls.wins", false, limit)),
      ...(await this.getLeaderboard("arcadeWins", false, limit)),
    ];

    return leaderboarders;
  }

  async getDiscordAccounts() {
    const discords = await this.discordList.find().toArray();

    const uuids = discords.map(d => d.uuid);

    const options = {
      projection: {
        _id: 0,
        uuid: 1,
        name: 1,
        "blockingDead.wins": 1,
        "bountyHunters.wins": 1,
        "dragonWars.wins": 1,
        "enderSpleef.wins": 1,
        "farmhunt.wins": 1,
        "football.wins": 1,
        "galaxyWars.wins": 1,
        "hideAndSeek.wins": 1,
        "hideAndSeek.kills": 1,
        "hideAndSeek.objectives": 1,
        "holeInTheWall.wins": 1,
        "hypixelSays.wins": 1,
        "partyGames.wins": 1,
        "pixelPainters.wins": 1,
        "throwOut.wins": 1,
        "miniWalls.wins": 1,
        "zombies.wins_zombies": 1,
        seasonalWins: 1,
      },
    };

    return await this.accounts.find({ uuid: { $in: uuids } }, options).toArray();
  }

  async getOutdatedAccs() {
    const projection = {
      uuid: 1,
      _id: 0,
    };

    return await this.accounts.find({}, { sort: { updateTime: 1 }, limit: cfg.hypixel.datagen.outdateAmount, projection }).toArray();
  }

  async getImportantAccounts(level = 0) {
    Logger.info(`Getting important accounts with level: ${level}`);
    let accs = [];
    let leaderboarders = [];

    const opts = {
      projection: {
        _id: 0,
        uuid: 1,
      },
    };

    if (level == 0) {
      const basicReqs = { $or: [{ importance: { $gte: cfg.hypixel.importanceLimit } }, { discordID: { $exists: true } }] };
      const timeLimit = {
        $or: [
          { "actionTime.otherActions": { $gte: Date.now() - cfg.hypixel.loginLimit } },
          { lastLogin: { $gte: Date.now() - cfg.hypixel.loginLimit } },
        ],
      };

      const mainAccs = await this.accounts.find({ $and: [basicReqs, timeLimit] }, opts).toArray();
      const highImportance = await this.accounts.find({ importance: { $gte: cfg.hypixel.forceImportance } }, opts).toArray();
      accs = [...mainAccs, ...highImportance];

      leaderboarders = await this.getLeaderboarders(cfg.hypixel.leaderboardLimit);
    } else if (level == 1) {
      accs = await this.accounts
        .find({ $or: [{ importance: { $gte: cfg.hypixel.importanceLimit } }, { discordID: { $exists: true } }] }, opts)
        .toArray();

      leaderboarders = await this.getLeaderboarders(cfg.hypixel.leaderboardLimit * 2);
    } else if (level == 2) {
      accs = await this.accounts
        .find(
          {
            $or: [
              { importance: { $gte: cfg.hypixel.minImportance } },
              { discordID: { $exists: true } },
              { updateTime: { $lte: Date.now() - cfg.hypixel.loginLimit } },
            ],
          },
          opts,
        )
        .toArray();
      leaderboarders = await this.getLeaderboarders(cfg.hypixel.leaderboardLimit * 2);
    } else {
      accs = await this.accounts.find({}, opts).toArray();
    }

    const oldest = await this.getOutdatedAccs();

    const total = [...oldest, ...accs, ...leaderboarders];
    Logger.info(`Sending ${total.length} accounts to workers.`);
    return total;
  }

  async getInfo() {
    return {
      accs: await this.accounts.countDocuments(),
      guilds: await this.guilds.countDocuments(),
      links: await this.discordList.countDocuments(),
      mem: (os.totalmem() - os.freemem()) / 1024 / 1000,
    };
  }

  async linkDiscord(discordID, uuid) {
    await this.discordList.replaceOne({ discordID }, { discordID, uuid }, { upsert: true });
  }

  async unlinkDiscord(input) {
    if (!input) {
      return;
    }
    await (input.length == 18 ? this.discordList.deleteMany({ discordID: input }) : this.discordList.deleteMany({ uuid: input }));
  }

  async addHacker(uuid) {
    await this.hackerList.replaceOne({ uuid }, { uuid }, { upsert: true });
  }

  async deleteHacker(uuid) {
    await this.hackerList.deleteOne({ uuid });
  }

  async addBanned(uuid) {
    await this.bannedList.replaceOne({ uuid }, { uuid }, { upsert: true });
  }

  async deleteBanned(uuid) {
    await this.bannedList.deleteOne({ uuid });
  }

  async addBlacklist(uuid) {
    await this.hackerList.replaceOne({ uuid }, { uuid }, { upsert: true });
  }

  async deleteBlacklist(uuid) {
    await this.hackerList.deleteOne({ uuid });
  }

  async useCommand(name, type) {
    const cmdData = await this.commands.findOne({ name });

    if (cmdData) {
      delete cmdData._id;
      cmdData[type] += 1;
      this.commands.replaceOne({ name }, cmdData, { upsert: true });
    } else {
      const newCommand = new CommandMetadata(name);

      newCommand[type] += 1;
      this.commands.replaceOne({ name }, newCommand, { upsert: true });
    }
  }

  async useWebpage(endpoint, time) {
    const pageData = await this.webpages.findOne({ endpoint });

    if (pageData) {
      delete pageData._id;

      this.webpages.updateOne({ endpoint }, { $inc: { uses: 1 }, $set: { lastUse: time } });

      this.webpages.replaceOne({ endpoint }, pageData, { upsert: true });
    } else {
      const newWebpage = { endpoint, uses: 1, lastUse: time };

      this.webpages.replaceOne({ endpoint }, newWebpage, { upsert: true });
    }
  }

  async getRequester(address) {
    return await this.requests.findOne({ address });
  }

  async updateRequester(requester) {
    if (requester._id) {
      delete requester._id;
    }
    await this.requests.replaceOne({ address: requester.address }, requester, { upsert: true });
  }

  async requesterKeyInUse(key) {
    const requester = await this.requests.findOne({ key });
    return requester != undefined;
  }

  async getFakePlayer(uuid) {
    return await this.fakePlayers.findOne({ uuid });
  }

  async updateFakePlayer(player) {
    delete player._id;
    await this.fakePlayers.replaceOne({ uuid: player.uuid }, player, { upsert: true });
  }

  async addEZMsg(str) {
    await this.ezMsgs.insertOne({ str });
  }

  async destroy() {
    Logger.out("Closing mongo connector, goodbye!");
    await this.client.close();
  }
}

module.exports = MongoConnector;
