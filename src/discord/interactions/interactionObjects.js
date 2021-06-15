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
            },
            {
                name : "Player searching",
                value : "topic_searching"
            },
            {
                name : "Role handling",
                value : "topic_Role_Handling"
            }
        ],
    }],
};

exports.statsCommand = {
    "name": "stats",
    "description": "Get a players stats in arcade games",
    "options": [
        {
            "type": 3,
            "name": "player",
            "description": "The player you want to see the stats of",
            "required": false
        },
        {
            "type": 3,
            "name": "game",
            "description": "The game you want to see specific stats of",
            "required": false
        }
    ]
}

// exports.cheatDetector = {
//     name: 'cheatdetector',
//     description: 'Check the likelyhood that a player is cheating',
//     options: [{
//         name: 'player',
//         type: 'STRING',
//         description: 'The player you would like to check',
//         required: true // Most likely people will need to check someone else
//     }],
// }

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

exports.info = {
    "name": "info",
    "description": "Get info about the arcade bot"
}

exports.whois = {
    "name": "whois",
    "description": "Get the discord account linked to a specifc minecraft account",
    "options": [
        {
            "type": 3,
            "name": "player",
            "description": "The player you want to get the discord account of",
            "required": false
        }
    ]
}

exports.getdataraw = {
    "name": "getdataraw",
    "description": "Get some raw data from an account based on the database",
    "options": [
        {
            "type": 3,
            "name": "path",
            "description": "The field name of the data you are looking for",
            "required": true
        },
        {
            "type": 3,
            "name": "player",
            "description": "The player you want to see the data of",
            "required": false
        }
    ]
}

exports.addaccount = {
    "name": "addaccount",
    "description": "Add any account(s) to the database",
    "options": [
        {
            "type": 3,
            "name": "accounts",
            "description": "IGNs or UUIDs of the accounts you want added to the database",
            "required": true
        }
    ]
}

exports.namehistory = {
    "name": "namehistory",
    "description": "Get the name history of a player",
    "options": [
        {
            "type": 3,
            "name": "player",
            "description": "The player you want to see the name history of",
            "required": false
        }
    ]
}

exports.verify = {
    "name": "verify",
    "description": "Verify yourself in the arcade bot database",
    "options": [
        {
            "type": 3,
            "name": "player",
            "description": "The ign or uuid you would like to link yourself to",
            "required": true
        }
    ]
}

exports.leaderboard = require("./Commands/Leaderboard");