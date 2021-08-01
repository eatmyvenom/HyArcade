let statsCommand = require("./Commands/Stats");
statsCommand.options[0].required = true;
exports.statsCommand = statsCommand;

exports.compare = require("./Commands/Compare");
exports.info = require("./Commands/Info");
exports.gamecounts = require("./Commands/GameCounts");

let namehistory = require("./Commands/NameHistory");
namehistory.options[0].required = true;

let profile = require("./Commands/Profile");
profile.options[0].required = true;
exports.profile = profile;

let topgames = require("./Commands/TopGames");
topgames.options = [topgames.options[0]];
topgames.options[0].required = true;
exports.topgames = topgames;

let arcade = require("./Commands/Arcade");
arcade.options = [arcade.options[0], arcade.options[1], arcade.options[2]];
exports.arcade = arcade;

exports.quake = require("./Commands/Quake");
exports.arena = require("./Commands/Arena");
exports.zombies = require("./Commands/PBall");

let zombies = require("./Commands/Zombies");
zombies.options[0].required = true;
exports.zombies = zombies;
