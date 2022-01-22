module.exports = {
  name: "party-games",
  description: "Get stats in party games",
  options: [{
    type: 3,
    name: "player",
    description: "The player you want to see the party games stats of",
    required: true,
  },
  {
    type: 3,
    name: "game",
    description: "The party game you want to see specific stats of",
    required: false,
    choices: [{
      name: "Overall",
      value: "Party Games",
    },
    {
      name: "Animal Slaughter",
      value: "Animal Slaughter",
    },
    {
      name: "Anvil Spleef",
      value: "Anvil Spleef",
    },
    {
      name: "Bombardment",
      value: "Bombardment",
    },
    {
      name: "Chicken Rings",
      value: "Chicken Rings",
    },
    {
      name: "Dive",
      value: "Dive",
    },
    {
      name: "High Ground",
      value: "High Ground",
    },
    {
      name: "Hoe Hoe Hoe",
      value: "Hoe Hoe Hoe",
    },
    {
      name: "Jigsaw Rush",
      value: "Jigsaw Rush",
    },
    {
      name: "Parkour",
      value: "Parkour",
    },
    {
      name: "Lab Escape",
      value: "Lab Escape",
    },
    {
      name: "Lawn Moower",
      value: "Lawn Moower",
    },
    {
      name: "Minecart Racing",
      value: "Minecart Racing",
    },
    {
      name: "RPG-16",
      value: "RPG-16",
    },
    {
      name: "Spider Maze",
      value: "Spider Maze",
    },
    {
      name: "Avalanche",
      value: "Avalanche",
    },
    {
      name: "Misc Pigs",
      value: "Misc Pigs",
    },
    {
      name: "Trampolinio",
      value: "Trampolinio",
    },
    {
      name: "Workshop",
      value: "Workshop",
    },
    {
      name: "Shooting Range",
      value: "Shooting Range",
    },
    {
      name: "Frozen Floor",
      value: "Frozen Floor",
    },
    {
      name: "Cannon Painting",
      value: "Cannon Painting",
    },
    {
      name: "Fire Leapers",
      value: "Fire Leapers",
    },
    {
      name: "Super Sheep",
      value: "Super Sheep",
    }
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
