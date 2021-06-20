const Canvas = require("canvas");
const Discord = require("discord.js");

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
};

module.exports = class ImageGenerator {
    canvas;
    context;
    constructor(width, height) {
        this.canvas = Canvas.createCanvas(width, height);
        this.context = this.canvas.getContext("2d");
    }

    async addBackground(path) {
        let bg = await Canvas.loadImage(path);
        this.context.drawImage(bg, 0, 0, this.canvas.width, this.canvas.height);
        this.context.beginPath();
        this.context.rect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = "#181c3099";
        this.context.fill();
    }

    async addImage(path, x, y, bgIterations = 48, bgStrenth = "11") {
        let img = await Canvas.loadImage(path);
        for (let i = bgIterations; i >= 4; i--) {
            this.context.beginPath();
            this.context.rect(x - i / 2, y - i / 2, img.width + i, img.height + i);
            this.context.fillStyle = `#222222${bgStrenth}`;
            this.context.fill();
        }
        this.context.drawImage(img, x, y);
    }

    writeText(txt, x, y, align, color = "#ffffff", size = "32px", spacing = 36) {
        this.context.font = `${size} Fira Code`;
        this.context.fillStyle = color;
        this.context.textAlign = align;
        this.context.textBaseline = "middle";
        txt = txt.split("\n");
        for (let t of txt) {
            this.context.fillText(t, x, y);
            y += spacing;
        }
    }

    writeTextCenter(txt, spacing = 36) {
        this.writeText(txt, this.canvas.width / 2, 96, "center", "#ffffff", "32px", spacing);
    }

    writeAccTitle(rank, plusColor, name) {
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

        this.context.font = `42px Fira Code`;
        let rankWidth = this.context.measureText(rank.replace(/_PLUS/g, "")).width;
        let plusWidth = this.context.measureText(plus).width;
        let rankEndWidth = this.context.measureText(rankEnd).width;
        let nameWidth = this.context.measureText(name).width;

        let startX = this.canvas.width / 2 - (rankWidth + rankEndWidth + plusWidth + nameWidth) / 2;
        let rankColor;
        if (rank == "[MVP_PLUS_PLUS") {
            rankColor = "#FFAA00";
        } else if (rank == "[MVP_PLUS" || rank == "[MVP") {
            rankColor = "#55FFFF";
        } else if (rank == "[VIP_PLUS" || rank == "[VIP") {
            rankColor = "#55FF55";
        }

        if (rank != "") {
            this.writeText(rank.replace(/_PLUS/g, ""), startX, 32, "left", rankColor, "42px", 36);
            startX += rankWidth;
            if (plus != "") {
                this.writeText(plus, startX, 32, "left", PlusColors[plusColor.toLowerCase()], "42px", 36);
                startX += plusWidth;
            }
            this.writeText(rankEnd, startX, 32, "left", rankColor, "42px", 36);
            startX += rankEndWidth;
        }

        this.writeText(name, startX, 32, "left", rankColor, "42px", 36);
        startX += nameWidth;
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
