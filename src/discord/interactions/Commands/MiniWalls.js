module.exports = {
    "name": "miniwalls",
    "options": [
      {
        "type": 2,
        "name": "command",
        "description": "The command you would like to run",
        "options": [
          {
            "type": 1,
            "name": "stats",
            "description": "Get the miniwalls stats of a player",
            "options": [
              {
                "type": 3,
                "name": "player",
                "description": "The ign or uuid of the player you want the stats of",
                "required": false
              }
            ]
          },
          {
            "type": 1,
            "name": "leaderboard",
            "description": "Get a miniwalls leaderboard",
            "options": [
              {
                "type": 3,
                "name": "type",
                "description": "The leaderboard you would like",
                "required": false,
                "choices": []
              },
              {
                "type": 3,
                "name": "timeperiod",
                "description": "The time period you want stats from",
                "required": false,
                "choices": [
                  {
                    "key": "ChoiceOption-1623459217472",
                    "name": "lifetime",
                    "value": "lifetime"
                  },
                  {
                    "key": "ChoiceOption-1623459225989",
                    "name": "monthly",
                    "value": "monthly"
                  },
                  {
                    "key": "ChoiceOption-1623459233339",
                    "name": "daily",
                    "value": "daily"
                  },
                  {
                    "key": "ChoiceOption-1623459238991",
                    "name": "weekly",
                    "value": "weekly"
                  }
                ]
              },
              {
                "type": 4,
                "name": "amount",
                "description": "amount of players you want in the leaderboard",
                "required": false
              }
            ]
          }
        ]
      }
    ],
    "description": "Run a miniwalls command"
  }