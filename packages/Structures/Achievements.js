/* eslint-disable jsdoc/no-undefined-types */

const fs = require("fs-extra");
const { achievements } = JSON.parse(fs.readFileSync("data/achievements.json"));

class Achievement {
  name = "";
  description = "";
}

class OneTimeAP extends Achievement {
  points = 0;
  gamePercentUnlocked = 0;
  globalPercentUnlocked = 0;
  legacy = false;
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
  name = "";
  tiers = {};
  legacy = false;
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
    this.stat = `${stat.toLowerCase()}`;
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
    this.stat = `${stat.toLowerCase()}`;
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

class GameTieredAP {
  name = "";
  legacy = false;
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
    this.legacy = achievement.legacy ?? false;

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

class GameAP {
  apEarned = 0;
  apAvailable = 0;

  legacyEarned = 0;
  legacyAvailable = 0;

  challengeEarned = 0;
  challengeAvailable = 0;

  tieredEarned = 0;
  tieredAvailable = 0;

  tieredAP = [];
  challengeAP = [];

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
      const completed = onetimeArr.has(onetime.stat);
      if (completed) {
        this.achievementsEarned.push({ name: onetime.achievement.name, points: onetime.achievement.points, challenge: true, legacy: onetime.achievement.legacy ?? false });
        if (onetime.achievement.legacy != true) {
          this.apEarned += onetime.achievement.points;
          this.challengeEarned += onetime.achievement.points;
        } else {
          this.legacyEarned += onetime.achievement.points;
        }
      } else {
        this.achievementsMissing.push({ name: onetime.achievement.name, points: onetime.achievement.points, challenge: true, legacy: onetime.achievement.legacy ?? false });
      }

      this.challengeAP.push({ ...onetime.achievement, completed });

      if (onetime.achievement.legacy != true) {
        this.apAvailable += onetime.achievement.points;
        this.challengeAvailable += onetime.achievement.points;
      } else {
        this.legacyAvailable += onetime.achievement.points;
      }
    }

    for (const tierAP of tiered) {
      if (tieredKeys.includes(tierAP.stat)) {
        const gameTier = new GameTieredAP(accData.achievements[tierAP.stat], tierAP.achievement);
        if (gameTier.currentTier == gameTier.topTier) {
          this.achievementsEarned.push({ name: gameTier.name, points: gameTier.availiableAP - gameTier.ap, challenge: false, legacy: gameTier.legacy });
        } else {
          this.achievementsMissing.push({ name: gameTier.name, points: gameTier.availiableAP - gameTier.ap, challenge: false, legacy: gameTier.legacy });
        }

        if (!gameTier.legacy) {
          this.apEarned += gameTier.ap;
          this.apAvailable += gameTier.availiableAP;
          this.tieredEarned += gameTier.ap;
          this.tieredAvailable += gameTier.availiableAP;
        } else {
          this.legacyEarned += gameTier.ap;
          this.legacyAvailable += gameTier.availiableAP;
        }

        this.tieredAP.push(gameTier);
      } else {
        const gameTier = new GameTieredAP(0, tierAP.achievement);

        if (!gameTier.legacy) {
          this.apAvailable += gameTier.availiableAP;
          this.tieredAvailable += gameTier.availiableAP;
        } else {
          this.legacyAvailable += gameTier.availiableAP;
        }

        this.tieredAP.push(gameTier);
      }
    }
  }
}

class Achievements {
  totalEarned = 0;
  totalAvailiable = 0;
  totalLegacyEarned = 0;
  totalLegacyAvailable = 0;

  constructor(accData) {
    for (const game in achievements) {
      const oneTimes = [];
      for (const onetimeAP in achievements[game].one_time) {
        oneTimes.push(new OneTimeAchievementWrapper(achievements[game].one_time[onetimeAP], `${game}_${onetimeAP}`));
      }

      const allTiered = [];
      for (const tieredAP in achievements[game].tiered) {
        allTiered.push(new TeiredAchievementWrapper(achievements[game].tiered[tieredAP], `${game}_${tieredAP}`));
      }
      const gameData = new GameAP(accData, oneTimes, allTiered);
      this[game] = gameData;

      this.totalEarned += gameData.apEarned;
      this.totalAvailiable += gameData.apAvailable;
      this.totalLegacyEarned += gameData.legacyEarned;
      this.totalLegacyAvailable += gameData.legacyAvailable;
    }
  }
}

module.exports = Achievements;
