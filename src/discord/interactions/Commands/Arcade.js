module.exports = {
    name: "arcade",
    description: "A command with other various sub commands which don't need full commands.",
    options: [
        {
            type: 1,
            name: "link",
            description: "Link a users discord to their minecraft account",
            options: [
                {
                    type: 3,
                    name: "input",
                    description: "command input",
                    required: true,
                },
            ],
        },
        {
            type: 1,
            name: "lastupdate",
            description: "The last time the database updated",
            options: [],
        },
        {
            type: 1,
            name: "ez",
            description: "ez",
            options: [],
        },
    ],
};
