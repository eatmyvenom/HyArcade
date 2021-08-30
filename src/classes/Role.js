module.exports = class Role {
    minimumWins = 0;
    roleID = "";

    constructor (minimumWins, roleID) {
      this.minimumWins = minimumWins;
      this.roleID = roleID;
    }
};
