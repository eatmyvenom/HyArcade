/* eslint-disable unicorn/no-lonely-if */
const Logger = require("hyarcade-logger");
const MongoConnector = require("hyarcade-requests/MongoConnector");
const RedisInterface = require("hyarcade-requests/RedisInterface");
const cfg = require("hyarcade-config").fromJSON();

// eslint-disable-next-line prefer-arrow-callback
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

/**
 * @param {string} str
 * @returns {string}
 */
function safeEval(str) {
  return new AsyncFunction("c", `"use strict";return (${str})`);
}

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {MongoConnector} connector
 * @param {RedisInterface} redis
 */
module.exports = async (req, res, connector, redis) => {
  if (req.method == "GET") {
    res.statusCode = 404;
    res.end();
  } else if (req.method == "POST") {
    let data = "";
    let json = {};

    const key = cfg.database.keys[req.headers.key];
    const fullAuth = req.headers.authorization == cfg.database.pass;
    const keyValid = key != undefined && key.perms.includes("internal");

    if (fullAuth || keyValid) {
      req.on("data", d => (data += d));
      req.on("end", async () => {
        res.setHeader("Content-Type", "application/json");
        json = JSON.parse(data);

        if ((fullAuth || key.perms.includes("important")) && json.fetchImportant) {
          res.write(JSON.stringify(connector.getImportantAccounts(json.fetchImportant)));
        }

        if ((fullAuth || key.perms.includes("eval")) && json.mongoEval) {
          Logger.warn("Evaluating raw JS.");
          const fun = safeEval(json.mongoEval);
          const result = await fun(connector);

          res.write(JSON.stringify({ result }));
        }

        if ((fullAuth || key.perms.includes("statsEdit")) && json.useCommand) {
          await connector.useCommand(json.useCommand.name, json.useCommand.type);
          res.write(JSON.stringify({ success: true }));
        }

        if ((fullAuth || key.perms.includes("forceUpdate")) && json.forceUpdate) {
          await redis.set("nextLevel", json.forceUpdate);

          res.write(JSON.stringify({ success: true }));
        }

        if ((fullAuth || key.perms.includes("batch")) && json.getBatch) {
          let currentUUIDs = (await redis.getJSON("currentUUIDs")) ?? [];
          if (currentUUIDs.length === 0) {
            const nextLevel = await redis.get("nextLevel");
            currentUUIDs = await connector.getImportantAccounts(nextLevel ?? 0);
            await redis.set("nextLevel", 0);
          }

          const batch = currentUUIDs.splice(0, Math.min(cfg.hypixel.segmentSize, currentUUIDs.length));
          await redis.setJSON("currentUUIDs", currentUUIDs);

          res.write(JSON.stringify(batch));
        }

        if ((fullAuth || key.perms.includes("listEdit")) && json.ezmsgs) {
          let reply = {};
          if (json.ezmsgs.add) {
            await connector.addEZMsg(json.ezmsgs.add);
            reply.success = true;
          }

          if (json.ezmsgs.ls) {
            reply.list = await connector.ezMsgs.find().toArray();
          }

          res.write(JSON.stringify(reply));
        }

        if ((fullAuth || key.perms.includes("discord")) && json.discord) {
          let reply = {};
          if (json.discord.ln) {
            await connector.linkDiscord(json.discord.ln.id, json.discord.ln.uuid);
            reply.success = true;
          }

          if (json.discord.rm) {
            await connector.linkDiscord(json.discord.fuv.id, json.discord.fuv.uuid);
            reply.success = true;
          }

          if (json.discord.ls) {
            reply.list = await connector.getDiscordAccounts();
          }

          res.write(JSON.stringify(reply));
        }

        if ((fullAuth || key.perms.includes("banned")) && json.banned) {
          let reply = {};
          if (json.banned.add) {
            await connector.addBanned(json.banned.ln.uuid);
            reply.success = true;
          }

          if (json.banned.rm) {
            await connector.deleteBanned(json.banned.rm.uuid);
            reply.success = true;
          }

          if (json.banned.ls) {
            reply.list = await connector.bannedList.find().toArray();
          }

          res.write(JSON.stringify(reply));
        }

        if ((fullAuth || key.perms.includes("hacker")) && json.hacker) {
          let reply = {};
          if (json.hacker.add) {
            await connector.addHacker(json.hacker.ln.uuid);
            reply.success = true;
          }

          if (json.hacker.rm) {
            await connector.deleteHacker(json.hacker.rm.uuid);
            reply.success = true;
          }

          if (json.hacker.ls) {
            reply.list = await connector.hackerList.find().toArray();
          }

          res.write(JSON.stringify(reply));
        }

        res.end();
      });
    } else {
      res.statusCode = 404;
      res.end();
    }
  }
};
