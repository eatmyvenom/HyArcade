module.exports = {
  name: "leaderboard",
  description: "Get a mini walls leaderboard",
  options: [
    {
      type: 3,
      name: "type",
      description: "The type of leaderboard you want",
      required: true,
    },
    {
      type: 3,
      name: "time",
      description: "The time period you want to see",
      required: true,
      choices: [
        {
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
    {
      type: 4,
      name: "amount",
      description: "The amount of players you want to see in the leaderboard",
      required: false,
    },
  ],
};
