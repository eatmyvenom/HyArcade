module.exports = {
    name: "leaderboard",
    description: "Get an arcade games leaderboard",
    options: [
        {
            type: 3,
            name: "game",
            description: "The game you want to see the leaderboard of ",
            required: true,
        },
        {
            type: 3,
            name: "type",
            description: "The time type of the leaderboard you want",
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
                {
                    name: "all",
                    value: "a",
                }
            ],
        },
        {
            type: 4,
            name: "amount",
            description: "The amount of players you want to see in the leaderboard",
            required: false,
        },
        {
            type: 4,
            name: "start",
            description: "The starting point you want to see on the leaderboard",
            required: false,
        },
    ],
};
