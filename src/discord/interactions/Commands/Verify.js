module.exports = {
    name: "verify",
    description: "Verify yourself in the arcade bot database",
    options: [
        {
            type: 3,
            name: "player",
            description: "The ign or uuid you would like to link yourself to",
            required: true,
        },
    ],
};
