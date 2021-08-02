/**
 * 
 * @param {boolean} nitro
 * @param {string} emoji
 * @returns {string} 
 */
module.exports = function EmojiGetter(nitro, emoji) {
    switch(emoji.toLowerCase()) {
    case "wins": {
        return ":crown:";
    }

    case "poop": {
        return ":poop:";
    }

    case "win": {
        return ":crown:";
    }

    case "skill": {
        return ":star:";
    }

    case "skill2": {
        return ":star2:";
    }

    case "game": {
        return ":video_game:";
    }

    case "ap": {
        return ":trophy:";
    }

    case "pvp": {
        return ":crossed_swords:";
    }

    case "bow": {
        return ":bow_and_arrow:";
    }

    case "death": {
        return ":skull_crossbones:";
    }

    case "goal": {
        return ":goal:";
    }

    case "shoe": {
        return ":athletic_shoe:";
    }

    case "headshot": {
        return ":exploding_head:";
    }

    case "blind": {
        return ":see_no_evil:";
    }

    case "coin": {
        return ":coin:";
    }

    case "positive": {
        return ":thumbsup:";
    }

    case "id": {
        return ":receipt:";
    }

    case "better": {
        if(nitro) {
            return "<:greenincrease:861225215559860224>";
        } else {
            return ":green_square:";
        }
    }

    case "worse": {
        if(nitro) {
            return "<:reddecrease:861225334841802814>";
        } else {
            return ":red_square:";
        }
    }
    }
};
