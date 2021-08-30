module.exports = class ButtonResponse {
    content = "";
    embeds = [];
    newButtons = [];

    constructor (content, embeds, newButtons) {
      if(content != "") {
        this.content = content;
      } else {
        this.content = undefined;
      }
      this.embeds = embeds;
      this.newButtons = newButtons;
    }

    toDiscord () {
      return {
        content: this.content,
        embeds: this.embeds,
        components: [this.newButtons],
      };
    }
};
