const { ShardingManager } = require('discord.js');
const cfg = require("../Config").fromJSON();
const args = process.argv.slice(2);
const Logger = require('../utils/Logger')

function BotSpawner() {
    Logger.out("Sharding " + args)
    const manager = new ShardingManager('./index.js', { token: cfg.discord.token, shardArgs : args });
    manager.on('shardCreate', shard => Logger.info(`Launched shard ${shard.id}`));
    try {
        manager.spawn();
    } catch (e) {
        Logger.err(e);
    }
}

BotSpawner();