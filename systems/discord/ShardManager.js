const process = require("process");
const { ShardingManager } = require("discord.js");
const cfg = require("@hyarcade/config").fromJSON();
const args = process.argv.slice(2);
const Logger = require("@hyarcade/logger");
const path = require("path");

/**
 * @param args
 */
async function BotSpawner(args) {
  Logger.name = "ShardManager";
  Logger.out(`Shard manager started with\n${args}`);
  try {
    // eslint-disable-next-line no-undef
    const manager = new ShardingManager(path.join(__dirname, "bot.mjs"), {
      token: cfg.discord.token,
      shardArgs: args,
      respawn: true,
      mode: "process",
    });

    manager.on("shardCreate", shard => Logger.info(`Launched shard ${shard.id}`));
    await manager.spawn();
  } catch (error) {
    Logger.err(JSON.stringify(error));
    Logger.err(error.stack);
  }
}

BotSpawner(args)
  .then(() => {})
  .catch(error => Logger.err(error));
