#!/bin/env node
const child_process = require("child_process");
const { logger } = require("./src/utils");
const Logger = require("./src/utils/Logger");
const fs = require("fs-extra");
const args = process.argv;

function sleep(time) {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}


/**
 * @type {child_process.ChildProcess}
 */
let interactions;

/**
 * @type {child_process.ChildProcess}
 */
let arcade;

/**
 * @type {child_process.ChildProcess}
 */
let mini;

/**
 * @type {child_process.ChildProcess}
 */
let mw;

async function main() {
    try {
        logger.info("Bots starting...");
        let ascii = (await fs.readFile('resources/hyarcade.ascii')).toString();
        logger.info(ascii);
        if(args[2] == "test") {
            logger.info("Starting test arcade bot...");
            arcade = child_process.fork("./src/discord/ShardManager.js", ["bot", "test"], {silent : false});
        } else {
            logger.info("Starting arcade bot...");
            arcade = child_process.fork("./src/discord/ShardManager.js", ["bot"], { silent : false});
            await sleep(5500);
            logger.info("Interactions starting...");
            interactions = child_process.fork("./src/discord/ShardManager.js", ["bot", "slash"], { silent : false});
            await sleep(5500);
            logger.info("Micro bot starting...");
            mini = child_process.fork("./src/discord/ShardManager.js", ["bot", "mini"], { silent : false});
            await sleep(5500);
            logger.info("Mini walls bot starting...");
            mw = child_process.fork("./src/discord/ShardManager.js", ["bot", "mw"], { silent : false});

            interactions.on("spawn",  ()=> {
                logger.info("Interactions spawned");
            });
            interactions.on("exit", restartInteraction);
        
            mini.on("spawn",  ()=> {
                logger.info("Micro bot spawned");
            });
            mini.on("exit", restartMini);
        
            mw.on("spawn", ()=> {
                logger.info("Mini walls bot spawned");
            });
            mw.on("exit", restartMW);
        }

        arcade.on("spawn",  ()=> {
            logger.info("Arcade bot spawned");
        });
        arcade.on("exit", restartArcade);
    } catch (e) {
        logger.err(e);
    }
}

function restartMW() {
    Logger.error("Mini walls bot crashed!");
    mw = child_process.fork("index.js", ["bot", "mini"], { silent : false});
    mw.on("exit", restartMW);
}

function restartMini() {
    Logger.error("Mini bot crashed!");
    mini = child_process.fork("index.js", ["bot", "mini"], { silent : false});
    mini.on("exit", restartMini);
}

function restartArcade() {
    Logger.error("Arcade bot crashed!");
    arcade = child_process.fork("index.js", ["bot"], { silent : false});
    arcade.on("exit", restartArcade);
}

function restartInteraction() {
    Logger.error("Interactions has crashed!");
    interactions = child_process.fork("index.js", ["bot", "slash"], { silent : false});
    interactions.on("exit", restartInteraction);
}

main();