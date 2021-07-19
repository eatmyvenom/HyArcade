const Canvas = require("canvas");
const Discord = require("discord.js");
Canvas.registerFont("resources/minecraftia.ttf", { family : "myFont"});

let PlusColors = {
    black: "#000000",
    dark_blue: "#0000AA",
    dark_green: "#00AA00",
    dark_aqua: "#00AAAA",
    dark_red: "#AA0000",
    dark_purple: "#AA00AA",
    gold: "#FFAA00",
    gray: "#AAAAAA",
    dark_gray: "#555555",
    blue: "#5555FF",
    green: "#55FF55",
    aqua: "#55FFFF",
    red: "#FF5555",
    light_purple: "#FF55FF",
    yellow: "#FFFF55",
    white: "#FFFFFF",
    undefined: "#FFAA00"
};

module.exports = class ImageGenerator {
    canvas;
    context;
    font;
    constructor(width, height, font = "Fira Code") {
        this.canvas = Canvas.createCanvas(width, height);
        this.context = this.canvas.getContext("2d");
        this.font = font;
    }

    async addBackground(path, x = 0, y = 0, dx = this.canvas.width, dy = this.canvas.height, fillColor = "#181c3099") {
        let bg = await Canvas.loadImage(path);
        this.context.drawImage(bg, x, y, dx, dy);
        this.context.beginPath();
        this.context.rect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = fillColor;
        this.context.fill();
    }

    async addImage(path, x, y, bgIterations = 48, bgStrenth = "11", width, height) {
        let img = await Canvas.loadImage(path);
        for (let i = bgIterations; i >= 4; i--) {
            this.context.beginPath();
            this.context.rect(x - i / 2, y - i / 2, img.width + i, img.height + i);
            this.context.fillStyle = `#222222${bgStrenth}`;
            this.context.fill();
        }
        width = width == undefined ? img.width : width;
        height = height == undefined ? img.height : height;
        this.context.drawImage(img, x, y, width, height);
    }

    writeText(txt, x, y, align, color = "#ffffff", size = "32px", spacing = 36) {
        this.context.font = `${size} ${this.font}`;
        this.context.fillStyle = color;
        this.context.textAlign = align;
        this.context.textBaseline = "middle";
        txt = txt.split("\n");
        for (let t of txt) {
            this.context.fillText(t, x, y);
            y += spacing;
        }
    }

    drawNameTag(txt, x, y, color, size) {
        this.context.beginPath();
        this.context.font = `${size}px 'myFont'`
        let width = this.context.measureText(txt).width;
        this.context.textAlign = "center";
        this.context.textBaseline = "middle";
        x = x - width/2;
        this.context.rect(x - 2, y - (size /2), width + 3, size + 4);
        this.context.fillStyle = "#33333377";
        this.context.fill();
        this.context.fillStyle = color;
        this.context.fillText(txt, x + width / 2, y);
    }

    drawTimeType(type, x, y, size) {
        this.context.beginPath();
        this.context.font = `${size}px 'myFont'`
        let lWidth = this.context.measureText("Lifetime ").width;
        let mWidth = this.context.measureText("Monthly ").width;
        let wWidth = this.context.measureText("Weekly").width;
        let width = lWidth + mWidth + wWidth;
        this.context.textAlign = "center";
        this.context.textBaseline = "middle";
        this.context.rect((x - width / 2) - 2, y - (size/2), width + 3, size + 4);
        this.context.fillStyle = "#33333377";
        this.context.fill();
        x = x - width / 3.3;
        this.context.fillStyle = type == "l" ? "#55FF55" : "#AAAAAA";
        this.context.fillText("Lifetime ", x, y);
        x += lWidth / 1;
        this.context.fillStyle = type == "m" ? "#55FF55" : "#AAAAAA";
        this.context.fillText("Monthly ", x, y);
        x += mWidth / 1.2;
        this.context.fillStyle = type == "w" ? "#55FF55" : "#AAAAAA";
        this.context.fillText("Weekly", x, y);
        x += wWidth;
    }

    drawLBPos(pos, rank, plusColor, name, guild, guildColor, count, x, y, size) {
        this.context.beginPath();
        this.context.textAlign = "left";
        this.context.font = `${size}px 'myFont'`
        let posWidth = this.context.measureText(`${pos}. `).width;
        let title = this.writeAccTitle(rank, plusColor, name, x + posWidth, y, `${size}px`, false, true);
        let ignWidth = title.w;
        let guildWidth;
        if(guild != undefined) {
            guildWidth = this.context.measureText(` [${guild}]`).width;
        } else {
            guildWidth = 0;
        }
        let dashWidth = this.context.measureText(` - `).width;
        let winsWidth = this.context.measureText(`${count}`).width;
        let width = posWidth + ignWidth + guildWidth + dashWidth + winsWidth;
        x = x - width / 2;
        this.context.textBaseline = "middle";
        this.context.rect(x - 3, y - (size /2) , width + 4, size + 5);
        this.context.fillStyle = "#33333377";
        this.context.fill();
        this.writeAccTitle(rank, plusColor, name, x + posWidth, y, `${size}px`, false);
        this.context.fillStyle = "#FFFF55";
        this.context.fillText(`${pos}. `, x, y);
        x+= posWidth;
        x+=ignWidth;
        this.context.fillStyle = PlusColors[guildColor?.toLowerCase()];
        if(guild != undefined) {
            this.context.fillText(` [${guild}]`, x ,y);
        }
        x+=guildWidth;
        this.context.fillStyle = "#AAAAAA";
        this.context.fillText(` - `, x, y);
        x+= dashWidth;
        this.context.fillStyle = "#FFFF55";
        this.context.fillText(`${count}`, x, y);
    }

    writeTextCenter(txt, spacing = 36) {
        this.writeText(txt, this.canvas.width / 2, 96, "center", "#ffffff", "32px", spacing);
    }

    writeAccTitle(rank, plusColor, name, x = undefined, y = 32, fontSize = "42px", rankEnabled = true, fake = false) {
        rank = rank == undefined ? "" : `[${rank}`;

        let plus = "";
        let rankEnd = "";
        if (rank.includes("_PLUS_PLUS")) {
            plus = "++";
        } else if (rank.includes("_PLUS")) {
            plus = "+";
        }

        if (rank != "") {
            rankEnd = "] ";
        }

        this.context.font = `${fontSize} ${this.font}`;
        let rankWidth = this.context.measureText(rank.replace(/_PLUS/g, "")).width;
        let plusWidth = this.context.measureText(plus).width;
        let rankEndWidth = this.context.measureText(rankEnd).width;
        let nameWidth = this.context.measureText(name).width;

        let startX = this.canvas.width / 2 - (rankWidth + rankEndWidth + plusWidth + nameWidth) / 2;
        if(x != undefined) {
            startX = x;
        }
        let rankColor;
        if (rank == "[MVP_PLUS_PLUS") {
            rankColor = "#FFAA00";
        } else if (rank == "[MVP_PLUS" || rank == "[MVP") {
            rankColor = "#55FFFF";
        } else if (rank == "[VIP_PLUS" || rank == "[VIP") {
            rankColor = "#55FF55";
        } else {
            rankColor = "#AAAAAA";
        }

        if(!fake) {
            if (rank != "" && rankEnabled) {
                this.writeText(rank.replace(/_PLUS/g, ""), startX, y, "left", rankColor, fontSize, 36);
                startX += rankWidth;
                if (plus != "") {
                    this.writeText(plus, startX, y, "left", PlusColors[("" + plusColor).toLowerCase()], fontSize, 36);
                    startX += plusWidth;
                }
                this.writeText(rankEnd, startX, y, "left", rankColor, fontSize, 36);
                startX += rankEndWidth;
            }
    
            this.writeText(name, startX, y, "left", rankColor, fontSize, 36);
        }

        startX += nameWidth;
        if(rankEnabled) {
            return {x : startX, w : rankWidth + rankEndWidth + plusWidth + nameWidth};
        } else {
            return {x : startX, w : nameWidth};
        }
    }

    writeTitle(txt) {
        this.writeText(txt, this.canvas.width / 2, 32, "center", "#ffffff", "48px");
    }

    writeTextTopCenter(txt) {
        this.writeText(txt, this.canvas.width / 2, 20, "center");
    }

    writeTextRight(txt, height = 112, color = "#FFFFFF", spacing = 36) {
        this.writeText(txt, this.canvas.width - 4, height, "right", color, "28px", spacing);
    }

    writeTextLeft(txt) {
        this.writeText(txt, 4, 80, "left");
    }

    toDiscord(name = "image.png") {
        return new Discord.MessageAttachment(this.canvas.toBuffer(), name);
    }
};
