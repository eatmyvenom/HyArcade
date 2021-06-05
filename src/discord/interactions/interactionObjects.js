exports.helpCommand = {
    name: 'arcadehelp',
    description: 'Get help on using the arcade bot',
    options: [{
        name: 'topic',
        type: 'STRING',
        description: 'The topic you would like to get help with',
        required: false,
        choices: [
            {
                name: 'Help',
                value: 'topic_help'
            },
            {
                name: 'Verify',
                value: 'topic_verify'
            },
            {
                name: 'AddAccount',
                value: 'topic_newacc'
            },
            {
                name: "Stats",
                value: 'topic_stats'
            },
            {
                name: "Unlinked Stats",
                value: "topic_us"
            },
            {
                name : "Leaderboard",
                value: "topic_lb"
            },
            {
                name : "Games",
                value: "topic_games"
            },
            {
                name : "GetDataRaw",
                value: "topic_getraw"
            },
            {
                name : "Name History",
                value : "topic_names"
            },
            {
                name : "Who is",
                value : "topic_whois"
            }
        ],
    }],
};

exports.statsCommand = {
    
}

exports.cheatDetector = {
    name: 'cheatdetector',
    description: 'Check the likelyhood that a player is cheating',
    options: [{
        name: 'player',
        type: 'STRING',
        description: 'The player you would like to check',
        required: false
    }],
}