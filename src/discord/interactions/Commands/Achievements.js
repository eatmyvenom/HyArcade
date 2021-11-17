module.exports = {
  name: "achievements",
  description: "Get a players achievement completion in arcade games",
  options: [{
    type: 3,
    name: "player",
    description: "The player you want to see the achievements of",
    required: true,
  },
  {
    type: 3,
    name: "game",
    description: "The game you want to see specific achievements of",
    required: false,
    choices: [{
      name: "Overall",
      value: "overall",
    },
    {
      name: "Party games",
      value: "partyGames",
    },
    {
      name: "Farm hunt",
      value: "farmHunt",
    },
    {
      name: "Hole in the wall",
      value: "holeInTheWall",
    },
    {
      name: "Hypixel says",
      value: "hypixelSays",
    },
    {
      name: "Blocking dead",
      value: "blockingDead",
    },
    {
      name: "Mini walls",
      value: "miniWalls",
    },
    {
      name: "Football",
      value: "football",
    },
    {
      name: "Ender spleef",
      value: "enderSpleef",
    },
    {
      name: "Throw out",
      value: "throwOut",
    },
    {
      name: "Galaxy wars",
      value: "galaxyWars",
    },
    {
      name: "Dragon wars",
      value: "dragonWars",
    },
    {
      name: "Bounty hunters",
      value: "bountyHunters",
    },
    {
      name: "Hide and Seek",
      value: "hideAndSeek",
    },
    {
      name: "Zombies",
      value: "zombies",
    },
    {
      name: "Pixel painters",
      value: "pixelPainters",
    },
    {
      name: "Capture the wool",
      value: "captureTheWool",
    },
    ]
  },
  ],
};
