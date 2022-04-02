/* eslint-disable unicorn/prefer-object-from-entries */
/* eslint-disable unicorn/no-array-reduce */

const { readFile, writeFile } = require("fs-extra");
const Logger = require("@hyarcade/logger");

/**
 * @param item
 * @returns {boolean}
 */
function isObject(item) {
  return item && typeof item === "object" && !Array.isArray(item);
}

/**
 * @param target
 * @param source
 * @returns {object}
 */
function mergeDeep(target, source) {
  let output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    for (const key of Object.keys(source)) {
      if (isObject(source[key])) {
        if (!(key in target)) Object.assign(output, { [key]: source[key] });
        else output[key] = mergeDeep(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    }
  }
  return output;
}

class MasterDoc {
  masterDoc;
  ready = false;
  async readData() {
    const masterFile = await readFile("data/fullplayer.json");
    this.masterDoc = masterFile.toJSON();
    this.ready = true;
  }

  async addData(source) {
    if (source.success == false) {
      return;
    }

    this.masterDoc = mergeDeep(this.masterDoc, source);
  }

  async saveData() {
    Logger.log("Overwriting data for master API document");

    delete this.masterDoc.data;
    this.masterDoc.player.displayname = "playerName";
    this.masterDoc.player.playername = "playername";
    this.masterDoc.player.uuid = "00000000000000000000000000000000";

    const orderedDoc = Object.keys(this.masterDoc)
      .sort()
      .reduce((obj, key) => {
        obj[key] = this.masterDoc[key];
        return obj;
      }, {});

    for (const key in orderedDoc.player) {
      if (key.startsWith("claimed_solo_bank_") || key.startsWith("claimed_coop_bank_")) {
        delete orderedDoc.player[key];
      }
    }

    orderedDoc.player.claimed_solo_bank_00000000000000000000000000000000 = 0;
    orderedDoc.player.claimed_coop_bank_00000000000000000000000000000000 = 0;

    for (const key in orderedDoc.player.housingMeta) {
      if (key.startsWith("given_cookies_")) {
        delete orderedDoc.player.housingMeta[key];
      }
    }

    orderedDoc.player.housingMeta.given_cookies_000000 = ["00000000-0000-0000-0000-000000000000"];

    orderedDoc.player.stats.SkyBlock.profiles = {
      "00000000000000000000000000000000": {
        profile_id: "00000000000000000000000000000000",
        cute_name: "green",
      },
    };

    orderedDoc.player = Object.keys(orderedDoc.player)
      .sort()
      .reduce((obj, key) => {
        obj[key] = orderedDoc.player[key];
        return obj;
      }, {});

    await writeFile("data/fullplayer.json", JSON.stringify(orderedDoc, undefined, 2));
  }
}

module.exports = MasterDoc;
