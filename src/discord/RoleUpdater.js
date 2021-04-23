const BotUtils = require('../discord/BotUtils');
const utils = require('../utils');

module.exports = class RoleUpdater {

    roles = [];
    guild = {};
    prop = "";

    constructor(guild, roles, prop) {
        this.guild = guild;
        this.roles = roles;
        this.prop = prop;
    }

    getRole(wins) {
        for(let role of this.roles) {
            if(wins >= role.minimumWins) {
                return role;
            }
        }
        return undefined;
    }

    async updateAll() {
        let acclist = await utils.readJSON('accounts.json');
        for(let acc of acclist) {
            await this.updatePlayer(acc);
        }
    }

    async updatePlayer(acc) {
        let discID = "" + acc.discord;
        if(discID.length != 18) return;
        let discMember;
        try{
            discMember = await this.guild.members.fetch(discID);
            await utils.sleep(500);
        } catch (e) {
            await utils.sleep(500);
            return;
        }
        let newRole = this.getRole(acc[this.prop]);
        if(newRole == undefined) return;
        if(discMember.roles == undefined) return;

        await this.removeOtherRoles(discMember, newRole.roleID);

        if(discMember.roles.cache != undefined) {
            if(!discMember.roles.cache.has(newRole.roleID)) {
                await BotUtils.logHook.send(`${acc.name} is reciving the "${newRole.minimumWins}+ wins" role in ${this.guild.name}`)
                await discMember.roles.add(newRole.roleID);
            }
        } else {
            await BotUtils.logHook.send(`${discMember.user.tag} is reciving the "${newRole.minimumWins}+ wins" role in ${this.guild.name}`)
            await discMember.roles.add(newRole.roleID);
        }
    }

    async removeOtherRoles(discMember, ignoreID) {
        for(let role of this.roles) {
            if(role.roleID == ignoreID) continue;
            if(discMember.roles.cache.has(role.roleID)) {
                await BotUtils.logHook.send(`${discMember.user.tag} is having "${role.minimumWins}+ wins" role removed in ${this.guild.name}`)
                await discMember.roles.remove(role.roleID);
            }
        }
    }
}