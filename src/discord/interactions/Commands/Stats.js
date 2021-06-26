module.exports = {
    name: "stats",
    description: "Get a players stats in arcade games",
    options: [
        {
            type: 3,
            name: "player",
            description: "The player you want to see the stats of",
            required: false,
        },
        {
            type: 3,
            name: "game",
            description: "The game you want to see specific stats of",
            required: false,
        },
    ],
};
