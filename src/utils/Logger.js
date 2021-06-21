const Config = require("../Config");
const cfg = Config.fromJSON();

function daytime() {
    return cfg.showDaytime
        ? Date()
              .replace(/.*20[0-9][0-9] /, "")
              .replace(/ [A-Z]..-[0-9]... \(.*\)/, "") + " "
        : "";
}

module.exports = class Logger {
    /**
     * Log content to stdout or a file
     *
     * @param {String} content
     */
    static log(content) {
        let str = `[${daytime().trim()}] [LOG] ${content}`;
        if (cfg.std.disable) {
            require("fs").writeFileSync(cfg.std.out, str + "\n", { flag: "a" });
        } else {
            console.log(str);
        }
    }

    static out = this.log;

    /**
     * Log content to stdout or a file
     *
     * @param {String} content
     */
    static info(content) {
        let str = `[${daytime().trim()}] [INFO] ${content}`;
        if (cfg.std.disable) {
            require("fs").writeFileSync(cfg.std.out, str + "\n", { flag: "a" });
        } else {
            console.log(str);
        }
    }

    /**
     * Log content to stderr or a file
     *
     * @param {String} content
     */
    static error(content) {
        let str = `[${daytime().trim()}] [ERROR] ${content}`;
        if (cfg.std.disable) {
            require("fs").writeFileSync(cfg.std.err, str + "\n", { flag: "a" });
        } else {
            console.error(str);
        }
    }

    static err = this.error
}