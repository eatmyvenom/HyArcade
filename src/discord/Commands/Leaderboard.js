const {
  Message,
  CommandInteraction,
  ButtonInteraction
} = require("discord.js");
const Command = require("../../classes/Command");
const logger = require("hyarcade-logger");
const getLB = require("../Utils/Leaderboards/GetLeaderboard");
const { ERROR_NO_LEADERBOARD } = require("../Utils/Embeds/StaticEmbeds");
const CommandResponse = require("../Utils/CommandResponse");
const { ERROR_ARGS_LENGTH } = require("../Utils/Embeds/DynamicEmbeds");
const ImageGenerator = require("../images/ImageGenerator");
const ButtonGenerator = require("../interactions/Buttons/ButtonGenerator");
const { MessageActionRow } = require("discord.js");
const { MessageButton } = require("discord.js");
const ReversedLBs = require("../Utils/Leaderboards/ReversedLBs");
const MillisecondLBs = require("../Utils/Leaderboards/MillisecondLBs");
const SecondLBs = require("../Utils/Leaderboards/SecondLBs");

/**
 * 
 * @param {number} time 
 * @returns {string}
 */
function ms2time (time) {
  const date = new Date(time);

  return `${
    date
      .getMinutes()
      .toString()
      .padStart(2, "0")
  }:${
    date
      .getSeconds()
      .toString()
      .padStart(2, "0")
  }.${
    date
      .getMilliseconds()
      .toString()
      .padStart(3, "0")
  }`;
}

/**
 * @param {number} secs
 * @returns {string}
 */
function toHHMMSS (secs) {
  const sec_num = parseInt(secs, 10);
  const hours   = Math.floor(sec_num / 3600);
  const minutes = Math.floor(sec_num / 60) % 60;
  const seconds = sec_num % 60;

  return [hours, minutes, seconds]
    .map((v) => v < 10 ? `0${v}` : v)
    .filter((v, i) => v !== "00" || i > 0)
    .join(":");
}

/**
 * 
 * @param {string[]} args 
 * @param {Message} rawMsg 
 * @param {CommandInteraction | ButtonInteraction} interaction 
 * @returns {object}
 */
async function hander (args, rawMsg, interaction) {
  // Start time before any packets are sent
  const startTime = Date.now();
  logger.verbose("Deferring");

  if(interaction != undefined && !interaction.isButton()) {
    logger.debug("Deferring interaction");
    await interaction.deferReply();
  } else if(interaction?.isButton()) {
    const row = new MessageActionRow({ components: [
      new MessageButton({ customId: "h", disabled: true, label: "    ⟵", style: "SECONDARY" }), new MessageButton({ customId: "h2", disabled: true, label: "⟶    ", style: "SECONDARY" })
    ] });
    await interaction.update({ components: [row] });
    interaction.deferred = true;
  }
  logger.verbose("Parsing");

  if(args.length < 1) {
    return new CommandResponse("", ERROR_ARGS_LENGTH(1));
  }

  const type = args[0] ?? "";
  const startingIndex = args[2] != undefined ? Number(args[2]) : 0;
  const timetype = args[1] ?? "lifetime";

  /**
   * @type {ImageGenerator}
   */
  let res;
  let gid = "";

  const sanitizedType = type
    .toLowerCase()
    .trim()
    .replace(/ /g, "");

  logger.verbose("Processing");

  switch(sanitizedType) {
  case "sex":
  case "sexy":
  case "party":
  case "partgam":
  case "party game":
  case "partygames":
  case "party games":
  case "pg": {
    res = await getLB("wins", timetype, "partyGames", startingIndex);
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
    res = await getLB("wins", timetype, "farmhunt", startingIndex);
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
    res = await getLB("poop", timetype, "farmhunt", startingIndex);
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
    res = await getLB("wins", timetype, "hypixelSays", startingIndex);
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
    res = await getLB("wins", timetype, "holeInTheWall", startingIndex);
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
    res = await getLB("wins", timetype, "miniWalls", startingIndex);
    gid = "mw";
    break;
  }

  case "mwk":
  case "mwkills": {
    res = await getLB("kills", timetype, "miniWalls", startingIndex);
    gid = "mwk";
    break;
  }

  case "mwd":
  case "mwdeaths": {
    res = await getLB("deaths", timetype, "miniWalls", startingIndex);
    gid = "mwd";
    break;
  }

  case "mwwd":
  case "mwwitherdmg": {
    res = await getLB("witherDamage", timetype, "miniWalls", startingIndex);
    gid = "mwwd";
    break;
  }

  case "mwwk":
  case "mwwitherkills": {
    res = await getLB("witherKills", timetype, "miniWalls", startingIndex);
    gid = "mwwk";
    break;
  }

  case "mwf":
  case "mwfinals": {
    res = await getLB("finalKills", timetype, "miniWalls", startingIndex);
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
    res = await getLB("wins", timetype, "football", startingIndex);
    gid = "fb";
    break;
  }

  case "es":
  case "spleeg":
  case "ender":
  case "enderman":
  case "trash":
  case "enderspleef": {
    res = await getLB("wins", timetype, "enderSpleef", startingIndex);
    gid = "es";
    break;
  }

  case "to":
  case "throw":
  case "toss":
  case "sumo2":
  case "throwout": {
    res = await getLB("wins", timetype, "throwOut", startingIndex);
    gid = "to";
    break;
  }

  case "tok":
  case "sumokill":
  case "throwkills":
  case "tokills": {
    res = await getLB("kills", timetype, "throwOut", startingIndex);
    gid = "tok";
    break;
  }

  case "gw":
  case "sw":
  case "galaxy":
  case "galaxywar":
  case "galawar":
  case "galaxywars": {
    res = await getLB("wins", timetype, "galaxyWars", startingIndex);
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
    res = await getLB("wins", timetype, "dragonWars", startingIndex);
    gid = "dw";
    break;
  }

  case "bh":
  case "bnt":
  case "one":
  case "oneinthequiver":
  case "bountyhunters": {
    res = await getLB("wins", timetype, "bountyHunters", startingIndex);
    gid = "bh";
    break;
  }

  case "bd":
  case "do":
  case "dayone":
  case "walkingdead":
  case "blocking":
  case "blockdie":
  case "blockdead":
  case "blockingdead": {
    res = await getLB("wins", timetype, "blockingDead", startingIndex);
    gid = "bd";
    break;
  }

  case "arc":
  case "arcade":
  case "overall":
  case "all": {
    res = await getLB("arcadeWins", timetype, undefined, startingIndex);
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
    res = await getLB("wins", timetype, "hideAndSeek", startingIndex);
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
    res = await getLB("kills", timetype, "hideAndSeek", startingIndex);
    gid = "hnsk";
    break;
  }

  case "z":
  case "zs":
  case "zbs":
  case "zomb":
  case "zbies":
  case "zombies": {
    res = await getLB("wins_zombies", timetype, "zombies", startingIndex);
    gid = "z";
    break;
  }

  case "ctw":
  case "ctwk":
  case "capkills":
  case "ctkills":
  case "ctwkills": {
    res = await getLB("kills", timetype, "captureTheWool", startingIndex);
    gid = "ctw";
    break;
  }

  case "ctww":
  case "ctwool":
  case "capwool":
  case "ctwwool":
  case "ctwcaps":
  case "ctwcap":
  case "woolcap":
  case "caps":
  case "captures":
  case "woolcaps":
  case "ctwwoolcaptured": {
    res = await getLB("woolCaptures", timetype, "captureTheWool", startingIndex);
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
    res = await getLB("wins", timetype, "pixelPainters", startingIndex);
    gid = "pp";
    break;
  }

  case "c":
  case "coins":
  case "acoins":
  case "arccoins":
  case "arcadecoins":
  case "arcade_coins": {
    res = await getLB("arcadeCoins", timetype, undefined, startingIndex);
    gid = "c";
    break;
  }

  case "coinsearned":
  case "ce":
  case "realcoins":
  case "rcoin":
  case "rc": {
    res = await getLB("coinsEarned", timetype, undefined, startingIndex);
    gid = "ce";
    break;
  }

  case "esim":
  case "eastsim":
  case "easter":
  case "eastersim":
  case "eastersimulator":
  case "easter-simulator": {
    res = await getLB("easter", timetype, "seasonalWins", startingIndex);
    gid = "esim";
    break;
  }

  case "ssim":
  case "scuba":
  case "scubasim":
  case "scubasimulator":
  case "scuba-simulator": {
    res = await getLB("scuba", timetype, "seasonalWins", startingIndex);
    gid = "ssim";
    break;
  }

  case "hsim":
  case "hallow":
  case "halloween":
  case "halloweensim":
  case "halloweensimulator":
  case "halloween-simulator": {
    res = await getLB("halloween", timetype, "seasonalWins", startingIndex);
    gid = "hsim";
    break;
  }

  case "gsim":
  case "grinch":
  case "grinchsim":
  case "grinchsimulator":
  case "grinch-simulator": {
    res = await getLB("grinch", timetype, "seasonalWins", startingIndex);
    gid = "gsim";
    break;
  }

  case "simulator":
  case "seasonal":
  case "sim":
  case "tsim":
  case "totalsim":
  case "totalsimulator":
  case "total-simulator": {
    res = await getLB("total", timetype, "seasonalWins", startingIndex);
    gid = "tsim";
    break;
  }

  case "ap":
  case "achieve":
  case "achievements":
  case "achievemnts":
  case "ach":
  case "advancements":
  case "advance":
  case "achiev": {
    res = await getLB("achievementPoints", timetype, undefined, startingIndex);
    gid = "ap";
    break;
  }

  case "oitck":
  case "bhk":
  case "bhkills":
  case "bountyhunterkills":
  case "bountykill":
  case "oitckills":
  case "bountyhuntkills": {
    res = await getLB("kills", timetype, "bountyHunters", startingIndex);
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
    res = await getLB("kills", timetype, "dragonWars", startingIndex);
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
    res = await getLB("goals", timetype, "football", startingIndex);
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
    res = await getLB("kills", timetype, "galaxyWars", startingIndex);
    gid = "gwk";
    break;
  }

  case "hiderwins":
  case "hwins":
  case "hnshwins":
  case "hnshiderwins": {
    res = await getLB("hiderWins", timetype, "hideAndSeek", startingIndex);
    gid = "hwins";
    break;
  }

  case "seekerwins":
  case "swins":
  case "hnsswins":
  case "hnsseekerwins": {
    res = await getLB("seekerWins", timetype, "hideAndSeek", startingIndex);
    gid = "swins";
    break;
  }

  case "quests":
  case "qst":
  case "quest": {
    res = await getLB("questsCompleted", timetype, undefined, startingIndex);
    gid = "qst";
    break;
  }

  case "agamer":
  case "arcadegamer":
  case "arcgamer": {
    res = await getLB("arcadeGamer", timetype, "quests", startingIndex);
    gid = "agamer";
    break;
  }

  case "awinner":
  case "arcadewinner":
  case "arcwinner": {
    res = await getLB("arcadeWinner", timetype, "quests", startingIndex);
    gid = "awinner";
    break;
  }

  case "aspec":
  case "aspecial":
  case "arcadespecialist":
  case "arcspecial": {
    res = await getLB("arcadeSpecialist", timetype, "quests", startingIndex);
    gid = "aspec";
    break;
  }

  case "arcadeap":
  case "arcap":
  case "aap":
  case "arcadeach":
  case "arcadeachievements": {
    res = await getLB("totalEarned", timetype, "arcadeAchievments", startingIndex);
    gid = "aap";
    break;
  }

  case "bdc":
  case "cbd":
  case "bdchal":
  case "blockingdeadchallenge": {
    res = await getLB("blockingDead", timetype, "arcadeChallenges", startingIndex);
    gid = "bdc";
    break;
  }

  case "cac":
  case "cca":
  case "creeperchal":
  case "creeperattackchallenge": {
    res = await getLB("creeperAttack", timetype, "arcadeChallenges", startingIndex);
    gid = "cac";
    break;
  }

  case "dwc":
  case "cdw":
  case "dragonchallenge":
  case "dwchallenge":
  case "dragonwarschallenge": {
    res = await getLB("dragonWars", timetype, "arcadeChallenges", startingIndex);
    gid = "dwc";
    break;
  }

  case "esc":
  case "cse":
  case "spleefchallenge":
  case "enderchallenge":
  case "enderspleefchallenge": {
    res = await getLB("enderSpleef", timetype, "arcadeChallenges", startingIndex);
    gid = "esc";
    break;
  }
  
  case "fhc":
  case "cfh":
  case "farmchallenge":
  case "farmhuntchallenge": {
    res = await getLB("farmhunt", timetype, "arcadeChallenges", startingIndex);
    gid = "cfh";
    break;
  }
  case "cfb":
  case "fbc":
  case "footballc":
  case "footballchallenge": {
    res = await getLB("football", timetype, "arcadeChallenges", startingIndex);
    gid = "cfb";
    break;
  }

  case "gwc":
  case "cgw":
  case "galaxychallenge":
  case "galaxychal":
  case "galaxywarschallenge": {
    res = await getLB("galaxyWars", timetype, "arcadeChallenges", startingIndex);
    gid = "cgw";
    break;
  }

  case "chns":
  case "hnsc":
  case "hidec":
  case "chide":
  case "hasc":
  case "chas":
  case "hideandseekchallenge": {
    res = await getLB("hideAndSeek", timetype, "arcadeChallenges", startingIndex);
    gid = "chns";
    break;
  }

  case "hitwc":
  case "chitw":
  case "challengehitw":
  case "chole":
  case "holec":
  case "holeinthewallchallenge": {
    res = await getLB("holeInTheWall", timetype, "arcadeChallenges", startingIndex);
    gid = "chitw";
    break;
  }

  case "chs":
  case "hsc":
  case "hypixelchallenge":
  case "hschal":
  case "challengehs":
  case "hypixelsayschallenge": {
    res = await getLB("hypixelSays", timetype, "arcadeChallenges", startingIndex);
    gid = "chs";
    break;
  }

  case "mwc":
  case "cmw":
  case "miwc":
  case "cmiw":
  case "minichallenge":
  case "challengemini":
  case "challengeminiwalls":
  case "mwchallenges":
  case "miniwallschallenge": {
    res = await getLB("miniWalls", timetype, "arcadeChallenges", startingIndex);
    gid = "cmw";
    break;
  }

  case "pc":
  case "partychallenge":
  case "pgamechallenge":
  case "cpg":
  case "pgc":
  case "partygameschallenge": {
    res = await getLB("partyGames", timetype, "arcadeChallenges", startingIndex);
    gid = "cpg";
    break;
  }


  case "toc":
  case "cto":
  case "challengeto":
  case "tochallenge":
  case "throwoutchallenge": {
    res = await getLB("throwOut", timetype, "arcadeChallenges", startingIndex);
    gid = "toc";
    break;
  }

  case "ctwc":
  case "cctw":
  case "capturethewoolc":
  case "capturethewoolchallenge":
  case "cwc":
  case "capc": {
    res = await getLB("captureTheWool", timetype, "arcadeChallenges", startingIndex);
    gid = "ctwc";
    break;
  }

  case "czombies":
  case "zchallenge":
  case "zbc":
  case "czb":
  case "zc":
  case "zombiesc":
  case "zombieschallenge": {
    res = await getLB("zombies", timetype, "arcadeChallenges", startingIndex);
    gid = "zc";
    break;
  }

  case "blockingdeadkills":
  case "bdk": {
    res = await getLB("kills", timetype, "blockingDead", startingIndex);
    gid = "bdk";
    break;
  }

  case "bdhs":
  case "blockingdeadheadshots": {
    res = await getLB("headshots", timetype, "blockingDead", startingIndex);
    gid = "bdhs";
    break;
  }

  case "ca":
  case "creeperattack": {
    res = await getLB("maxWave", timetype, "creeperAttack", startingIndex);
    gid = "ca";
    break;
  }

  case "pgr":
  case "partygamesroundswon" : {
    res = await getLB("roundsWon", timetype, "partyGames", startingIndex);
    gid = "pgr";
    break;
  }

  case "pgs":
  case "partygamesstars" : {
    res = await getLB("starsEarned", timetype, "partyGames", startingIndex);
    gid = "pgs";
    break;
  }

  case "pgas":
  case "pgasw":
  case "partygamesanimalslaughterwins" : {
    res = await getLB("animalSlaughterWins", timetype, "partyGames", startingIndex);
    gid = "pgasw";
    break;
  }

  case "pgask":
  case "partygamesanimalslaughterkills" : {
    res = await getLB("animalSlaughterKills", timetype, "partyGames", startingIndex);
    gid = "pgask";
    break;
  }

  case "pgaspb":
  case "partygamesanimalslaughterpersonalbest" : {
    res = await getLB("animalSlaughterPB", timetype, "partyGames", startingIndex);
    gid = "pgaspb";
    break;
  }

  case "pganw":
  case "partygamesanvilspleefwins" : {
    res = await getLB("anvilSpleefWins", timetype, "partyGames", startingIndex);
    gid = "pganw";
    break;
  }

  case "pganpb":
  case "partygamesanvilspleefpersonalbest" : {
    res = await getLB("anvilSpleefPB", timetype, "partyGames", startingIndex, false, ms2time);
    gid = "pganpb";
    break;
  }

  case "pgbw":
  case "partygamesbombardmentwins" : {
    res = await getLB("bombardmentWins", timetype, "partyGames", startingIndex);
    gid = "pgbw";
    break;
  }

  case "pgbpb":
  case "partygamesbombardmentpersonalbest" : {
    res = await getLB("bombardmentPB", timetype, "partyGames", startingIndex, false, ms2time);
    gid = "pgbpb";
    break;
  }

  case "pgcrw":
  case "partygameschickenringswins" : {
    res = await getLB("chickenRingsWins", timetype, "partyGames", startingIndex);
    gid = "pgcrw";
    break;
  }

  case "pgcrpb":
  case "partygameschickenringspersonalbest" : {
    res = await getLB("chickenRingsPB", timetype, "partyGames", startingIndex, true, ms2time);
    gid = "pgcrpb";
    break;
  }

  case "pgdw":
  case "partygamesdivewins" : {
    res = await getLB("diveWins", timetype, "partyGames", startingIndex);
    gid = "pgdw";
    break;
  }

  case "pgds":
  case "partygamesdivescore" : {
    res = await getLB("diveScore", timetype, "partyGames", startingIndex);
    gid = "pgds";
    break;
  }

  case "pgdpb":
  case "partygamesdivepersonalbest" : {
    res = await getLB("divePB", timetype, "partyGames", startingIndex);
    gid = "pgdpb";
    break;
  }

  case "pghgw":
  case "partygameshighgroundwins" : {
    res = await getLB("highGroundWins", timetype, "partyGames", startingIndex);
    gid = "pghgw";
    break;
  }

  case "pghgs":
  case "partygameshighgroundscore" : {
    res = await getLB("highGroundScore", timetype, "partyGames", startingIndex);
    gid = "pghgs";
    break;
  }

  case "pghgpb":
  case "partygameshighgroundpersonalbest" : {
    res = await getLB("highGroundPB", timetype, "partyGames", startingIndex);
    gid = "pghgpb";
    break;
  }

  case "pghw":
  case "partygameshoehoehoewins" : {
    res = await getLB("hoeWins", timetype, "partyGames", startingIndex);
    gid = "pghw";
    break;
  }

  case "pghs":
  case "partygameshoehoehoescore" : {
    res = await getLB("hoeScore", timetype, "partyGames", startingIndex);
    gid = "pghs";
    break;
  }

  case "pghpb":
  case "partygameshoehoehoepersonalbest" : {
    res = await getLB("hoePB", timetype, "partyGames", startingIndex);
    gid = "pghpb";
    break;
  }

  case "pgjw":
  case "partygamesjigsawwins" : {
    res = await getLB("jigsawWins", timetype, "partyGames", startingIndex);
    gid = "pgjw";
    break;
  }

  case "pgjpb":
  case "partygamesjigsawpersonalbest" : {
    res = await getLB("jigsawPB", timetype, "partyGames", startingIndex, true, ms2time);
    gid = "pgjpb";
    break;
  }

  case "pgjjw":
  case "partygamesjunglejumpwins" : {
    res = await getLB("jungleJumpWins", timetype, "partyGames", startingIndex);
    gid = "pgjjw";
    break;
  }

  case "pgjjpb":
  case "partygamesjunglejumppersonalbest" : {
    res = await getLB("jungleJumpPB", timetype, "partyGames", startingIndex, true, ms2time);
    gid = "pgjjpb";
    break;
  }

  case "pglw":
  case "partygameslabescapewins" : {
    res = await getLB("labEscapeWins", timetype, "partyGames", startingIndex);
    gid = "pglw";
    break;
  }

  case "pglpb":
  case "partygameslabescapepersonalbest" : {
    res = await getLB("labEscapePB", timetype, "partyGames", startingIndex, true, ms2time);
    gid = "pglpb";
    break;
  }

  case "pglmw":
  case "partygameslawnmoowerwins" : {
    res = await getLB("lawnMoowerWins", timetype, "partyGames", startingIndex);
    gid = "pglmw";
    break;
  }

  case "pglms":
  case "partygameslawnmoowerscore" : {
    res = await getLB("lawnMoowerScore", timetype, "partyGames", startingIndex);
    gid = "pglms";
    break;
  }

  case "pglmpb":
  case "partygameslawnmoowerpersonalbest" : {
    res = await getLB("lawnMoowerPB", timetype, "partyGames", startingIndex);
    gid = "pglmpb";
    break;
  }

  case "pgmrw":
  case "partygamesminecartracingwins" : {
    res = await getLB("minecartRacingWins", timetype, "partyGames", startingIndex);
    gid = "pgmrw";
    break;
  }

  case "pgmrpb":
  case "partygamesminecartracingpersonalbest" : {
    res = await getLB("minecartRacingPB", timetype, "partyGames", startingIndex, true, ms2time);
    gid = "pgmrpb";
    break;
  }

  case "pgrpgw":
  case "partygamesrpgwins" : {
    res = await getLB("rpgWins", timetype, "partyGames", startingIndex);
    gid = "pgrpgw";
    break;
  }

  case "pgrpgk":
  case "partygamesrpgkills" : {
    res = await getLB("rpgKills", timetype, "partyGames", startingIndex);
    gid = "pgrpgk";
    break;
  }

  case "pgrpgpb":
  case "partygamesrpgpersonalbest" : {
    res = await getLB("rpgPB", timetype, "partyGames", startingIndex);
    gid = "pgrpgpb";
    break;
  }

  case "pgsmw":
  case "partygamesspidermazewins" : {
    res = await getLB("spiderMazeWins", timetype, "partyGames", startingIndex);
    gid = "pgsmw";
    break;
  }

  case "pgsmpb":
  case "partygamesspidermazepersonalbest" : {
    res = await getLB("spiderMazePB", timetype, "partyGames", startingIndex, true, ms2time);
    gid = "pgsmpb";
    break;
  }

  case "pgtfilw":
  case "partygamesthefloorislavawins" : {
    res = await getLB("theFloorIsLavaWins", timetype, "partyGames", startingIndex);
    gid = "pgtfilw";
    break;
  }

  case "pgtfilpb":
  case "partygamesthefloorislavapersonalbest" : {
    res = await getLB("theFloorIsLavaPB", timetype, "partyGames", startingIndex, true, ms2time);
    gid = "pgtfilpb";
    break;
  }

  case "pgavaw":
  case "partygamesavalanchewins" : {
    res = await getLB("avalancheWins", timetype, "partyGames", startingIndex);
    gid = "pgavaw";
    break;
  }

  case "pgvw":
  case "partygamesvolcanowins" : {
    res = await getLB("volcanoWins", timetype, "partyGames", startingIndex);
    gid = "pgvw";
    break;
  }

  case "pgpfw":
  case "partygamespigfishingwins" : {
    res = await getLB("pigFishingWins", timetype, "partyGames", startingIndex);
    gid = "pgpfw";
    break;
  }

  case "pgtw":
  case "partygamestrampoliniowins" : {
    res = await getLB("trampolinioWins", timetype, "partyGames", startingIndex);
    gid = "pgtw";
    break;
  }

  case "pgpjw":
  case "partygamespigjoustingwins" : {
    res = await getLB("pigJoustingWins", timetype, "partyGames", startingIndex);
    gid = "pgpjw";
    break;
  }

  case "pgww":
  case "partygamesworkshopwins" : {
    res = await getLB("workshopWins", timetype, "partyGames", startingIndex);
    gid = "pgww";
    break;
  }

  case "pgsrw":
  case "partygamesshootingrangewins" : {
    res = await getLB("shootingRangeWins", timetype, "partyGames", startingIndex);
    gid = "pgsrw";
    break;
  }

  case "pgffw":
  case "partygamesfrozenfloorwins" : {
    res = await getLB("frozenFloorWins", timetype, "partyGames", startingIndex);
    gid = "pgffw";
    break;
  }

  case "pgcpw":
  case "partygamescannonpaintingwins" : {
    res = await getLB("cannonPaintingWins", timetype, "partyGames", startingIndex);
    gid = "pgcpw";
    break;
  }

  case "pgflw":
  case "partygamesfireleaperswins" : {
    res = await getLB("fireLeapersWins", timetype, "partyGames", startingIndex);
    gid = "pgflw";
    break;
  }

  case "pgssw":
  case "partygamessupersheepwins" : {
    res = await getLB("superSheepWins", timetype, "partyGames", startingIndex);
    gid = "pgssw";
    break;
  }

  case "hitwf":
  case "holeinthewallfinals" : {
    res = await getLB("finals", timetype, "holeInTheWall", startingIndex);
    gid = "hitwf";
    break;
  }

  case "hitwq":
  case "holeinthewallqualifiers" : {
    res = await getLB("qualifiers", timetype, "holeInTheWall", startingIndex);
    gid = "hitwq";
    break;
  }

  case "hitww":
  case "holeinthewallwalls" : {
    res = await getLB("rounds", timetype, "holeInTheWall", startingIndex);
    gid = "hitww";
    break;
  }

  case "hnsobj":
  case "hnsobjective":
  case "hiderobjective":
  case "hnso": {
    res = await getLB("objectives", timetype, "hideAndSeek", startingIndex);
    gid = "hnso";
    break;
  }

  case "hspb":
  case "hsbestscore":
  case "hypixelsayspb":
  case "hypixelsaysmaxscore":
  case "besths": {
    res = await getLB("maxScore", timetype, "hypixelSays", startingIndex);
    gid = "hspb";
    break;
  }

  case "hsr":
  case "hsrounds":
  case "hypixelsaysrounds":
  case "hsrnd": {
    res = await getLB("totalRoundWins", timetype, "hypixelSays", startingIndex);
    gid = "hsr";
    break;
  }

  case "fhk" :
  case "farmkills":
  case "farmhuntkills": {
    res = await getLB("kills", timetype, "farmhunt", startingIndex);
    gid = "fhk";
    break;
  }

  case "fht" : 
  case "farmtaunts":
  case "fhtaunts":
  case "farmhunttaunts": {
    res = await getLB("tauntsUsed", timetype, "farmhunt", startingIndex);
    gid = "fht";
    break;
  }

  default: {
    if(type.trim().startsWith(".")) {
      
      let lb;
      const reverse = args.includes("-r") || args.includes("--reverse");

      try {
        const typeArgs = type.split(".");

        let formatter = undefined;

        if(MillisecondLBs?.[typeArgs[1]]?.[typeArgs[2]]) {
          formatter = ms2time;
        } else if(SecondLBs?.[typeArgs[1]]?.[typeArgs[2]]) {
          formatter = toHHMMSS;
        }

        lb = await getLB(type, timetype, undefined, startingIndex, reverse || ReversedLBs?.[typeArgs[1]]?.[typeArgs[2]], formatter);
      } catch (e) {
        logger.err(e.stack);
        return { res: "", embed: ERROR_NO_LEADERBOARD };
      }

      gid = type;
      res = lb;
    } else {
      if(interaction && interaction.options.getString("category")) {

        const category = interaction.options.getString("category");
        const stat = interaction.options.getString("stat");

        if(category != "others") {
          let formatter = undefined;

          if(MillisecondLBs?.[category]?.[stat]) {
            formatter = ms2time;
          } else if(SecondLBs?.[category]?.[stat]) {
            formatter = toHHMMSS;
          }

          res = await getLB(stat, timetype, category, startingIndex, ReversedLBs?.[category]?.[stat], formatter);
          gid = `.${category}.${stat}`;
        } else {
          res = await getLB(stat, timetype, undefined, startingIndex, ReversedLBs?.[stat]);
          gid = `.${stat}`;
        }
      } else {
        logger.info(`${type} leaderboard does not exist.`);

        return {
          res: "",
          embed: ERROR_NO_LEADERBOARD
        };
      }

    }
  }
  }

  logger.verbose("Converting canvas");
  const finalRes = res.toDiscord("leaderboard.png");

  logger.debug(`Leaderboard command ran in ${Date.now() - startTime}ms`);

  const buttons = await ButtonGenerator.getLBButtons(startingIndex, gid, timetype);

  return new CommandResponse("", undefined, finalRes, buttons);
}

module.exports = new Command(["leaderboard", "lb"], ["*"], hander, 10000);
