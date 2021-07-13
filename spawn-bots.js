#!/bin/env node
const child_process = require("child_process");
const { logger } = require("./src/utils");
const Logger = require("./src/utils/Logger");
const fs = require("fs-extra");

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
    logger.info("Bots starting...");
    let ascii = (await fs.readFile('resources/hyarcade.ascii')).toString();
    logger.info(ascii);
    logger.info("Starting arcade bot...");
    arcade = child_process.fork("index.js", ["bot"], { silent : false});
    logger.info("Interactions starting...");
    interactions = child_process.fork("index.js", ["bot", "slash"], { silent : false});
    logger.info("Micro bot starting...");
    mini = child_process.fork("index.js", ["bot", "mini"], { silent : false});
    logger.info("Mini walls bot starting...");
    mw = child_process.fork("index.js", ["bot", "mw"], { silent : false});

    arcade.on("spawn",  ()=> {
        logger.info("Arcade bot spawned");
    });
    arcade.on("exit", restartArcade);

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