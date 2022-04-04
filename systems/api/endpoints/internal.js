/* eslint-disable unicorn/no-lonely-if */
const Logger = require("@hyarcade/logger");
const APIRuntime = require("../APIRuntime");

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
 * @param {APIRuntime} runtime
 */
module.exports = async (req, res, runtime) => {
  const { config, mongoConnector, redisInterface } = runtime;
  if (req.method == "GET") {
    res.statusCode = 404;
    res.end();
  } else if (req.method == "POST") {
    let data = "";
    let json = {};

    const key = config.database.keys[req.headers.key];
    const fullAuth = req.headers.authorization == config.database.pass;
    const keyValid = key != undefined && key.perms.includes("internal");

    if (fullAuth || keyValid) {
      req.on("data", d => (data += d));
      req.on("end", async () => {
        res.setHeader("Content-Type", "application/json");
        json = JSON.parse(data);

        if ((fullAuth || key.perms.includes("important")) && json.fetchImportant) {
          res.write(JSON.stringify(mongoConnector.getImportantAccounts(json.fetchImportant)));
        }

        if ((fullAuth || key.perms.includes("eval")) && json.mongoEval) {
          Logger.warn("Evaluating raw JS.");
          const fun = safeEval(json.mongoEval);
          const result = await fun(mongoConnector);

          res.write(JSON.stringify({ result }));
        }

        if ((fullAuth || key.perms.includes("statsEdit")) && json.useCommand) {
          await mongoConnector.useCommand(json.useCommand.name, json.useCommand.type);
          res.write(JSON.stringify({ success: true }));
        }

        if ((fullAuth || key.perms.includes("statsEdit")) && json.usePage) {
          await mongoConnector.useWebpage(json.usePage.endpoint, Date.now());
          res.write(JSON.stringify({ success: true }));
        }

        if ((fullAuth || key.perms.includes("forceUpdate")) && json.forceUpdate) {
          Logger.debug("Setting next force level to " + json.forceUpdate);
          const nextLevel = await redisInterface.get("nextLevel");
          await redisInterface.set("nextLevel", Math.max(json.forceUpdate, nextLevel, 0));

          res.write(JSON.stringify({ success: true }));
        }

        if ((fullAuth || key.perms.includes("batch")) && json.getBatch) {
          let currentUUIDs = (await redisInterface.getJSON("currentUUIDs")) ?? [];
          const isGenerating = (await redisInterface.get("generating")) == true;
          if (currentUUIDs.length === 0) {
            if (!isGenerating) {
              const nextLevel = await redisInterface.get("nextLevel");
              await redisInterface.set("generating", true);
              currentUUIDs = await mongoConnector.getImportantAccounts(nextLevel ?? 0);
              await redisInterface.set("nextLevel", 0);
              await redisInterface.set("generating", false);
            } else {
              Logger.debug("Returning random accounts");
              const templist = await mongoConnector.accounts.aggregate([{ $sample: config.hypixel.segmentSize }]).toArray();

              res.write(JSON.stringify(templist));
            }
          }

          const batch = currentUUIDs.splice(0, Math.min(config.hypixel.segmentSize, currentUUIDs.length));
          await redisInterface.setJSON("currentUUIDs", currentUUIDs);

          if (batch.length > 0) {
            res.write(JSON.stringify(batch));
          }
        }

        if ((fullAuth || key.perms.includes("listEdit")) && json.ezmsgs) {
          const reply = {};
          if (json.ezmsgs.add) {
            await mongoConnector.addEZMsg(json.ezmsgs.add);
            reply.success = true;
          }

          if (json.ezmsgs.ls) {
            reply.list = await mongoConnector.ezMsgs.find().toArray();
          }

          res.write(JSON.stringify(reply));
        }

        if ((fullAuth || key.perms.includes("discord")) && json.discord) {
          const reply = {};
          if (json.discord.ln) {
            await mongoConnector.linkDiscord(json.discord.ln.id, json.discord.ln.uuid);
            reply.success = true;
          }

          if (json.discord.rm) {
            await mongoConnector.linkDiscord(json.discord.fuv.id, json.discord.fuv.uuid);
            reply.success = true;
          }

          if (json.discord.ls) {
            reply.list = await mongoConnector.getDiscordAccounts();
          }

          res.write(JSON.stringify(reply));
        }

        if ((fullAuth || key.perms.includes("banned")) && json.banned) {
          const reply = {};
          if (json.banned.add) {
            await mongoConnector.addBanned(json.banned.ln.uuid);
            reply.success = true;
          }

          if (json.banned.rm) {
            await mongoConnector.deleteBanned(json.banned.rm.uuid);
            reply.success = true;
          }

          if (json.banned.ls) {
            reply.list = await mongoConnector.bannedList.find().toArray();
          }

          res.write(JSON.stringify(reply));
        }

        if ((fullAuth || key.perms.includes("hacker")) && json.hacker) {
          const reply = {};
          if (json.hacker.add) {
            await mongoConnector.addHacker(json.hacker.ln.uuid);
            reply.success = true;
          }

          if (json.hacker.rm) {
            await mongoConnector.deleteHacker(json.hacker.rm.uuid);
            reply.success = true;
          }

          if (json.hacker.ls) {
            reply.list = await mongoConnector.hackerList.find().toArray();
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
