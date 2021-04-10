module.exports = class Command {
    name = "";
    allowed = [];
    callback = async function () {
        return {res :"command broke"};
    };

    constructor(name, allowed, callback) {
        this.name = name;
        this.allowed = allowed;
        this.callback = callback;
    }

    async execute(args, author, rawMsg) {
        if (!this.allowed.includes(author) && !this.allowed.includes("*"))
            return { res : "You are not allowed to run this command."};
        return await this.callback(args, rawMsg);
    }
};
