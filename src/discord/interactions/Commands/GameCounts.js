module.exports = {
    name: "game-counts",
    description: "Get the amount of players in different arcade games.",
    options: [
        {
            type: 3,
            name: "game",
            description: "The game you want to see the specific count of",
            required: false,
        },
    ],
};
