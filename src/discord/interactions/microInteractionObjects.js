const statsCommand = require("./Commands/Stats");
statsCommand.options[0].required = true;
exports.statsCommand = statsCommand;

exports.compare = require("./Commands/Compare");
exports.info = require("./Commands/Info");
exports.gamecounts = require("./Commands/GameCounts");

const namehistory = require("./Commands/NameHistory");
namehistory.options[0].required = true;

const profile = require("./Commands/Profile");
profile.options[0].required = true;
exports.profile = profile;

const topgames = require("./Commands/TopGames");
topgames.options = [topgames.options[0]];
topgames.options[0].required = true;
exports.topgames = topgames;

const arcade = require("./Commands/Arcade");
arcade.options = [arcade.options[0], arcade.options[1], arcade.options[2]];
exports.arcade = arcade;

exports.quake = require("./Commands/Quake");
exports.arena = require("./Commands/Arena");
exports.zombies = require("./Commands/PBall");

const zombies = require("./Commands/Zombies");
zombies.options[0].required = true;
exports.zombies = zombies;
