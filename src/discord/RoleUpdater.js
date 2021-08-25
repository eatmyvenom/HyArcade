const Role = require("../classes/Role");
const BotUtils = require("./BotUtils");
const Webhooks = require("./Utils/Webhooks");

module.exports = class RoleUpdater {
    roles = [];
    guild = {};
    game = "";
    prop = "";

    constructor (guild, roles, game, prop) {
      this.guild = guild;
      this.roles = roles;
      this.game = game;
      this.prop = prop;
    }

    /**
     * 
     * @param {*} wins 
     * @returns {Role}
     */
    getRole (wins) {
      for(const role of this.roles) {
        if(wins >= role.minimumWins) {
          return role;
        }
      }
      return undefined;
    }

    async updateAll () {
      const disclist = await BotUtils.getFromDB("disclist");
      const acclist = await BotUtils.getFromDB("accounts");
      const mbrList = await this.guild.members.fetch();
      for(const discid in disclist) {
        if(mbrList.has(discid)) {
          const uuid = disclist[discid];
          const acc = acclist.find((a) => a.uuid == uuid);
          if(acc == undefined) continue;
          await this.updatePlayer(acc, mbrList.get(discid));
        }
      }
    }

    async updatePlayer (acc, discMember) {
      const wins = acc?.[this.game]?.[this.prop] ?? 0;
      const newRole = this.getRole(wins);

      if(wins == 0) {
        await Webhooks.logHook.send(`${discMember.user.tag} has 0 wins for ${this.guild.name} and is being ignored`);
        return;
      }
      if(newRole == undefined) return;
      if(discMember.roles == undefined) return;

      await this.removeOtherRoles(discMember, newRole.roleID);

      if(discMember.roles.cache != undefined) {
        if(!discMember.roles.cache.has(newRole.roleID)) {
          await Webhooks.logHook.send(
            `${discMember.user.tag} is reciving the "${newRole.minimumWins}+ wins" role in ${this.guild.name}`
          );
          await discMember.roles.add(newRole.roleID);
        }
      } else {
        await Webhooks.logHook.send(
          `${discMember.user.tag} is reciving the "${newRole.minimumWins}+ wins" role in ${this.guild.name}`
        );
        await discMember.roles.add(newRole.roleID);
      }
    }

    async removeOtherRoles (discMember, ignoreID) {
      for(const role of this.roles) {
        if(role.roleID == ignoreID) continue;
        if(discMember.roles.cache.has(role.roleID)) {
          await Webhooks.logHook.send(
            `${discMember.user.tag} is having "${role.minimumWins}+ wins" role removed in ${this.guild.name}`
          );
          await discMember.roles.remove(role.roleID);
        }
      }
    }
};
