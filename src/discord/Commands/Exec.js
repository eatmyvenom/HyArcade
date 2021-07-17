const cp = require("child_process")
const Command = require("../../classes/Command");

module.exports = new Command("Exec", ["156952208045375488"], async (args) => {
    let shellCommand = args.join(" ");
    let stdout;
    try {
        stdout = cp.execSync(shellCommand, { timeout : 20000});
    } catch (e) {
        stdout = e
    }

    return { res : "```Response:\n" + stdout.toString() + "\n```" };
});