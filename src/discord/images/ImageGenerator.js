const Canvas = require("canvas");
const Discord = require('discord.js');

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
        this.context.fillStyle = "#181c3088";
        this.context.fill();
    }

    writeText(txt, x, y, align, color = "#ffffff", size = "32px", spacing = 36) {
        this.context.font = `${size} Fira Code`;
        this.context.fillStyle = color;
        this.context.textAlign = align;
        this.context.textBaseline = "middle";
        txt = txt.split("\n");
        for(let t of txt) {
            this.context.fillText(t, x, y);
            y += spacing;
        }
    }

    writeTextCenter(txt, spacing = 36) {
        this.writeText(txt, this.canvas.width / 2, 96, "center", "#ffffff", "32px", spacing);
    }

    writeTitle(txt) {
        this.writeText(txt, this.canvas.width / 2, 32, "center", "#ffffff", "48px");
    }

    writeTextTopCenter(txt) {
        this.writeText(txt, this.canvas.width / 2, 20, "center")
    }

    writeTextRight(txt) {
        this.writeText(txt, this.canvas.width, 84, "right")
    }

    writeTextLeft(txt) {
        this.writeText(txt, 0, 80, "left")
    }

    toDiscord(name = "image.png") {
        return new Discord.MessageAttachment(this.canvas.toBuffer(), name);
    }
}