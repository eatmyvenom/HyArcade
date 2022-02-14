const LoggerInstance = require("./LoggerInstance");

const { argv } = require("process");

let name = argv[2];
name = this.name == "bot" ? argv[argv.length - 1] : this.name;
name = this.name == undefined ? "hyarcade" : this.name;

module.exports = new LoggerInstance(name, "🎮");
