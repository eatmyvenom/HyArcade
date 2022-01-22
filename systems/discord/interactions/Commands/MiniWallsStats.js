module.exports = {
  name: "stats",
  description: "Get someones mini walls stats",
  options: [{
    type: 3,
    name: "player",
    description: "The player you want to see the mini walls stats of",
    required: true,
  },
  {
    type: 3,
    name: "time",
    description: "The time period you want to see",
    required: false,
    choices: [{
      name: "lifetime",
      value: "l",
    },
    {
      name: "daily",
      value: "d",
    },
    {
      name: "weekly",
      value: "w",
    },
    {
      name: "monthly",
      value: "m",
    },
    ],
  },
  ],
};
