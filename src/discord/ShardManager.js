const process = require("process");
const { ShardingManager } = require("discord.js");
const cfg = require("hyarcade-config").fromJSON();
const args = process.argv.slice(2);
const Logger = require("hyarcade-logger");

/**
 *
 */
async function BotSpawner() {
    Logger.out("Sharding " + args);
    try {
        const manager = new ShardingManager("./index.js", { token: cfg.discord.token, shardArgs : args, respawn: false });
        manager.on("shardCreate", shard => Logger.info(`Launched shard ${shard.id}`));
        await manager.spawn();
    } catch (e) {
        Logger.err(JSON.stringify(e));
        Logger.err(e.stack);
    }
}

BotSpawner();