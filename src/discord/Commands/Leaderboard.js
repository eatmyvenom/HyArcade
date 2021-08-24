const {
  MessageEmbed,
  Message,
  CommandInteraction
} = require("discord.js");
const BotUtils = require("../BotUtils");
const Command = require("../../classes/Command");
const listUtils = require("../../listUtils");
const logger = require("hyarcade-logger");
const {
  stringLBAdv
} = require("../../listUtils");

/**
 * @param {string} prop
 * @param {string} timetype
 * @param {number} limit
 * @param {string} category
 * @param {number} start
 * @returns {MessageEmbed}
 */
async function getLB (prop, timetype, limit, category, start) {
  let res = "";
  let time;

  switch(timetype) {
  case "d":
  case "day":
  case "daily": {
    time = "Daily";
    res = await listUtils.stringLBDiff(prop, limit, "day", category, start);
    break;
  }

  case "w":
  case "week":
  case "weak":
  case "weekly": {
    time = "Weekly";
    res = await listUtils.stringLBDiff(prop, limit, "weekly", category, start);
    break;
  }

  case "m":
  case "mon":
  case "month":
  case "monthly": {
    time = "Monthly";
    res = await listUtils.stringLBDiff(prop, limit, "monthly", category, start);
    break;
  }

  case "a":
  case "all":
  case "*": {
    let day = await listUtils.stringLBDiff(prop, limit, "day", category, start);
    let week = await listUtils.stringLBDiff(prop, limit, "weekly", category, start);
    let month = await listUtils.stringLBDiff(prop, limit, "monthly", category, start);
    const life = await listUtils.stringLB(prop, limit, category, start);

    day = day == "" ? "Nobody has won" : day;
    week = week == "" ? "Nobody has won" : week;
    month = month == "" ? "Nobody has won" : month;

    const embed = new MessageEmbed()
      .setColor(0x00cc66)
      .addField("Daily", day, true)
      .addField("Weekly", week, true)
      .addField("\u200B", "\u200B", true)
      .addField("Monthly", month, true)
      .addField("Lifetime", life, true)
      .addField("\u200B", "\u200B", true);

    return embed;
  }

  default: {
    time = "Lifetime";
    res = await listUtils.stringLB(prop, limit, category, start);
    break;
  }
  }

  res = res != "" ? res : "Nobody has won.";
  const embed = new MessageEmbed().setTitle(time)
    .setColor(0x00cc66)
    .setDescription(res);

  if(res.length > 6000) {
    return new MessageEmbed()
      .setTitle("ERROR")
      .setColor(0xff0000)
      .setDescription(
        "You have requested an over 6000 character response, this is unable to be handled and your request has been ignored!"
      );
  }

  if(res.length > 2000) {
    let resArr = res.trim().split("\n");
    embed.setDescription("");
    while(resArr.length > 0) {
      const end = Math.min(25, resArr.length);
      embed.addField("\u200b", resArr.slice(0, end).join("\n"), false);
      resArr = resArr.slice(end);
    }
  }

  return embed;
}

/**
 * @param {object} o
 * @param {string} s
 * @returns {*}
 */
function getProp (o, s) {
  let obj = o;
  let str = s;
  str = str.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
  str = str.replace(/^\./, ""); // strip a leading dot
  const a = str.split(".");
  for(let i = 0, n = a.length; i < n; i += 1) {
    const k = a[i];
    if(k in obj) {
      obj = obj[k];
    } else {
      return;
    }
  }
  return obj;
}

module.exports = new Command("leaderboard", ["*"], hander);

/**
 * 
 * @param {string[]} args 
 * @param {Message} rawMsg 
 * @param {CommandInteraction} interaction 
 * @returns {object}
 */
async function hander (args, rawMsg, interaction) {
  const startTime = Date.now();
  if(interaction != undefined && !interaction.isButton()) {
    logger.debug("Deferring interaction");
    await interaction.defer();
  }

  if(interaction.isButton()) {
    await interaction.deferUpdate();
  }

  const type = args[0];
  let timetype = args[1] != undefined ? args[1] : "lifetime";
  const limit = args[2] != undefined ? Number(args[2]) : 10;
  const startingIndex = args[3] != undefined ? Number(args[3]) : 0;
  let res = "";
  let gid = "";
  let gameName = "";

  switch(type.toLowerCase().trim()) {
  case "sex":
  case "sexy":
  case "party":
  case "partgam":
  case "party game":
  case "partygames":
  case "party games":
  case "pg": {
    gameName = "Party games";
    res = await getLB("wins", timetype, limit, "partyGames", startingIndex);
    gid = "pg";
    break;
  }

  case "fh":
  case "hot":
  case "farm":
  case "fmhnt":
  case "farmhunt":
  case "farm hunt":
  case "frmhnt": {
    gameName = "Farm hunt";
    res = await getLB("wins", timetype, limit, "farmhunt", startingIndex);
    gid = "fh";
    break;
  }

  case "fhp":
  case "fhpoop":
  case "poop":
  case "poopcollect":
  case "farmhuntpoop":
  case "farmhuntshit":
  case "shitcollected":
  case "poopcollected":
  case "fmhntpoop": {
    gameName = "Farm hunt poop";
    res = await getLB("poop", timetype, limit, "farmhunt", startingIndex);
    gid = "fhp";
    break;
  }

  case "hs":
  case "hsays":
  case "hypixel_says":
  case "hypixel says":
  case "hypixelsay":
  case "hypixelsays":
  case "hys":
  case "hypixel":
  case "says":
  case "hysays": {
    gameName = "Hypixel Says";
    res = await getLB("wins", timetype, limit, "hypixelSays", startingIndex);
    gid = "hs";
    break;
  }

  case "hitw":
  case "hit":
  case "hole":
  case "holeinthehole":
  case "woleinthehall":
  case "holeinthewall":
  case "holewall":
  case "wallhole":
  case "wally":
  case "speedbuilders":
  case "h.i.t.w.":
  case "pain": {
    gameName = "Hole in the wall";
    res = await getLB("wins", timetype, limit, "holeInTheWall", startingIndex);
    gid = "hitw";
    break;
  }

  case "mw":
  case "miw":
  case "mini":
  case "mwall":
  case "wall":
  case "pvp":
  case "miniwalls":
  case "mwwins": {
    gameName = "Mini walls";
    res = await getLB("wins", timetype, limit, "miniWalls", startingIndex);
    gid = "mw";
    break;
  }

  case "mwk":
  case "mwkills": {
    gameName = "Mini Walls Kills";
    res = await getLB("kills", timetype, limit, "miniWalls", startingIndex);
    gid = "mwk";
    break;
  }

  case "mwd":
  case "mwdeaths": {
    gameName = "Mini Walls Deaths";
    res = await getLB("deaths", timetype, limit, "miniWalls", startingIndex);
    gid = "mwd";
    break;
  }

  case "mwwd":
  case "mwwitherdmg": {
    gameName = "Mini Walls Wither Damage";
    res = await getLB("witherDamage", timetype, limit, "miniWalls", startingIndex);
    gid = "mwwd";
    break;
  }

  case "mwwk":
  case "mwwitherkills": {
    gameName = "Mini Walls Wither Kills";
    res = await getLB("witherKills", timetype, limit, "miniWalls", startingIndex);
    gid = "mwwk";
    break;
  }

  case "mwf":
  case "mwfinals": {
    gameName = "Mini Walls Final Kills";
    res = await getLB("finalKills", timetype, limit, "miniWalls", startingIndex);
    gid = "mwf";
    break;
  }

  case "sc":
  case "fb":
  case "foot":
  case "ballin":
  case "fuck":
  case "shit":
  case "football": {
    gameName = "Football";
    res = await getLB("wins", timetype, limit, "football", startingIndex);
    gid = "fb";
    break;
  }

  case "es":
  case "spleeg":
  case "ender":
  case "enderman":
  case "trash":
  case "enderspleef": {
    gameName = "Ender spleef";
    res = await getLB("wins", timetype, limit, "enderSpleef", startingIndex);
    gid = "es";
    break;
  }

  case "to":
  case "throw":
  case "toss":
  case "sumo2":
  case "throwout": {
    gameName = "Throw out";
    res = await getLB("wins", timetype, limit, "throwOut", startingIndex);
    gid = "to";
    break;
  }

  case "tok":
  case "throwkills":
  case "tokills": {
    gameName = "Throw out kills";
    res = await getLB("kills", timetype, limit, "throwOut", startingIndex);
    gid = "tok";
    break;
  }

  case "gw":
  case "sw":
  case "galaxy":
  case "galaxywar":
  case "galawar":
  case "galaxywars": {
    gameName = "Galaxy wars";
    res = await getLB("wins", timetype, limit, "galaxyWars", startingIndex);
    gid = "gw";
    break;
  }

  case "dw":
  case "dragon":
  case "dragonwar":
  case "dragon war":
  case "fuckyousnoop":
  case "fuck you snoop":
  case "draggin":
  case "wagon":
  case "dwar":
  case "dawar":
  case "dragwar":
  case "dragonwars":
  case "dragon wars": {
    gameName = "Dragon wars";
    res = await getLB("wins", timetype, limit, "dragonWars", startingIndex);
    gid = "dw";
    break;
  }

  case "bh":
  case "bnt":
  case "one":
  case "oneinthequiver":
  case "bountyhunters": {
    gameName = "Bounty hunters";
    res = await getLB("wins", timetype, limit, "bountyHunters", startingIndex);
    gid = "bh";
    break;
  }

  case "bd":
  case "do":
  case "dayone":
  case "walkingdead":
  case "blocking":
  case "blockingdead": {
    gameName = "Blocking dead";
    res = await getLB("wins", timetype, limit, "blockingDead", startingIndex);
    gid = "bd";
    break;
  }

  case "arc":
  case "arcade":
  case "all": {
    gameName = "Arcade wins";
    res = await getLB("arcadeWins", timetype, limit, undefined, startingIndex);
    gid = "arc";
    break;
  }

  case "has":
  case "hide":
  case "h&s":
  case "hns":
  case "probotkeptspammingthisshit":
  case "hideandseek":
  case "hidenseek":
  case "hideseek": {
    gameName = "Hide and seek";
    res = await getLB("wins", timetype, limit, "hideAndSeek", startingIndex);
    gid = "hns";
    break;
  }

  case "hnsk":
  case "hnskills":
  case "haskills":
  case "hidekills":
  case "hiderkills":
  case "seekerkills":
  case "hide and seek kills": {
    gameName = "Hide and seek kills";
    res = await getLB("kills", timetype, limit, "hideAndSeek", startingIndex);
    gid = "hnsk";
    break;
  }

  case "z":
  case "zs":
  case "zbs":
  case "zomb":
  case "zbies":
  case "zombies": {
    gameName = "Zombies";
    res = await getLB("wins_zombies", timetype, limit, "zombies", startingIndex);
    gid = "z";
    break;
  }

  case "ctw":
  case "capkills":
  case "ctkills":
  case "ctwkills": {
    gameName = "Capture the wool kills";
    res = await getLB("kills", timetype, limit, "captureTheWool", startingIndex);
    gid = "ctw";
    break;
  }

  case "ctww":
  case "ctwool":
  case "capwool":
  case "ctwwool":
  case "ctwcaps":
  case "woolcap":
  case "caps":
  case "captures":
  case "woolcaps":
  case "ctwwoolcaptured": {
    gameName = "Capture the wool captures";
    res = await getLB("woolCaptured", timetype, limit, "captureTheWool", startingIndex);
    gid = "ctww";
    break;
  }

  case "pp":
  case "draw":
  case "pixpaint":
  case "pixelpaint":
  case "pixelpainters":
  case "pixelpainter":
  case "drawmything":
  case "drawtheirthing":
  case "drawing": {
    gameName = "Pixel painters";
    res = await getLB("wins", timetype, limit, "pixelPainters", startingIndex);
    gid = "pp";
    break;
  }

  case "c":
  case "coins":
  case "acoins":
  case "arccoins":
  case "arcadecoins":
  case "arcade_coins": {
    gameName = "Arcade coins";
    res = await getLB("arcadeCoins", timetype, limit, undefined, startingIndex);
    gid = "c";
    break;
  }

  case "esim":
  case "eastsim":
  case "easter":
  case "eastersim":
  case "eastersimulator":
  case "easter-simulator": {
    gameName = "Easter simulator";
    res = await getLB("easter", timetype, limit, "seasonalWins", startingIndex);
    gid = "esim";
    break;
  }

  case "ssim":
  case "scuba":
  case "scubasim":
  case "scubasimulator":
  case "scuba-simulator": {
    gameName = "Scuba simulator";
    res = await getLB("scuba", timetype, limit, "seasonalWins", startingIndex);
    gid = "ssim";
    break;
  }

  case "hsim":
  case "hallow":
  case "halloween":
  case "halloweensim":
  case "halloweensimulator":
  case "halloween-simulator": {
    gameName = "Halloween simulator";
    res = await getLB("halloween", timetype, limit, "seasonalWins", startingIndex);
    gid = "hsim";
    break;
  }

  case "gsim":
  case "grinch":
  case "grinchsim":
  case "grinchsimulator":
  case "grinch-simulator": {
    gameName = "Grinch simulator";
    res = await getLB("grinch", timetype, limit, "seasonalWins", startingIndex);
    gid = "gsim";
    break;
  }

  case "sim":
  case "tsim":
  case "totalsim":
  case "totalsimulator":
  case "total-simulator": {
    gameName = "Total simulator";
    res = await getLB("total", timetype, limit, "seasonalWins", startingIndex);
    gid = "tsim";
    break;
  }

  case "ap":
  case "achieve":
  case "achievemnts":
  case "ach":
  case "advancements":
  case "advance":
  case "achiev": {
    gameName = "Achievement points";
    res = await getLB("achievementPoints", timetype, limit, undefined, startingIndex);
    gid = "ap";
    break;
  }

  case "bhk":
  case "bhkills":
  case "bountyhunterkills":
  case "bountykill":
  case "oitckills":
  case "bountyhuntkills": {
    gameName = "Bounty hunter kills";
    res = await getLB("kills", timetype, limit, "bountyHunters", startingIndex);
    gid = "bhk";
    break;
  }

  case "dwk":
  case "dwkills":
  case "dragonkills":
  case "dragwarkills":
  case "wagonkills":
  case "dragwarkil":
  case "dragonwarskills": {
    gameName = "Dragon wars kills";
    res = await getLB("kills", timetype, limit, "dragonWars", startingIndex);
    gid = "dwk";
    break;
  }

  case "fbg":
  case "fbgoals":
  case "goal":
  case "goals":
  case "fbgoal":
  case "footballg":
  case "soccergoals":
  case "footballgoals": {
    gameName = "Football goals";
    res = await getLB("goals", timetype, limit, "football", startingIndex);
    gid = "fbg";
    break;
  }

  case "gwk":
  case "gwkills":
  case "galaxykills":
  case "galawarkills":
  case "galakills":
  case "galaxywarkil":
  case "galaxywarskills": {
    gameName = "Galaxy wars kills";
    res = await getLB("kills", timetype, limit, "galaxyWars", startingIndex);
    gid = "gwk";
    break;
  }

  case "hiderwins":
  case "hwins":
  case "hnshwins":
  case "hnshiderwins": {
    gameName = "HNS hider wins";
    res = await getLB("hiderWins", timetype, limit, "hideAndSeek", startingIndex);
    gid = "hwins";
    break;
  }

  case "seekerwins":
  case "swins":
  case "hnsswins":
  case "hnsseekerwins": {
    gameName = "HNS seeker wins";
    res = await getLB("seekerWins", timetype, limit, "hideAndSeek", startingIndex);
    gid = "swins";
    break;
  }

  default: {
    if(type.trim().startsWith(".")) {
      let lb;
      gameName = type.trim().slice(1);
      if(timetype == "lifetime" || timetype == "l") {
        timetype = "Lifetime";
        lb = await stringLBAdv((a, b) => (getProp(b, type.trim()) ?? 0) - (getProp(a, type.trim()) ?? 0), (a) => getProp(a, type.trim()), limit,
          (l) => l, startingIndex);
      } else {
        const embed = new MessageEmbed()
          .setTitle("ERROR")
          .setDescription(
            "Sorry that category does not exist. Go to [this page](https://docs.hyarcade.xyz/bots/Leaderboards) to see what is available."
          )
          .setColor(0xff0000);
        return {
          res: "",
          embed
        };
      }
      gid = undefined;
      res = new MessageEmbed().setTitle(timetype)
        .setColor(0x00cc66)
        .setDescription(lb);
    } else {
      const embed = new MessageEmbed()
        .setTitle("ERROR")
        .setDescription(
          "Sorry that category does not exist. Go to [this page](https://docs.hyarcade.xyz/bots/Leaderboards) to see what is available."
        )
        .setColor(0xff0000);
      return {
        res: "",
        embed
      };
    }
  }
  }

  const finalRes = res
    .setAuthor(`${gameName} leaderboard`, BotUtils.client.user.avatarURL());

  logger.out(`Leaderboard command ran in ${Date.now() - startTime}ms`);

  const response = {
    res: "",
    embed: finalRes,
    game: gid,
    start: startingIndex
  };
  if(interaction == undefined) {
    response.res =
            "**WARNING** This command will be disabled 2 weeks after hypixel was brought back up. Please use `/leaderboard` instead!";
  }
  return response;
}
