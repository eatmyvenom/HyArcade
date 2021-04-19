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
        acclist.map(async (acc) => {
            await this.updatePlayer(acc)
        });
    }

    async updatePlayer(acc) {
        let discID = "" + acc.discord;
        if(discID.length != 18) return;
        let discMember;
        try{
            discMember = await this.guild.members.fetch(discID);
        } catch (e) {
            return;
        }
        await utils.sleep(500);
        let newRole = this.getRole(acc[this.prop]);
        
        if(discMember.roles == undefined) return;

        if(discMember.roles.cache != undefined) {
            if(!discMember.roles.cache.has(newRole.roleID)) {
                await BotUtils.logHook.send(`${acc.name} is reciving the "${newRole.minimumWins}+ wins" role in ${this.guild.name}`)
                await discMember.roles.add(newRole.roleID);
            }
        } else {
            await BotUtils.logHook.send(`${acc.name} is reciving the "${newRole.minimumWins}+ wins" role in ${this.guild.name}`)
            await discMember.roles.add(newRole.roleID);
        }
    }
}