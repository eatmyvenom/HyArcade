module.exports = {
    name: "leaderboard",
    description: "Get an arcade games leaderboard",
    options: [
        {
            type: 3,
            name: "game",
            description: "The game you want to see the leaderboard of ",
            required: true,
            choices: [
                {
                    name : "Overall",
                    value: "arc",
                },
                {
                    name : "Party games",
                    value: "pg",
                },
                {
                    name : "Farm hunt",
                    value: "fh",
                },
                {
                    name : "Hole in the wall",
                    value: "hitw",
                },
                {
                    name : "Hypixel says",
                    value: "hs",
                },
                {
                    name : "Blocking dead",
                    value: "bd",
                },
                {
                    name : "Mini walls",
                    value: "mw",
                },
                {
                    name : "Football",
                    value: "fb",
                },
                {
                    name : "Ender spleef",
                    value: "es",
                },
                {
                    name : "Throw out",
                    value: "to",
                },
                {
                    name : "Galaxy wars",
                    value: "gw",
                },
                {
                    name : "Dragon wars",
                    value: "dw",
                },
                {
                    name : "Bounty hunters",
                    value: "bh",
                },
                {
                    name : "Hide and seek",
                    value: "hns",
                },
                {
                    name : "Zombies",
                    value: "z",
                },
                {
                    name : "Pixel painters",
                    value: "pp",
                },
                {
                    name : "Capture the wool",
                    value: "ctw",
                },
                {
                    name : "Seasonal games",
                    value: "sim",
                },
            ]
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
