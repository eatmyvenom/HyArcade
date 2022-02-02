module.exports = {
  name: "top-games",
  description: "Get a players top games won in arcade games",
  options: [
    {
      type: 3,
      name: "player",
      description: "The player you want to see the top games of",
      required: true,
    },
    {
      type: 3,
      name: "time",
      description: "The time type you want to see",
      required: false,
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
  ],
};
