#!/bin/env node
const child_process = require("child_process");
const Logger = require("./src/utils/Logger");

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

function sleep(time) {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}

async function main() {
    interactions = child_process.fork("index.js", ["bot", "slash"], { silent : false});
    arcade = child_process.fork("index.js", ["bot"], { silent : false});
    mini = child_process.fork("index.js", ["bot", "mini"], { silent : false});
    mw = child_process.fork("index.js", ["bot", "mw"], { silent : false});

    interactions.on("exit", restartInteraction);
    arcade.on("exit", restartArcade);
    mini.on("exit", restartMini);
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