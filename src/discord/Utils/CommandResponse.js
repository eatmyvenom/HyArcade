const { MessageEmbed, FileOptions, BufferResolvable, MessageAttachment, MessageActionRow, MessageActionRowOptions, ReplyMessageOptions, MessageOptions} = require("discord.js");

module.exports = class CommandResponse {
    text = "";
    embed;
    file;
    components;
    silent = false;

    /**
     * 
     * @param {String | Object} text 
     * @param {MessageEmbed | MessageEmbed[]} embed 
     * @param {FileOptions | BufferResolvable | MessageAttachment | FileOptions[] | BufferResolvable[] | MessageAttachment[]} file 
     * @param {MessageActionRow | MessageActionRowOptions | MessageActionRow[] | MessageActionRowOptions[]} components 
     * @param {Boolean} silent 
     */
    constructor(text, embed = undefined, file = undefined, components = undefined, silent = false) {
        if(typeof text == "object") {
            this.text = text.res;
            this.file = text.img;
            this.embed = text.embed;
            this.silent = text.silent;
            this.components = text.b;
        } else {
            this.text = "" + text;
            this.embed = embed;
            this.file = file;
            this.components = components;
            this.silent = silent;
        }
    }

    isValid() {
        return this.text != undefined || this.text != "" || this.embed != undefined || this.file != undefined
    }

    /**
     * 
     * @param {ReplyMessageOptions} reply 
     * @returns {MessageOptions | undefined}
     */
    toDiscord(reply) {
        if(this.silent) {
            return;
        }

        if(this.text.length > 2000) {
            this.file = [ new MessageAttachment(Buffer.from(this.text.replace(/`/g, "").trim()), "message.txt") ];
            this.text = undefined;
        }

        if(this.text == "") {
            this.text = undefined;
        }

        if(this.embed != undefined && !Array.isArray(this.embed)) {
            this.embed = [ this.embed ];
        }

        if(this.file != undefined && !Array.isArray(this.file)) {
            this.file = [ this.file ];
        }

        return {
            tts: false,
            nonce: undefined,
            content: this.text,
            embeds: this.embed,
            allowedMentions : { parse: [], repliedUser: false },
            files: this.file,
            components: this.components,
            reply: reply
        }
    }
}