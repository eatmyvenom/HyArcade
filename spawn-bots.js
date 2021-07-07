#!/bin/env node
const child_process = require("child_process");

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
    await sleep(4000);
    arcade = child_process.fork("index.js", ["bot"], { silent : false});
    await sleep(4000);
    mini = child_process.fork("index.js", ["bot", "mini"], { silent : false});
    await sleep(4000);
    mw = child_process.fork("index.js", ["bot", "mw"], { silent : false});

    interactions.on("exit", restartInteraction);
    arcade.on("exit", restartArcade);
    mini.on("exit", restartMini);
    mw.on("exit", restartMW);
}

function restartMW() {
    mw = child_process.fork("index.js", ["bot", "mini"], { silent : false});
    mw.on("exit", restartMW);
}

function restartMini() {
    mini = child_process.fork("index.js", ["bot", "mini"], { silent : false});
    mini.on("exit", restartMini);
}

function restartArcade() {
    arcade = child_process.fork("index.js", ["bot"], { silent : false});
    arcade.on("exit", restartArcade);
}

function restartInteraction() {
    interactions = child_process.fork("index.js", ["bot", "slash"], { silent : false});
    interactions.on("exit", restartInteraction);
}

main();