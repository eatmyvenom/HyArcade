const leaderboard = require("./Leaderboard");
leaderboard.type = 1;
const profile = require("./Profile");
profile.type = 1;
const compare = require("./Compare");
compare.type = 1;
const ap = require("./Achievements");
ap.type = 1;
const info = require("./Info");
info.type = 1;
const gc = require("./GameCounts");
gc.type = 1;
const raw = require("./GetDataRaw");
raw.type = 1;

module.exports = {
  name: "arcade",
  description: "A command with other various sub commands which don't need full commands.",
  options: [{
    type: 1,
    name: "help",
    description: "Get help on using the arcade bot",
  },
  {
    type: 1,
    name: "ez",
    description: "ez",
    options: [],
  },
  {
    type: 1,
    name: "ping",
    description: "Get the bots ping and status",
    options: [],
  },
  {
    type: 1,
    name: "database",
    description: "Get info about the database",
    options: [],
  },
  {
    type: 1,
    name: "update-time",
    description: "Get the time of the last database update",
    options: [],
  },
  leaderboard,
  profile,
  ap,
  info,
  gc,
  raw,
  ],
};
