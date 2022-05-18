/* eslint-disable complexity */
interface ArcadeGameStats {
  /**
   *
   * @type {number}
   * @memberof ArcadeGameStats
   */
  wins: number;
}

export class BlockingDeadStats implements ArcadeGameStats {
  wins: number;
  hints: boolean;
  kills: number;
  headshots: number;
  weapon: string;

  constructor(arcade: any) {
    this.wins = arcade?.wins_dayone ?? 0;
    this.kills = arcade?.kills_dayone ?? 0;
    this.headshots = arcade?.headshots_dayone ?? 0;
    this.hints = arcade?.hints ?? true;
    this.weapon = arcade?.melee_weapon ?? "";
  }
}

export class BountyHuntersStats implements ArcadeGameStats {
  wins: number;
  kills: number;
  bowKills: number;
  swordKills: number;
  bountyKills: number;
  deaths: number;

  constructor(arcade: any) {
    this.wins = arcade?.wins_oneinthequiver ?? 0;
    this.kills = arcade?.kills_oneinthequiver ?? 0;
    this.bowKills = arcade?.bow_kills_oneinthequiver ?? 0;
    this.swordKills = arcade?.sword_kills_oneinthequiver ?? 0;
    this.bountyKills = arcade?.bounty_kills_oneinthequiver ?? 0;
    this.deaths = arcade?.deaths_oneinthequiver ?? 0;
  }
}

export class CaptureTheWoolStats {
  kills: number;
  woolCaptures: number;

  constructor(player: any) {
    this.woolCaptures = player?.achievements?.arcade_ctw_oh_sheep ?? 0;
    this.kills = player?.achievements?.arcade_ctw_slayer ?? 0;
  }
}

export class CreeperAttackStats {
  maxWave: number;

  constructor(arcade: any) {
    this.maxWave = arcade?.max_wave ?? 0;
  }
}

export class DragonWarsStats implements ArcadeGameStats {
  wins: number;
  kills: number;

  constructor(arcade: any) {
    this.wins = arcade?.wins_dragonwars2 ?? 0;
    this.kills = arcade?.kills_dragonwars2 ?? 0;
  }
}

export class EnderSpleefStats implements ArcadeGameStats {
  wins: number;
  blocksBroken: number;
  totalPowerups: number;
  bigshotPowerups: number;
  tripleshotPowerups: number;

  constructor(arcade: any) {
    this.blocksBroken = arcade?.blocks_destroyed_ender ?? 0;
    this.totalPowerups = arcade?.powerup_activations_ender ?? 0;
    this.bigshotPowerups = arcade?.bigshot_powerup_activations_ender ?? 0;
    this.tripleshotPowerups = arcade?.tripleshot_powerup_activations_ender ?? 0;
    this.wins = arcade?.wins_ender ?? 0;
  }
}

export class FootballStats implements ArcadeGameStats {
  wins: number;
  goals: number;
  powerkicks: number;
  kicks: number;

  constructor(arcade: any) {
    this.wins = arcade?.wins_soccer ?? 0;
    this.goals = arcade?.goals_soccer ?? 0;
    this.powerkicks = arcade?.powerkicks_soccer ?? 0;
    this.kicks = arcade?.kicks_soccer ?? 0;
  }
}

export class FarmhuntStats implements ArcadeGameStats {
  wins: number;
  poop: number;
  animalWins: number;
  hunterWins: number;
  kills: number;
  animalKills: number;
  hunterKills: number;
  bowKills: number;
  animalBowKills: number;
  hunterBowKills: number;
  tauntsUsed: number;
  safeTauntsUsed: number;
  riskyTauntsUsed: number;
  dangerousTauntsUsed: number;
  fireworksUsed: number;

  constructor(arcade: any) {
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

export class GalaxyWarsStats implements ArcadeGameStats {
  wins: number;
  kills: number;
  deaths: number;
  rebelKills: number;
  empireKills: number;
  shotsFired: number;

  constructor(arcade: any) {
    this.kills = arcade?.sw_kills ?? 0;
    this.deaths = arcade?.sw_deaths ?? 0;
    this.wins = arcade?.sw_game_wins ?? 0;
    this.rebelKills = arcade?.sw_rebel_kills ?? 0;
    this.empireKills = arcade?.sw_empire_kills ?? 0;
    this.shotsFired = arcade?.sw_shots_fired ?? 0;
  }
}

export class HideAndSeekStats implements ArcadeGameStats {
  wins: number;
  propHuntHiderWins: number;
  propHuntSeekerWins: number;
  propHuntWins: number;
  partyPooperHiderWins: number;
  partyPooperSeekerWins: number;
  partyPooperWins: number;
  seekerWins: number;
  hiderWins: number;
  kills: number;
  objectives: number;

  constructor(player: any) {
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

export class HoleInTheWallStats implements ArcadeGameStats {
  wins: number;
  rounds: number;
  qualifiers: number;
  finals: number;
  combinedScore: number;
  bestGame: number;

  constructor(player: any) {
    this.finals = player?.stats?.Arcade?.hitw_record_f ?? 0;
    this.qualifiers = player?.stats?.Arcade?.hitw_record_q ?? 0;
    this.combinedScore = this.finals + this.qualifiers;
    this.bestGame = player?.achievements?.arcade_hitw_practice_makes_perfect ?? 0;

    this.wins = player?.stats?.Arcade?.wins_hole_in_the_wall ?? 0;
    this.rounds = player?.stats?.Arcade?.rounds_hole_in_the_wall ?? 0;
  }
}

export class HypixelSaysStats implements ArcadeGameStats {
  simonWins: number;
  santaWins: number;
  totalPoints: number;
  simonPoints: number;
  santaPoints: number;
  totalRoundWins: number;
  simonRoundWins: number;
  santaRoundWins: number;
  maxScoreSimon: number;
  maxScoreSanta: number;
  maxScore: number;

  constructor(arcade: any) {
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
  wins: number;
}

export class PartyGamesStats implements ArcadeGameStats {
  wins: number;
  wins1: number;
  wins2: number;
  wins3: number;

  roundsWon: number;
  starsEarned: number;

  animalSlaughterWins: number;
  animalSlaughterKills: number;
  animalSlaughterPB: number;

  anvilSpleefWins: number;
  anvilSpleefPB: number;

  bombardmentWins: number;
  bombardmentPB: number;

  chickenRingsWins: number;
  chickenRingsPB: number;

  diveWins: number;
  diveScore: number;
  divePB: number;

  highGroundWins: number;
  highGroundScore: number;
  highGroundPB: number;

  hoeWins: number;
  hoeScore: number;
  hoePB: number;

  jigsawWins: number;
  jigsawPB: number = 9999999999;

  jungleJumpWins: number;
  jungleJumpPB: number = 9999999999;

  labEscapeWins: number;
  labEscapePB: number = 9999999999;

  lawnMoowerWins: number;
  lawnMoowerScore: number;
  lawnMoowerPB: number;

  minecartRacingWins: number;
  minecartRacingPB: number = 9999999999;

  rpgWins: number;
  rpgKills: number;
  rpgPB: number;

  spiderMazeWins: number;
  spiderMazePB: number;

  theFloorIsLavaWins: number;
  theFloorIsLavaPB: number = 9999999999;

  avalancheWins: number;

  volcanoWins: number;

  pigFishingWins: number;

  trampolinioWins: number;

  pigJoustingWins: number;

  workshopWins: number;

  shootingRangeWins: number;

  frozenFloorWins: number;

  cannonPaintingWins: number;

  fireLeapersWins: number;

  superSheepWins: number;

  constructor(arcade: any) {
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
    this.chickenRingsPB = arcade?.chicken_rings_best_time_party ?? 9999999999;

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
    this.jigsawPB = arcade?.jigsaw_rush_best_time_party ?? 9999999999;

    this.jungleJumpWins = arcade?.jungle_jump_round_wins_party ?? 0;
    this.jungleJumpPB = arcade?.jungle_jump_best_time_party ?? 9999999999;

    this.labEscapeWins = arcade?.lab_escape_round_wins_party ?? 0;
    this.labEscapePB = arcade?.lab_escape_best_time_party ?? 9999999999;

    this.lawnMoowerWins = arcade?.lawn_moower_round_wins_party ?? 0;
    this.lawnMoowerScore = arcade?.lawn_moower_mowed_total_score_party ?? 0;
    this.lawnMoowerPB = arcade?.lawn_moower_mowed_best_score_party ?? 0;

    this.minecartRacingWins = arcade?.minecart_racing_round_wins_party ?? 0;
    this.minecartRacingPB = arcade?.minecart_racing_best_time_party ?? 9999999999;

    this.rpgWins = arcade?.rpg_16_round_wins_party ?? 0;
    this.rpgKills = arcade?.rpg_16_kills_party ?? 0;
    this.rpgPB = arcade?.rpg_16_kills_best_score_party ?? 0;

    this.spiderMazeWins = arcade?.spider_maze_round_wins_party ?? 0;
    this.spiderMazePB = arcade?.spider_maze_best_time_party ?? 9999999999;

    this.theFloorIsLavaWins = arcade?.the_floor_is_lava_round_wins_party ?? 0;
    this.theFloorIsLavaPB = arcade?.the_floor_is_lava_best_time_party ?? 9999999999;

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

export class PixelPaintersStats implements ArcadeGameStats {
  wins: number;
  constructor(arcade: any) {
    this.wins = arcade?.wins_draw_their_thing ?? 0;
  }
}

export class ThrowOutStats implements ArcadeGameStats {
  wins: number;
  kills: number;
  deaths: number;

  constructor(arcade: any) {
    this.wins = arcade?.wins_throw_out ?? 0;
    this.kills = arcade?.kills_throw_out ?? 0;
    this.deaths = arcade?.deaths_throw_out ?? 0;
  }
}

export class SeasonalStats {
  constructor(player: any) {
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

  easter: number;
  scuba: number;
  halloween: number;
  grinch: number;
  santaWins: number;
  total: number;

  grinchGiftsFound: number;
  pointsScuba: number;
  foundScuba: number;
  foundEaster: number;
  foundHalloween: number;
  deliveredSanta: number;
}

export class MiniWallsStats implements ArcadeGameStats {
  wins: number;
  kit: string;
  arrowsHit: number;
  arrowsShot: number;
  finalKills: number;
  kills: number;
  witherKills: number;
  deaths: number;
  witherDamage: number;

  constructor(arcade: any) {
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

export class ArcadeQuests {
  total: number;
  daily: number;
  weekly: number;
  arcadeGamer: number;
  arcadeWinner: number;
  arcadeSpecialist: number;

  constructor(player: any) {
    this.arcadeGamer = player?.quests?.arcade_gamer?.completions?.length ?? 0;
    this.arcadeSpecialist = player?.quests?.arcade_specialist?.completions?.length ?? 0;
    this.arcadeWinner = player?.quests?.arcade_winner?.completions?.length ?? 0;

    this.total = this.arcadeGamer + this.arcadeSpecialist + this.arcadeWinner;
    this.daily = this.arcadeGamer + this.arcadeWinner;
    this.weekly = this.arcadeSpecialist;
  }
}

export class ArcadeChallenges {
  zombies: number;
  partyGames: number;
  galaxyWars: number;
  holeInTheWall: number;
  hypixelSays: number;
  creeperAttack: number;
  blockingDead: number;
  enderSpleef: number;
  football: number;
  miniWalls: number;
  hideAndSeek: number;
  farmhunt: number;
  throwOut: number;
  dragonWars: number;
  pixelPainters: number;
  bountyHunters: number;
  captureTheWool: number;

  constructor(player: any) {
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

export class ZombiesStats {
  constructor(player: any) {
    if (player?.stats?.Arcade) {
      for (const stat in player?.stats?.Arcade) {
        if (stat.includes("zombie")) {
          this[stat] = player?.stats?.Arcade[stat];
        }
      }
    }
  }
}

export class ExtraStats {
  combinedAchievementProgress: number;
  classicTokens: number;
  challengeAchievementsCompleted: number;
  tournamentTributes: number;
  tournamentTokens: number;
  totalCoins: number;
  rewardStreak: number;

  constructor(player: any) {
    this.tournamentTributes = player?.tourney?.total_tributes ?? 0;
    this.tournamentTokens = player?.tournamentTokens ?? 0;
    this.classicTokens = player?.stats?.Legacy?.total_tokens ?? 0;
    this.challengeAchievementsCompleted = (player?.achievementsOneTime ?? []).length;
    this.totalCoins = player?.achievements?.general_coins ?? 0;
    this.rewardStreak = player?.rewardStreak ?? 0;

    this.combinedAchievementProgress = 0;
    for (const achievementName in player?.achievements ?? {}) {
      this.combinedAchievementProgress += player?.achievements?.[achievementName] ?? 0;
    }
  }
}
