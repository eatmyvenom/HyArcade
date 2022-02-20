/* eslint-disable jsdoc/no-undefined-types */

const fs = require("fs-extra");
const { achievements } = JSON.parse(fs.readFileSync("data/achievements.json"));
const arcadeOneTime = achievements.arcade.one_time;
const arcadeTiered = achievements.arcade.tiered;

class Achievement {
  name = "";
  description = "";
}

class OneTimeAP extends Achievement {
  points = 0;
  gamePercentUnlocked = 0;
  globalPercentUnlocked = 0;
}

class APTier {
  tier = 0;
  points = 0;
  amount = 0;
}

class TieredAP extends Achievement {
  /**
   *
   * @type {ArrayLike<APTier>}
   * @memberof TieredAP
   */
  tiers = {};
}

class TeiredAchievementWrapper {
  /**
   *
   * @type {TieredAP}
   * @memberof TeiredAchievementWrapper
   */
  achievement = {};

  stat = "";

  constructor(achievement, stat) {
    this.achievement = achievement;
    this.stat = `arcade_${stat.toLowerCase()}`;
  }
}

class OneTimeAchievementWrapper {
  /**
   *
   * @type {OneTimeAP}
   * @memberof TeiredAchievementWrapper
   */
  achievement = {};

  stat = "";

  constructor(achievement, stat) {
    this.achievement = achievement;
    this.stat = `arcade_${stat.toLowerCase()}`;
  }
}

class AccountWithAchievements {
  /**
   *
   * @type {ArrayLike<string>}
   * @memberof AccountWithAchievements
   */
  achievementsOneTime = {};

  /**
   *
   * @type {object.<string, number>}
   * @memberof AccountWithAchievements
   */
  achievements = {};
}

class ArcadeTieredAP {
  name = "";
  currentTier = 0;
  topTier = 0;
  amount = 0;
  toTop = 0;
  toNext = 0;
  ap = 0;
  availiableAP = 0;

  /**
   *
   * @param {number} amnt
   * @param {TieredAP} achievement
   */
  constructor(amnt, achievement) {
    this.amount = amnt;
    this.name = achievement.name;

    const tierArr = [...achievement.tiers];

    for (const tier of tierArr) {
      if (this.amount >= tier.amount) {
        this.currentTier = tier.tier;
        this.ap += tier.points;
      }

      this.availiableAP += tier.points;
    }

    this.topTier = tierArr[tierArr.length - 1].tier;
    this.toTop = tierArr[tierArr.length - 1].amount - this.amount;
    this.toNext = (tierArr[this.currentTier]?.amount ?? tierArr[tierArr.length - 1].amount) - this.amount;
  }
}

class ArcadeGameAP {
  apEarned = 0;
  apAvailable = 0;

  tieredAP = [];

  achievementsEarned = [];
  achievementsMissing = [];

  /**
   *
   * @param {AccountWithAchievements} accData
   * @param {OneTimeAchievementWrapper[]} onetimes
   * @param {TeiredAchievementWrapper[]} tiered
   */
  constructor(accData, onetimes, tiered) {
    const onetimeArr = new Set(accData?.achievementsOneTime ?? []);
    const tieredKeys = Object.keys(accData?.achievements ?? []);

    for (const onetime of onetimes) {
      if (onetimeArr.has(onetime.stat)) {
        this.achievementsEarned.push({ name: onetime.achievement.name, points: onetime.achievement.points });
        this.apEarned += onetime.achievement.points;
      } else {
        this.achievementsMissing.push({ name: onetime.achievement.name, points: onetime.achievement.points });
      }

      this.apAvailable += onetime.achievement.points;
    }

    for (const tierAP of tiered) {
      if (tieredKeys.includes(tierAP.stat)) {
        const gameTier = new ArcadeTieredAP(accData.achievements[tierAP.stat], tierAP.achievement);
        if (gameTier.currentTier == gameTier.topTier) {
          this.achievementsEarned.push(gameTier.name);
        } else {
          this.achievementsMissing.push(gameTier.name);
        }

        this.apEarned += gameTier.ap;
        this.apAvailable += gameTier.availiableAP;

        this.tieredAP.push(gameTier);
      } else {
        const gameTier = new ArcadeTieredAP(0, tierAP.achievement);

        this.apAvailable += gameTier.availiableAP;

        this.tieredAP.push(gameTier);
      }
    }
  }
}

class AccountAP {
  totalEarned = 0;
  totalAvailiable = 0;

  /**
   *
   * @type {ArcadeGameAP}
   * @memberof AccountAP
   */
  overall;

  /**
   *
   * @type {ArcadeGameAP}
   * @memberof AccountAP
   */
  blockingDead;

  /**
   *
   * @type {ArcadeGameAP}
   * @memberof AccountAP
   */
  bountyHunters;

  /**
   *
   * @type {ArcadeGameAP}
   * @memberof AccountAP
   */
  captureTheWool;

  /**
   *
   * @type {ArcadeGameAP}
   * @memberof AccountAP
   */
  creeperAttack;

  /**
   *
   * @type {ArcadeGameAP}
   * @memberof AccountAP
   */
  dragonWars;

  /**
   *
   * @type {ArcadeGameAP}
   * @memberof AccountAP
   */
  enderSpleef;

  /**
   *
   * @type {ArcadeGameAP}
   * @memberof AccountAP
   */
  farmHunt;

  /**
   *
   * @type {ArcadeGameAP}
   * @memberof AccountAP
   */
  football;

  /**
   *
   * @type {ArcadeGameAP}
   * @memberof AccountAP
   */
  galaxyWars;

  /**
   *
   * @type {ArcadeGameAP}
   * @memberof AccountAP
   */
  hideAndSeek;

  /**
   *
   * @type {ArcadeGameAP}
   * @memberof AccountAP
   */
  holeInTheWall;

  /**
   *
   * @type {ArcadeGameAP}
   * @memberof AccountAP
   */
  hypixelSays;

  /**
   *
   * @type {ArcadeGameAP}
   * @memberof AccountAP
   */
  miniWalls;

  /**
   *
   * @type {ArcadeGameAP}
   * @memberof AccountAP
   */
  pixelPainters;

  /**
   *
   * @type {ArcadeGameAP}
   * @memberof AccountAP
   */
  throwOut;

  /**
   *
   * @type {ArcadeGameAP}
   * @memberof AccountAP
   */
  zombies;

  constructor(accData) {
    this.overall = new ArcadeGameAP(
      accData,
      [new OneTimeAchievementWrapper(arcadeOneTime.WORLD_ECONOMICS, "WORLD_ECONOMICS")],
      [new TeiredAchievementWrapper(arcadeTiered.ARCADE_BANKER, "ARCADE_BANKER"), new TeiredAchievementWrapper(arcadeTiered.ARCADE_WINNER, "ARCADE_WINNER")],
    );

    this.blockingDead = new ArcadeGameAP(
      accData,
      [
        new OneTimeAchievementWrapper(arcadeOneTime.NO_MERCY, "NO_MERCY"),
        new OneTimeAchievementWrapper(arcadeOneTime.LONE_SURVIVOR, "LONE_SURVIVOR"),
        new OneTimeAchievementWrapper(arcadeOneTime.BLOCKING_DEAD_RESCUE, "BLOCKING_DEAD_RESCUE"),
      ],
      [new TeiredAchievementWrapper(arcadeTiered.ZOMBIE_KILLER, "ZOMBIE_KILLER")],
    );

    this.bountyHunters = new ArcadeGameAP(
      accData,
      [
        new OneTimeAchievementWrapper(arcadeOneTime.NO_MUTINY_TODAY, "NO_MUTINY_TODAY"),
        new OneTimeAchievementWrapper(arcadeOneTime.BOUNTY_HUNTER_TARGET_KILLER, "BOUNTY_HUNTER_TARGET_KILLER"),
        new OneTimeAchievementWrapper(arcadeOneTime.BOUNTY_HUNTERS_SNIPER, "BOUNTY_HUNTERS_SNIPER"),
      ],
      [new TeiredAchievementWrapper(arcadeTiered.BOUNTY_HUNTER, "BOUNTY_HUNTER")],
    );

    this.captureTheWool = new ArcadeGameAP(
      accData,
      [
        new OneTimeAchievementWrapper(arcadeOneTime.CTW_HEY_THERE, "CTW_HEY_THERE"),
        new OneTimeAchievementWrapper(arcadeOneTime.CTW_I_CAN_BE_ANYTHING, "CTW_I_CAN_BE_ANYTHING"),
        new OneTimeAchievementWrapper(arcadeOneTime.CTW_NO_NEED, "CTW_NO_NEED"),
        new OneTimeAchievementWrapper(arcadeOneTime.CTW_MVP, "CTW_MVP"),
        new OneTimeAchievementWrapper(arcadeOneTime.CTW_RIGHT_PLACE_RIGHT_TIME, "CTW_RIGHT_PLACE_RIGHT_TIME"),
        new OneTimeAchievementWrapper(arcadeOneTime.CTW_FASHIONABLY_LATE, "CTW_FASHIONABLY_LATE"),
        new OneTimeAchievementWrapper(arcadeOneTime.CTW_SAFETY_IS_AN_ILLUSION, "CTW_SAFETY_IS_AN_ILLUSION"),
        new OneTimeAchievementWrapper(arcadeOneTime.CTW_MAGICIAN, "CTW_MAGICIAN"),
        new OneTimeAchievementWrapper(arcadeOneTime.CTW_FIRST, "CTW_FIRST"),
        new OneTimeAchievementWrapper(arcadeOneTime.CTW_COMEBACK, "CTW_COMEBACK"),
        new OneTimeAchievementWrapper(arcadeOneTime.CTW_NINJA, "CTW_NINJA"),
      ],
      [new TeiredAchievementWrapper(arcadeTiered.CTW_OH_SHEEP, "CTW_OH_SHEEP"), new TeiredAchievementWrapper(arcadeTiered.CTW_SLAYER, "CTW_SLAYER")],
    );

    this.creeperAttack = new ArcadeGameAP(
      accData,
      [
        new OneTimeAchievementWrapper(arcadeOneTime.CREEPER_ATTACK_SURVIVAL, "CREEPER_ATTACK_SURVIVAL"),
        new OneTimeAchievementWrapper(arcadeOneTime.CREEPER_ATTACK_WAVES, "CREEPER_ATTACK_WAVES"),
        new OneTimeAchievementWrapper(arcadeOneTime.CREEPER_ATTACK_IRON_GOLEM, "CREEPER_ATTACK_IRON_GOLEM"),
        new OneTimeAchievementWrapper(arcadeOneTime.CREEPER_ATTACK_UPGRADES, "CREEPER_ATTACK_UPGRADES"),
      ],
      [new TeiredAchievementWrapper(arcadeTiered.TEAM_WORK, "TEAM_WORK")],
    );

    this.dragonWars = new ArcadeGameAP(
      accData,
      [
        new OneTimeAchievementWrapper(arcadeOneTime.DRAGONTAMER, "DRAGONTAMER"),
        new OneTimeAchievementWrapper(arcadeOneTime.DRAGON_WARS_BLAST, "DRAGON_WARS_BLAST"),
        new OneTimeAchievementWrapper(arcadeOneTime.DRAGON_SLAYER, "DRAGON_SLAYER"),
        new OneTimeAchievementWrapper(arcadeOneTime.DRAGON_KILLER, "DRAGON_KILLER"),
        new OneTimeAchievementWrapper(arcadeOneTime.DW_QUICK_WIN, "DW_QUICK_WIN"),
        new OneTimeAchievementWrapper(arcadeOneTime.DW_VOID, "DW_VOID"),
      ],
      [new TeiredAchievementWrapper(arcadeTiered.DW_SLAYER, "DW_SLAYER"), new TeiredAchievementWrapper(arcadeTiered.DW_DRAGONBORN, "DW_DRAGONBORN")],
    );

    this.enderSpleef = new ArcadeGameAP(
      accData,
      [
        new OneTimeAchievementWrapper(arcadeOneTime.OVERPOWERED, "OVERPOWERED"),
        new OneTimeAchievementWrapper(arcadeOneTime.GOTTA_CATCH_THEM_ALL, "GOTTA_CATCH_THEM_ALL"),
        new OneTimeAchievementWrapper(arcadeOneTime.ENDER_SPLEEF_NO_POWERHOUSE, "ENDER_SPLEEF_NO_POWERHOUSE"),
      ],
      [
        new TeiredAchievementWrapper(arcadeTiered.ENDER_SPLEEF_POWERUPS, "ENDER_SPLEEF_POWERUPS"),
        new TeiredAchievementWrapper(arcadeTiered.ENDER_SPLEEF_BLOCK_STEALER, "ENDER_SPLEEF_BLOCK_STEALER"),
      ],
    );

    this.farmHunt = new ArcadeGameAP(
      accData,
      [
        new OneTimeAchievementWrapper(arcadeOneTime.CANT_HIDE_FROM_ME, "CANT_HIDE_FROM_ME"),
        new OneTimeAchievementWrapper(arcadeOneTime.OVER_HERE, "OVER_HERE"),
        new OneTimeAchievementWrapper(arcadeOneTime.GIDDY_UP_HORSEY, "GIDDY_UP_HORSEY"),
        new OneTimeAchievementWrapper(arcadeOneTime.FARM_HUNT_DISGUISE, "FARM_HUNT_DISGUISE"),
        new OneTimeAchievementWrapper(arcadeOneTime.FARM_HUNT_KILLER, "FARM_HUNT_KILLER"),
        new OneTimeAchievementWrapper(arcadeOneTime.UNTOUCHABLE, "UNTOUCHABLE"),
        new OneTimeAchievementWrapper(arcadeOneTime.SAVAGE, "SAVAGE"),
      ],
      [new TeiredAchievementWrapper(arcadeTiered.FARMHUNT_DOMINATOR, "FARMHUNT_DOMINATOR")],
    );

    this.football = new ArcadeGameAP(
      accData,
      [
        new OneTimeAchievementWrapper(arcadeOneTime.FOOTBALL_FIVE_GOALS, "FOOTBALL_FIVE_GOALS"),
        new OneTimeAchievementWrapper(arcadeOneTime.FOOTBALL_SPEED, "FOOTBALL_SPEED"),
        new OneTimeAchievementWrapper(arcadeOneTime.FOOTBALL_POTM, "FOOTBALL_POTM"),
      ],
      [new TeiredAchievementWrapper(arcadeTiered.FOOTBALL_PRO, "FOOTBALL_PRO")],
    );

    this.galaxyWars = new ArcadeGameAP(
      accData,
      [
        new OneTimeAchievementWrapper(arcadeOneTime.GALAXY_WARS_NOW_I_AM_THE_MASTER, "GALAXY_WARS_NOW_I_AM_THE_MASTER"),
        new OneTimeAchievementWrapper(arcadeOneTime.GALAXY_WARS_NEVER_FELT_BETTER, "GALAXY_WARS_NEVER_FELT_BETTER"),
        new OneTimeAchievementWrapper(arcadeOneTime.GALAXY_WARS_AIMED, "GALAXY_WARS_AIMED"),
        new OneTimeAchievementWrapper(arcadeOneTime.GALAXY_WARS_LETHALLY_BLIND, "GALAXY_WARS_LETHALLY_BLIND"),
        new OneTimeAchievementWrapper(arcadeOneTime.GALAXY_WARS_TARGET_PRACTICE, "GALAXY_WARS_TARGET_PRACTICE"),
        new OneTimeAchievementWrapper(arcadeOneTime.GALAXY_WARS_PERFECT_DEFLECT, "GALAXY_WARS_PERFECT_DEFLECT"),
      ],
      [new TeiredAchievementWrapper(arcadeTiered.GALAXY_WARS_KILLS, "GALAXY_WARS_KILLS")],
    );

    this.hideAndSeek = new ArcadeGameAP(
      accData,
      [
        new OneTimeAchievementWrapper(arcadeOneTime.HIDE_AND_SEEK_PROP_HUNTER, "HIDE_AND_SEEK_PROP_HUNTER"),
        new OneTimeAchievementWrapper(arcadeOneTime.HIDE_AND_SEEK_PARTY_POOPER, "HIDE_AND_SEEK_PARTY_POOPER"),
        new OneTimeAchievementWrapper(arcadeOneTime.HIDE_AND_SEEK_PROP, "HIDE_AND_SEEK_PROP"),
        new OneTimeAchievementWrapper(arcadeOneTime.HIDE_AND_SEEK_SPEEDRUNNER, "HIDE_AND_SEEK_SPEEDRUNNER"),
        new OneTimeAchievementWrapper(arcadeOneTime.HIDE_AND_SEEK_CLOSE_CALL, "HIDE_AND_SEEK_CLOSE_CALL"),
      ],
      [
        new TeiredAchievementWrapper(arcadeTiered.HIDE_AND_SEEK_HIDER_KILLS, "HIDE_AND_SEEK_HIDER_KILLS"),
        new TeiredAchievementWrapper(arcadeTiered.HIDE_AND_SEEK_MASTER_HIDER, "HIDE_AND_SEEK_MASTER_HIDER"),
      ],
    );

    this.holeInTheWall = new ArcadeGameAP(
      accData,
      [new OneTimeAchievementWrapper(arcadeOneTime.HOLE_SCORE, "HOLE_SCORE"), new OneTimeAchievementWrapper(arcadeOneTime.HOLE_FINALS, "HOLE_FINALS")],
      [new TeiredAchievementWrapper(arcadeTiered.HITW_PRACTICE_MAKES_PERFECT, "HITW_PRACTICE_MAKES_PERFECT")],
    );

    this.hypixelSays = new ArcadeGameAP(
      accData,
      [
        new OneTimeAchievementWrapper(arcadeOneTime.HYPIXEL_SAYS_BAD_HEALTH_CHOICES, "HYPIXEL_SAYS_BAD_HEALTH_CHOICES"),
        new OneTimeAchievementWrapper(arcadeOneTime.HYPIXEL_SAYS_TNT_DODGER, "HYPIXEL_SAYS_TNT_DODGER"),
        new OneTimeAchievementWrapper(arcadeOneTime.HYPIXEL_SAYS_PVE_EXPERT, "HYPIXEL_SAYS_PVE_EXPERT"),
        new OneTimeAchievementWrapper(arcadeOneTime.HYPIXEL_SAYS_PIG_RIDER, "HYPIXEL_SAYS_PIG_RIDER"),
        new OneTimeAchievementWrapper(arcadeOneTime.HYPIXEL_SAYS_MASTER, "HYPIXEL_SAYS_MASTER"),
        new OneTimeAchievementWrapper(arcadeOneTime.HYPIXEL_SAYS_MOVEMENT, "HYPIXEL_SAYS_MOVEMENT"),
      ],
      [],
    );

    this.miniWalls = new ArcadeGameAP(
      accData,
      [
        new OneTimeAchievementWrapper(arcadeOneTime.MINI_WALLS_LAST_MAN, "MINI_WALLS_LAST_MAN"),
        new OneTimeAchievementWrapper(arcadeOneTime.MINI_WALLS_DAMAGE, "MINI_WALLS_DAMAGE"),
        new OneTimeAchievementWrapper(arcadeOneTime.MINI_HUNTER, "MINI_HUNTER"),
        new OneTimeAchievementWrapper(arcadeOneTime.TEAM_SLAYER, "TEAM_SLAYER"),
      ],
      [new TeiredAchievementWrapper(arcadeTiered.MINIWALLS_WINNER, "MINIWALLS_WINNER")],
    );

    this.partyGames = new ArcadeGameAP(
      accData,
      [
        new OneTimeAchievementWrapper(arcadeOneTime.SHOOTING_RANGE_EXPLOSIVE_ARROW, "SHOOTING_RANGE_EXPLOSIVE_ARROW"),
        new OneTimeAchievementWrapper(arcadeOneTime.HOEHOEHOE_SCORE, "HOEHOEHOE_SCORE"),
        new OneTimeAchievementWrapper(arcadeOneTime.PIG_FISHING_SUPER_BACON, "PIG_FISHING_SUPER_BACON"),
        new OneTimeAchievementWrapper(arcadeOneTime.WOOPS_DIDNT_MEAN_TO, "WOOPS_DIDNT_MEAN_TO"),
        new OneTimeAchievementWrapper(arcadeOneTime.RPG_16_ROCKET_PIG, "RPG_16_ROCKET_PIG"),
        new OneTimeAchievementWrapper(arcadeOneTime.AVALANCE_WAVES, "AVALANCE_WAVES"),
        new OneTimeAchievementWrapper(arcadeOneTime.PARTY_GAMES_STARS, "PARTY_GAMES_STARS"),
        new OneTimeAchievementWrapper(arcadeOneTime.TRAMPOLINIO_RED_WOOL, "TRAMPOLINIO_RED_WOOL"),
        new OneTimeAchievementWrapper(arcadeOneTime.ANIMAL_SLAUGHTER, "ANIMAL_SLAUGHTER"),
        new OneTimeAchievementWrapper(arcadeOneTime.PARTY_SURVIVOR, "PARTY_SURVIVOR"),
        new OneTimeAchievementWrapper(arcadeOneTime.PARTY_IN_SYNC, "PARTY_IN_SYNC"),
        new OneTimeAchievementWrapper(arcadeOneTime.PARTY_PICASSO, "PARTY_PICASSO"),
        new OneTimeAchievementWrapper(arcadeOneTime.PARTY_PARKOUR, "PARTY_PARKOUR"),
        new OneTimeAchievementWrapper(arcadeOneTime.PARTY_PERFECTION, "PARTY_PERFECTION"),
        new OneTimeAchievementWrapper(arcadeOneTime.PARTY_FAST_HANDS, "PARTY_FAST_HANDS"),
        new OneTimeAchievementWrapper(arcadeOneTime.PARTY_SHEEP_RIDER, "PARTY_SHEEP_RIDER"),
        new OneTimeAchievementWrapper(arcadeOneTime.PROFESSIONAL_MOWER, "PROFESSIONAL_MOWER"),
      ],
      [new TeiredAchievementWrapper(arcadeTiered.PARTY_SUPER_STAR, "PARTY_SUPER_STAR")],
    );

    this.pixelPainters = new ArcadeGameAP(accData, [new OneTimeAchievementWrapper(arcadeOneTime.PIXEL_PAINTERS_ONE, "PIXEL_PAINTERS_ONE")], []);

    this.throwOut = new ArcadeGameAP(
      accData,
      [
        new OneTimeAchievementWrapper(arcadeOneTime.THROW_OUT_POWERUP_KILL, "THROW_OUT_POWERUP_KILL"),
        new OneTimeAchievementWrapper(arcadeOneTime.THROW_OUT_REGULAR_GUY, "THROW_OUT_REGULAR_GUY"),
      ],
      [new TeiredAchievementWrapper(arcadeTiered.THROW_OUT_KILLS, "THROW_OUT_KILLS")],
    );

    this.zombies = new ArcadeGameAP(
      accData,
      [
        new OneTimeAchievementWrapper(arcadeOneTime.ZOMBIES_FEELS_GOOD, "ZOMBIES_FEELS_GOOD"),
        new OneTimeAchievementWrapper(arcadeOneTime.ZOMBES_SERIAL_KILLER, "ZOMBES_SERIAL_KILLER"),
        new OneTimeAchievementWrapper(arcadeOneTime.ZOMBIES_SPEED_RUNNER, "ZOMBIES_SPEED_RUNNER"),
        new OneTimeAchievementWrapper(arcadeOneTime.ZOMBIES_ULTIMATE, "ZOMBIES_ULTIMATE"),
        new OneTimeAchievementWrapper(arcadeOneTime.ZOMBIES_TIME_TRIAL_BLOOD, "ZOMBIES_TIME_TRIAL_BLOOD"),
        new OneTimeAchievementWrapper(arcadeOneTime.ZOMBIES_TEAM_PLAYER, "ZOMBIES_TEAM_PLAYER"),
        new OneTimeAchievementWrapper(arcadeOneTime.ZOMBIES_HEROBRINE, "ZOMBIES_HEROBRINE"),
        new OneTimeAchievementWrapper(arcadeOneTime.ZOMBIES_PERK_HOARDER, "ZOMBIES_PERK_HOARDER"),
        new OneTimeAchievementWrapper(arcadeOneTime.ZOMBIES_WIN, "ZOMBIES_WIN"),
        new OneTimeAchievementWrapper(arcadeOneTime.ZOMBIES_ELECTRICIAN, "ZOMBIES_ELECTRICIAN"),
        new OneTimeAchievementWrapper(arcadeOneTime.ZOMBIES_TIME_TRIAL_DEAD, "ZOMBIES_TIME_TRIAL_DEAD"),
        new OneTimeAchievementWrapper(arcadeOneTime.ZOMBIES_SURVIVOR, "ZOMBIES_SURVIVOR"),
      ],
      [
        new TeiredAchievementWrapper(arcadeTiered.ZOMBIES_NICE_SHOT, "ZOMBIES_NICE_SHOT"),
        new TeiredAchievementWrapper(arcadeTiered.ZOMBIES_ROUND_PROGRESSION, "ZOMBIES_ROUND_PROGRESSION"),
        new TeiredAchievementWrapper(arcadeTiered.ZOMBIES_HIGH_ROUND, "ZOMBIES_HIGH_ROUND"),
      ],
    );

    this.totalAvailiable =
      this.overall.apAvailable +
      this.blockingDead.apAvailable +
      this.bountyHunters.apAvailable +
      this.captureTheWool.apAvailable +
      this.creeperAttack.apAvailable +
      this.dragonWars.apAvailable +
      this.enderSpleef.apAvailable +
      this.farmHunt.apAvailable +
      this.football.apAvailable +
      this.galaxyWars.apAvailable +
      this.hideAndSeek.apAvailable +
      this.holeInTheWall.apAvailable +
      this.hypixelSays.apAvailable +
      this.miniWalls.apAvailable +
      this.partyGames.apAvailable +
      this.pixelPainters.apAvailable +
      this.throwOut.apAvailable +
      this.zombies.apAvailable;

    this.totalEarned =
      this.overall.apEarned +
      this.blockingDead.apEarned +
      this.bountyHunters.apEarned +
      this.captureTheWool.apEarned +
      this.creeperAttack.apEarned +
      this.dragonWars.apEarned +
      this.enderSpleef.apEarned +
      this.farmHunt.apEarned +
      this.football.apEarned +
      this.galaxyWars.apEarned +
      this.hideAndSeek.apEarned +
      this.holeInTheWall.apEarned +
      this.hypixelSays.apEarned +
      this.miniWalls.apEarned +
      this.partyGames.apEarned +
      this.pixelPainters.apEarned +
      this.throwOut.apEarned +
      this.zombies.apEarned;
  }
}

module.exports = AccountAP;
