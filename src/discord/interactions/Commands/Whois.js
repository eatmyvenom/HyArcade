module.exports = {
    name: "whois",
    description: "Get the discord account linked to a specifc minecraft account",
    options: [
        {
            type: 3,
            name: "player",
            description: "The player you want to get the discord account of",
            required: false,
        },
    ],
};