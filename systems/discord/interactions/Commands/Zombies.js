module.exports = {
  name: "zombies",
  description: "Get zombies stats",
  options: [
    {
      type: 3,
      name: "player",
      description: "The player you want to see zombies stats for",
      required: true,
    },
    {
      type: 3,
      name: "map",
      description: "The Zombies map you want to see stats from",
      required: false,
      choices: [
        {
          name: "All",
          value: "",
        },
        {
          name: "Bad Blood",
          value: "bb",
        },
        {
          name: "Dead End",
          value: "de",
        },
        {
          name: "Alien Arcadium",
          value: "aa",
        },
      ],
    },
  ],
};
