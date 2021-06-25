module.exports = {
    name: "compare",
    description: "Compare two players in a specific game",
    options: [
        {
            name: "player1",
            type: "STRING",
            description: "The 1st player you would like to compare",
            required: true,
        },
        {
            name: "player2",
            type: "STRING",
            description: "The 2nd player you would like to compare",
            required: true,
        },
        {
            name: "game",
            type: "STRING",
            description: "The game you would like to compare the players in",
            required: true,
        },
    ],
};