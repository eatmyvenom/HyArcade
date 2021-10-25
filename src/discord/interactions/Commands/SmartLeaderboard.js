module.exports = {
  name: "leaderboard",
  description: "get an arcade related leaderboard",
  options: [
    {
      type: 1,
      name: "bountyhunters",
      options: [
        {
          type: 3,
          name: "stat",
          required: true,
          choices: [
            {
              name: "wins",
              value: "wins"
            },
            {
              name: "kills",
              value: "kills"
            },
            {
              name: "bow kills",
              value: "bowKills"
            },
            {
              name: "sword kills",
              value: "swordKills"
            },
            {
              name: "bounty kills",
              value: "bountyKills"
            },
            {
              name: "deaths",
              value: "deaths"
            }
          ]
        }
      ]
    },
    {
      type: 1,
      name: "blockingdead",
      options: [
        {
          type: 3,
          name: "stat",
          required: true,
          choices: [
            {
              name: "wins",
              value: "wins"
            },
            {
              name: "kills",
              value: "kills"
            },
            {
              name: "headshots",
              value: "headshots"
            }
          ]
        }
      ]
    },
    {
      type: 1,
      name: "capturethewool",
      options: [
        {
          type: 3,
          name: "stat",
          required: true,
          choices: [
            {
              name: "kills + assists",
              value: "kills"
            },
            {
              name: "captures",
              value: "woolCaptures"
            }
          ]
        }
      ]
    },
    {
      type: 1,
      name: "creeperattack",
      options: []
    },
    {
      type: 1,
      name: "dragonwars",
      options: []
    },
    {
      type: 1,
      name: "enderspleef",
      options: []
    },
    {
      type: 1,
      name: "farmhunt",
      options: []
    },
    {
      type: 1,
      name: "football",
      options: []
    },
    {
      type: 1,
      name: "galaxywars",
      options: []
    },
    {
      type: 1,
      name: "hideandseek",
      options: []
    },
    {
      type: 1,
      name: "holeinthewall",
      options: []
    },
    {
      type: 1,
      name: "hypixelsays",
      options: []
    },
    {
      type: 1,
      name: "miniwalls",
      options: []
    },
    partygames,
    pixelpainters,
    seasonal,
    zombies,
    throwout
  ]
};

const miniwalls = {
  type: 1,
  name: "miniwalls",
  options: [
    {
      type: 3,
      name: "stat",
      choices: [
        { name: "wins", value: "wins" }
        { name: ""}
      ]
    }
  ]
};

const partygames = {
  type: 1,
  name: "partygames",
  options: [
    {
      type: 3,
      name: "stat"
    }
  ]
};

const pixelpainters = {
  type: 1,
  name: "pixelpainters",
  options: [
    {
      type: 3,
      name: "stat",
      choices: [
        { name: "wins", value: "wins" }
      ]
    },
    time
  ]
};

const seasonal = {
  type: 1,
  name: "seasonal",
  options: [
    {
      type: 3,
      name: "stat",
      choices: [
        {
          name: "easter wins",
          value: "easter"
        },
        {
          name: "scuba wins",
          value: "scuba"
        },
        {
          name: "halloween wins",
          value: "halloween"
        },
        {
          name: "grinch wins",
          value: "grinch"
        },
        {
          name: "total wins",
          value: "total"
        },
        {
          name: "points scuba",
          value: "pointsScuba"
        },
        {
          name: "found scuba",
          value: "foundScuba"
        },
        {
          name: "found easter",
          value: "foundEaster"
        },
        {
          name: "found halloween",
          value: "foundHalloween"
        }
      ]
    },
    time
  ]
};

const zombies = {
  type: 1,
  name: "zombies",
  options: [
    {
      type: 3,
      name: "stat",
      required: true,
      choices: [
        {
          name: "wins",
          value: "wins_zombies"
        },
        {
          name: "bad blood wins",
          value: "wins_zombies_badblood"
        },
        {
          name: "dead end wins",
          value: "wins_zombies_deadend"
        },
        {
          name: "alien arcadium wins",
          value: "wins_zombies_alienarcadium"
        }
      ]
    },
    time
  ]
};

const throwout = {
  type: 1,
  name: "throwout",
  options: [
    {
      type: 3,
      name: "stat",
      required: true,
      choices: [
        {
          name: "wins",
          value: "wins"
        },
        {
          name: "kills",
          value: "kills"
        },
        {
          name: "deaths",
          value: "deaths"
        }
      ]
    },
    time
  ]
};

const time = {
  type: 3,
  name: "time",
  choices: [
    {
      name: "lifetime",
      value: "l"
    },
    {
      name: "daily",
      value: "d"
    },
    {
      name: "weekly",
      value: "w"
    },
    {
      name: "monthly",
      value: "m"
    }
  ]
};