const leaderboard = require("./Leaderboard-v3");
leaderboard.type = 1;
const profile = require("./Profile");
profile.type = 1;
const compare = require("./Compare");
compare.type = 1;
const stats = require("./Stats");
stats.type = 1;
const ap = require("./Achievements");
ap.type = 1;
const info = require("./Info");
info.type = 1;
const gc = require("./GameCounts");
gc.type = 1;
const raw = require("./GetDataRaw");
raw.type = 1;
const verify = require("./Verify");
verify.type = 1;

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
    name: "unverify",
    description: "Unverify yourself with Arcade Bot",
    options: [],
  },
  verify,
  leaderboard,
  stats,
  profile,
  ap,
  info,
  gc,
  raw,
  ],
};
