const Canvas = require("canvas");
const Discord = require("discord.js");
Canvas.registerFont("resources/minecraftia.ttf", {
    family: "myFont"
});

const PlusColors = {
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
    constructor (width, height, font = "Fira Code") {
        this.canvas = Canvas.createCanvas(width, height);
        this.context = this.canvas.getContext("2d");
        this.font = font;
    }

    async addBackground (path, x = 0, y = 0, dx = this.canvas.width, dy = this.canvas.height, fillColor = "#181c3099") {
        const bg = await Canvas.loadImage(path);
        this.context.drawImage(bg, x, y, dx, dy);
        this.context.beginPath();
        this.context.rect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = fillColor;
        this.context.fill();
    }

    async addImage (path, x, y, bgIterations = 48, bgStrenth = "11", width, height) {
        const img = await Canvas.loadImage(path);
        for(let i = bgIterations; i >= 4; i -= 1) {
            this.context.beginPath();
            this.context.rect(x - i / 2, y - i / 2, img.width + i, img.height + i);
            this.context.fillStyle = `#333333${bgStrenth}`;
            this.context.fill();
        }
        const imgWidth = width == undefined ? img.width : width;
        const imgHeight = height == undefined ? img.height : height;
        this.context.drawImage(img, x, y, imgWidth, imgHeight);
    }

    writeText (txt, x, y, align, color = "#ffffff", size = "32px", spacing = 36) {
        this.context.font = `${size} ${this.font}`;
        this.context.fillStyle = color;
        this.context.textAlign = align;
        this.context.textBaseline = "middle";
        const txtarr = txt.split("\n");
        let newY = y;
        for(const t of txtarr) {
            this.context.fillText(t, x, newY);
            newY += spacing;
        }
    }

    drawNameTag (txt, x, y, color, size) {
        this.context.beginPath();
        this.context.font = `${size}px 'myFont'`;
        const {width} = this.context.measureText(txt);
        this.context.textAlign = "center";
        this.context.textBaseline = "middle";
        const realX = x - width / 2;
        this.context.rect(realX - 2, y - (size / 2), width + 3, size + 4);
        this.context.fillStyle = "#33333377";
        this.context.fill();
        this.context.fillStyle = color;
        this.context.fillText(txt, realX + width / 2, y);
    }

    drawTimeType (type, x, y, size) {
        this.context.beginPath();
        this.context.font = `${size}px 'myFont'`;
        const lWidth = this.context.measureText("Lifetime ").width;
        const mWidth = this.context.measureText("Monthly ").width;
        const wWidth = this.context.measureText("Weekly").width;
        const width = lWidth + mWidth + wWidth;
        this.context.textAlign = "center";
        this.context.textBaseline = "middle";
        this.context.rect((x - width / 2) - 2, y - (size / 2), width + 3, size + 4);
        this.context.fillStyle = "#33333377";
        this.context.fill();
        let currentX = x - width / 3.3;
        this.context.fillStyle = type == "l" ? "#55FF55" : "#AAAAAA";
        this.context.fillText("Lifetime ", currentX, y);
        currentX += lWidth / 1;
        this.context.fillStyle = type == "m" ? "#55FF55" : "#AAAAAA";
        this.context.fillText("Monthly ", currentX, y);
        currentX += mWidth / 1.2;
        this.context.fillStyle = type == "w" ? "#55FF55" : "#AAAAAA";
        this.context.fillText("Weekly", currentX, y);
        currentX += wWidth;
    }

    drawLBPos (pos, rank, plusColor, name, guild, guildColor, count, x, y, size) {
        this.context.beginPath();
        this.context.textAlign = "left";
        this.context.font = `${size}px 'myFont'`;
        const posWidth = this.context.measureText(`${pos}. `).width;
        const title = this.writeAccTitle(rank, plusColor, name, x + posWidth, y, `${size}px`, false, true);
        const ignWidth = title.w;
        let guildWidth;
        if(guild != undefined) {
            guildWidth = this.context.measureText(` [${guild}]`).width;
        } else {
            guildWidth = 0;
        }
        const dashWidth = this.context.measureText(" - ").width;
        const winsWidth = this.context.measureText(`${count}`).width;
        const width = posWidth + ignWidth + guildWidth + dashWidth + winsWidth;
        let currentX = x - width / 2;
        this.context.textBaseline = "middle";
        this.context.rect(currentX - 3, y - (size / 2), width + 4, size + 5);
        this.context.fillStyle = "#33333377";
        this.context.fill();
        this.writeAccTitle(rank, plusColor, name, currentX + posWidth, y, `${size}px`, false);
        this.context.fillStyle = "#FFFF55";
        this.context.fillText(`${pos}. `, currentX, y);
        currentX += posWidth;
        currentX += ignWidth;
        this.context.fillStyle = PlusColors[guildColor?.toLowerCase()];
        if(guild != undefined) {
            this.context.fillText(` [${guild}]`, currentX, y);
        }
        currentX += guildWidth;
        this.context.fillStyle = "#AAAAAA";
        this.context.fillText(" - ", currentX, y);
        currentX += dashWidth;
        this.context.fillStyle = "#FFFF55";
        this.context.fillText(`${count}`, currentX, y);
    }

    writeTextCenter (txt, spacing = 36) {
        this.writeText(txt, this.canvas.width / 2, 96, "center", "#ffffff", "32px", spacing);
    }

    writeAccTitle (rank, plusColor, name, x = undefined, y = 32, fontSize = "36px", rankEnabled = true, fake = false) {
        const txtRank = rank == undefined ? "" : `[${rank}`;

        let plus = "";
        let rankEnd = "";
        if(txtRank.includes("_PLUS_PLUS")) {
            plus = " += 1";
        } else if(txtRank.includes("_PLUS")) {
            plus = "+";
        }

        if(txtRank != "") {
            rankEnd = "] ";
        }

        this.context.font = `${fontSize} ${this.font}`;
        const rankWidth = this.context.measureText(txtRank.replace(/_PLUS/g, "")).width;
        const plusWidth = this.context.measureText(plus).width;
        const rankEndWidth = this.context.measureText(rankEnd).width;
        const nameWidth = this.context.measureText(name).width;

        let startX = this.canvas.width / 2 - (rankWidth + rankEndWidth + plusWidth + nameWidth) / 2;
        if(x != undefined) {
            startX = x;
        }
        let rankColor;
        if(txtRank == "[MVP_PLUS_PLUS") {
            rankColor = "#FFAA00";
        } else if(txtRank == "[MVP_PLUS" || txtRank == "[MVP") {
            rankColor = "#55FFFF";
        } else if(txtRank == "[VIP_PLUS" || txtRank == "[VIP") {
            rankColor = "#55FF55";
        } else {
            rankColor = "#AAAAAA";
        }

        if(!fake) {
            if(txtRank != "" && rankEnabled) {
                this.writeText(txtRank.replace(/_PLUS/g, ""), startX, y, "left", rankColor, fontSize, 36);
                startX += rankWidth;
                if(plus != "") {
                    this.writeText(plus, startX, y, "left", PlusColors[(`${plusColor}`).toLowerCase()], fontSize, 36);
                    startX += plusWidth;
                }
                this.writeText(rankEnd, startX, y, "left", rankColor, fontSize, 36);
                startX += rankEndWidth;
            }

            this.writeText(name, startX, y, "left", rankColor, fontSize, 36);
        }

        startX += nameWidth;
        if(rankEnabled) {
            return {
                x: startX,
                w: rankWidth + rankEndWidth + plusWidth + nameWidth
            };
        } 
        return {
            x: startX,
            w: nameWidth
        };
        
    }

    writeTitle (txt) {
        this.writeText(txt, this.canvas.width / 2, 32, "center", "#ffffff", "48px");
    }

    writeTextTopCenter (txt) {
        this.writeText(txt, this.canvas.width / 2, 20, "center");
    }

    writeTextRight (txt, height = 112, color = "#FFFFFF", spacing = 36) {
        this.writeText(txt, this.canvas.width - 4, height, "right", color, "24px", spacing);
    }

    writeTextLeft (txt) {
        this.writeText(txt, 4, 80, "left");
    }

    toDiscord (name = "image.png") {
        return new Discord.MessageAttachment(this.canvas.toBuffer(), name);
    }
};
