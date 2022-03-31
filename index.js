#!/bin/env node
const os = require("os");
const fs = require("fs-extra");
const process = require("process");
const args = process.argv;

/**
 * Write the current PID to a tmp file
 */
async function writePID() {
  if (!fs.existsSync(`${os.tmpdir()}/pgapi`)) {
    await fs.mkdir(`${os.tmpdir()}/pgapi`);
  }
  await fs.writeFile(`${os.tmpdir()}/pgapi/${args[2]}.pid`, `${process.pid}`);
}

/**
 * Remove the tmp PID file
 */
async function rmPID() {
  await fs.rm(`${os.tmpdir()}/pgapi/${args[2]}.pid`);
}

/**
 *
 */
async function main() {
  await writePID();

  const runCli = require("./systems/cli");
  await runCli();

  await rmPID();
}

main()
  .then(() => {})
  .catch(() => {});
