module.exports = {
  name: "stats",
  description: "Get stats from an arcade game",
  options: [
    {
      type: 1,
      name: "blocking-dead",
      description: "Get stats from blocking dead",
      options: [
        {
          type: 3,
          name: "player",
          description: "",
          required: true
        }
      ]
    },
    {
      type: 1,
      name: "bounty-hunters",
      description: "Get stats from bounty hunters",
      options: [
        {
          type: 3,
          name: "player",
          description: "",
          required: true
        }
      ]
    },
    {
      type: 1,
      name: "capture-the-wool",
      description: "Get stats from capture the wool",
      options: [
        {
          type: 3,
          name: "player",
          description: "",
          required: true
        }
      ]
    },
    {
      type: 1,
      name: "dragon-wars",
      description: "Get stats from dragon wars",
      options: [
        {
          type: 3,
          name: "player",
          description: "",
          required: true
        }
      ]
    },
    {
      type: 1,
      name: "ender-spleef",
      description: "Get stats from ender spleef",
      options: [
        {
          type: 3,
          name: "player",
          description: "",
          required: true
        }
      ]
    },
    {
      type: 1,
      name: "football",
      description: "Get stats from football",
      options: [
        {
          type: 3,
          name: "player",
          description: "",
          required: true
        }
      ]
    },
    {
      type: 1,
      name: "galaxy-wars",
      description: "Get stats from galaxy wars",
      options: [
        {
          type: 3,
          name: "player",
          description: "",
          required: true
        }
      ]
    },
    {
      type: 1,
      name: "hide-and-seek",
      description: "Get stats from hide and seek",
      options: [
        {
          type: 3,
          name: "player",
          description: "",
          required: true
        }
      ]
    },
    {
      type: 1,
      name: "hole-in-the-wall",
      description: "Get stats from hole in the wall",
      options: [
        {
          type: 3,
          name: "player",
          description: "",
          required: true
        }
      ]
    },
    {
      type: 1,
      name: "hypixel-says",
      description: "Get stats from hypixel says",
      options: [
        {
          type: 3,
          name: "player",
          description: "",
          required: true
        }
      ]
    },
    {
      type: 1,
      name: "mini-walls",
      description: "Get stats from mini walls",
      options: [
        {
          type: 3,
          name: "player",
          description: "",
          required: true
        }
      ]
    },
    {
      type: 1,
      name: "pixel-painters",
      description: "Get stats from pixel painters",
      options: [
        {
          type: 3,
          name: "player",
          description: "",
          required: true
        }
      ]
    },
    {
      type: 1,
      name: "seasonal-games",
      description: "Get stats from seasonal games",
      options: [
        {
          type: 3,
          name: "player",
          description: "",
          required: true
        },
        {
          type: 3,
          name: "game",
          description: "",
          required: false,
          choices: [
            {
              key: "ChoiceOption-1629845280535",
              name: "easter",
              value: null
            },
            {
              key: "ChoiceOption-1629845300598",
              name: "scuba",
              value: null
            },
            {
              key: "ChoiceOption-1629845304745",
              name: "halloween",
              value: null
            },
            {
              key: "ChoiceOption-1629845312887",
              name: "grinch",
              value: null
            },
            {
              key: "ChoiceOption-1629845331392",
              name: "all",
              value: null
            }
          ]
        }
      ]
    },
    {
      type: 1,
      name: "throw-out",
      description: "Get stats from throw out",
      options: [
        {
          type: 3,
          name: "player",
          description: "",
          required: true
        }
      ]
    },
    {
      type: 1,
      name: "party-games",
      description: "Get stats from party games",
      options: [
        {
          type: 3,
          name: "player",
          description: "",
          required: true
        },
        {
          type: 3,
          name: "game",
          description: "",
          required: false,
          choices: [
            {
              name: "animal-slaughter",
              value: null
            },
            {
              name: "anvil-spleef",
              value: null
            },
            {
              name: "avalanche",
              value: null
            },
            {
              name: "bombardment",
              value: null
            },
            {
              name: "cannon-painting",
              value: null
            },
            {
              name: "chicken-rings",
              value: null
            },
            {
              name: "dive",
              value: null
            },
            {
              name: "fire-leapers",
              value: null
            },
            {
              name: "frozen-floor",
              value: null
            },
            {
              name: "high-ground",
              value: null
            },
            {
              name: "high-ground",
              value: null
            },
            {
              name: "hoe-hoe-hoe",
              value: null
            },
            {
              name: "jigsaw-rush",
              value: null
            },
            {
              name: "parkour",
              value: null
            },
            {
              name: "lab-escape",
              value: null
            },
            {
              name: "lawn-moower",
              value: null
            },
            {
              name: "minecart-racing",
              value: null
            },
            {
              name: "pig-fishing",
              value: null
            },
            {
              name: "pig-jousting",
              value: null
            },
            {
              name: "rpg-16",
              value: null
            },
            {
              name: "shooting-range",
              value: null
            },
            {
              name: "spider-maze",
              value: null
            },
            {
              name: "super-sheep",
              value: null
            },
            {
              name: "trampolinio",
              value: null
            },
            {
              name: "volcano",
              value: null
            },
            {
              name: "workshop",
              value: null
            }
          ]
        }
      ]
    },
    {
      type: 1,
      name: "zombies",
      description: "Get stats from zombies",
      options: [
        {
          type: 3,
          name: "player",
          description: "",
          required: true,
          choices: []
        },
        {
          type: 3,
          name: "map",
          description: "",
          required: false,
          choices: [
            {
              name: "bad-blood",
              value: null
            },
            {
              name: "dead-end",
              value: null
            },
            {
              name: "alien-arcadium",
              value: null
            }
          ]
        }
      ]
    }
  ]
};