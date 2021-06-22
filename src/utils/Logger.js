const Config = require("../Config");
const cfg = Config.fromJSON();

function daytime() {
    return cfg.showDaytime
        ? Date()
              .replace(/.*20[0-9][0-9] /, "")
              .replace(/ [A-Z]..-[0-9]... \(.*\)/, "") + " "
        : "";
}

function print(type, string, color = "\x1b[0m") {
    for(let s of string.split("\n")) {
        println(type, s, color);
    }
}

function println(type, string, color = "\x1b[0m") {
    let str = `[\x1b[36m${daytime().trim()}\x1b[0m] [${color}${type}\x1b[0m]${color} ${string}\x1b[0m`
    if (cfg.std.disable) {
        require("fs").writeFileSync(cfg.std.out, str + "\n", { flag: "a" });
    } else {
        console.log(str);
    }
}

function error(string) {
    for(let s of string.split("\n")) {
        errorln(s);
    }
}

function errorln(string) {
    let str = `[\x1b[36m${daytime().trim()}\x1b[0m] [\x1b[31mERROR\x1b[0m]\x1b[31m ${string}\x1b[0m`
    if (cfg.std.disable) {
        require("fs").writeFileSync(cfg.std.out, str + "\n", { flag: "a" });
    } else {
        console.log(str);
    }
}

module.exports = class Logger {
    /**
     * Log content to stdout or a file
     *
     * @param {String} content
     */
    static log(content) {
        print("LOG" , content);
    }

    static out = this.log;

    /**
     * Log content to stdout or a file
     *
     * @param {String} content
     */
    static info(content) {
        print("INFO", content, "\x1b[32m");
    }

    /**
     * Log content to stdout or a file
     *
     * @param {String} content
     */
     static warn(content) {
        print("WARN", content, "\x1b[33m");
    }

    /**
     * Log content to stderr or a file
     *
     * @param {String} content
     */
    static error(content) {
        error(content);
    }

    static err = this.error
}