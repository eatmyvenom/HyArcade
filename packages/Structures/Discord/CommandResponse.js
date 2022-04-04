const {
  MessageAttachment,
  MessageEmbed,
  FileOptions,
  BufferResolvable,
  MessageActionRow,
  MessageActionRowOptions,
  ReplyMessageOptions,
  MessageOptions,
} = require("discord.js");

module.exports = class CommandResponse {
  text = "";
  embed;
  file;
  components;
  silent = false;
  priv = false;

  /**
   *
   * @param {string | object} text
   * @param {MessageEmbed | MessageEmbed[]} embed
   * @param {FileOptions | BufferResolvable | MessageAttachment | FileOptions[] | BufferResolvable[] | MessageAttachment[]} file
   * @param {MessageActionRow | MessageActionRowOptions | MessageActionRow[] | MessageActionRowOptions[]} components
   * @param {boolean} silent
   * @param {boolean} priv
   */
  constructor(text, embed, file, components, silent = false, priv = false) {
    if (typeof text === "object" && typeof text !== "string") {
      this.text = text.res;
      this.file = text.img;
      this.embed = text.embed;
      this.silent = text.silent;
      this.components = text.b;
      this.priv = text.private;
    } else {
      this.text = text;
      this.embed = embed;
      this.file = file;
      this.components = components;
      this.silent = silent;
      this.priv = priv;
    }
  }

  isValid() {
    return (this.text != undefined && this.text != "") || this.embed != undefined || this.file != undefined;
  }

  /**
   *
   * @param {ReplyMessageOptions} reply
   * @param {boolean} webhook
   * @returns {MessageOptions | undefined}
   */
  toDiscord(reply, webhook = false) {
    if (this.silent) {
      return;
    }

    if (`${this.text}`.length > 2000) {
      // eslint-disable-next-line no-undef
      this.file = [new MessageAttachment(Buffer.from(`${this.text}`.replace(/`/g, "").trim()), "message.txt")];
      this.text = undefined;
    }

    if (this.text == "") {
      this.text = undefined;
    }

    if (this.embed != undefined && !Array.isArray(this.embed)) {
      this.embed = [this.embed];
    }

    if (this.file != undefined && !Array.isArray(this.file)) {
      this.file = [this.file];
    }

    if (this.components != undefined && !Array.isArray(this.components)) {
      this.components = [this.components];
    }

    const obj = {
      tts: false,
      nonce: undefined,
      ephemeral: this.priv,
      content: this.text,
      embeds: this.embed,
      allowedMentions: {
        parse: [],
        repliedUser: false,
      },
      files: this.file,
      components: this.components,
      reply,
    };

    if (webhook) {
      obj.username = "Arcade Bot";
      obj.avatarURL = "https://i.vnmm.dev/arcadepfp2.png";
      return obj;
    }
    return obj;
  }
};
