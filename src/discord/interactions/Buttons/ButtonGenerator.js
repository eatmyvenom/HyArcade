const {
  MessageButton,
  MessageActionRow
} = require("discord.js");

module.exports = class ButtonGenerator {
  static async getStatsButtons (currentGame, uuid) {
    let leftTxt = "";
    let rightTxt = "";
    let leftID = "";
    let rightID = "";

    switch(currentGame) {
    case "arc": {
      leftTxt = "Seasonal games";
      leftID = "sim";
      rightTxt = "Party games";
      rightID = "pg";
      break;
    }

    case "pg": {
      leftTxt = "Overall";
      leftID = "arc";
      rightTxt = "Farm hunt";
      rightID = "fh";
      break;
    }

    case "fh": {
      leftTxt = "Party games";
      leftID = "pg";
      rightTxt = "Hole in the wall";
      rightID = "hitw";
      break;
    }

    case "hitw": {
      leftTxt = "Farm hunt";
      leftID = "fh";
      rightTxt = "Hypixel Says";
      rightID = "hs";
      break;
    }

    case "hs": {
      leftTxt = "Hole in the wall";
      leftID = "hitw";
      rightTxt = "Blocking dead";
      rightID = "bd";
      break;
    }

    case "bd": {
      leftTxt = "Hypixel Says";
      leftID = "hs";
      rightTxt = "Mini walls";
      rightID = "mw";
      break;
    }

    case "mw": {
      leftTxt = "Blocking dead";
      leftID = "bd";
      rightTxt = "Football";
      rightID = "fb";
      break;
    }

    case "fb": {
      leftTxt = "Mini walls";
      leftID = "mw";
      rightTxt = "Ender spleef";
      rightID = "es";
      break;
    }

    case "es": {
      leftTxt = "Football";
      leftID = "fb";
      rightTxt = "Throw out";
      rightID = "to";
      break;
    }

    case "to": {
      leftTxt = "Ender spleef";
      leftID = "es";
      rightTxt = "Galaxy wars";
      rightID = "gw";
      break;
    }

    case "gw": {
      leftTxt = "Throw out";
      leftID = "to";
      rightTxt = "Dragon wars";
      rightID = "dw";
      break;
    }

    case "dw": {
      leftTxt = "Galaxy wars";
      leftID = "gw";
      rightTxt = "Bounty hunters";
      rightID = "bh";
      break;
    }

    case "bh": {
      leftTxt = "Dragon wars";
      leftID = "dw";
      rightTxt = "Hide and seek";
      rightID = "hns";
      break;
    }

    case "hns": {
      leftTxt = "Bounty hunters";
      leftID = "bh";
      rightTxt = "Zombies";
      rightID = "z";
      break;
    }

    case "z": {
      leftTxt = "Hide and seek";
      leftID = "hns";
      rightTxt = "Pixel Painters";
      rightID = "pp";
      break;
    }

    case "pp": {
      leftTxt = "Zombies";
      leftID = "z";
      rightTxt = "Capture the wool";
      rightID = "ctw";
      break;
    }

    case "ctw": {
      leftTxt = "Pixel Painters";
      leftID = "pp";
      rightTxt = "Seasonal games";
      rightID = "sim";
      break;
    }

    case "sim": {
      leftTxt = "Capture the wool";
      leftID = "ctw";
      rightTxt = "Overall";
      rightID = "arc";
      break;
    }
    }

    const row = new MessageActionRow();
    const left = new MessageButton()
      .setCustomId(`s:${uuid}:${leftID}`)
      .setLabel(`<< ${leftTxt}`)
      .setStyle("PRIMARY");

    const m = new MessageButton().setCustomId(`s:${uuid}:${currentGame}`)
      .setLabel("↻")
      .setStyle("SECONDARY");

    const right = new MessageButton()
      .setCustomId(`s:${uuid}:${rightID}`)
      .setLabel(`${rightTxt} >>`)
      .setStyle("PRIMARY");

    row.addComponents(left, m, right);
    return row;
  }

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
};
