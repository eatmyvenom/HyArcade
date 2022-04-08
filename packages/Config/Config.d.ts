interface CommandImage {
  /**
   * The location of the image file to use
   */
  file: string;

  /**
   * The color to put over the image after it is added
   */
  overlay: string;
}

interface CommandImages {
  topGames: CommandImage;
  leaderboard: CommandImage;
  gameStats: CommandImage;
}

interface ClusterConfig {
  name: string;
  key: string;
  tasks: string[];
  flags: string[];
}

interface Clusters {
  main: ClusterConfig;
}

interface DataCacheTime {
  accounts: number;
  guilds: number;
  config: number;
  counts: number;
  resources: number;
}

interface DatabaseKey {
  limit: number;

  perms: string;
}

interface DatabaseKeys {
  [key: string]: DatabaseKey;
}

interface DatabaseConfig {
  url: string;

  defaultLimit: string;

  pass: string;

  key: string;

  mongoURL: string;

  serverIP: string;

  /**
   * Keys for users to access the database from
   * allows for workers or for other people without
   * a full database system to use similar data
   * from the Hyarcade API instead.
   */
  keys: DatabaseKeys;

  maxLBSize: number;

  defaultLBSize: number;

  cacheTime: DataCacheTime;

  /**
   * Dot notated list of all leaderboards to be stored in redis.
   * Used by the api for returning results for default leaderboards
   * however is prone to being out of date.
   *
   * The caching process runs once every 20 minutes but can be
   * modified in the pm2 ecosystem config file. However it takes
   * about 30 seconds to generate each set of leaderboards for the
   * cache which means it should be at least leaderboards*30 seconds
   * for how often the process runs.
   */
  cacheLbs: string[];
}

interface MiniWallsConfig {
  /** Message ID for the auto updated leaderboards */
  lbMsg: string;

  /** Discord guilds for the bot to be activated in */
  guilds: string[];

  /** Discord channels for the bot to be activated in */
  channels: string[];
}

interface Activity {
  name: string;
  type: string;
}

interface PresenceItem {
  activities: Activity[];
  status: string;
}

interface SetupItem {
  username: string;
  icon: string;
  presences: PresenceItem;
}

interface DiscordSetupConfig {
  bot: SetupItem;
  mini: SetupItem;
  test: SetupItem;
  mw: SetupItem;
}

interface DiscordConfig {
  /** The token for the main discord bot */
  token: string;

  mwToken: string;
  testToken: string;

  trustedUsers: string[];
  miniWalls: MiniWallsConfig;

  logChannel: string;
  errChannel: string;
  cmdChannel: string;
  verifyChannel: string;
  statusHook: string;

  leaderboards: object;
  lbArchive: object;

  presences: PresenceItem[];
  setup: DiscordSetupConfig;
}

interface VerifyChannelConfig {
  channel: string;
  add: string;
  remove: string;
  blacklist: string[];
}

interface EnabledBotLocations {
  guilds: string[];
  channels: string[];
}

interface DiscordBotConfig {
  key: string;
  allEnabled: boolean;
  enabled: EnabledBotLocations;
  verifyChannels: VerifyChannelConfig[];
}

interface datagenConfig {
  outdateAmount: number;
  hypixelReqTimeout: number;
}

interface HypixelConfig {
  mainKey: string;
  botKey: string;
  batchKeys: string[];
  localInterfaces: string[];
  loginLimit: number;
  importanceLimit: number;
  minImportance: number;
  leaderboardLimit: number;
  segmentSize: number;
  concurrentBatches: number;
  alwaysForce: number;
  autoUpdate: number;
  datagen: datagenConfig;
}

interface ThirdPartyConfig {
  observerKey: string;
  slothPixelKey: string;
}

interface RedisConfig {
  url: string;
  leaderboardSize: number;
}

interface SiteConfig {
  port: number;
}

declare class HyarcadeConfig {
  private _interval: object;

  key: string;
  mode: string;
  alwaysForce: boolean;
  logRateLimit: boolean;
  cluster: string;
  showDaytime: string;
  commandCharacter: string;
  webhook: object;

  commandImages: CommandImages;
  clusters: Clusters;
  database: DatabaseConfig;
  discord: DiscordConfig;
  discordBot: DiscordBotConfig;
  hypixel: HypixelConfig;
  otherHooks: object;
  thirdParty: ThirdPartyConfig;
  redis: RedisConfig;
  site: SiteConfig;

  autoRefresh(): void;
  destory(): void;
}

export default class Config extends HyarcadeConfig {
  // eslint-disable-next-line no-unused-vars
  constructor(json: object);
  static fromJSON(): HyarcadeConfig;
}

export function fromJSON(): HyarcadeConfig;
