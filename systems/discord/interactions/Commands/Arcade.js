const ap = require("./Achievements");
const compare = require("./Compare");
const gc = require("./GameCounts");
const raw = require("./GetDataRaw");
const info = require("./Info");
const leaderboard = require("./Leaderboard-v3");
const profile = require("./Profile");
const stats = require("./Stats");
const verify = require("./Verify");

leaderboard.type = 1;
profile.type = 1;
compare.type = 1;
stats.type = 1;
ap.type = 1;
info.type = 1;
gc.type = 1;
raw.type = 1;
verify.type = 1;

module.exports = {
  name: "arcade",
  description: "A command with other various sub commands which don't need full commands.",
  options: [
    {
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
    {
      type: 1,
      name: "dev",
      description: "Dev only",
      options: [
        {
          type: 3,
          name: "input",
          description: "input",
          required: true,
        },
      ],
    },
  ],
};
