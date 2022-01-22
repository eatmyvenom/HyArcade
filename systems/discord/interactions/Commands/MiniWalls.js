const command = {
  name: "mini-walls",
  description: "Mini walls commands",
  options: [],
};

command.options.push(require("./MiniWallsStats"));
command.options[0].type = 1;

command.options.push(require("./MiniWallsLeaderboard"));
command.options[1].type = 1;

module.exports = command;