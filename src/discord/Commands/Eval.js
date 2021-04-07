const Command = require("../../classes/Command");

module.exports = new Command(
    "Eval",
    ["156952208045375488"],
    async (args, rawMsg) => {
        let str = rawMsg.content;
        str = rawMsg.content.slice(5);
        str = str.slice(
            str.indexOf("```"),
            str.indexOf("```", str.indexOf("```") + 1)
        );
        str = str.replace(/```/g, "");
        let res = eval("async function mn() {" + str + "} mn()");
        return { res: await res };
    }
);
