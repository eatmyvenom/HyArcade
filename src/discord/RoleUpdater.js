const BotUtils = require("./BotUtils");
const Webhooks = require("./Utils/Webhooks");

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
        let disclist = await BotUtils.getFromDB("disclist");
        let acclist = await BotUtils.getFromDB("accounts");
        let mbrList = await this.guild.members.fetch();
        for(let discid in disclist) {
            if(mbrList.has(discid)) {
                let uuid = disclist[discid];
                let acc = acclist.find((a) => a.uuid == uuid);
                if(acc == undefined) continue;
                await this.updatePlayer(acc, mbrList.get(discid));
            }
        }
    }

    async updatePlayer(acc, discMember) {
        // logger.out(`Updating ${discMember.user.tag}`);
        let newRole = this.getRole(acc[this.prop]);
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

    async removeOtherRoles(discMember, ignoreID) {
        for(let role of this.roles) {
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
