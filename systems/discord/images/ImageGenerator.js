const Canvas = require("canvas");
const Discord = require("discord.js");
const Account = require("hyarcade-requests/types/Account");
const StackBlur = require("stackblur-canvas");

const imgCache = [];

Canvas.registerFont("resources/minecraft.ttf", {
  family: "myFont",
});

Canvas.registerFont("resources/bold.otf", {
  family: "boldmc",
});

const PlusColors = {
  black: "#000000",
  dark_blue: "#0000AA",
  dark_green: "#00AA00",
  dark_aqua: "#00AAAA",
  dark_red: "#AA0000",
  dark_purple: "#AA00AA",
  gold: "#FFAA00",
  grey: "#AAAAAA",
  gray: "#AAAAAA",
  dark_gray: "#555555",
  blue: "#5555FF",
  green: "#55FF55",
  aqua: "#55FFFF",
  red: "#FF5555",
  light_purple: "#FF55FF",
  yellow: "#FFFF55",
  white: "#FFFFFF",
  undefined: "#FFAA00",
};

const colorFormatters = {
  black: "&0",
  dark_blue: "&1",
  dark_green: "&2",
  dark_aqua: "&3",
  dark_red: "&4",
  dark_purple: "&5",
  gold: "&6",
  grey: "&7",
  gray: "&7",
  dark_gray: "&8",
  blue: "&9",
  green: "&a",
  aqua: "&b",
  red: "&c",
  light_purple: "&d",
  yellow: "&e",
  white: "&f",
  undefined: "&6",
};

module.exports = class ImageGenerator {
  canvas;
  context;
  font;
  shadow = false;
  gradient;
  constructor(width, height, font = "Fira Code", shadow = false) {
    this.canvas = Canvas.createCanvas(width, height);
    this.context = this.canvas.getContext("2d");
    this.context.antialias = "none";
    this.context.textDrawingMode = "glyph";
    this.font = font;
    this.shadow = shadow;
  }

  async blur(radius = 32) {
    StackBlur.canvasRGBA(this.canvas, 0, 0, this.canvas.width, this.canvas.height, radius);
  }

  async addBackground(path, x = 0, y = 0, dx = this.canvas.width, dy = this.canvas.height, fillColor = "#181c3099") {
    let bg;

    if (imgCache[path] != undefined) {
      bg = imgCache[path];
    } else {
      bg = await Canvas.loadImage(path);
      imgCache[path] = bg;
    }

    this.context.drawImage(bg, x, y, dx, dy);
    this.context.beginPath();
    this.context.rect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = fillColor;
    this.context.fill();
  }

  async addImage(path, x, y, bgIterations = 0, bgStrenth = "11", width, height) {
    const img = await Canvas.loadImage(path);
    for (let i = bgIterations; i >= 4; i -= 1) {
      this.context.beginPath();
      this.context.rect(x - i / 2, y - i / 2, img.width + i, img.height + i);
      this.context.fillStyle = `#333333${bgStrenth}`;
      this.context.fill();
    }
    const imgWidth = width == undefined ? img.width : width;
    const imgHeight = height == undefined ? img.height : height;
    this.context.drawImage(img, x, y, imgWidth, imgHeight);
  }

  drawMcText(txt, x, y, size = 32, align = "left", tag = false, fake = false) {
    const offset = size * 0.1;
    this.context.font = `${size}px 'myfont'`;
    this.context.textAlign = align;
    this.context.textBaseline = "middle";

    const lineArr = txt.includes("&") ? txt.split(/&/) : [`r${txt}`];

    let currentX = x;
    let shadowColor = "#3F3F3F";
    this.context.fillStyle = "#FFFFFF";

    if (align == "center") {
      const totalWidth = this.drawMcText(txt, x, y, size, "left", false, true);

      currentX -= totalWidth / 2;
      this.context.textAlign = "left";
    }

    if (tag) {
      const width = Math.abs(this.drawMcText(txt, x, y, size, "left", false, true));
      this.context.beginPath();
      this.context.rect(currentX - size / 10 - 2, y - size / 2 - 1, width + size / 5 + 1, size);
      this.context.fillStyle = "#33333372";
      this.context.fill();
    }

    for (const s of lineArr) {
      switch (s.slice(0, 1)) {
        case "0": {
          this.context.fillStyle = "#000000";
          shadowColor = "#000000";
          break;
        }

        case "1": {
          this.context.fillStyle = "#0000AA";
          shadowColor = "#00002A";
          break;
        }

        case "2": {
          this.context.fillStyle = "#00AA00";
          shadowColor = "#002A00";
          break;
        }

        case "3": {
          this.context.fillStyle = "#00AAAA";
          shadowColor = "#002A2A";
          break;
        }

        case "4": {
          this.context.fillStyle = "#AA0000";
          shadowColor = "#2A0000";
          break;
        }

        case "5": {
          this.context.fillStyle = "#AA00AA";
          shadowColor = "#2A002A";
          break;
        }

        case "6": {
          this.context.fillStyle = "#FFAA00";
          shadowColor = "#3F2A00";
          break;
        }

        case "7": {
          this.context.fillStyle = "#AAAAAA";
          shadowColor = "#2A2A2A";
          break;
        }

        case "8": {
          this.context.fillStyle = "#555555";
          shadowColor = "#151515";
          break;
        }

        case "9": {
          this.context.fillStyle = "#5555FF";
          shadowColor = "#15153F";
          break;
        }

        case "a": {
          this.context.fillStyle = "#55FF55";
          shadowColor = "#153F15";
          break;
        }

        case "b": {
          this.context.fillStyle = "#55FFFF";
          shadowColor = "#153F3F";
          break;
        }

        case "c": {
          this.context.fillStyle = "#FF5555";
          shadowColor = "#3F1515";
          break;
        }

        case "d": {
          this.context.fillStyle = "#FF55FF";
          shadowColor = "#3F153F";
          break;
        }

        case "e": {
          this.context.fillStyle = "#FFFF55";
          shadowColor = "#3F3F15";
          break;
        }

        case "f": {
          this.context.fillStyle = "#FFFFFF";
          shadowColor = "#3F3F3F";
          break;
        }

        case "z": {
          if (this.gradient == undefined) {
            const gradient = this.context.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
            gradient.addColorStop(0, "red");
            gradient.addColorStop(1 / 6, "orange");
            gradient.addColorStop(2 / 6, "yellow");
            gradient.addColorStop(3 / 6, "green");
            gradient.addColorStop(4 / 6, "blue");
            gradient.addColorStop(5 / 6, "indigo");
            gradient.addColorStop(1, "violet");
            this.gradient = gradient;
          }

          shadowColor = "#00000072";
          this.context.fillStyle = this.gradient;
          break;
        }

        case "l": {
          this.context.font = `${size}px 'boldmc'`;
          break;
        }

        case "r": {
          this.context.font = `${size}px 'myfont'`;
          this.context.fillStyle = "#FFFFFF";
          break;
        }
      }

      if (this.shadow) {
        const prevStyle = this.context.fillStyle;
        this.context.fillStyle = shadowColor;
        if (!fake) {
          this.context.fillText(s.slice(1).replace(/&./g, ""), currentX + offset, y + offset);
        }
        this.context.fillStyle = prevStyle;
      }

      if (!fake) {
        this.context.fillText(s.slice(1).replace(/&./g, ""), currentX, y);
      }

      if (align == "right") {
        currentX -= this.context.measureText(s.slice(1).replace(/&./g, "")).width;
      } else {
        currentX += this.context.measureText(s.slice(1).replace(/&./g, "")).width;
      }
    }

    return currentX - x;
  }

  writeText(txt, x, y, align = "center", color = "#ffffff", size = "32px", spacing = 36, font) {
    const offset = Number(size.replace(/px/g, "")) * 0.1;
    this.context.font = `${size} ${font ?? this.font}`;
    this.context.fillStyle = color;
    this.context.textAlign = align;
    this.context.textBaseline = "middle";
    const txtarr = txt.split("\n");
    let newY = y;
    for (const t of txtarr) {
      const lineArr = t.includes("&") ? t.split(/&/) : [`r${t}`];

      if (align == "right") {
        lineArr.reverse();
      }

      let currentX = x;
      for (const s of lineArr) {
        switch (s.slice(0, 1)) {
          case "0": {
            this.context.fillStyle = "#000000";
            break;
          }

          case "1": {
            this.context.fillStyle = "#0000AA";
            break;
          }

          case "2": {
            this.context.fillStyle = "#00AA00";
            break;
          }

          case "3": {
            this.context.fillStyle = "#00AAAA";
            break;
          }

          case "4": {
            this.context.fillStyle = "#AA0000";
            break;
          }

          case "5": {
            this.context.fillStyle = "#AA0000";
            break;
          }

          case "6": {
            this.context.fillStyle = "#FFAA00";
            break;
          }

          case "7": {
            this.context.fillStyle = "#AAAAAA";
            break;
          }

          case "8": {
            this.context.fillStyle = "#555555";
            break;
          }

          case "9": {
            this.context.fillStyle = "#5555FF";
            break;
          }

          case "a": {
            this.context.fillStyle = "#55FF55";
            break;
          }

          case "b": {
            this.context.fillStyle = "#55FFFF";
            break;
          }

          case "c": {
            this.context.fillStyle = "#FF5555";
            break;
          }

          case "d": {
            this.context.fillStyle = "#FF55FF";
            break;
          }

          case "e": {
            this.context.fillStyle = "#FFFF55";
            break;
          }

          case "f": {
            this.context.fillStyle = "#FFFFFF";
            break;
          }

          case "l": {
            this.context.font = `${size} 'boldmc'`;
            break;
          }

          case "r": {
            this.context.font = `${size} ${font ?? this.font}`;
            this.context.fillStyle = color;
            break;
          }
        }
        if (this.shadow) {
          const prevStyle = this.context.fillStyle;
          this.context.fillStyle = "#00000072";
          this.context.fillText(s.slice(1).replace(/&./g, ""), currentX + offset, newY + offset);
          this.context.fillStyle = prevStyle;
        }
        this.context.fillText(s.slice(1).replace(/&./g, ""), currentX, newY);
        if (align == "right") {
          currentX -= this.context.measureText(s.slice(1).replace(/&./g, "")).width;
        } else {
          currentX += this.context.measureText(s.slice(1).replace(/&./g, "")).width;
        }
      }
      newY += spacing;
    }
  }

  drawNameTag(txt, x, y, color, size) {
    this.drawMcText(`&${colorFormatters[color]}${txt}`, x, y, size, "center", true, false);
  }

  drawTimeType(type, x, y, size) {
    this.context.beginPath();

    const lbold = type == "lifetime";
    const mbold = type == "monthly";
    const wbold = type == "weekly";

    this.drawMcText(`${lbold ? "&l&a" : "&r&7"}Lifetime ${mbold ? "&l&a" : "&r&7"}Monthly ${wbold ? "&l&a" : "&r&7"}Weekly`, x, y, size, "center", true);
  }

  /**
   *
   * @param {Account} acc
   * @param {number} pos
   * @param {number} count
   * @param {*} x
   * @param {*} y
   * @param {*} size
   */
  drawLBPlayer(acc, pos, count, x, y, size) {
    this.drawMcText(`&e${pos}. &r${ImageGenerator.formatAcc(acc, false, true, true)}&r &7-&r &e${count}`, x, y, size, "center", true);
  }

  drawLBPos(pos, rank, plusColor, name, guild, guildColor, count, x, y, size) {
    // datafixer
    if (guild == "NONE" || guild == "") {
      // eslint-disable-next-line no-param-reassign
      guild = undefined;
    }

    this.context.beginPath();

    this.context.textAlign = "left";
    this.context.textBaseline = "middle";
    this.context.font = `${size}px 'myFont'`;

    const posWidth = this.context.measureText(`${pos}. `).width;
    const title = this.writeAccTitle(rank, plusColor, name, x + posWidth, y, `${size}px`, false, true);
    const ignWidth = title.w;

    let guildWidth;
    guildWidth = guild != undefined ? this.context.measureText(` [${guild}]`).width : 0;

    const dashWidth = this.context.measureText(" - ").width;
    const winsWidth = this.context.measureText(`${count}`).width;
    const width = posWidth + ignWidth + guildWidth + dashWidth + winsWidth;

    let currentX = x - width / 2;

    this.context.rect(currentX - 3, y - size / 2 - 2, width + 4, size + 2);
    this.context.fillStyle = "#33333372";
    this.context.fill();

    this.writeAccTitle(rank, plusColor, name, currentX + posWidth, y, `${size}px`, false);

    this.writeText(`${pos}. `, currentX, y, "left", "#FFFF55", `${size}px`);
    currentX += posWidth;
    currentX += ignWidth;

    this.context.fillStyle = PlusColors[guildColor?.toLowerCase()];
    if (guild != undefined) {
      this.writeText(` [${guild}]`, currentX, y, "left", PlusColors[guildColor?.toLowerCase()], `${size}px`);
    }
    currentX += guildWidth;

    this.writeText(" - ", currentX, y, "left", "#AAAAAA", `${size}px`);
    currentX += dashWidth;

    this.writeText(`${count}`, currentX, y, "left", "#FFFF55", `${size}px`);
  }

  writeTextCenter(txt, spacing = 36) {
    this.writeText(txt, this.canvas.width / 2, 96, "center", "#ffffff", "32px", spacing);
  }

  /**
   *
   * @param {Account} acc
   * @param {boolean} showRank
   * @param {boolean} showGuild
   * @param {boolean} ignorePref
   * @returns {string}
   */
  static formatAcc(acc, showRank = true, showGuild = false, ignorePref = false) {
    let rank = colorFormatters.grey;
    if (acc.rank != undefined && showRank) {
      if (acc.rank == "MVP_PLUS_PLUS") {
        const superStarColor = ignorePref ? colorFormatters.gold : colorFormatters[acc.mvpColor?.toLowerCase()];
        rank = `${superStarColor}[MVP${colorFormatters[acc.plusColor.toLowerCase()]}++${superStarColor}] `;
      } else if (acc.rank == "MVP_PLUS") {
        rank = `${colorFormatters.aqua}[MVP${colorFormatters[acc.plusColor.toLowerCase()]}+${colorFormatters.aqua}] `;
      } else if (acc.rank == "MVP") {
        rank = `${colorFormatters.aqua}[MVP] `;
      } else if (acc.rank == "VIP_PLUS") {
        rank = `${colorFormatters.green}[VIP${colorFormatters.gold}+${colorFormatters.green}] `;
      } else if (acc.rank == "VIP") {
        rank = `${colorFormatters.green}[VIP] `;
      } else if (acc.rank == "YOUTUBER") {
        rank = `${colorFormatters.red}[${colorFormatters.white}YOUTUBE${colorFormatters.red}] `;
      } else if (acc.rank == "GM") {
        rank = `${colorFormatters.dark_green}[GM] `;
      } else if (acc.rank == "ADMIN") {
        rank = `${colorFormatters.red}[ADMIN] `;
      } else if (acc.rank == "NONE" || acc.rank == "NORMAL" || acc.rank == undefined || acc.rank == "") {
        rank = colorFormatters.grey;
      } else {
        rank = `${acc.rank.replace(/§/g, "&")} `;
      }
    } else {
      if (acc.rank == "MVP_PLUS_PLUS") {
        const superStarColor = ignorePref ? colorFormatters.gold : colorFormatters[acc.mvpColor.toLowerCase()];
        rank = `${superStarColor}`;
      } else if (acc.rank == "MVP_PLUS") {
        rank = `${colorFormatters.aqua}`;
      } else if (acc.rank == "MVP") {
        rank = `${colorFormatters.aqua}`;
      } else if (acc.rank == "VIP_PLUS") {
        rank = `${colorFormatters.green}`;
      } else if (acc.rank == "VIP") {
        rank = `${colorFormatters.green}`;
      } else if (acc.rank == "YOUTUBER") {
        rank = `${colorFormatters.red}`;
      } else if (acc.rank == "GM") {
        rank = `${colorFormatters.dark_green}`;
      } else if (acc.rank == "ADMIN") {
        rank = `${colorFormatters.red}`;
      } else if (acc.rank == "NONE" || acc.rank == "NORMAL" || acc.rank == undefined || acc.rank == "") {
        rank = colorFormatters.grey;
      } else if (acc.rank != "") {
        rank = `${acc.rank.slice(acc.rank.lastIndexOf("§"), acc.rank.lastIndexOf("§") + 1)}`;
      } else {
        rank = colorFormatters.grey;
      }
    }

    let guild = "";
    if (acc.guildTag != "NONE" && acc.guildTag != "" && showGuild) {
      guild = ` ${colorFormatters[acc.guildTagColor?.toLowerCase()]}[${acc.guildTag}${colorFormatters[acc.guildTagColor?.toLowerCase()]}]`.replace(/§/g, "&");
    }

    return `${rank}${acc.name}${guild}`;
  }

  /**
   *
   * @param {Account} acc
   * @param {number} x
   * @param {number} y
   * @param {string} fontSize
   * @param {string} appendTxt
   * @returns {object}
   */
  writeAcc(acc, x, y, fontSize, appendTxt = "") {
    let txtRank = acc.rank ?? "";

    let plus = "";
    let rankEnd = "";
    let rankStart = "";
    let plusColor = PlusColors[`${acc.plusColor}`.toLowerCase()];
    if (txtRank.includes("_PLUS_PLUS")) {
      plus = "++";
    } else if (txtRank.includes("_PLUS")) {
      plus = "+";
    }

    if (acc.rank == "§d[PIG§b+++§d]") {
      txtRank = "PIG_PLUS_PLUS_PLUS";
      plus = "+++";
      plusColor = "#55FFFF";
    } else if (acc.rank == "§c[OWNER]") {
      txtRank = "OWNER";
      plus = "";
      plusColor = "#55FFFF";
    } else if (acc.rank == "NONE" || acc.rank == "NORMAL") {
      txtRank = "";
    }

    if (txtRank == "YOUTUBER") {
      txtRank = "YOUTUBE";
    }

    if (txtRank != "") {
      rankStart = "[";
      rankEnd = "] ";
    }

    this.context.font = `${fontSize} ${this.font}`;
    const rankStartWidth = this.context.measureText(rankStart).width;
    const rankWidth = this.context.measureText(txtRank.replace(/_PLUS/g, "")).width;
    const plusWidth = this.context.measureText(plus).width;
    const rankEndWidth = this.context.measureText(rankEnd).width;
    const nameWidth = this.context.measureText(acc.name).width;
    const appendWidth = this.context.measureText(appendTxt).width;

    let startX = this.canvas.width / 2 - (rankWidth + rankEndWidth + plusWidth + nameWidth + appendWidth) / 2;
    if (x != undefined) {
      startX = x;
    }

    let rankColor;
    let bracketColor;
    if (txtRank == "MVP_PLUS_PLUS") {
      rankColor = acc.mvpColor != "" ? PlusColors[acc.mvpColor.toLowerCase()] : "#FFAA00";
      bracketColor = rankColor;
    } else if (txtRank == "MVP_PLUS" || txtRank == "MVP") {
      rankColor = "#55FFFF";
      bracketColor = rankColor;
    } else if (txtRank == "VIP_PLUS" || txtRank == "VIP") {
      rankColor = "#55FF55";
      bracketColor = rankColor;
    } else if (txtRank == "YOUTUBE") {
      txtRank = "YOUTUBE";
      bracketColor = "#FF5555";
      rankColor = "#FFFFFF";
    } else if (txtRank == "ADMIN") {
      bracketColor = "#FF5555";
      rankColor = "#FF5555";
    } else if (txtRank == "GM") {
      bracketColor = "#00AA00";
      rankColor = "#00AA00";
    } else if (txtRank == "PIG_PLUS_PLUS_PLUS") {
      bracketColor = "#FF55FF";
      rankColor = "#FF55FF";
    } else if (txtRank == "OWNER") {
      bracketColor = "#FF5555";
      rankColor = "#FF5555";
    } else {
      bracketColor = "#AAAAAA";
      rankColor = "#AAAAAA";
      txtRank = "";
      rankStart = "";
      rankEnd = "";
    }

    if (txtRank != "") {
      if (rankStart != "") {
        this.writeText(rankStart, startX, y, "left", bracketColor, fontSize, 36);
        startX += rankStartWidth;
      }

      if (txtRank != "") {
        this.writeText(txtRank.replace(/_PLUS/g, ""), startX, y, "left", rankColor, fontSize, 36);
        startX += rankWidth;
      }

      if (plus != "") {
        this.writeText(plus, startX, y, "left", plusColor, fontSize, 36);
        startX += plusWidth;
      }

      if (rankEnd != "") {
        this.writeText(rankEnd, startX, y, "left", bracketColor, fontSize, 36);
        startX += rankEndWidth;
      }
    }

    this.writeText(acc.name, startX, y, "left", bracketColor, fontSize, 36);
    startX += nameWidth;

    if (appendTxt != "") {
      this.writeText(appendTxt, startX, y, "left", bracketColor, fontSize, 36);
      startX += appendWidth;
    }

    return {
      x: startX,
      w: rankWidth + rankEndWidth + plusWidth + nameWidth,
    };
  }

  writeAccTitle(rank, plusColor, name, x, y = 32, fontSize = "36px", rankEnabled = true, fake = false) {
    const txtRank = rank == "" ? "" : `[${rank}`;

    let plus = "";
    let rankEnd = "";
    if (txtRank.includes("_PLUS_PLUS")) {
      plus = "++";
    } else if (txtRank.includes("_PLUS")) {
      plus = "+";
    }

    if (txtRank != "") {
      rankEnd = "] ";
    }

    this.context.font = `${fontSize} ${this.font}`;
    const rankWidth = this.context.measureText(txtRank.replace(/_PLUS/g, "")).width;
    const plusWidth = this.context.measureText(plus).width;
    const rankEndWidth = this.context.measureText(rankEnd).width;
    const nameWidth = this.context.measureText(name).width;

    let startX = this.canvas.width / 2 - (rankWidth + rankEndWidth + plusWidth + nameWidth) / 2;
    if (x != undefined) {
      startX = x;
    }

    let rankColor;
    if (txtRank == "[MVP_PLUS_PLUS") {
      rankColor = "#FFAA00";
    } else if (txtRank == "[MVP_PLUS" || txtRank == "[MVP") {
      rankColor = "#55FFFF";
    } else if (txtRank == "[VIP_PLUS" || txtRank == "[VIP") {
      rankColor = "#55FF55";
    } else if (txtRank == "[YOUTUBER") {
      rankColor = "#FF5555";
    } else {
      rankColor = "#AAAAAA";
    }

    if (!fake) {
      if (txtRank != "" && rankEnabled) {
        this.writeText(txtRank.replace(/_PLUS/g, ""), startX, y, "left", rankColor, fontSize, 36);
        startX += rankWidth;
        if (plus != "") {
          this.writeText(plus, startX, y, "left", PlusColors[`${plusColor}`.toLowerCase()], fontSize, 36);
          startX += plusWidth;
        }
        this.writeText(rankEnd, startX, y, "left", rankColor, fontSize, 36);
        startX += rankEndWidth;
      }

      this.writeText(name, startX, y, "left", rankColor, fontSize, 36);
    }

    startX += nameWidth;
    if (rankEnabled) {
      return {
        x: startX,
        w: rankWidth + rankEndWidth + plusWidth + nameWidth,
      };
    }
    return {
      x: startX,
      w: nameWidth,
    };
  }

  writeTitle(txt) {
    this.writeText(txt, this.canvas.width / 2, 32, "center", "#ffffff", "48px");
  }

  writeTextTopCenter(txt) {
    this.writeText(txt, this.canvas.width / 2, 20, "center");
  }

  writeTextRight(txt, height = 112, color = "#FFFFFF", spacing = 36) {
    this.writeText(txt, this.canvas.width - 4, height, "right", color, "24px", spacing);
  }

  writeTextLeft(txt) {
    this.writeText(txt, 4, 80, "left");
  }

  toDiscord(name = "image.png") {
    return new Discord.MessageAttachment(this.canvas.toBuffer("image/png", { compressionLevel: 3 }), name);
  }
};
