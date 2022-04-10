import Logger from "@hyarcade/logger";
import { HypixelApi } from "@hyarcade/requests";
import { AccountAP } from "./AccountAP";
import {
  ArcadeChallenges,
  ArcadeQuests,
  BlockingDeadStats,
  BountyHuntersStats,
  CaptureTheWoolStats,
  CreeperAttackStats,
  DragonWarsStats,
  EnderSpleefStats,
  ExtraStats,
  FarmhuntStats,
  FootballStats,
  GalaxyWarsStats,
  HideAndSeekStats,
  HoleInTheWallStats,
  HypixelSaysStats,
  MiniWallsStats,
  PartyGamesStats,
  PixelPaintersStats,
  SeasonalStats,
  ThrowOutStats,
  ZombiesStats,
} from "./ArcadeModes";
import { PopulateAccountData } from "./PopulateAccountData";

export default class Account {
  name: string;
  // eslint-disable-next-line camelcase
  name_lower: string;
  nameHist: string[];
  uuid: string;
  uuidPosix: string;
  internalId: string;

  rank: string;
  plusColor: string;
  mvpColor: string;

  apiHidden: boolean;
  firstLogin: number;
  isLoggedIn: boolean;
  lastLogin: number;
  lastLogout: number;
  mostRecentGameType: string;
  actionTime: any;

  questsCompleted: number;
  achievementPoints: number;
  xp: number;
  level: number;
  karma: number;
  ranksGifted: number;

  arcadeCoins: number;
  coinsEarned: number;
  arcadeWins: number;
  combinedArcadeWins: number;
  importance: number;
  arcadeAchievementPoints: number;

  arcadeAchievments: AccountAP;
  arcadeChallenges: ArcadeChallenges;
  quests: ArcadeQuests;

  blockingDead: BlockingDeadStats;
  bountyHunters: BountyHuntersStats;
  captureTheWool: CaptureTheWoolStats;
  creeperAttack: CreeperAttackStats;
  dragonWars: DragonWarsStats;
  enderSpleef: EnderSpleefStats;
  farmhunt: FarmhuntStats;
  football: FootballStats;
  galaxyWars: GalaxyWarsStats;
  hideAndSeek: HideAndSeekStats;
  holeInTheWall: HoleInTheWallStats;
  hypixelSays: HypixelSaysStats;
  partyGames: PartyGamesStats;
  pixelPainters: PixelPaintersStats;
  throwOut: ThrowOutStats;
  seasonalWins: SeasonalStats;
  miniWalls: MiniWallsStats;
  zombies: any;
  extra: ExtraStats;

  coinTransfers: number;
  simTotal: number;
  unknownWins: number;

  anyWins: number;

  hypixelDiscord: string;
  discord: string;

  timePlaying: number;
  updateTime: number;

  constructor(name: string, wins: number, uuid: string) {
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

  setData(oldAcc: Account) {
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

  static from(obj: any): Account {
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
    // eslint-disable-next-line camelcase
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

  async updateData() {
    await this.updateHypixel();
  }

  setHypixel(json: any) {
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
    this.holeInTheWall = new HoleInTheWallStats(player);
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
    this.extra = new ExtraStats(json?.player);

    PopulateAccountData(json, this);
  }

  async updateHypixel() {
    try {
      const json = await HypixelApi.player(this.uuid);

      this.setHypixel(json);
    } catch (error) {
      Logger.error(error);
      Logger.error(error.stack);
    }
  }
}
