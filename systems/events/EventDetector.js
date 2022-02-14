const cfg = require("hyarcade-config").fromJSON();
const logger = require("hyarcade-logger");
const AccountEvent = require("hyarcade-structures/Event");
const Json = require("hyarcade-utils/FileHandling/Json");

class EventDetector {
  OldAccounts = {};
  NewAccounts = {};
  Events = [];

  constructor(OldAccounts, NewAccounts) {
    this.OldAccounts = OldAccounts;
    this.NewAccounts = NewAccounts;
  }

  scanAccount(account) {
    const oldAcc = account;
    const newAcc = this.NewAccounts.find(a => a.uuid == oldAcc.uuid);

    if (oldAcc == undefined || newAcc == undefined) {
      return;
    }

    if (oldAcc.name != newAcc.name) {
      this.Events.push(new AccountEvent(newAcc.name, "NAME", oldAcc.name, newAcc.name, "", newAcc.uuid));
    }
  }

  runDetection() {
    for (const account of this.OldAccounts) {
      this.scanAccount(account);
    }
  }

  detectDiff(oldAcc, newAcc, prop, type, modifier) {
    if (newAcc[prop] > oldAcc[prop]) {
      this.Events.push(new AccountEvent(newAcc.name, type, oldAcc[prop], newAcc[prop], modifier, newAcc.uuid));
    }
  }

  detectWinsAuto(oldAcc, newAcc, prop, cate, type) {
    if (newAcc[prop] % cfg.events[type].winMod == 0 && newAcc[prop] > oldAcc[prop]) {
      this.Events.push(new AccountEvent(newAcc.name, type, oldAcc[prop], newAcc[prop], "", newAcc.uuid));
    }
  }

  detectWins(oldWc, newWc, name, type, modifier, uuid) {
    if (newWc % 500 == 0 && newWc > oldWc) {
      this.Events.push(new AccountEvent(name, type, oldWc, newWc, modifier, uuid));
    }
  }

  detectSpecific(oldWc, newWc, amnt, name, type, modifier, uuid) {
    if (newWc == amnt && newWc > oldWc) {
      this.Events.push(new AccountEvent(name, type, oldWc, newWc, modifier, uuid));
    }
  }

  async sendEvents() {
    for (const evt of this.Events) {
      await evt.toDiscord();
    }
  }

  async saveEvents() {
    let oldEvents = await Json.read("events.json");
    for (const event of this.Events) {
      oldEvents.unshift([event, event.toString()]);
    }

    oldEvents = oldEvents.slice(0, Math.min(oldEvents.length, 100));
    await Json.write("events.json", oldEvents);
  }

  logEvents() {
    for (const evt of this.Events) {
      logger.out(evt.toString());
    }
  }
}

module.exports = EventDetector;
