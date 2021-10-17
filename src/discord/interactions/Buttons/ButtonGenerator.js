const {
  MessageButton,
  MessageActionRow
} = require("discord.js");

module.exports = class ButtonGenerator {
  static async getLBButtons (currentIndex, lb, time) {
    const left = new MessageButton()
      .setCustomId(`lb:${lb}:${time}:${currentIndex - 10}`)
      .setLabel("    ⟵")
      .setStyle("SECONDARY");

    const right = new MessageButton()
      .setCustomId(`lb:${lb}:${time}:${currentIndex + 10}`)
      .setLabel("⟶    ")
      .setStyle("SECONDARY");

    if(currentIndex - 10 < 0) {
      left.setDisabled(true);
    }

    const row = new MessageActionRow().addComponents(left, right);

    return row;
  }

  static async getEZ () {
    const ez = new MessageButton().setCustomId("ez:null")
      .setLabel("EZ")
      .setStyle("SECONDARY");

    const row = new MessageActionRow().addComponents(ez);

    return row;
  }

  static async getZombies (currentGame, uuid) {
    const o = new MessageButton().setCustomId(`z:${uuid}:o`)
      .setLabel("Overall")
      .setStyle("PRIMARY")
      .setDisabled(currentGame == "o");

    const aa = new MessageButton().setCustomId(`z:${uuid}:aa`)
      .setLabel("Alien Arcadium")
      .setStyle("SECONDARY")
      .setDisabled(currentGame == "aa");

    const bb = new MessageButton().setCustomId(`z:${uuid}:bb`)
      .setLabel("Bad Blood")
      .setStyle("SECONDARY")
      .setDisabled(currentGame == "bb");

    const de = new MessageButton().setCustomId(`z:${uuid}:de`)
      .setLabel("Dead End")
      .setStyle("SECONDARY")
      .setDisabled(currentGame == "de");

    const row = new MessageActionRow().addComponents(o, bb, de, aa);

    return row;
  }

  static async getMiw (currentTime, uuid) {
    const lifetime = new MessageButton().setCustomId(`mw:${uuid}:l`)
      .setLabel("Lifetime")
      .setStyle("SUCCESS")
      .setDisabled(currentTime == "lifetime");

    const day = new MessageButton().setCustomId(`mw:${uuid}:d`)
      .setLabel("Daily")
      .setStyle("SECONDARY")
      .setDisabled(currentTime == "day");

    const weekly = new MessageButton().setCustomId(`mw:${uuid}:w`)
      .setLabel("Weekly")
      .setStyle("SECONDARY")
      .setDisabled(currentTime == "weekly");

    const monthly = new MessageButton().setCustomId(`mw:${uuid}:m`)
      .setLabel("Monthly")
      .setStyle("SECONDARY")
      .setDisabled(currentTime == "monthly");

    const row = new MessageActionRow().addComponents(lifetime, day, weekly, monthly);

    return row;
  }

  static async getTopGames (currentTime, uuid) {
    const lifetime = new MessageButton().setCustomId(`t:${uuid}:l`)
      .setLabel("Lifetime")
      .setStyle("SUCCESS")
      .setDisabled(currentTime == "lifetime");

    const day = new MessageButton().setCustomId(`t:${uuid}:d`)
      .setLabel("Daily")
      .setStyle("SECONDARY")
      .setDisabled(currentTime == "day");

    const weekly = new MessageButton().setCustomId(`t:${uuid}:w`)
      .setLabel("Weekly")
      .setStyle("SECONDARY")
      .setDisabled(currentTime == "weekly");

    const monthly = new MessageButton().setCustomId(`t:${uuid}:m`)
      .setLabel("Monthly")
      .setStyle("SECONDARY")
      .setDisabled(currentTime == "monthly");

    const row = new MessageActionRow().addComponents(lifetime, day, weekly, monthly);

    return row;
  }
};
