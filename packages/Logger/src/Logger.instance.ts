import { writeFile } from "node:fs/promises";
import path from "node:path";
import process, { argv, stderr, stdout } from "node:process";

let logLevel = process.env.HYARCADE_LOG_LEVEL ?? 5;

if (argv.includes("--silent") || process.env.SILENT == "true") {
  logLevel = 0;
} else if (argv.includes("--verbose") || argv.includes("-v")) {
  logLevel = 6;
}

const levels = ["ERROR", "WARN", "LOG", "INFO", "DEBUG", "VERBOSE"];

/**
 * @param {string} type
 * @returns {boolean}
 */
function shouldLog(type: string): boolean {
  return levels.includes(type) ? levels.slice(0, Number(logLevel)).includes(type) : true;
}

/**
 * @returns {string} Formatted time
 */
function daytime(): string {
  const d = new Date();
  const month = `${`0${d.getMonth() + 1}`.slice(-2)}`;
  const day = `${`0${d.getDate()}`.slice(-2)}`;

  const hour = `${`0${d.getHours()}`.slice(-2)}`;
  const minute = `${`0${d.getMinutes()}`.slice(-2)}`;
  const sec = `${`0${d.getSeconds()}`.slice(-2)}`;
  const milli = `${`00${d.getMilliseconds()}`.slice(-3)}`;

  return `${month}-${day}T${hour}:${minute}:${sec}:${milli}`;
}

/**
 * @returns {string} Formatted time
 */
function shortTime(): string {
  const d = new Date();

  const month = `${`0${d.getMonth() + 1}`.slice(-2)}`;
  const day = `${`0${d.getDate()}`.slice(-2)}`;

  const hour = `${`0${d.getHours()}`.slice(-2)}`;
  const minute = `${`0${d.getMinutes()}`.slice(-2)}`;
  const sec = `${`0${d.getSeconds()}`.slice(-2)}`;

  return `${month}-${day}T${hour}:${minute}:${sec}`;
}

/**
 * @returns {string}
 */
function timeStr(): string {
  return `\u001B[34m${shortTime().trim()}\u001B[0m |`;
}

/**
 *
 * @param {string} name
 * @returns {string}
 */
function nameStr(name: string = ""): string {
  return `\u001B[36m${name.trim().slice(0, 8).padEnd(8)}\u001B[0m |`;
}

/**
 *
 * @param {string} type
 * @param {string} color
 * @returns {string}
 */
function typeStr(type: string, color: string): string {
  return `${color}${type.slice(0, 5).padEnd(5)}\u001B[0m |`;
}

/**
 * @param {string} string
 * @param {string} name
 */
function errorln(string: string, name: string = "") {
  if (shouldLog("ERROR")) {
    const str = `❌ ${timeStr()} ${nameStr(name)} ${typeStr("ERROR", "\u001B[31m")}\u001B[31m ${string}\u001B[0m\n`;
    stderr.write(str, () => {});
  }

  writeFile(path.join(__dirname, "../../..", "logs", `${name.trim()}-err.log`), `${daytime().trim()} - ${string}\n`, {
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
function println(type: string, string: string, name: string, color: string = "\u001B[0m", emoji: string = "") {
  const realEmoji = emoji ? `${emoji.trim()} ` : "";
  if (shouldLog(type)) {
    const str = `${realEmoji}${timeStr()} ${nameStr(name)} ${typeStr(type, color)} ${color}${string}\u001B[0m\n`;
    stdout.write(str, () => {});
  }

  writeFile(path.join(__dirname, "../../..", "logs", `${name.trim()}-out.log`), `${daytime().trim()} - ${string}\n`, {
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
function print(type: string, string: any, name: string = "", color: string = "\u001B[0m", emoji: string = "") {
  for (const s of string?.toString()?.split("\n") ?? "") {
    println(type, s, name, color, emoji);
  }
}

/**
 * @param {string} string
 * @param {string} name
 */
function error(string: string, name: string) {
  for (const s of string?.toString()?.split("\n") ?? "") {
    errorln(s, name);
  }
}

class LoggerInstance {
  name: string;
  emoji = "🎮";

  constructor(name: string, emoji = "🎮") {
    this.name = name;
    this.emoji = emoji;
  }

  /**
   * Log content to stdout or a file
   *
   * @param {string|string[]} content
   */
  log(content: string | string[]) {
    const str = Array.isArray(content) ? content.join(" ") : content;
    print("LOG", str, this.name, undefined, this.emoji);
  }

  out = this.log;

  /**
   * Log content to stdout or a file
   *
   * @param {string|string[]} content
   */
  info(content: string | string[]) {
    const str = Array.isArray(content) ? content.join(" ") : content;
    print("INFO", str, this.name, "\u001B[32m", this.emoji);
  }

  /**
   * Log content to stdout or a file
   *
   * @param {string} event
   * @param {string|string[]} content
   */
  event(event: string, content: string | string[]) {
    const str = Array.isArray(content) ? content.join(" ") : content;
    print(event.toUpperCase(), str, this.name, "\u001B[44m", this.emoji);
  }

  /**
   * Log content to stdout or a file
   *
   * @param {string} name
   * @param {string} color
   * @param {string|string[]} content
   */
  custom(name: string, color: string, content: string | string[]) {
    const str = Array.isArray(content) ? content.join(" ") : content;
    print(name.toUpperCase(), str, this.name, color, this.emoji);
  }

  /**
   * Log content to stdout or a file
   *
   * @param {string|string[]} content
   */
  warn(content: string | string[]) {
    const str = Array.isArray(content) ? content.join(" ") : content;
    print("WARN", str, this.name, "\u001B[33m", this.emoji);
  }

  /**
   * Log content to stdout or a file
   *
   * @param {string|string[]} content
   */
  debug(content: string | string[]) {
    const str = Array.isArray(content) ? content.join(" ") : content;
    print("DEBUG", str, this.name, "\u001B[35m", this.emoji);
  }

  dbg = this.debug;

  /**
   * Log content to stdout or a file
   *
   * @param {string|string[]} content
   */
  explain(content: string | string[]) {
    const str = Array.isArray(content) ? content.join(" ") : content;
    print("EXPLN", str, this.name, "\u001B[96m", this.emoji);
  }

  /**
   * Log content to stdout or a file
   *
   * @param {string|string[]} content
   */
  verbose(content: string | string[]) {
    const str = Array.isArray(content) ? content.join(" ") : content;
    print("VERBOSE", str, this.name, "\u001B[90m", this.emoji);
  }

  /**
   * Log content to stderr or a file
   *
   * @param {string|string[]} content
   */
  error(content: string | string[]) {
    const str = Array.isArray(content) ? content.join(" ") : content;
    error(str, this.name);
  }

  err = this.error;
}

export { LoggerInstance };
