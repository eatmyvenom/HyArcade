const { MessageEmbed } = require("discord.js");

function stringify(str) {
    return "" + str;
}

function numberify(str) {
    return Number(("" + str).replace(/undefined/g, 0).replace(/null/g, 0));
}

function formatNum(number) {
    return Intl.NumberFormat("en").format(number);
}

module.exports = class AdvancedEmbeds {
    
    static compareStats(acc1, acc2, game) {
    
    let embed = new MessageEmbed()
        .setTitle(`${acc1.name} vs ${acc2.name}`)
        .setColor(0xbb00dd);

    let side1 = "";
    let side2 = "";

        switch (game.toLowerCase()) {
            case "12":
            case "party":
            case "partygames":
            case "pg": {
                side1 += `**Party games wins**\n${formatNum(numberify(acc1.wins))}`
                side2 += `**Party games wins**\n${formatNum(numberify(acc2.wins))}`
                break;
            }

            case "fh":
            case "farm":
            case "fmhnt":
            case "farmhunt":
            case "5":
            case "frmhnt": {
                side1 += `**Farm hunt wins**\n${formatNum(numberify(acc1.farmhuntWins))}\n**Farm hunt poop**\n${formatNum(numberify(acc1.farmhuntShit))}`
                side2 += `**Farm hunt wins**\n${formatNum(numberify(acc2.farmhuntWins))}\n**Farm hunt poop**\n${formatNum(numberify(acc2.farmhuntShit))}`
                break;
            }
            case "10":
            case "hs":
            case "hys":
            case "hypixel":
            case "says":
            case "hysays": {
                side1 += `**Hypixel says wins**\n${formatNum(numberify(acc1.hypixelSaysWins))}\n**Hypixel says Rounds**\n${formatNum(numberify(acc1.hypixelSaysWins))}`
                side2 += `**Hypixel says wins**\n${formatNum(numberify(acc2.extras.hypixelSaysRounds))}\n**Hypixel says Rounds**\n${formatNum(numberify(acc2.extras.hypixelSaysRounds))}`
                break;
            }

            case "8":
            case "hitw":
            case "hit":
            case "hole":
            case "pain": {
                side1 += `**HITW wins**\n${formatNum(numberify(acc1.hitwWins))}\n` +
                            `**HITW qualifiers**\n${formatNum(numberify(acc1.hitwQual))}` +
                            `**HITW finals**\n${formatNum(numberify(acc1.hitwFinal))}` +
                            `**HITW walls**\n${formatNum(numberify(acc1.hitwRounds))}`


                side2 += `**HITW wins**\n${formatNum(numberify(acc2.hitwWins))}\n` +
                            `**HITW qualifiers**\n${formatNum(numberify(acc2.hitwQual))}` +
                            `**HITW finals**\n${formatNum(numberify(acc2.hitwFinal))}` +
                            `**HITW walls**\n${formatNum(numberify(acc2.hitwRounds))}`
                break;
            }

            case "11":
            case "mw":
            case "miw":
            case "mini":
            case "mwall":
            case "wall":
            case "pvp":
            case "miniwalls": {
                side1 += `**Mini walls wins**\n${formatNum(numberify(acc1.miniWallsWins))}\n` +
                            `**Mini walls kills**\n${formatNum(numberify(acc1.miniWalls.kills))}` +
                            `**Mini walls finals**\n${formatNum(numberify(acc1.miniWalls.finalKills))}` +
                            `**Mini walls wither damage**\n${formatNum(numberify(acc1.miniWalls.witherDamage))}` +
                            `**Mini walls wither kills**\n${formatNum(numberify(acc1.miniWalls.witherKills))}` +
                            `**Mini walls deaths**\n${formatNum(numberify(acc1.miniWalls.deaths))}`

                side2 += `**Mini walls wins**\n${formatNum(numberify(acc2.miniWallsWins))}\n` +
                            `**Mini walls kills**\n${formatNum(numberify(acc2.miniWalls.kills))}` +
                            `**Mini walls finals**\n${formatNum(numberify(acc2.miniWalls.finalKills))}` +
                            `**Mini walls wither damage**\n${formatNum(numberify(acc2.miniWalls.witherDamage))}` +
                            `**Mini walls wither kills**\n${formatNum(numberify(acc2.miniWalls.witherKills))}` +
                            `**Mini walls deaths**\n${formatNum(numberify(acc2.miniWalls.deaths))}`
                break;
            }

            case "6":
            case "sc":
            case "fb":
            case "foot":
            case "ballin":
            case "fuck":
            case "shit":
            case "football": {
                side1 += `**Football wins**\n${formatNum(numberify(acc1.footballWins))}\n` +
                            `**Football goals**\n${formatNum(numberify(acc1.extras.footballGoals))}` +
                            `**Football power kicks**\n${formatNum(numberify(acc1.extras.footballPKicks))}` +
                            `**Football kicks**\n${formatNum(numberify(acc1.extras.footballKicks))}`

                side2 += `**Football wins**\n${formatNum(numberify(acc2.footballWins))}\n` +
                            `**Football goals**\n${formatNum(numberify(acc2.extras.footballGoals))}` +
                            `**Football power kicks**\n${formatNum(numberify(acc2.extras.footballPKicks))}` +
                            `**Football kicks**\n${formatNum(numberify(acc2.extras.footballKicks))}`

                break;
            }

            case "4":
            case "es":
            case "spleeg":
            case "ender":
            case "enderman":
            case "trash":
            case "enderspleef": {
                side1 += `**Ender spleef wins**\n${formatNum(numberify(acc1.enderSpleefWins))}`
                side2 += `**Ender spleef wins**\n${formatNum(numberify(acc2.enderSpleefWins))}`
                break;
            }

            case "15":
            case "to":
            case "throw":
            case "toss":
            case "sumo2":
            case "throwout": {
                side1 += `**Throw out wins**\n${formatNum(numberify(acc1.throwOutWins))}\n` +
                            `**Throw out kills**\n${formatNum(numberify(acc1.extras.throwOutKills))}` +
                            `**Throw out deaths**\n${formatNum(numberify(acc1.extras.throwOutDeaths))}`

                side2 += `**Throw out wins**\n${formatNum(numberify(acc2.throwOutWins))}\n` +
                            `**Throw out kills**\n${formatNum(numberify(acc2.extras.throwOutKills))}` +
                            `**Throw out deaths**\n${formatNum(numberify(acc2.extras.throwOutDeaths))}`

                break;
            }

            case "7":
            case "gw":
            case "sw":
            case "galaxy":
            case "galaxywars": {
                side1 += `**Galaxy wars wins**\n${formatNum(numberify(acc1.galaxyWarsWins))}\n` +
                            `**Galaxy wars kills**\n${formatNum(numberify(acc1.extras.galaxyWarsKills))}` +
                            `**Galaxy wars deaths**\n${formatNum(numberify(acc1.extras.galaxyWarsDeaths))}`

                side2 += `**Galaxy wars wins**\n${formatNum(numberify(acc2.galaxyWarsWins))}\n` +
                            `**Galaxy wars kills**\n${formatNum(numberify(acc2.extras.galaxyWarsKills))}` +
                            `**Galaxy wars deaths**\n${formatNum(numberify(acc2.extras.galaxyWarsDeaths))}`

                break;
            }

            case "3":
            case "dw":
            case "dragon":
            case "dragonwars": {
                side1 += `**Dragon wars wins**\n${formatNum(numberify(acc1.dragonWarsWins))}\n` +
                            `**Dragon wars kills**\n${formatNum(numberify(acc1.extras.dragonWarsKills))}`

                side2 += `**Dragon wars wins**\n${formatNum(numberify(acc2.dragonWarsWins))}\n` +
                            `**Dragon wars kills**\n${formatNum(numberify(acc2.extras.dragonWarsKills))}`

                break;
            }

            case "2":
            case "bh":
            case "bnt":
            case "one":
            case "bounty":
            case "oneinthequiver":
            case "bountyhunters": {
                side1 += `**Bounty hunters wins**\n${formatNum(numberify(acc1.bountyHuntersWins))}\n` +
                            `**Bounty hunters kills**\n${formatNum(numberify(acc1.extras.bountyHuntersKills))}` +
                            `**Bounty hunters deaths**\n${formatNum(numberify(acc1.extras.bountyHuntersDeaths))}`

                side2 += `**Bounty hunters wins**\n${formatNum(numberify(acc2.bountyHuntersWins))}\n` +
                            `**Bounty hunters kills**\n${formatNum(numberify(acc2.extras.bountyHuntersKills))}` +
                            `**Bounty hunters deaths**\n${formatNum(numberify(acc2.extras.bountyHuntersDeaths))}`

                break;
            }

            case "1":
            case "bd":
            case "do":
            case "dayone":
            case "blocking":
            case "blockingdead": {
                side1 += `**Blocking dead wins**\n${formatNum(numberify(acc1.blockingDeadWins))}\n` +
                            `**Blocking dead kills**\n${formatNum(numberify(acc1.extras.blockingDeadKills))}` +
                            `**Blocking dead headshots**\n${formatNum(numberify(acc1.extras.blockingDeadHeadshots))}`

                side2 += `**Blocking dead wins**\n${formatNum(numberify(acc2.blockingDeadWins))}\n` +
                            `**Blocking dead kills**\n${formatNum(numberify(acc2.extras.blockingDeadKills))}` +
                            `**Blocking dead headshots**\n${formatNum(numberify(acc2.extras.blockingDeadHeadshots))}`

                break;
            }

            case "9":
            case "has":
            case "hide":
            case "h&s":
            case "hns":
            case "probotkeptspammingthisshit":
            case "hideandseek":
            case "hidenseek":
            case "hideseek": {
                side1 += `**Hide and seek wins**\n${formatNum(numberify(acc1.hideAndSeekWins))}\n` +
                            `**Hide and seek kills**\n${formatNum(numberify(acc1.hnsKills))}` +
                            `**Hide and seek seeker wins**\n${formatNum(numberify(acc1.extras.HNSSeekerWins))}` +
                            `**Hide and seek hider wins**\n${formatNum(numberify(acc1.extras.HNSHiderWins))}`

                side2 += `**Hide and seek wins**\n${formatNum(numberify(acc2.hideAndSeekWins))}\n` +
                            `**Hide and seek kills**\n${formatNum(numberify(acc2.hnsKills))}` +
                            `**Hide and seek seeker wins**\n${formatNum(numberify(acc2.extras.HNSSeekerWins))}` +
                            `**Hide and seek hider wins**\n${formatNum(numberify(acc2.extras.HNSHiderWins))}`

                break;
            }

            case "16":
            case "z":
            case "zs":
            case "zbs":
            case "zomb":
            case "zbies":
            case "zombies": {
                side1 += `**Zombies wins**\n${formatNum(numberify(acc1.zombiesWins))}`
                side2 += `**Zombies wins**\n${formatNum(numberify(acc2.zombiesWins))}`
                break;
            }

            case "ctw":
            case "ctwool":
            case "capkills":
            case "capture":
            case "capwool":
            case "ctwwool":
            case "ctwwoolcaptured":
            case "ctwkills": {
                side1 += `**CTW kills**\n${formatNum(numberify(acc1.ctwKills))}\n` +
                            `**CTW wool captured**\n${formatNum(numberify(acc1.ctwWoolCaptured))}`

                side2 += `**CTW kills**\n${formatNum(numberify(acc2.ctwKills))}\n` +
                            `**CTW wool captured**\n${formatNum(numberify(acc2.ctwWoolCaptured))}`

                break;
            }

            case "13":
            case "pp":
            case "draw":
            case "pixpaint":
            case "pixelpaint":
            case "pixelpainters":
            case "drawmything":
            case "drawtheirthing":
            case "drawing": {
                side1 += `**Pixel painter wins**\n${formatNum(numberify(acc1.pixelPaintersWins))}`
                side2 += `**Pixel painter wins**\n${formatNum(numberify(acc2.pixelPaintersWins))}`

                break;
            }
        }

        embed.addField(acc1.name, side1, true);
        embed.addField(acc2.name, side2, true);

        return
    }
}