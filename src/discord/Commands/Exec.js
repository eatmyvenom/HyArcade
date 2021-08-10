const cp = require("child_process");
const Command = require("../../classes/Command");
const CommandResponse = require("../Utils/CommandResponse");

module.exports = new Command("Exec", ["156952208045375488"], async (args) => {
    const shellCommand = args.join(" ");
    let stdout;
    try {
        stdout = cp.execSync(shellCommand, {
            timeout: 20000
        });
    } catch (e) {
        stdout = e;
    }

    const res = `\`\`\`Response:\n${stdout.toString()}\n\`\`\``;

    return new CommandResponse(res);
});
