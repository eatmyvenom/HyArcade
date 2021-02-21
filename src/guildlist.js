/* These guild lists are not accurate
 * this is due to the fact that if I add
 * every guild member it will take way 
 * too much time to regenerate the list 
 * every time. If anyone wants to have 
 * someone added please let me know.
 */
module.exports = function gld(accs) {
    let accounts = accs;
    let Guild = require("./guild")(accounts);
    return [
        new Guild("Mini",0,[
            "HammyInTheWall",
            "UekuInTheWall",
            "verybad_",
            "i1a",
            "liamgonemad",
            "Tabananaman",
            "Pasha300",
            "WinInTheWall",
            "itamar080607",
            "Arcxire",
            "_Hipo",
            "USOMUSKY",
            "Blackoutburst",
            "mvvi",
            "VeryLonelyTree",
            "rxob",
            "oojetager",
            "MasonInTheWall",
            "Blatser",
            "Ilomiswir",
            "bunniexoxo",
            "qSpider",
            "napness",
            "pastuuh",
            "xmuffins"
        ]),
        new Guild("Fidelity",0,[
            "yubg",
            "khaninthewall",
            "steakinthewall",
            "paethetic",
        ]),
        new Guild("TKJK", 0, [
            "UUUJTAGR_81",
            "jkGALAKTUS",
            "Pe3tr",
            "knacam",
            "Cukrenka",
            "FortuneLemon",
            "Aldix",
            "Krumpachnik",
            "aByee",
            "ThePoGoCZ"
        ]),
        new Guild("Cactus",0,[
            "minecraftoogle",
            "cute_god",
            "als_31",
            "cakeeplayz",
            "markynoodle",
            "v3n0m__",
            "fubyinthecutie",
            "BruhPogChamp",
            "wetaspoggers",
            "fuby",
            "coolswaggamer",
            "hotcheetah",
            "BotCheetah",
            "ghostly3",
            "Atni",
            "BadNeon",
            "kas61"
        ]),
        new Guild("sadvibes",0,[
            "jqkeup",
            "Faebled",
            "holidee"
        ]),
        new Guild("psoldiers",0,[
            "ILoveTHE77",
            "norriie"
        ]),
        new Guild("PartyGamers",0,[
            "CloverStyle",
            "DaniezOwo",
            "SkyCity17",
            "p3ppa_plg",
            "Galaxy_Senpai",
            "genkai95",
            "Chenchen87",
            "Swishfox",
            "Sebastitgames",
            "shiins",
            "0897david0897",
            "lllGhost",
            "BLKIN",
            "laura_something",
            "DarthEsme",
            "Ink0taScythe",
            "PartyGamesUpdate",
            "DrPickle_",
            "SuperMinerAAA",
            "PokemonCity17",
            "xLightW0lf",
            "Riiruu",
            "Cale73",
            "Aplanna",
            "Gigchad"
        ])
    ];
}