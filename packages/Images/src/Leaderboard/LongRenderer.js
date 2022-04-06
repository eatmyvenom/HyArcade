/* eslint-disable unicorn/no-array-reduce */
const { Account } = require("@hyarcade/structures");
const ImageGenerator = require("../ImageGenerator");

class LongRendererOptions {
  length = 25;
  ranks = true;
  guilds = false;
  stat = "importance";
  background;
  blur;
}

class LongRenderer {
  /** @type {Account[]} */
  accounts;

  /** @type {LongRendererOptions} */
  options;

  /**
   *
   * @param {Account[]} accounts
   * @param {LongRendererOptions} options
   */
  constructor(accounts, options) {
    this.accounts = accounts;
    this.options = options;
  }

  async render() {
    const image = new ImageGenerator(1280, this.options.length * 80, "myfont", true);
    if (this.options.background) {
      await image.addBackground(this.options.background);

      if (this.options.blur) {
        await image.blur(4);
      }
    }

    const length = Math.min(this.accounts.length, this.options.length);

    for (let i = 0; i < length; i++) {
      const stat = this.options.stat.split(".").reduce((a, b) => a[b], this.accounts[i]) ?? 0;
      await image.drawLBPlayer(this.accounts[i], i + 1, stat, 640, (i + 1) * 40, 20);
    }
  }
}

module.exports = LongRenderer;
