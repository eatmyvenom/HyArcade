/* eslint-disable jsdoc/valid-types */

const Logger = require("hyarcade-logger");
const AccountAP = require("./AccountAP");
const PopulateAccountData = require("./PopulateAccountData");
const HypixelApi = require("../HypixelApi");

class ArcadeGameStats {
  /**
   *
   * @type {number}
   * @memberof ArcadeGameStats
   */
  wins = 0;
}

class BlockingDeadStats extends ArcadeGameStats {
  hints = true;
  kills = 0;
  headshots = 0;
  weapon = "";

  /**
   *
   * @param {import("./hypixel").IArcade} arcade
   */
  constructor(arcade) {
    super();
    this.wins = arcade?.wins_dayone ?? 0;
    this.kills = arcade?.kills_dayone ?? 0;
    this.headshots = arcade?.headshots_dayone ?? 0;
    this.hints = arcade?.hints ?? true;
    this.weapon = arcade?.melee_weapon ?? "";
  }
}

class BountyHuntersStats extends ArcadeGameStats {
  kills = 0;
  bowKills = 0;
  swordKills = 0;
  bountyKills = 0;
  deaths = 0;

  /**
   *
   * @param {import("./hypixel").IArcade} arcade
   */
  constructor(arcade) {
    super();
    this.wins = arcade?.wins_oneinthequiver ?? 0;
    this.kills = arcade?.kills_oneinthequiver ?? 0;
    this.bowKills = arcade?.bow_kills_oneinthequiver ?? 0;
    this.swordKills = arcade?.sword_kills_oneinthequiver ?? 0;
    this.bountyKills = arcade?.bounty_kills_oneinthequiver ?? 0;
    this.deaths = arcade?.deaths_oneinthequiver ?? 0;
  }
}

class CaptureTheWoolStats {
  kills = 0;
  woolCaptures = 0;

  /**
   *
   * @param {import("./hypixel").IPlayer} player
   */
  constructor(player) {
    this.woolCaptures = player?.achievements?.arcade_ctw_oh_sheep ?? 0;
    this.kills = player?.achievements?.arcade_ctw_slayer ?? 0;
  }
}

class CreeperAttackStats {
  maxWave = 0;

  /**
   *
   * @param {import("./hypixel").IArcade} arcade
   */
  constructor(arcade) {
    this.maxWave = arcade?.max_wave ?? 0;
  }
}

class DragonWarsStats extends ArcadeGameStats {
  kills = 0;

  /**
   *
   * @param {import("./hypixel").IArcade} arcade
   */
  constructor(arcade) {
    super();
    this.wins = arcade?.wins_dragonwars2 ?? 0;
    this.kills = arcade?.kills_dragonwars2 ?? 0;
  }
}

class EnderSpleefStats extends ArcadeGameStats {
  blocksBroken = 0;
  totalPowerups = 0;
  bigshotPowerups = 0;
  tripleshotPowerups = 0;

  /**
   *
   * @param {import("./hypixel").IArcade} arcade
   */
  constructor(arcade) {
    super();
    this.blocksBroken = arcade?.blocks_destroyed_ender ?? 0;
    this.totalPowerups = arcade?.powerup_activations_ender ?? 0;
    this.bigshotPowerups = arcade?.bigshot_powerup_activations_ender ?? 0;
    this.tripleshotPowerups = arcade?.tripleshot_powerup_activations_ender ?? 0;
    this.wins = arcade?.wins_ender ?? 0;
  }
}

class FootballStats extends ArcadeGameStats {
  goals = 0;
  powerkicks = 0;
  kicks = 0;

  /**
   *
   * @param {import("./hypixel").IArcade} arcade
   */
  constructor(arcade) {
    super();
    this.wins = arcade?.wins_soccer ?? 0;
    this.goals = arcade?.goals_soccer ?? 0;
    this.powerkicks = arcade?.powerkicks_soccer ?? 0;
    this.kicks = arcade?.kicks_soccer ?? 0;
  }
}

class FarmhuntStats extends ArcadeGameStats {
  poop = 0;
  animalWins = 0;
  hunterWins = 0;
  kills = 0;
  animalKills = 0;
  hunterKills = 0;
  bowKills = 0;
  animalBowKills = 0;
  hunterBowKills = 0;
  tauntsUsed = 0;
  safeTauntsUsed = 0;
  riskyTauntsUsed = 0;
  dangerousTauntsUsed = 0;
  fireworksUsed = 0;

  /**
   *
   * @param {import("./hypixel").IArcade} arcade
   */
  constructor(arcade) {
    super();
    this.wins = arcade?.wins_farm_hunt ?? 0;
    this.animalWins = arcade?.animal_wins_farm_hunt ?? 0;
    this.hunterWins = arcade?.hunter_wins_farm_hunt ?? 0;
    this.kills = arcade?.kills_farm_hunt ?? 0;
    this.animalKills = arcade?.animal_kills_farm_hunt ?? 0;
    this.hunterKills = arcade?.hunter_kills_farm_hunt ?? 0;
    this.bowKills = arcade?.bow_kills_farm_hunt ?? 0;
    this.animalBowKills = arcade?.animal_bow_kills_farm_hunt ?? 0;
    this.hunterBowKills = arcade?.hunter_bow_kills_farm_hunt ?? 0;
    this.tauntsUsed = arcade?.taunts_used_farm_hunt ?? 0;
    this.safeTauntsUsed = arcade?.safe_taunts_used_farm_hunt ?? 0;
    this.riskyTauntsUsed = arcade?.risky_taunts_used_farm_hunt ?? 0;
    this.dangerousTauntsUsed = arcade?.dangerous_taunts_used_farm_hunt ?? 0;
    this.fireworksUsed = arcade?.firework_taunts_used_farm_hunt ?? 0;
    this.poop = (arcade?.poop_collected ?? 0) + (arcade?.poop_collected_farm_hunt ?? 0);
  }
}

class GalaxyWarsStats extends ArcadeGameStats {
  kills = 0;
  deaths = 0;
  rebelKills = 0;
  empireKills = 0;
  shotsFired = 0;

  /**
   *
   * @param {import("./hypixel").IArcade} arcade
   */
  constructor(arcade) {
    super();
    this.kills = arcade?.sw_kills ?? 0;
    this.deaths = arcade?.sw_deaths ?? 0;
    this.wins = arcade?.sw_game_wins ?? 0;
    this.rebelKills = arcade?.sw_rebel_kills ?? 0;
    this.empireKills = arcade?.sw_empire_kills ?? 0;
    this.shotsFired = arcade?.sw_shots_fired ?? 0;
  }
}

class HideAndSeekStats extends ArcadeGameStats {
  propHuntHiderWins = 0;
  propHuntSeekerWins = 0;
  propHuntWins = 0;
  partyPooperHiderWins = 0;
  partyPooperSeekerWins = 0;
  partyPooperWins = 0;
  seekerWins = 0;
  hiderWins = 0;
  kills = 0;
  objectives = 0;

  /**
   *
   * @param {import("./hypixel").IPlayer} player
   */
  constructor(player) {
    super();
    this.propHuntHiderWins = player?.stats?.Arcade?.prop_hunt_hider_wins_hide_and_seek ?? 0;
    this.propHuntSeekerWins = player?.stats?.Arcade?.prop_hunt_seeker_wins_hide_and_seek ?? 0;
    this.propHuntWins = this.propHuntHiderWins + this.propHuntSeekerWins;

    this.partyPooperSeekerWins = player?.stats?.Arcade?.party_pooper_seeker_wins_hide_and_seek ?? 0;
    this.partyPooperHiderWins = player?.stats?.Arcade?.party_pooper_hider_wins_hide_and_seek ?? 0;
    this.partyPooperWins = this.partyPooperHiderWins + this.partyPooperSeekerWins;

    this.seekerWins = player?.stats?.Arcade?.seeker_wins_hide_and_seek ?? 0;
    this.hiderWins = player?.stats?.Arcade?.hider_wins_hide_and_seek ?? 0;
    this.wins = this.seekerWins + this.hiderWins;

    this.kills = player?.achievements?.arcade_hide_and_seek_hider_kills ?? 0;

    this.objectives = player?.achievements?.arcade_hide_and_seek_master_hider ?? 0;
  }
}

class HoleInTheWallStats extends ArcadeGameStats {
  rounds = 0;
  qualifiers = 0;
  finals = 0;

  /**
   *
   * @param {import("./hypixel").IArcade} arcade
   */
  constructor(arcade) {
    super();
    this.finals = arcade?.hitw_record_f ?? 0;
    this.qualifiers = arcade?.hitw_record_q ?? 0;
    this.wins = arcade?.wins_hole_in_the_wall ?? 0;
    this.rounds = arcade?.rounds_hole_in_the_wall ?? 0;
  }
}

class HypixelSaysStats extends ArcadeGameStats {
  simonWins = 0;
  santaWins = 0;
  totalPoints = 0;
  simonPoints = 0;
  santaPoints = 0;
  totalRoundWins = 0;
  simonRoundWins = 0;
  santaRoundWins = 0;
  maxScoreSimon = 0;
  maxScoreSanta = 0;
  maxScore = 0;

  /**
   *
   * @param {import("./hypixel").IArcade} arcade
   */
  constructor(arcade) {
    super();

    this.simonWins = arcade?.wins_simon_says ?? 0;
    this.santaWins = arcade?.wins_santa_says ?? 0;
    this.wins = this.simonWins + this.santaWins;

    this.simonPoints = arcade?.rounds_simon_says ?? 0;
    this.santaPoints = arcade?.rounds_santa_says ?? 0;
    this.totalPoints = this.simonPoints + this.santaPoints;

    this.simonRoundWins = arcade?.round_wins_simon_says ?? 0;
    this.santaRoundWins = arcade?.round_wins_santa_says ?? 0;
    this.totalRoundWins = this.simonRoundWins + this.santaRoundWins;

    this.maxScoreSimon = arcade?.top_score_simon_says ?? 0;
    this.maxScoreSanta = arcade?.top_score_santa_says ?? 0;

    this.maxScore = Math.max(this.maxScoreSimon, this.maxScoreSanta);
  }
}

class PartyGamesStats extends ArcadeGameStats {
  wins1 = 0;
  wins2 = 0;
  wins3 = 0;

  roundsWon = 0;
  starsEarned = 0;

  animalSlaughterWins = 0;
  animalSlaughterKills = 0;
  animalSlaughterPB = 0;

  anvilSpleefWins = 0;
  anvilSpleefPB = 0;

  bombardmentWins = 0;
  bombardmentPB = 0;

  chickenRingsWins = 0;
  chickenRingsPB = 99999999999;

  diveWins = 0;
  diveScore = 0;
  divePB = 0;

  highGroundWins = 0;
  highGroundScore = 0;
  highGroundPB = 0;

  hoeWins = 0;
  hoeScore = 0;
  hoePB = 0;

  jigsawWins = 0;
  jigsawPB = 99999999999;

  jungleJumpWins = 0;
  jungleJumpPB = 99999999999;

  labEscapeWins = 0;
  labEscapePB = 99999999999;

  lawnMoowerWins = 0;
  lawnMoowerScore = 0;
  lawnMoowerPB = 0;

  minecartRacingWins = 0;
  minecartRacingPB = 99999999999;

  rpgWins = 0;
  rpgKills = 0;
  rpgPB = 0;

  spiderMazeWins = 0;
  spiderMazePB = 99999999999;

  theFloorIsLavaWins = 0;
  theFloorIsLavaPB = 99999999999;

  avalancheWins = 0;

  volcanoWins = 0;

  pigFishingWins = 0;

  trampolinioWins = 0;

  pigJoustingWins = 0;

  workshopWins = 0;

  shootingRangeWins = 0;

  frozenFloorWins = 0;

  cannonPaintingWins = 0;

  fireLeapersWins = 0;

  superSheepWins = 0;

  /**
   *
   * @param {import("./hypixel").IArcade} arcade
   */
  constructor(arcade) {
    super();

    this.wins1 = arcade?.wins_party ?? 0;
    this.wins2 = arcade?.wins_party_2 ?? 0;
    this.wins3 = arcade?.wins_party_3 ?? 0;
    this.wins = this.wins1 + this.wins2 + this.wins3;

    this.roundsWon = arcade?.round_wins_party ?? 0;
    this.starsEarned = arcade?.total_stars_party ?? 0;

    this.animalSlaughterWins = arcade?.animal_slaughter_round_wins_party ?? 0;
    this.animalSlaughterKills = arcade?.animal_slaughter_kills_party ?? 0;
    this.animalSlaughterPB = arcade?.animal_slaughter_best_score_party ?? 0;

    this.anvilSpleefWins = arcade?.anvil_spleef_round_wins_party ?? 0;
    this.anvilSpleefPB = arcade?.anvil_spleef_best_time_party ?? 0;

    this.bombardmentWins = arcade?.bombardment_round_wins_party ?? 0;
    this.bombardmentPB = arcade?.bombardment_best_time_party ?? 0;

    this.chickenRingsWins = arcade?.chicken_rings_round_wins_party ?? 0;
    this.chickenRingsPB = arcade?.chicken_rings_best_time_party ?? 99999999999;

    this.diveWins = arcade?.dive_round_wins_party ?? 0;
    this.diveScore = arcade?.dive_total_score_party ?? 0;
    this.divePB = arcade?.dive_best_score_party ?? 0;

    this.highGroundWins = arcade?.high_ground_round_wins_party ?? 0;
    this.highGroundScore = arcade?.high_ground_total_score_party ?? 0;
    this.highGroundPB = arcade?.high_ground_best_score_party ?? 0;

    this.hoeWins = arcade?.hoe_hoe_hoe_round_wins_party ?? 0;
    this.hoeScore = arcade?.hoe_hoe_hoe_total_score_party ?? 0;
    this.hoePB = arcade?.hoe_hoe_hoe_best_score_party ?? 0;

    this.jigsawWins = arcade?.jigsaw_rush_round_wins_party ?? 0;
    this.jigsawPB = arcade?.jigsaw_rush_best_time_party ?? 99999999999;

    this.jungleJumpWins = arcade?.jungle_jump_round_wins_party ?? 0;
    this.jungleJumpPB = arcade?.jungle_jump_best_time_party ?? 99999999999;

    this.labEscapeWins = arcade?.lab_escape_round_wins_party ?? 0;
    this.labEscapePB = arcade?.lab_escape_best_time_party ?? 99999999999;

    this.lawnMoowerWins = arcade?.lawn_moower_round_wins_party ?? 0;
    this.lawnMoowerScore = arcade?.lawn_moower_mowed_total_score_party ?? 0;
    this.lawnMoowerPB = arcade?.lawn_moower_mowed_best_score_party ?? 0;

    this.minecartRacingWins = arcade?.minecart_racing_round_wins_party ?? 0;
    this.minecartRacingPB = arcade?.minecart_racing_best_time_party ?? 99999999999;

    this.rpgWins = arcade?.rpg_16_round_wins_party ?? 0;
    this.rpgKills = arcade?.rpg_16_kills_party ?? 0;
    this.rpgPB = arcade?.rpg_16_kills_best_score_party ?? 0;

    this.spiderMazeWins = arcade?.spider_maze_round_wins_party ?? 0;
    this.spiderMazePB = arcade?.spider_maze_best_time_party ?? 99999999999;

    this.theFloorIsLavaWins = arcade?.the_floor_is_lava_round_wins_party ?? 0;
    this.theFloorIsLavaPB = arcade?.the_floor_is_lava_best_time_party ?? 99999999999;

    this.avalancheWins = arcade?.avalanche_round_wins_party ?? 0;

    this.volcanoWins = arcade?.volcano_round_wins_party ?? 0;

    this.pigFishingWins = arcade?.pig_fishing_round_wins_party ?? 0;

    this.pigJoustingWins = arcade?.pig_jousting_round_wins_party ?? 0;

    this.trampolinioWins = arcade?.trampolinio_round_wins_party ?? 0;

    this.workshopWins = arcade?.workshop_round_wins_party ?? 0;

    this.shootingRangeWins = arcade?.shooting_range_round_wins_party ?? 0;

    this.frozenFloorWins = arcade?.frozen_floor_round_wins_party ?? 0;

    this.cannonPaintingWins = arcade?.cannon_painting_round_wins_party ?? 0;

    this.fireLeapersWins = arcade?.fire_leapers_round_wins_party ?? 0;

    this.superSheepWins = arcade?.super_sheep_round_wins_party ?? 0;
  }
}

class PixelPaintersStats extends ArcadeGameStats {
  /**
   *
   * @param {import("./hypixel").IArcade} arcade
   */
  constructor(arcade) {
    super();
    this.wins = arcade?.wins_draw_their_thing ?? 0;
  }
}

class ThrowOutStats extends ArcadeGameStats {
  kills = 0;
  deaths = 0;

  /**
   *
   * @param {import("./hypixel").IArcade} arcade
   */
  constructor(arcade) {
    super();
    this.wins = arcade?.wins_throw_out ?? 0;
    this.kills = arcade?.kills_throw_out ?? 0;
    this.deaths = arcade?.deaths_throw_out ?? 0;
  }
}

class SeasonalStats {
  /**
   *
   * @param {import("./hypixel").IPlayer} player
   */
  constructor(player) {
    this.pointsScuba = player?.stats?.Arcade?.total_points_scuba_simulator ?? 0;
    this.foundScuba = player?.stats?.Arcade?.items_found_scuba_simulator ?? 0;
    this.foundEaster = player?.stats?.Arcade?.eggs_found_easter_simulator ?? 0;
    this.foundHalloween = player?.stats?.Arcade?.candy_found_halloween_simulator ?? 0;
    this.grinchGiftsFound = player?.stats?.Arcade?.gifts_grinch_simulator_v2 ?? 0;
    this.deliveredSanta = player?.stats?.Arcade?.delivered_santa_simulator ?? 0;

    this.easter = player?.stats?.Arcade?.wins_easter_simulator ?? 0;
    this.grinch = player?.stats?.Arcade?.wins_grinch_simulator_v2 ?? 0;
    this.halloween = player?.stats?.Arcade?.wins_halloween_simulator ?? 0;
    this.scuba = player?.stats?.Arcade?.wins_scuba_simulator ?? 0;
    this.santaWins = (player?.stats?.Arcade?.wins_santa_simulator ?? 0) + (player?.stats?.Arcade?.wins_ss_SANTA_SIMULATOR ?? 0);
    this.total = this.easter + this.grinch + this.halloween + this.scuba + this.santaWins;
  }

  easter = 0;
  scuba = 0;
  halloween = 0;
  grinch = 0;
  total = 0;

  grinchGiftsFound = 0;
  pointsScuba = 0;
  foundScuba = 0;
  foundEaster = 0;
  foundHalloween = 0;
}

class MiniWallsStats extends ArcadeGameStats {
  kit = "";
  arrowsHit = 0;
  arrowsShot = 0;
  finalKills = 0;
  kills = 0;
  witherKills = 0;
  deaths = 0;
  witherDamage = 0;

  /**
   *
   * @param {import("./hypixel").IArcade} arcade
   */
  constructor(arcade) {
    super();
    this.wins = arcade?.wins_mini_walls ?? 0;
    this.kit = arcade?.miniwalls_activeKit ?? "Soldier";
    this.arrowsHit = arcade?.arrows_hit_mini_walls ?? 0;
    this.arrowsShot = arcade?.arrows_shot_mini_walls ?? 0;
    this.finalKills = arcade?.final_kills_mini_walls ?? 0;
    this.kills = arcade?.kills_mini_walls ?? 0;
    this.witherKills = arcade?.wither_kills_mini_walls ?? 0;
    this.deaths = arcade?.deaths_mini_walls ?? 0;
    this.witherDamage = arcade?.wither_damage_mini_walls ?? 0;
  }
}

class ArcadeQuests {
  /**
   *
   * @param {import("./hypixel").IPlayer} player
   */
  constructor(player) {
    this.arcadeGamer = player?.quests?.arcade_gamer?.completions?.length ?? 0;
    this.arcadeSpecialist = player?.quests?.arcade_specialist?.completions?.length ?? 0;
    this.arcadeWinner = player?.quests?.arcade_winner?.completions?.length ?? 0;
  }

  arcadeGamer = 0;
  arcadeWinner = 0;
  arcadeSpecialist = 0;
}

class ArcadeChallenges {
  zombies = 0;
  partyGames = 0;
  galaxyWars = 0;
  holeInTheWall = 0;
  hypixelSays = 0;
  creeperAttack = 0;
  blockingDead = 0;
  enderSpleef = 0;
  football = 0;
  miniWalls = 0;
  hideAndSeek = 0;
  farmhunt = 0;
  throwOut = 0;
  dragonWars = 0;
  pixelPainters = 0;
  bountyHunters = 0;
  captureTheWool = 0;

  /**
   *
   * @param {import("./hypixel").IPlayer} player
   */
  constructor(player) {
    const challenges = player?.challenges?.all_time;

    this.zombies = challenges?.ARCADE__zombies_challenge ?? 0;
    this.partyGames = challenges?.ARCADE__party_games_challenge ?? 0;
    this.galaxyWars = challenges?.ARCADE__galaxy_wars_challenge ?? 0;
    this.holeInTheWall = challenges?.ARCADE__hole_in_the_wall_challenge ?? 0;
    this.hypixelSays = challenges?.ARCADE__hypixel_says_challenge ?? 0;
    this.creeperAttack = challenges?.ARCADE__creeper_attack_challenge ?? 0;
    this.blockingDead = challenges?.ARCADE__blocking_dead_challenge ?? 0;
    this.enderSpleef = challenges?.ARCADE__ender_spleef_challenge ?? 0;
    this.football = challenges?.ARCADE__football_challenge ?? 0;
    this.miniWalls = challenges?.ARCADE__mini_walls_challenge ?? 0;
    this.hideAndSeek = challenges?.ARCADE__hide_and_seek_challenge ?? 0;
    this.farmhunt = challenges?.ARCADE__farm_hunt_challenge ?? 0;
    this.throwOut = challenges?.ARCADE__throw_out_challenge ?? 0;
    this.dragonWars = challenges?.ARCADE__dragon_wars_challenge ?? 0;
    this.pixelPainters = challenges?.ARCADE__pixel_painters_challenge ?? 0;
    this.bountyHunters = challenges?.ARCADE__bounty_hunter_challenge ?? 0;
    this.captureTheWool = challenges?.ARCADE__capture_the_wool_challenge ?? 0;
  }
}

class ZombiesStats {
  /**
   *
   * @param {import("./hypixel").IPlayer} player
   */
  constructor(player) {
    if (player?.stats?.Arcade) {
      for (const stat in player?.stats?.Arcade) {
        if (stat.includes("zombie")) {
          this[stat] = player?.stats?.Arcade[stat];
        }
      }
    }
  }
}

class Account {
  name = "";
  name_lower = "";
  nameHist = [];
  uuid = "";
  uuidPosix = "";
  internalId = "";

  rank = "";

  version = "";

  firstLogin = 0;

  isLoggedIn = false;
  lastLogin = 0;
  lastLogout = 0;

  mostRecentGameType = "";

  questsCompleted = 0;
  achievementPoints = 0;
  xp = 0;
  level = 0;
  karma = 0;
  ranksGifted = 0;

  /**
   *
   * @type {AccountAP}
   * @memberof Account
   */
  arcadeAchievments = new AccountAP();

  /**
   *
   * @type {ArcadeChallenges}
   * @memberof Account
   */
  arcadeChallenges = new ArcadeChallenges();

  blockingDead = new BlockingDeadStats();
  bountyHunters = new BountyHuntersStats();
  captureTheWool = new CaptureTheWoolStats();
  creeperAttack = new CreeperAttackStats();
  dragonWars = new DragonWarsStats();
  enderSpleef = new EnderSpleefStats();
  farmhunt = new FarmhuntStats();
  football = new FootballStats();
  galaxyWars = new GalaxyWarsStats();
  hideAndSeek = new HideAndSeekStats();
  holeInTheWall = new HoleInTheWallStats();
  hypixelSays = new HypixelSaysStats();
  partyGames = new PartyGamesStats();
  pixelPainters = new PixelPaintersStats();
  throwOut = new ThrowOutStats();

  coinTransfers = 0;
  simTotal = 0;
  arcadeCoins = 0;
  arcadeWins = 0;
  combinedArcadeWins = 0;
  anyWins = 0;
  coinsEarned = 0;
  monthlyCoins = 0;
  weeklyCoins = 0;
  importance = 0;

  /**
   * Seasonal "simulator" games wins and stats
   *
   * @type {SeasonalStats}
   * @memberof Account
   */
  seasonalWins = new SeasonalStats();

  /**
   *
   * @type {MiniWallsStats}
   * @memberof Account
   */
  miniWalls = new MiniWallsStats();

  /**
   *
   * @type {ArcadeQuests}
   * @memberof Account
   */
  quests = {};

  /**
   *
   * @type {ZombiesStats}
   * @memberof Account
   */
  zombies = {};

  hasOFCape = false;
  hasLabyCape = false;

  cloak = "";
  clickEffect = "";
  hat = "";

  plusColor = "";
  mvpColor = "";

  hypixelDiscord = "";
  discord = "";

  timePlaying = 0;
  updateTime = 0;

  /**
   * Creates an instance of Account.
   *
   * @param {string} name
   * @param {number} wins
   * @param {string} uuid
   * @memberof account
   */
  constructor(name, wins, uuid) {
    this.name = name;

    this.uuid = uuid == undefined && wins.toString().length > 16 ? wins.toString() : uuid;

    this.uuid = uuid.toLowerCase().replace(/-/g, "");

    try {
      const timeLow = this.uuid?.slice(0, 8);
      const timeMid = this.uuid?.slice(8, 12);
      const version = this.uuid?.slice(12, 16);
      const varient = this.uuid?.slice(16, 20);
      const node = this.uuid?.slice(-12);
      this.uuidPosix = `${timeLow}-${timeMid}-${version}-${varient}-${node}`;
    } catch (error) {
      Logger.error(`Error caused from the uuid of ${name} : ${uuid}`);
      Logger.error(error);
    }
  }

  setData(oldAcc) {
    Object.assign(this, oldAcc);
    this.uuid = this.uuid.toLowerCase().replace(/-/g, "");

    try {
      const timeLow = this.uuid?.slice(0, 8);
      const timeMid = this.uuid?.slice(8, 12);
      const version = this.uuid?.slice(12, 16);
      const varient = this.uuid?.slice(16, 20);
      const node = this.uuid?.slice(-12);
      this.uuidPosix = `${timeLow}-${timeMid}-${version}-${varient}-${node}`;
    } catch (error) {
      Logger.error(`Error caused from the uuid of ${this.name} : ${this.uuid}`);
      Logger.error(error);
    }
  }

  /**
   *
   * @param {*} obj
   * @returns {Account}
   */
  static from(obj) {
    const acc = new Account("", 0, "");
    acc.setData(obj);

    return acc;
  }

  get wins() {
    return this.partyGames.wins;
  }
  set wins(count) {
    this.partyGames.wins = count;
  }

  get hitwQual() {
    return this.holeInTheWall.qualifiers;
  }
  set hitwQual(v) {
    this.holeInTheWall.qualifiers = v;
  }

  get hitwFinal() {
    return this.holeInTheWall.finals;
  }
  set hitwFinal(v) {
    this.holeInTheWall.finals = v;
  }

  get hitwWins() {
    return this.holeInTheWall.wins;
  }
  set hitwWins(v) {
    this.holeInTheWall.wins = v;
  }

  get hitwRounds() {
    return this.holeInTheWall.rounds;
  }
  set hitwRounds(v) {
    this.holeInTheWall.rounds = v;
  }

  get farmhuntWins() {
    return this.farmhunt.wins;
  }
  set farmhuntWins(v) {
    this.farmhunt.wins = v;
  }

  get farmhuntShit() {
    return this.farmhunt.poop;
  }
  set farmhuntShit(v) {
    this.farmhunt.poop = v;
  }

  get hypixelSaysWins() {
    return this.hypixelSays.wins;
  }
  set hypixelSaysWins(v) {
    this.hypixelSays.wins = v;
  }

  get miniWallsWins() {
    return this.miniWalls.wins;
  }
  set miniWallsWins(v) {
    this.miniWalls.wins = v;
  }

  get footballWins() {
    return this.football.wins;
  }
  set footballWins(v) {
    this.football.wins = v;
  }

  get enderSpleefWins() {
    return this.enderSpleef.wins;
  }
  set enderSpleefWins(v) {
    this.enderSpleef.wins = v;
  }

  get throwOutWins() {
    return this.throwOut.wins;
  }
  set throwOutWins(v) {
    this.throwOut.wins = v;
  }

  get galaxyWarsWins() {
    return this.galaxyWars.wins;
  }
  set galaxyWarsWins(v) {
    this.galaxyWars.wins = v;
  }

  get dragonWarsWins() {
    return this.dragonWars.wins;
  }
  set dragonWarsWins(v) {
    this.dragonWars.wins = v;
  }

  get bountyHuntersWins() {
    return this.bountyHunters.wins;
  }
  set bountyHuntersWins(v) {
    this.bountyHunters.wins = v;
  }

  get blockingDeadWins() {
    return this.blockingDead.wins;
  }
  set blockingDeadWins(v) {
    this.blockingDead.wins = v;
  }

  get hideAndSeekWins() {
    return this.hideAndSeek.wins;
  }
  set hideAndSeekWins(v) {
    this.hideAndSeek.wins = v;
  }

  get zombiesWins() {
    return this.zombies.wins_zombies;
  }
  set zombiesWins(v) {
    this.zombies.wins_zombies = v;
  }

  get pixelPaintersWins() {
    return this.pixelPainters.wins;
  }
  set pixelPaintersWins(v) {
    this.pixelPainters.wins = v;
  }

  get ctwKills() {
    return this.captureTheWool.kills;
  }
  set ctwKills(v) {
    this.captureTheWool.kills = v;
  }

  get ctwWoolCaptured() {
    return this.captureTheWool.woolCaptures;
  }
  set ctwWoolCaptured(v) {
    this.captureTheWool.woolCaptures = v;
  }

  get hnsKills() {
    return this.hideAndSeek.kills;
  }
  set hnsKills(v) {
    this.hideAndSeek.kills = v;
  }

  /**
   * Update and populate all the data for this account
   *
   * @memberof account
   */
  async updateData() {
    await this.updateHypixel();
  }

  /**
   * populate the hypixel data
   *
   * @memberof account
   * @param {import("./hypixel").HypixelPlayer} json
   */
  setHypixel(json) {
    const player = json?.player;
    const arcade = json?.player?.stats?.Arcade;

    if (player == undefined) {
      return;
    }

    this.updateTime = Date.now();

    this.blockingDead = new BlockingDeadStats(arcade);
    this.bountyHunters = new BountyHuntersStats(arcade);
    this.captureTheWool = new CaptureTheWoolStats(player);
    this.creeperAttack = new CreeperAttackStats(arcade);
    this.dragonWars = new DragonWarsStats(arcade);
    this.enderSpleef = new EnderSpleefStats(arcade);
    this.farmhunt = new FarmhuntStats(arcade);
    this.football = new FootballStats(arcade);
    this.galaxyWars = new GalaxyWarsStats(arcade);
    this.hideAndSeek = new HideAndSeekStats(player);
    this.holeInTheWall = new HoleInTheWallStats(arcade);
    this.hypixelSays = new HypixelSaysStats(arcade);
    this.partyGames = new PartyGamesStats(arcade);
    this.pixelPainters = new PixelPaintersStats(arcade);
    this.throwOut = new ThrowOutStats(arcade);
    this.zombies = new ZombiesStats(player);
    this.miniWalls = new MiniWallsStats(arcade);

    this.arcadeChallenges = new ArcadeChallenges(player);
    this.arcadeAchievments = new AccountAP(player);
    this.quests = new ArcadeQuests(player);
    this.seasonalWins = new SeasonalStats(json?.player);
    this.simTotal = this.seasonalWins.total;

    PopulateAccountData(json, this);
  }

  /**
   * Update and populate the hypixel data
   *
   * @memberof account
   */
  async updateHypixel() {
    const json = await HypixelApi.player(this.uuid);

    this.setHypixel(json);
  }
}

module.exports = Account;
