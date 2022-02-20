const { MessageEmbed, User } = require("discord.js");
const { Account } = require("hyarcade-structures");
const Compare = require("./Compare");
const Arcade = require("./Stats/Arcade");

const BlockingDead = require("./Stats/BlockingDead");
const BountyHunters = require("./Stats/BountyHunters");
const CaptureTheWool = require("./Stats/CaptureTheWool");
const DragonWars = require("./Stats/DragonWars");
const EnderSpleef = require("./Stats/EnderSpleef");
const FarmHunt = require("./Stats/FarmHunt");
const Football = require("./Stats/Football");
const GalaxyWars = require("./Stats/GalaxyWars");
const HideAndSeek = require("./Stats/HideAndSeek");
const HoleInTheWall = require("./Stats/HoleInTheWall");
const HypixelSays = require("./Stats/HypixelSays");
const MiniWalls = require("./Stats/MiniWalls");
const PartyGames = require("./Stats/PartyGames");
const PixelPainters = require("./Stats/PixelPainters");
const SeasonalGames = require("./Stats/SeasonalGames");
const ThrowOut = require("./Stats/ThrowOut");
const Zombies = require("./Stats/Zombies");

module.exports = class AdvancedEmbeds {
  /**
   *
   * @param {Account} acc1
   * @param {Account} acc2
   * @param {string} game
   * @param {boolean} hasPerms
   * @returns {MessageEmbed}
   */
  static compareStats(acc1, acc2, game, hasPerms) {
    return Compare(acc1, acc2, game, hasPerms);
  }

  static async getStats(acc, game) {
    let rank = `${acc.rank}`.replace(/_PLUS/g, "+").replace(/undefined/g, "");

    rank = rank == "" ? "" : `[${rank}]`;

    let embed = new MessageEmbed()
      .setAuthor({ name: `${rank} ${acc.name}`, url: `https://hyarcade.xyz/player.html?q=${acc.name}` })
      .setThumbnail(`https://crafatar.com/renders/head/${acc.uuid}?overlay&time=${Date.now()}`)
      .setColor(0xee0061);

    let gamename = "";
    let title = "";

    switch (game.toLowerCase()) {
      case "12":
      case "party":
      case "partygames":
      case "pg": {
        embed = PartyGames(acc, embed);
        gamename = "pg";
        title = "Party games";
        break;
      }

      case "fh":
      case "farm":
      case "fmhnt":
      case "farmhunt":
      case "5":
      case "frmhnt": {
        embed = FarmHunt(acc, embed);
        title = "Farm hunt";
        gamename = "fh";
        break;
      }

      case "10":
      case "hs":
      case "hys":
      case "hypixel":
      case "says":
      case "hysays": {
        embed = HypixelSays(acc, embed);
        title = "Hypixel says";
        gamename = "hs";
        break;
      }

      case "8":
      case "hitw":
      case "hit":
      case "hole":
      case "pain": {
        embed = HoleInTheWall(acc, embed);
        title = "Hole in the wall";
        gamename = "hitw";
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
        embed = MiniWalls(acc, embed);
        title = "Mini walls";
        gamename = "mw";
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
        embed = Football(acc, embed);
        title = "Football";
        gamename = "fb";
        break;
      }

      case "4":
      case "es":
      case "endspleef":
      case "spleef":
      case "endermanspleef":
      case "anriespleef":
      case "spleeg":
      case "ender":
      case "enderman":
      case "trash":
      case "enderspleef": {
        embed = EnderSpleef(acc, embed);
        title = "Ender spleef";
        gamename = "es";
        break;
      }

      case "15":
      case "to":
      case "throw":
      case "toss":
      case "sumo2":
      case "throwout": {
        embed = ThrowOut(acc, embed);
        title = "Throw out";
        gamename = "to";
        break;
      }

      case "7":
      case "gw":
      case "sw":
      case "galaxy":
      case "galaxywars": {
        embed = GalaxyWars(acc, embed);
        title = "Galaxy wars";
        gamename = "gw";
        break;
      }

      case "3":
      case "dw":
      case "dragon":
      case "dragonwars": {
        embed = DragonWars(acc, embed);
        title = "Dragon wars";
        gamename = "dw";
        break;
      }

      case "2":
      case "bh":
      case "bnt":
      case "one":
      case "bounty":
      case "oneinthequiver":
      case "bountyhunters": {
        embed = BountyHunters(acc, embed);
        title = "Bounty hunters";
        gamename = "bh";
        break;
      }

      case "1":
      case "bd":
      case "do":
      case "dayone":
      case "blocking":
      case "blockingdead": {
        embed = BlockingDead(acc, embed);
        title = "Blocking dead";
        gamename = "bd";
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
        embed = HideAndSeek(acc, embed);
        title = "Hide and seek";
        gamename = "hns";
        break;
      }

      case "16":
      case "z":
      case "zs":
      case "zbs":
      case "zomb":
      case "zbies":
      case "zombies": {
        embed = Zombies(acc, embed);
        title = "Zombies";
        gamename = "z";
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
        embed = CaptureTheWool(acc, embed);
        title = "Capture the wool";
        gamename = "ctw";
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
        embed = PixelPainters(acc, embed);
        title = "Pixel painters";
        gamename = "pp";
        break;
      }

      case "sim":
      case "simulator":
      case "seasonal":
      case "season":
      case "14":
      case "sea": {
        embed = SeasonalGames(acc, embed);
        gamename = "sim";
        title = "Seasonal Games";
        break;
      }

      default: {
        embed = Arcade(acc, embed);
        gamename = "arc";
        title = "Overall";
        break;
      }
    }

    embed.setTitle(`:mag_right: ${title} stats`);

    return {
      res: "",
      embed,
      game: gamename,
    };
  }

  /**
   *
   * @param {string} ign
   * @param {User} user
   * @returns {MessageEmbed}
   */
  static playerLink(ign, user) {
    const embed = new MessageEmbed()
      .setTitle("Success")
      .setColor(0x00cc66)
      .setDescription(`<@${user.id}> was linked as ${ign}`)
      .setFooter({ text: `${user.id}` });

    return embed;
  }
};
