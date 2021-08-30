module.exports = {
  name: "arcade",
  description: "A command with other various sub commands which don't need full commands.",
  options: [{
    type: 1,
    name: "help",
    description: "Get help on using the arcade bot",
  },
  {
    type: 1,
    name: "ez",
    description: "ez",
    options: [],
  },
  {
    type: 1,
    name: "ping",
    description: "Get the bots ping and status",
    options: [],
  }
  ],
};
