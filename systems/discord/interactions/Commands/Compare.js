module.exports = {
  name: "compare",
  description: "Compare two players in a specific game",
  options: [
    {
      name: "player1",
      type: "STRING",
      description: "The 1st player you would like to compare",
      required: true,
    },
    {
      name: "player2",
      type: "STRING",
      description: "The 2nd player you would like to compare",
      required: true,
    },
    {
      name: "game",
      type: "STRING",
      description: "The game you would like to compare the players in",
      required: true,
      choices: [
        {
          name: "Overall",
          value: "arc",
        },
        {
          name: "All games",
          value: "all",
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
      ],
    },
  ],
};
