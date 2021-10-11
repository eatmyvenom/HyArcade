const {
  Message,
  CommandInteraction,
  ButtonInteraction
} = require("discord.js");
const BotRuntime = require("../BotRuntime");
const Command = require("../../classes/Command");
const logger = require("hyarcade-logger");
const getLB = require("../Utils/Leaderboards/GetLeaderboard");
const CustomLeaderboard = require("../Utils/Leaderboards/CustomLeaderboard");
const { ERROR_NO_LEADERBOARD } = require("../Utils/Embeds/StaticEmbeds");
const CommandResponse = require("../Utils/CommandResponse");
const { ERROR_ARGS_LENGTH } = require("../Utils/Embeds/DynamicEmbeds");

module.exports = new Command("leaderboard", ["*"], hander);

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

  if(interaction != undefined && !interaction.isButton()) {
    logger.debug("Deferring interaction");
    await interaction.defer();
  } else if(interaction?.isButton()) {
    await interaction.deferUpdate();
  }

  if(args.length < 1) {
    return new CommandResponse("", ERROR_ARGS_LENGTH(1));
  }

  const type = args[0];
  const limit = args[2] != undefined ? Number(args[2]) : 10;
  const startingIndex = args[3] != undefined ? Number(args[3]) : 0;
  const timetype = args[1] != undefined ? args[1] : "lifetime";

  let res = "";
  let gid = "";
  let gameName = "";

  const sanitizedType = type
    .toLowerCase()
    .trim()
    .replace(/ /g, "");

  switch(sanitizedType) {
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
  case "sumokill":
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
  case "blockdie":
  case "blockdead":
  case "blockingdead": {
    gameName = "Blocking dead";
    res = await getLB("wins", timetype, limit, "blockingDead", startingIndex);
    gid = "bd";
    break;
  }

  case "arc":
  case "arcade":
  case "overall":
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
  case "ctwcap":
  case "woolcap":
  case "caps":
  case "captures":
  case "woolcaps":
  case "ctwwoolcaptured": {
    gameName = "Capture the wool captures";
    res = await getLB("woolCaptures", timetype, limit, "captureTheWool", startingIndex);
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

  case "quests":
  case "qst":
  case "quest": {
    gameName = "Quests completed";
    res = await getLB("questsCompleted", timetype, limit, undefined, startingIndex);
    gid = "qst";
    break;
  }

  case "agamer":
  case "arcadegamer":
  case "arcgamer": {
    gameName = "'Arcade gamer' quests";
    res = await getLB("arcadeGamer", timetype, limit, "quests", startingIndex);
    gid = "agamer";
    break;
  }

  case "awinner":
  case "arcadewinner":
  case "arcwinner": {
    gameName = "'Arcade winner' quests";
    res = await getLB("arcadeWinner", timetype, limit, "quests", startingIndex);
    gid = "awinner";
    break;
  }

  case "aspec":
  case "aspecial":
  case "arcadespecialist":
  case "arcspecial": {
    gameName = "'Arcade specialist' quests";
    res = await getLB("arcadeSpecialist", timetype, limit, "quests", startingIndex);
    gid = "aspec";
    break;
  }

  case "arcadeap":
  case "arcap":
  case "aap":
  case "arcadeach":
  case "arcadeachievements": {
    gameName = "Arcade Achievements";
    res = await getLB("totalEarned", timetype, limit, "arcadeAchievments", startingIndex);
    gid = "aap";
    break;
  }

  case "bdc":
  case "cbd":
  case "bdchal":
  case "blockingdeadchallenge": {
    gameName = "Blocking dead challenges";
    res = await getLB("blockingDead", timetype, limit, "arcadeChallenges", startingIndex);
    gid = "bdc";
    break;
  }

  case "cac":
  case "cca":
  case "creeperchal":
  case "creeperattackchallenge": {
    gameName = "Creeper attack challenges";
    res = await getLB("creeperAttack", timetype, limit, "arcadeChallenges", startingIndex);
    gid = "cac";
    break;
  }

  case "dwc":
  case "cdw":
  case "dragonchallenge":
  case "dwchallenge":
  case "dragonwarschallenge": {
    gameName = "Dragon wars challenges";
    res = await getLB("dragonWars", timetype, limit, "arcadeChallenges", startingIndex);
    gid = "dwc";
    break;
  }

  case "esc":
  case "cse":
  case "spleefchallenge":
  case "enderchallenge":
  case "enderspleefchallenge": {
    gameName = "Ender spleef challenges";
    res = await getLB("enderSpleef", timetype, limit, "arcadeChallenges", startingIndex);
    gid = "esc";
    break;
  }
  
  case "fhc":
  case "cfh":
  case "farmchallenge":
  case "farmhuntchallenge": {
    gameName = "Farmhunt challenges";
    res = await getLB("farmhunt", timetype, limit, "arcadeChallenges", startingIndex);
    gid = "cfh";
    break;
  }
  case "cfb":
  case "fbc":
  case "footballc":
  case "footballchallenge": {
    gameName = "Football challenges";
    res = await getLB("football", timetype, limit, "arcadeChallenges", startingIndex);
    gid = "cfb";
    break;
  }

  case "gwc":
  case "cgw":
  case "galaxychallenge":
  case "galaxychal":
  case "galaxywarschallenge": {
    gameName = "Galaxy wars challenges";
    res = await getLB("galaxyWars", timetype, limit, "arcadeChallenges", startingIndex);
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
    gameName = "Hide and seek challenges";
    res = await getLB("hideAndSeek", timetype, limit, "arcadeChallenges", startingIndex);
    gid = "chns";
    break;
  }

  case "hitwc":
  case "chitw":
  case "challengehitw":
  case "chole":
  case "holec":
  case "holeinthewallchallenge": {
    gameName = "Hole in the wall challenges";
    res = await getLB("holeInTheWall", timetype, limit, "arcadeChallenges", startingIndex);
    gid = "chitw";
    break;
  }

  case "chs":
  case "hsc":
  case "hypixelchallenge":
  case "hschal":
  case "challengehs":
  case "hypixelsayschallenge": {
    gameName = "Hypixel says challenges";
    res = await getLB("hypixelSays", timetype, limit, "arcadeChallenges", startingIndex);
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
    gameName = "Mini walls challenges";
    res = await getLB("miniWalls", timetype, limit, "arcadeChallenges", startingIndex);
    gid = "cmw";
    break;
  }

  case "pc":
  case "partychallenge":
  case "pgamechallenge":
  case "cpg":
  case "pgc":
  case "partygameschallenge": {
    gameName = "Party games challenges";
    res = await getLB("partyGames", timetype, limit, "arcadeChallenges", startingIndex);
    gid = "cpg";
    break;
  }


  case "toc":
  case "cto":
  case "challengeto":
  case "tochallenge":
  case "throwoutchallenge": {
    gameName = "Throw out challenges";
    res = await getLB("throwOut", timetype, limit, "arcadeChallenges", startingIndex);
    gid = "toc";
    break;
  }

  case "ctwc":
  case "cctw":
  case "capturethewoolc":
  case "capturethewoolchallenge":
  case "cwc":
  case "capc": {
    gameName = "Capture the Wool challenges";
    res = await getLB("captureTheWool", timetype, limit, "arcadeChallenges", startingIndex);
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
    gameName = "Zombies challenges";
    res = await getLB("zombies", timetype, limit, "arcadeChallenges", startingIndex);
    gid = "zc";
    break;
  }

  case "blockingdeadkills":
  case "bdk": {
    gameName = "Blocking dead kills";
    res = await getLB("kills", timetype, limit, "blockingDead", startingIndex);
    gid = "bdk";
    break;
  }

  case "bdhs":
  case "blockingdeadheadshots": {
    gameName = "Blocking dead headshots";
    res = await getLB("headshots", timetype, limit, "blockingDead", startingIndex);
    gid = "bdhs";
    break;
  }

  case "ca":
  case "creeperattack": {
    gameName = "Creeper attack highest wave";
    res = await getLB("maxWave", timetype, limit, "creeperAttack", startingIndex);
    gid = "ca";
    break;
  }

  case "pgr":
  case "partygamesroundswon" : {
    gameName = "Party games rounds won";
    res = await getLB("roundsWon", timetype, limit, "partyGames", startingIndex);
    gid = "pgr";
    break;
  }

  case "pgs":
  case "partygamesstars" : {
    gameName = "Party games stars";
    res = await getLB("starsEarned", timetype, limit, "partyGames", startingIndex);
    gid = "pgs";
    break;
  }

  case "pgas":
  case "pgasw":
  case "partygamesanimalslaughterwins" : {
    gameName = "Party games animal slaughter wins";
    res = await getLB("animalSlaughterWins", timetype, limit, "partyGames", startingIndex);
    gid = "pgasw";
    break;
  }

  case "pgask":
  case "partygamesanimalslaughterkills" : {
    gameName = "Party games animal slaughter kills";
    res = await getLB("animalSlaughterKills", timetype, limit, "partyGames", startingIndex);
    gid = "pgask";
    break;
  }

  case "pgaspb":
  case "partygamesanimalslaughterpersonalbest" : {
    gameName = "Party games animal slaughter personal best";
    res = await getLB("animalSlaughterKills", timetype, limit, "partyGames", startingIndex);
    gid = "pgaspb";
    break;
  }

  case "pganw":
  case "partygamesanvilspleefwins" : {
    gameName = "Party games anvil spleef wins";
    res = await getLB("anvilSpleefWins", timetype, limit, "partyGames", startingIndex);
    gid = "pganw";
    break;
  }

  case "pganpb":
  case "partygamesanvilspleefpersonalbest" : {
    gameName = "Party games anvil spleef personal best";
    res = await getLB("anvilSpleefPB", timetype, limit, "partyGames", startingIndex);
    gid = "pganpb";
    break;
  }

  case "pgbw":
  case "partygamesbombardmentwins" : {
    gameName = "Party games bombardment wins";
    res = await getLB("bombardmentWins", timetype, limit, "partyGames", startingIndex);
    gid = "pgbw";
    break;
  }

  case "pgbpb":
  case "partygamesbombardmentpersonalbest" : {
    gameName = "Party games anvil spleef personal best";
    res = await getLB("bombardmentPB", timetype, limit, "partyGames", startingIndex);
    gid = "pgbpb";
    break;
  }

  case "pgcrw":
  case "partygameschickenringswins" : {
    gameName = "Party games chicken rings wins";
    res = await getLB("chickenRingsWins", timetype, limit, "partyGames", startingIndex);
    gid = "pgcrw";
    break;
  }

  case "pgcrpb":
  case "partygameschickenringspersonalbest" : {
    gameName = "Party games chicken rings personal best";
    res = await getLB("chickenRingsPB", timetype, limit, "partyGames", startingIndex, true);
    gid = "pgcrpb";
    break;
  }

  case "pbdw":
  case "partygamesdivewins" : {
    gameName = "Party games dive wins";
    res = await getLB("diveWins", timetype, limit, "partyGames", startingIndex);
    gid = "pbdw";
    break;
  }

  case "pgds":
  case "partygamesdivescore" : {
    gameName = "Party games dive score";
    res = await getLB("diveScore", timetype, limit, "partyGames", startingIndex);
    gid = "pgds";
    break;
  }

  case "pgdpb":
  case "partygamesdivepersonalbest" : {
    gameName = "Party games dive personal best";
    res = await getLB("divePB", timetype, limit, "partyGames", startingIndex);
    gid = "pgdpb";
    break;
  }

  case "pbhgw":
  case "partygameshighgroundwins" : {
    gameName = "Party games high ground wins";
    res = await getLB("highGroundWins", timetype, limit, "partyGames", startingIndex);
    gid = "pbhgw";
    break;
  }

  case "pghgs":
  case "partygameshighgroundscore" : {
    gameName = "Party games high ground score";
    res = await getLB("highGroundScore", timetype, limit, "partyGames", startingIndex);
    gid = "pghgs";
    break;
  }

  case "pghgpb":
  case "partygameshighgroundpersonalbest" : {
    gameName = "Party games high ground personal best";
    res = await getLB("highGroundPB", timetype, limit, "partyGames", startingIndex);
    gid = "pghgpb";
    break;
  }

  case "pbhw":
  case "partygameshoehoehoewins" : {
    gameName = "Party games hoe hoe hoe wins";
    res = await getLB("hoeWins", timetype, limit, "partyGames", startingIndex);
    gid = "pbhw";
    break;
  }

  case "pghs":
  case "partygameshoehoehoescore" : {
    gameName = "Party games hoe hoe hoe score";
    res = await getLB("hoeScore", timetype, limit, "partyGames", startingIndex);
    gid = "pghs";
    break;
  }

  case "pghpb":
  case "partygameshoehoehoepersonalbest" : {
    gameName = "Party games hoe hoe hoe personal best";
    res = await getLB("hoePB", timetype, limit, "partyGames", startingIndex);
    gid = "pghpb";
    break;
  }

  case "pgjw":
  case "partygamesjigsawwins" : {
    gameName = "Party games jigsaw rush wins";
    res = await getLB("jigsawWins", timetype, limit, "partyGames", startingIndex);
    gid = "pgjw";
    break;
  }

  case "pgjpb":
  case "partygamesjigsawpersonalbest" : {
    gameName = "Party games jigsaw personal best";
    res = await getLB("jigsawPB", timetype, limit, "partyGames", startingIndex, true);
    gid = "pgjpb";
    break;
  }

  case "pgjjw":
  case "partygamesjunglejumpwins" : {
    gameName = "Party games jungle jump wins";
    res = await getLB("jungleJumpWins", timetype, limit, "partyGames", startingIndex);
    gid = "pgjjw";
    break;
  }

  case "pgjjpb":
  case "partygamesjunglejumppersonalbest" : {
    gameName = "Party games jungle jump personal best";
    res = await getLB("jungleJumpPB", timetype, limit, "partyGames", startingIndex, true);
    gid = "pgjjpb";
    break;
  }

  case "pglw":
  case "partygameslabescapewins" : {
    gameName = "Party games lab escape wins";
    res = await getLB("labEscapeWins", timetype, limit, "partyGames", startingIndex);
    gid = "pglw";
    break;
  }

  case "pglpb":
  case "partygameslabescapepersonalbest" : {
    gameName = "Party games lab escape personal best";
    res = await getLB("labEscapePB", timetype, limit, "partyGames", startingIndex, true);
    gid = "pglpb";
    break;
  }

  case "pblmw":
  case "partygameslawnmoowerwins" : {
    gameName = "Party games lawn moower wins";
    res = await getLB("lawnMoowerWins", timetype, limit, "partyGames", startingIndex);
    gid = "pblmw";
    break;
  }

  case "pglms":
  case "partygameslawnmoowerscore" : {
    gameName = "Party games lawn moower score";
    res = await getLB("lawnMoowerScore", timetype, limit, "partyGames", startingIndex);
    gid = "pglms";
    break;
  }

  case "pglmpb":
  case "partygameslawnmoowerpersonalbest" : {
    gameName = "Party games lawn moower personal best";
    res = await getLB("lawnMoowerPB", timetype, limit, "partyGames", startingIndex);
    gid = "pglmpb";
    break;
  }

  case "pgmrw":
  case "partygamesminecartracingwins" : {
    gameName = "Party games minecart racing wins";
    res = await getLB("minecartRacingWins", timetype, limit, "partyGames", startingIndex);
    gid = "pgmrw";
    break;
  }

  case "pgmrpb":
  case "partygamesminecartracingpersonalbest" : {
    gameName = "Party games minecart racing personal best";
    res = await getLB("minecartRacingPB", timetype, limit, "partyGames", startingIndex, true);
    gid = "pgmrpb";
    break;
  }

  case "pbrpgw":
  case "partygamesrpgwins" : {
    gameName = "Party games RPG-16 wins";
    res = await getLB("rpgWins", timetype, limit, "partyGames", startingIndex);
    gid = "pbrpgw";
    break;
  }

  case "pgrpgk":
  case "partygamesrpgkills" : {
    gameName = "Party games RPG-16 score";
    res = await getLB("rpgKills", timetype, limit, "partyGames", startingIndex);
    gid = "pgrpgk";
    break;
  }

  case "pgrpgpb":
  case "partygamesrpgpersonalbest" : {
    gameName = "Party games RPG-16 personal best";
    res = await getLB("rpgPB", timetype, limit, "partyGames", startingIndex);
    gid = "pgrpgpb";
    break;
  }

  case "pgsmw":
  case "partygamesspidermazewins" : {
    gameName = "Party games spider maze wins";
    res = await getLB("spiderMazeWins", timetype, limit, "partyGames", startingIndex);
    gid = "pgsmw";
    break;
  }

  case "pgsmpb":
  case "partygamesspidermazepersonalbest" : {
    gameName = "Party games spider maze personal best";
    res = await getLB("spiderMazePB", timetype, limit, "partyGames", startingIndex, true);
    gid = "pgsmpb";
    break;
  }

  case "pgtfilw":
  case "partygamesthefloorislavawins" : {
    gameName = "Party games the floor is lava wins";
    res = await getLB("theFloorIsLavaWins", timetype, limit, "partyGames", startingIndex);
    gid = "pgtfilw";
    break;
  }

  case "pgtfilpb":
  case "partygamesthefloorislavapersonalbest" : {
    gameName = "Party games the floor is lava personal best";
    res = await getLB("theFloorIsLavaPB", timetype, limit, "partyGames", startingIndex, true);
    gid = "pgtfilpb";
    break;
  }

  case "pgavaw":
  case "partygamesavalanchewins" : {
    gameName = "Party games avalanche wins";
    res = await getLB("avalancheWins", timetype, limit, "partyGames", startingIndex);
    gid = "pgavaw";
    break;
  }

  case "pgvw":
  case "partygamesvolcanowins" : {
    gameName = "Party games volcano wins";
    res = await getLB("volcanoWins", timetype, limit, "partyGames", startingIndex);
    gid = "pgvw";
    break;
  }

  case "pgpfw":
  case "partygamespigfishingwins" : {
    gameName = "Party games pig fishing wins";
    res = await getLB("pigFishingWins", timetype, limit, "partyGames", startingIndex);
    gid = "pgpfw";
    break;
  }

  case "pgtw":
  case "partygamestrampoliniowins" : {
    gameName = "Party games trampolinio wins";
    res = await getLB("trampolinioWins", timetype, limit, "partyGames", startingIndex);
    gid = "pgtw";
    break;
  }

  case "pgpjw":
  case "partygamespigjoustingwins" : {
    gameName = "Party games pig jousting wins";
    res = await getLB("pigJoustingWins", timetype, limit, "partyGames", startingIndex);
    gid = "pgpjw";
    break;
  }

  case "pgww":
  case "partygamesworkshopwins" : {
    gameName = "Party games workshop wins";
    res = await getLB("workshopWins", timetype, limit, "partyGames", startingIndex);
    gid = "pgww";
    break;
  }

  case "pgsrw":
  case "partygamesshootingrangewins" : {
    gameName = "Party games shooting range wins";
    res = await getLB("shootingRangeWins", timetype, limit, "partyGames", startingIndex);
    gid = "pgsrw";
    break;
  }

  case "pgffw":
  case "partygamesfrozenfloorwins" : {
    gameName = "Party games frozen floor wins";
    res = await getLB("frozenFloorWins", timetype, limit, "partyGames", startingIndex);
    gid = "pgffw";
    break;
  }

  case "pgcpw":
  case "partygamescannonpaintingwins" : {
    gameName = "Party games cannon painting wins";
    res = await getLB("cannonPaintingWins", timetype, limit, "partyGames", startingIndex);
    gid = "pgcpw";
    break;
  }

  case "pgflw":
  case "partygamesfireleaperswins" : {
    gameName = "Party gamesfire leapers wins";
    res = await getLB("fireLeapersWins", timetype, limit, "partyGames", startingIndex);
    gid = "pgflw";
    break;
  }

  case "pgssw":
  case "partygamessupersheepins" : {
    gameName = "Party games super sheep wins";
    res = await getLB("superSheepWins", timetype, limit, "partyGames", startingIndex);
    gid = "pgssw";
    break;
  }

  default: {
    if(type.trim().startsWith(".")) {
      gameName = type.trim().slice(1);
      
      let lb;

      try {
        lb = await CustomLeaderboard(timetype, type, startingIndex, limit);
      } catch (e) {
        logger.err(e.stack);
        return { res: "", embed: ERROR_NO_LEADERBOARD };
      }

      gid = undefined;
      res = lb;
    } else {
      return {
        res: "",
        embed: ERROR_NO_LEADERBOARD
      };
    }
  }
  }

  const finalRes = res
    .setAuthor(`${gameName} leaderboard`, BotRuntime.client.user.avatarURL());

  logger.debug(`Leaderboard command ran in ${Date.now() - startTime}ms`);


  // Use custom response since it gets fixed by the parser
  const response = {
    res: "",
    embed: finalRes,
    game: gid,
    start: startingIndex
  };

  return response;
}
