module.exports = {
  name: "zombies",
  description: "Get zombies stats",
  options: [{
    type: 3,
    name: "player",
    description: "The player you want to see zombies stats for",
    required: true,
  }, {
    type: 3,
    name: "map",
    description: "",
    required: false,
    choices: [
      {
        name: "bad-blood",
        value: "bb"
      },
      {
        name: "dead-end",
        value: "de"
      },
      {
        name: "alien-arcadium",
        value: "aa"
      }
    ]
  } ],
};
