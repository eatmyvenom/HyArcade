const {
    MessageActionRow,
    MessageSelectMenu
} = require("discord.js");

module.exports = class MenuGenerator {
    static statsMenu (uuid) {
        let row = new MessageActionRow();
        let menu = new MessageSelectMenu()
            .setMaxValues(1)
            .setMinValues(1)
            .setCustomId(`s:${uuid}:menu`)
            .setPlaceholder("Select game to see stats from")
            .addOptions([{
                label: "Overall Arcade",
                value: "arc",
                description: "Overall stats about arcade games"
            },
            {
                label: "Blocking dead",
                value: "bd",
                description: "Hypixel arcade blocking dead stats"
            },
            {
                label: "Bounty hunters",
                value: "bh",
                description: "Hypixel arcade bounty hunters stats"
            },
            {
                label: "Capture the wool",
                value: "ctw",
                description: "Hypixel arcade capture the wool stats"
            },
            {
                label: "Dragon wars",
                value: "dw",
                description: "Hypixel arcade dragon wars stats"
            },
            {
                label: "Ender spleef",
                value: "es",
                description: "Hypixel arcade ender spleef stats"
            },
            {
                label: "Farm hunt",
                value: "fh",
                description: "Hypixel arcade farm hunt stats"
            },
            {
                label: "Football",
                value: "fb",
                description: "Hypixel arcade football stats"
            },
            {
                label: "Galaxy wars",
                value: "gw",
                description: "Hypixel arcade galaxy wars stats"
            },
            {
                label: "Hide and seek",
                value: "hns",
                description: "Hypixel arcade hide and seek stats"
            },
            {
                label: "Hole in the wall",
                value: "hitw",
                description: "Hypixel arcade hole in the wall stats"
            },
            {
                label: "Hypixel says",
                value: "hs",
                description: "Hypixel arcade hypixel says stats"
            },
            {
                label: "Mini walls",
                value: "mw",
                description: "Hypixel arcade mini walls stats"
            },
            {
                label: "Party games",
                value: "pg",
                description: "Hypixel arcade party games stats"
            },
            {
                label: "Pixel painters",
                value: "pp",
                description: "Hypixel arcade pixel painters stats"
            },
            {
                label: "Seasonal games",
                value: "sim",
                description: "Stats for all of the hypixel seasonal games"
            },
            {
                label: "Throw out",
                value: "to",
                description: "Hypixel arcade throw out stats"
            },
            {
                label: "Zombies",
                value: "z",
                description: "Hypixel arcade zombies stats"
            },
            ]);

        row.addComponents(menu);
        return row;
    }
};
