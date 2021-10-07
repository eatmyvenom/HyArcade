module.exports = {
  name: "stats",
  description: "Get a players stats in arcade games",
  options: [{
    type: 3,
    name: "player",
    description: "The player you want to see the stats of",
    required: true,
  },
  {
    type: 3,
    name: "game",
    description: "The game you want to see specific stats of",
    required: false,
    choices: [{
      name: "Overall",
      value: "arc",
    },
    {
      name: "Party games",
      value: "pg",
    },
    {
      name: "Farm hunt",
      value: "fh",
    },
    {
      name: "Hole in the wall",
      value: "hitw",
    },
    {
      name: "Hypixel says",
      value: "hs",
    },
    {
      name: "Blocking dead",
      value: "bd",
    },
    {
      name: "Mini walls",
      value: "mw",
    },
    {
      name: "Football",
      value: "fb",
    },
    {
      name: "Ender spleef",
      value: "es",
    },
    {
      name: "Throw out",
      value: "to",
    },
    {
      name: "Galaxy wars",
      value: "gw",
    },
    {
      name: "Dragon wars",
      value: "dw",
    },
    {
      name: "Bounty hunters",
      value: "bh",
    },
    {
      name: "Hide and seek",
      value: "hns",
    },
    {
      name: "Zombies",
      value: "z",
    },
    {
      name: "Pixel painters",
      value: "pp",
    },
    {
      name: "Capture the wool",
      value: "ctw",
    },
    {
      name: "Seasonal games",
      value: "sim",
    },
    ]
  },
  {
    type: 3,
    name: "time",
    description: "The time period of stats you want",
    required: false,
    choices: [{
      name: "lifetime",
      value: "lifetime",
    },
    {
      name: "daily",
      value: "day",
    },
    {
      name: "weekly",
      value: "weekly",
    },
    {
      name: "monthly",
      value: "monthly",
    }
    ],
  },
  ],
};
