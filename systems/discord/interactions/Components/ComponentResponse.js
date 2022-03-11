module.exports = class ComponentResponse {
  content = "";
  embeds = [];
  newButtons = [];
  img = undefined;

  constructor(content, embeds, newButtons, img) {
    this.content = content != "" ? content : undefined;

    this.img = img;
    this.embeds = embeds;
    this.newButtons = newButtons;
  }

  toDiscord() {
    if (!Array.isArray(this.newButtons)) {
      this.newButtons = [this.newButtons];
    }

    return {
      content: this.content,
      embeds: this.embeds,
      components: this.newButtons,
      attachments: [],
      files: this.img,
    };
  }
};
