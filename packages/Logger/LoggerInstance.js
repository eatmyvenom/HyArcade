/* eslint-disable no-undef */
const path = require("path");
const { argv, stdout, stderr } = require("process");
const { writeFile } = require("fs-extra");

let logLevel = process.env.HYARCADE_LOG_LEVEL ?? 5;

if (argv.includes("--silent") || process.env.SILENT == true) {
  logLevel = 0;
} else if (argv.includes("--verbose") || argv.includes("-v")) {
  logLevel = 6;
}

const levels = ["ERROR", "WARN", "LOG", "INFO", "DEBUG", "VERBOSE"];

/**
 * @param {string} type
 * @returns {boolean}
 */
function shouldLog(type) {
  return levels.includes(type) ? levels.slice(0, logLevel).includes(type) : true;
}

/**
 * @returns {string} Formatted time
 */
function daytime() {
  const d = new Date();
  return `${`0${d.getMonth() + 1}`.slice(-2)}-${`0${d.getDate()}`.slice(-2)}T${`0${d.getHours()}`.slice(-2)}:${`0${d.getMinutes()}`.slice(
    -2,
  )}:${`0${d.getSeconds()}`.slice(-2)}:${`00${d.getMilliseconds()}`.slice(-3)}`;
}

/**
 * @returns {string}
 */
function timeStr() {
  return `\u001B[32m${daytime().trim()}\u001B[0m |`;
}

/**
 *
 * @param {string} name
 * @returns {string}
 */
function nameStr(name = "") {
  return `\u001B[36m${name.trim().slice(0, 8).padEnd(8)}\u001B[0m |`;
}

/**
 *
 * @param {string} type
 * @param {string} color
 * @returns {string}
 */
function typeStr(type, color) {
  return `${color}${type.slice(0, 8).padEnd(8)}\u001B[0m |`;
}

/**
 * @param {string} string
 * @param {string} name
 */
function errorln(string, name = "") {
  if (shouldLog("ERROR")) {
    const str = `❌ ${timeStr()} ${nameStr(name)} ${typeStr("ERROR", "\u001B[31m")}\u001B[31m ${string}\u001B[0m\n`;
    stderr.write(str, () => {});
  }

  writeFile(path.join(__dirname, "../..", "logs", `${name.trim()}-err.log`), `${daytime().trim()} - ${string}\n`, {
    flag: "a",
  })
    .then(() => {})
    .catch(console.error);
}

/**
 * @param {string} type
 * @param {string} string
 * @param {string} name
 * @param {string} color
 * @param {string} emoji
 */
function println(type, string, name, color = "\u001B[0m", emoji = "") {
  const realEmoji = emoji ? `${emoji.trim()} ` : "";
  if (shouldLog(type)) {
    const str = `${realEmoji}${timeStr()} ${nameStr(name)} ${typeStr(type, color)} ${color}${string}\u001B[0m\n`;
    stdout.write(str, () => {});
  }

  writeFile(path.join(__dirname, "../..", "logs", `${name.trim()}-out.log`), `${daytime().trim()} - ${string}\n`, {
    flag: "a",
  })
    .then(() => {})
    .catch(console.error);
}

/**
 * @param {string} type
 * @param {*} string
 * @param {string} name
 * @param {string} color
 * @param {string} emoji
 */
function print(type, string, name = "", color = "\u001B[0m", emoji = "") {
  for (const s of string?.toString()?.split("\n") ?? "") {
    println(type, s, name, color, emoji);
  }
}

/**
 * @param {string} string
 * @param {string} name
 */
function error(string, name) {
  for (const s of string?.toString()?.split("\n") ?? "") {
    errorln(s, name);
  }
}

class LoggerInstance {
  name;
  emoji = "🎮";

  constructor(name, emoji = "🎮") {
    this.name = name;
    this.emoji = emoji;
  }

  /**
   * Log content to stdout or a file
   *
   * @param {string[]} content
   */
  log(...content) {
    print("LOG", content.join(" "), this.name, undefined, this.emoji);
  }

  out = this.log;

  /**
   * Log content to stdout or a file
   *
   * @param {string} content
   */
  info(...content) {
    print("INFO", content.join(" "), this.name, "\u001B[32m", this.emoji);
  }

  /**
   * Log content to stdout or a file
   *
   * @param {string} event
   * @param {string|string[]} content
   */
  event(event, ...content) {
    print(event.toUpperCase(), content.join(" "), this.name, "\u001B[44m", this.emoji);
  }

  /**
   * Log content to stdout or a file
   *
   * @param {string} name
   * @param {string} color
   * @param {string|string[]} content
   */
  custom(name, color, ...content) {
    print(name.toUpperCase(), content.join(" "), this.name, color, this.emoji);
  }

  /**
   * Log content to stdout or a file
   *
   * @param {string} content
   */
  warn(...content) {
    print("WARN", content.join(" "), this.name, "\u001B[33m", this.emoji);
  }

  /**
   * Log content to stdout or a file
   *
   * @param {string} content
   */
  debug(...content) {
    print("DEBUG", content.join(" "), this.name, "\u001B[95m", this.emoji);
  }

  dbg = this.debug;

  /**
   * Log content to stdout or a file
   *
   * @param {string} content
   */
  verbose(...content) {
    print("VERBOSE", content.join(" "), this.name, "\u001B[90m", this.emoji);
  }

  /**
   * Log content to stderr or a file
   *
   * @param {string} content
   */
  error(...content) {
    error(content.join(" "), this.name);
  }

  err = this.error;
}

module.exports = LoggerInstance;
