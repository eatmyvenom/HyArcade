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
        required: true // Most likely people will need to check someone else
    }],
}

exports.compare = {
    name: 'compare',
    description: 'Compare two players in a specific game',
    options: [{
            name: 'player1',
            type: 'STRING',
            description: 'The 1st player you would like to compare',
            required: true
        },
        {
            name: 'player2',
            type: 'STRING',
            description: 'The 2nd player you would like to compare',
            required: true
        },
        {
            name: 'game',
            type: 'STRING',
            description: 'The game you would like to compare the players in',
            required: true
        }
    ],
}

module.exports.miniwalls = require('./Commands/MiniWalls');