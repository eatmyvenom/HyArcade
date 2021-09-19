module.exports = class ButtonResponse {
    content = "";
    embeds = [];
    newButtons = [];
    img = undefined;

    constructor (content, embeds, newButtons, img) {
      if(content != "") {
        this.content = content;
      } else {
        this.content = undefined;
      }

      this.img = img;
      this.embeds = embeds;
      this.newButtons = newButtons;
    }

    toDiscord () {
      return {
        content: this.content,
        embeds: this.embeds,
        components: [this.newButtons],
        attachments: [],
        files: this.img,
      };
    }
};
