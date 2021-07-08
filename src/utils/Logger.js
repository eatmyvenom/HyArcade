const { argv } = require("process");
const Config = require("../Config");
const cfg = Config.fromJSON();
let name = argv[2];
name = name == "bot" ? argv[argv.length - 1] : name;

function daytime() {
    if(cfg.showDaytime) {
        let d = new Date();
        return `${d.getMonth()}/${d.getDate()}-${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}:${d.getMilliseconds()}`
    } else {
        return "";
    }
}

function print(type, string, color = "\x1b[0m") {
    string = "" + string;
    for (let s of string.split("\n")) {
        println(type, s, color);
    }
}

function println(type, string, color = "\x1b[0m") {
    let str = `[\x1b[36m${daytime().trim()}\x1b[0m] [\x1b[36m${name.trim()}\x1b[0m] [${color}${type}\x1b[0m]${color} ${string}\x1b[0m`;
    if (!cfg.std.disable) {
        console.log(str);
    }
    require("fs").writeFile(cfg.std.out, str + "\n", { flag: "a" }, () => {});
}

function error(string) {
    string = "" + string;
    for (let s of string.split("\n")) {
        errorln(s);
    }
}

function errorln(string) {
    let str = `[\x1b[36m${daytime().trim()}\x1b[0m] [\x1b[36m${name.trim()}\x1b[0m] [\x1b[31mERROR\x1b[0m]\x1b[31m ${string}\x1b[0m`;
    if (!cfg.std.disable) {
        console.log(str);
    }
    require("fs").writeFile(cfg.std.err, str + "\n", { flag: "a" }, () => {});
}

module.exports = class Logger {
    /**
     * Log content to stdout or a file
     *
     * @param {String} content
     */
    static log(content) {
        print("LOG", content);
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
     * Log content to stdout or a file
     *
     * @param {String} content
     */
    static debug(content) {
        print("DEBUG", content, "\x1b[95m");
    }

    /**
     * Log content to stderr or a file
     *
     * @param {String} content
     */
    static error(content) {
        error(content);
    }

    static err = this.error;
};
