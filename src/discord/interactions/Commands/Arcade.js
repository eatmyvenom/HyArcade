module.exports = {
    name: "arcade",
    description: "A command with other various sub commands which don't need full commands.",
    options: [
        {
            type: 1,
            name: "help",
            description: "Get help on using the arcade bot",
            options: [
                {
                    name: "topic",
                    type: "STRING",
                    description: "The topic you would like to get help with",
                    required: false,
                    choices: [
                        {
                            name: "Help",
                            value: "topic_help",
                        },
                        {
                            name: "Verify",
                            value: "topic_verify",
                        },
                        {
                            name: "AddAccount",
                            value: "topic_newacc",
                        },
                        {
                            name: "Stats",
                            value: "topic_stats",
                        },
                        {
                            name: "Leaderboard",
                            value: "topic_lb",
                        },
                        {
                            name: "Games",
                            value: "topic_games",
                        },
                        {
                            name: "GetDataRaw",
                            value: "topic_getraw",
                        },
                        {
                            name: "Name History",
                            value: "topic_names",
                        },
                        {
                            name: "Who is",
                            value: "topic_whois",
                        },
                        {
                            name: "Player searching",
                            value: "topic_searching",
                        },
                        {
                            name: "Role handling",
                            value: "topic_Role_Handling",
                        },
                    ],
                },
            ],
        },
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
            name: "last-update",
            description: "The last time the database updated",
            options: [],
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
