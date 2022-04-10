import type { Account } from "@hyarcade/account";
import Config from "@hyarcade/config";
import { DatabaseResponseError } from "@hyarcade/errors";
import Logger from "@hyarcade/logger";
import axios from "axios";

const cfg = Config.fromJSON();

/**
 * @param status
 * @returns {boolean}
 */
function validateStatus(status: number) {
  return status < 500;
}

/**
 *
 * @param {string} endpoint
 * @param {object} args
 * @returns {object}
 */
export async function ApiGET(endpoint: string, args: object = {}): Promise<object> {
  const url = new URL(endpoint, cfg.database.url);

  for (const arg in args) {
    url.searchParams.set(arg, args[arg]);
  }

  const req = await axios.get(url.toString(), { headers: { Authorization: cfg.database.pass }, validateStatus });
  return req.data;
}

/**
 *
 * @param {string} endpoint
 * @param {object} data
 * @returns {Promise<object>}
 */
export async function ApiPOST(endpoint: string, data: object): Promise<object> {
  const url = new URL(endpoint, cfg.database.url);

  const req = await axios.post(url.toString(), data, { headers: { Authorization: cfg.database.pass }, validateStatus });
  return req.data;
}

/**
 *
 * @param file
 * @param fields
 * @returns {Promise<object>}
 */
export async function readDB(file: string, fields: string[]): Promise<object> {
  let fileData;
  const url = new URL("database", cfg.database.url);
  const path = `${file}`;
  url.searchParams.set("path", path);

  if (fields != undefined) {
    url.searchParams.set("fields", fields.join(","));
  }

  Logger.info(`Fetching ${url.searchParams.toString()} from database`);

  try {
    const fileReq = await axios.get(url.toString(), { headers: { Authorization: cfg.database.pass }, validateStatus });
    fileData = fileReq.data;
  } catch (error) {
    Logger.err("Can't connect to database");
    Logger.err(error.stack);
    return {};
  }
  Logger.debug("Data fetched!");
  return fileData;
}

/**
 *
 * @param path
 * @param json
 */
export async function writeDB(path: string, json: object): Promise<void> {
  const url = new URL("database", cfg.database.url);
  url.searchParams.set("path", path);
  Logger.debug(`Writing to ${path} in database`);

  await axios.post(url.toString(), json, { headers: { Authorization: cfg.database.pass }, validateStatus });
}

/**
 *
 * @param text
 * @param discordID
 * @param cacheOnly
 * @returns {Promise<object>}
 */
export async function account(text: string, discordID: string, cacheOnly: boolean = false): Promise<Account | object> {
  const url = new URL("account", cfg.database.url);

  if (text != undefined && text != "" && text != "!") {
    if (text.length < 17) {
      url.searchParams.set("ign", text);
    } else {
      url.searchParams.set("uuid", text.replace(/-/g, ""));
    }
  }

  if (discordID != undefined && discordID != "") {
    url.searchParams.set("discid", discordID);
  }

  if (cacheOnly) {
    url.searchParams.set("cache", "");
  }

  let acc;
  try {
    Logger.verbose(`Fetching ${url.searchParams} from database!`);
    const accReq = await axios.get(url.toString(), { headers: { Authorization: cfg.database.pass }, validateStatus });
    acc = accReq.data;
  } catch (error) {
    Logger.err("Error fetching data from database");
    Logger.err(error.stack);
    Logger.err(acc);
    return {};
  }

  return acc;
}

/**
 *
 * @param text
 * @param cache
 */
export async function guild(text: string, cache = false): Promise<object> {
  const url = new URL("guild", cfg.database.url);

  if (text != undefined && text != "" && text != "!") {
    if (text.length == 24) {
      url.searchParams.set("uuid", text);
    } else {
      url.searchParams.set("member", text.replace(/-/g, ""));
    }
  }

  if (cache) {
    url.searchParams.set("cache", "");
  }

  let guild;
  try {
    const guildReq = await axios.get(url.toString(), { headers: { Authorization: cfg.database.pass }, validateStatus });
    guild = guildReq.data;
  } catch (error) {
    Logger.err("Error fetching data from database");
    Logger.err(error.stack);
    Logger.err(guild);
    return {};
  }

  return guild;
}

/**
 *
 * @param text
 * @param discordID
 * @param time
 * @param cacheOnly
 */
export async function timedAccount(text: string, discordID?: string, time?: string, cacheOnly?: boolean): Promise<Account | object> {
  const url = new URL("account", cfg.database.url);

  if (text != undefined && text != "" && text != "!") {
    if (text.length < 17) {
      url.searchParams.set("ign", text);
    } else {
      url.searchParams.set("uuid", text.replace(/-/g, ""));
    }
  }

  if (discordID != undefined && discordID != "") {
    url.searchParams.set("discid", discordID);
  }

  if (time != undefined && time != "lifetime" && time != "life") {
    url.searchParams.set("time", time);
  }

  if (cacheOnly) {
    url.searchParams.set("cache", "");
  }

  let acc;
  try {
    const accReq = await axios.get(url.toString(), { headers: { Authorization: cfg.database.pass }, validateStatus });
    acc = accReq.data;
  } catch (error) {
    Logger.err("Can't connect to database");
    Logger.err(error.stack);
    Logger.err(acc);
    return {};
  }

  return acc;
}

/**
 *
 */
export async function info(): Promise<object> {
  const url = new URL("info", cfg.database.url);

  let info;
  try {
    const accReq = await axios.get(url.toString(), { headers: { Authorization: cfg.database.pass }, validateStatus });
    info = accReq.data;
  } catch (error) {
    Logger.err("Can't connect to database");
    Logger.err(error.stack);
    Logger.err(info);
    return {};
  }

  return info;
}

/**
 *
 * @param json
 */
export async function addAccount(json: Account): Promise<object> {
  Logger.verbose(`Adding ${json.name} to accounts in database`);
  const url = new URL("account", cfg.database.url);

  try {
    return await axios.post(url.toString(), json, { headers: { Authorization: cfg.database.pass }, validateStatus });
  } catch (error) {
    throw new DatabaseResponseError(error?.message ?? error);
  }
}

/**
 *
 * @param json
 */
export async function addGuild(json: any): Promise<object> {
  Logger.info(`Adding ${json?.name} to guilds in database`);
  const url = new URL("guild", cfg.database.url);

  try {
    await axios.post(url.toString(), json, { headers: { Authorization: cfg.database.pass }, validateStatus });
  } catch (error) {
    Logger.err("Can't connect to database");
    Logger.err(error.stack);
    return {};
  }
}

/**
 *
 * @param uuid
 */
export async function addHacker(uuid: string): Promise<object> {
  const url = new URL("internal", cfg.database.url);

  const obj = { hacker: { add: { uuid } } };

  let hacker;
  try {
    const accReq = await axios.post(url.toString(), obj, { headers: { Authorization: cfg.database.pass } });
    hacker = accReq.data;
  } catch (error) {
    Logger.err("Can't connect to database");
    Logger.err(error.stack);
    Logger.err(hacker);
    return {};
  }

  return hacker;
}

/**
 *
 * @param uuid
 */
export async function delHacker(uuid: string): Promise<object> {
  const url = new URL("internal", cfg.database.url);

  const obj = { hacker: { rm: { uuid } } };

  let hacker;
  try {
    const accReq = await axios.post(url.toString(), obj, { headers: { Authorization: cfg.database.pass } });
    hacker = accReq.data;
  } catch (error) {
    Logger.err("Can't connect to database");
    Logger.err(error.stack);
    Logger.err(hacker);
    return {};
  }

  return hacker;
}

/**
 *
 * @param uuid
 */
export async function addBanned(uuid: string): Promise<object> {
  const url = new URL("internal", cfg.database.url);

  const obj = { banned: { add: { uuid } } };

  let banned;
  try {
    const accReq = await axios.post(url.toString(), obj, { headers: { Authorization: cfg.database.pass } });
    banned = accReq.data;
  } catch (error) {
    Logger.err("Can't connect to database");
    Logger.err(error.stack);
    Logger.err(banned);
    return {};
  }

  return banned;
}

/**
 *
 * @param uuid
 */
export async function delBanned(uuid: string): Promise<object> {
  const url = new URL("internal", cfg.database.url);

  const obj = { banned: { rm: { uuid } } };

  let banned;
  try {
    const accReq = await axios.post(url.toString(), obj, { headers: { Authorization: cfg.database.pass } });
    banned = accReq.data;
  } catch (error) {
    Logger.err("Can't connect to database");
    Logger.err(error.stack);
    Logger.err(banned);
    return {};
  }

  return banned;
}

/**
 *
 * @param path
 * @param category
 * @param time
 * @param min
 * @param reverse
 * @param max
 * @param noCache
 */
export async function getLeaderboard(
  path: string,
  category?: string,
  time?: string,
  min?: boolean,
  reverse?: boolean,
  max?: number,
  noCache?: boolean,
): Promise<object> {
  Logger.verbose("Reading database");

  const url = new URL("leaderboard", cfg.database.url);
  url.searchParams.set("path", path);

  if (category != undefined && category != "undefined") {
    url.searchParams.set("category", category);
  }

  if (time != undefined) {
    url.searchParams.set("time", time);
  }

  if (max != undefined) {
    url.searchParams.set("max", max.toString());
  }

  if (min) {
    url.searchParams.set("min", "");
  }

  if (reverse) {
    url.searchParams.set("reverse", "");
  }

  if (noCache) {
    url.searchParams.set("noCache", "");
  }

  let lb;

  try {
    const lbReq = await axios.get(url.toString(), { headers: { Authorization: cfg.database.pass }, validateStatus });
    lb = lbReq.data;
  } catch (error) {
    Logger.err("Can't connect to database");
    Logger.err(error.stack);
    Logger.err(lb);
    return {};
  }

  return lb;
}

/**
 *
 * @param path
 * @param time
 * @param reverse
 * @param max
 */
export async function getGuildLeaderboard(path: string, time?: string, reverse?: boolean, max?: number): Promise<object> {
  Logger.verbose("Reading database");

  const url = new URL("leaderboard/guild", cfg.database.url);
  url.searchParams.set("path", path);

  if (time != undefined) {
    url.searchParams.set("time", time);
  }

  if (max != undefined) {
    url.searchParams.set("max", max.toString());
  }

  if (reverse) {
    url.searchParams.set("reverse", "");
  }

  let lb;

  try {
    const lbReq = await axios.get(url.toString(), { headers: { Authorization: cfg.database.pass }, validateStatus });
    lb = lbReq.data;
  } catch (error) {
    Logger.err("Can't connect to database");
    Logger.err(error.stack);
    Logger.err(lb);
    return {};
  }

  return lb;
}

/**
 *
 * @param stat
 * @param time
 * @returns {Promise<object>}
 */
export async function getMWLeaderboard(stat: string, time?: string): Promise<object> {
  Logger.verbose("Reading database");

  const url = new URL("leaderboard/miniwalls", cfg.database.url);
  url.searchParams.set("stat", stat);

  if (time != undefined) {
    url.searchParams.set("time", time);
  }

  let lb;

  try {
    const lbReq = await axios.get(url.toString(), { headers: { Authorization: cfg.database.pass }, validateStatus });
    lb = lbReq.data;
  } catch (error) {
    Logger.err("Can't connect to database");
    Logger.err(error.stack);
    Logger.err(lb);
    return {};
  }

  return lb;
}

/**
 *
 * @param json
 * @param auth
 * @returns {Promise<object>}
 */
export async function internal(json: any, auth = ""): Promise<object> {
  const url = new URL("internal", cfg.database.url);

  let response;
  try {
    response = await axios.post(url.toString(), json, { headers: { Authorization: cfg.database.pass, key: auth } });
    response = response.data;
  } catch (error) {
    Logger.err("Can't connect to database");
    Logger.err(error.stack);
    return {};
  }

  return response;
}

/**
 *
 */
export async function ping(): Promise<boolean> {
  const url = new URL("ping", cfg.database.url);

  try {
    const testData = await axios.get(url.toString(), { timeout: 10000, headers: { Authorization: cfg.database.pass } });
    return testData.data.response == "pong";
  } catch {
    return false;
  }
}

/**
 *
 * @param id
 * @param uuid
 */
export async function linkDiscord(id: string, uuid?: string): Promise<object> {
  const url = new URL("internal", cfg.database.url);

  const obj = { discord: { ln: { id, uuid } } };

  let disc;
  try {
    const accReq = await axios.post(url.toString(), obj, { headers: { Authorization: cfg.database.pass } });
    disc = accReq.data;
  } catch (error) {
    Logger.err("Can't connect to database");
    Logger.err(error.stack);
    Logger.err(disc);
    return {};
  }

  return disc;
}

/**
 *
 * @param id
 * @param uuid
 */
export async function unlinkDiscord(id: string, uuid?: string): Promise<object> {
  const url = new URL("internal", cfg.database.url);

  const obj = { discord: { rm: { id, uuid } } };

  let disc;
  try {
    const accReq = await axios.post(url.toString(), obj, { headers: { Authorization: cfg.database.pass } });
    disc = accReq.data;
  } catch (error) {
    Logger.err("Can't connect to database");
    Logger.err(error.stack);
    Logger.err(disc);
    return {};
  }

  return disc;
}

/**
 *
 */
export async function getLinkedAccounts(): Promise<object> {
  const url = new URL("internal", cfg.database.url);

  const obj = { discord: { ls: true } };

  let discAccs;
  try {
    const accReq = await axios.post(url.toString(), obj, { headers: { Authorization: cfg.database.pass } });
    discAccs = accReq.data;
  } catch (error) {
    Logger.err("Can't connect to database");
    Logger.err(error.stack);
    Logger.err(discAccs);
    return {};
  }

  return discAccs.list;
}

/**
 *
 * @param text
 * @param discordID
 */
export async function status(text: string, discordID?: string) {
  const url = new URL("status", cfg.database.url);

  if (text != undefined && text != "" && text != "!") {
    if (text.length < 17) {
      url.searchParams.set("ign", text);
    } else {
      url.searchParams.set("uuid", text.replace(/-/g, ""));
    }
  }

  if (discordID != undefined && discordID != "") {
    url.searchParams.set("discid", discordID);
  }

  let sts;
  try {
    Logger.verbose(`Fetching ${url.searchParams} from database!`);
    const accReq = await axios.get(url.toString(), { headers: { Authorization: cfg.database.pass }, validateStatus });
    sts = accReq.data;
  } catch (error) {
    Logger.err("Error fetching data from database");
    Logger.err(error.stack);
    Logger.err(sts);
    return {};
  }

  return sts;
}

/**
 *
 */
export async function gameCounts(): Promise<object> {
  const url = new URL("gamecounts", cfg.database.url);

  let counts;
  try {
    const req = await axios.get(url.toString(), { headers: { Authorization: cfg.database.pass }, validateStatus });
    counts = req.data;
  } catch (error) {
    Logger.err("Can't connect to database");
    Logger.err(error.stack);
    Logger.err(counts);
    return {};
  }

  return counts;
}

/**
 *
 * @param text
 * @param discordID
 */
export async function friends(text: string, discordID?: string): Promise<object> {
  const url = new URL("friends", cfg.database.url);

  if (text != undefined && text != "" && text != "!") {
    if (text.length < 17) {
      url.searchParams.set("ign", text);
    } else {
      url.searchParams.set("uuid", text.replace(/-/g, ""));
    }
  }

  if (discordID != undefined && discordID != "") {
    url.searchParams.set("discid", discordID);
  }

  let fl;
  try {
    Logger.verbose(`Fetching ${url.searchParams} from database!`);
    const accReq = await axios.get(url.toString(), { headers: { Authorization: cfg.database.pass }, validateStatus });
    fl = accReq.data;
  } catch (error) {
    Logger.err("Error fetching data from database");
    Logger.err(error.stack);
    Logger.err(fl);
    return {};
  }

  return fl;
}

/**
 *
 * @param text
 * @param discordID
 */
export async function achievements(text: string, discordID?: string): Promise<object> {
  const url = new URL("achievements", cfg.database.url);

  if (text != undefined && text != "" && text != "!") {
    if (text.length < 17) {
      url.searchParams.set("ign", text);
    } else {
      url.searchParams.set("uuid", text.replace(/-/g, ""));
    }
  }

  if (discordID != undefined && discordID != "") {
    url.searchParams.set("discid", discordID);
  }

  let ap;
  try {
    Logger.verbose(`Fetching ${url.searchParams} from database!`);
    const accReq = await axios.get(url.toString(), { headers: { Authorization: cfg.database.pass }, validateStatus });
    ap = accReq.data;
  } catch (error) {
    Logger.err("Error fetching data from database");
    Logger.err(error.stack);
    Logger.err(ap);
    return {};
  }

  return ap;
}

/**
 *
 * @param uuid
 */
export async function DeleteAccount(uuid: string): Promise<object> {
  const url = new URL("account", cfg.database.url);
  url.searchParams.set("uuid", uuid);

  let del;
  try {
    Logger.verbose(`Sending DELETE ${url.searchParams} from database!`);
    const accReq = await axios.delete(url.toString(), { headers: { Authorization: cfg.database.pass }, validateStatus });
    del = accReq.data;
  } catch (error) {
    Logger.err("Database connection error.");
    Logger.err(error.stack);
    Logger.err(del);
    return {};
  }

  return del;
}

/**
 *
 * @param path
 */
export async function Resource(path: string): Promise<object> {
  const url = new URL("hypixelresource", cfg.database.url);
  url.searchParams.set("path", path);

  let resource;
  try {
    Logger.verbose(`Getting ${path} resource from database`);
    const accReq = await axios.get(url.toString(), { headers: { Authorization: cfg.database.pass }, validateStatus });
    resource = accReq.data;
  } catch (error) {
    Logger.err("Database connection error.");
    Logger.err(error.stack);
    Logger.err(resource);
    return {};
  }

  return resource;
}
