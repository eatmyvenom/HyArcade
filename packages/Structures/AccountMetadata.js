module.exports = class AccountMetadata {
  hacker = false;
  banned = false;
  uuid = "";

  constructor(hacker, banned, uuid) {
    this.hacker = hacker;
    this.banned = banned;
    this.uuid = uuid;
  }
};
